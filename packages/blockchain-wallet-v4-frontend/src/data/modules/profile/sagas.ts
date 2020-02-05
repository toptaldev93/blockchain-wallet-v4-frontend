import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { actions, actionTypes, selectors } from 'data'
import {
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  select,
  spawn,
  take
} from 'redux-saga/effects'
import {
  compose,
  difference,
  equals,
  keys,
  lift,
  prop,
  sortBy,
  tail
} from 'ramda'
import { KYC_STATES, USER_ACTIVATION_STATES } from './model'
import { promptForSecondPassword } from 'services/SagaService'
import { Remote } from 'blockchain-wallet-v4'
import moment from 'moment'

export const logLocation = 'modules/profile/sagas'
export const userRequiresRestoreError = 'User restored'
export const authRetryDelay = 5000
export const renewUserDelay = 30000

let renewSessionTask = null
let renewUserTask = null
export default ({ api, coreSagas, networks }) => {
  const waitForUserData = function * () {
    const userData = yield select(selectors.modules.profile.getUserData)
    if (Remote.Success.is(userData)) return
    yield take(actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS)
  }

  const getCampaignData = function * (campaign) {
    if (campaign.name === 'sunriver') {
      const xlmAccount = (yield select(
        selectors.core.kvStore.xlm.getDefaultAccountId
      )).getOrFail()
      return {
        'x-campaign-address': xlmAccount,
        'x-campaign-code': campaign.code,
        'x-campaign-email': campaign.email
      }
    }
    if (campaign.name === 'BLOCKSTACK') {
      let password = yield call(promptForSecondPassword, ['BLOCKSTACK'])
      yield put(actions.core.data.stx.generateAddress(password))
      const { payload } = yield take(actionTypes.core.data.stx.SET_ADDRESS)
      const { address } = payload
      return {
        'x-campaign-address': address
      }
    }

    return null
  }

  const signIn = function * () {
    try {
      const email = (yield select(selectors.core.settings.getEmail)).getOrFail(
        'No email'
      )
      const guid = yield select(selectors.core.wallet.getGuid)

      yield call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      const userId = (yield select(
        selectors.core.kvStore.userCredentials.getUserId
      )).getOrElse(null)
      const lifetimeToken = (yield select(
        selectors.core.kvStore.userCredentials.getLifetimeToken
      )).getOrElse(null)
      if (!userId || !lifetimeToken) {
        return yield put(
          A.fetchUserDataSuccess({
            state: USER_ACTIVATION_STATES.NONE,
            kycState: KYC_STATES.NONE
          })
        )
      }

      yield put(A.setApiTokenLoading())
      renewSessionTask = yield fork(
        renewSession,
        userId,
        lifetimeToken,
        email,
        guid,
        0
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'signIn', e))
    }
  }

  const renewSession = function * (
    userId,
    lifetimeToken,
    email,
    guid,
    renewIn = 0
  ) {
    try {
      yield delay(renewIn)
      yield call(setSession, userId, lifetimeToken, email, guid)
    } catch (e) {
      yield put(A.setApiTokenFailure(e))
      yield spawn(
        renewSession,
        userId,
        lifetimeToken,
        email,
        guid,
        authRetryDelay
      )
    }
  }

  const setSession = function * (userId, lifetimeToken, email, guid) {
    try {
      const { token: apiToken, expiresAt } = yield call(
        api.generateSession,
        userId,
        lifetimeToken,
        email,
        guid
      )
      yield put(A.setApiTokenSuccess(apiToken))
      yield call(fetchUser)
      yield call(renewApiSockets)
      const expiresIn = moment(expiresAt)
        .subtract(5, 's')
        .diff(moment())
      yield spawn(renewSession, userId, lifetimeToken, email, guid, expiresIn)
    } catch (e) {
      if (prop('description', e) === userRequiresRestoreError) {
        return yield call(recoverUser)
      }
      throw e
    }
  }

  const fetchUser = function * () {
    try {
      const user = yield call(api.getUser)
      yield put(A.fetchUserDataSuccess(user))
      yield call(fetchTiers)
      if (!renewUserTask && user.kycState === KYC_STATES.PENDING)
        renewUserTask = yield spawn(renewUser, renewUserDelay)

      return user
    } catch (e) {
      if (prop('description', e) === userRequiresRestoreError) throw e
      yield put(A.fetchUserDataFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchUser', e))
    }
  }

  const renewUser = function * (renewIn = 0) {
    try {
      yield delay(renewIn)
      const user = yield call(api.getUser)
      yield put(A.fetchUserDataSuccess(user))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'renewUser', e))
    } finally {
      yield spawn(renewUser, renewUserDelay)
    }
  }

  const renewApiSockets = function * () {
    yield put(actions.middleware.webSocket.rates.stopSocket())
    yield put(actions.middleware.webSocket.rates.startSocket())
  }

  const clearSession = function * () {
    if (renewSessionTask) {
      // @ts-ignore
      yield cancel(renewSessionTask)
      renewSessionTask = null
    }
    if (renewUserTask) {
      // @ts-ignore
      yield cancel(renewUserTask)
      renewUserTask = null
    }

    yield put(A.setApiTokenNotAsked())
  }

  const generateRetailToken = function * () {
    const guid = yield select(selectors.core.wallet.getGuid)
    const sharedKey = yield select(selectors.core.wallet.getSharedKey)
    const { token } = yield call(api.generateRetailToken, guid, sharedKey)
    return token
  }

  const generateAuthCredentials = function * () {
    const retailToken = yield call(generateRetailToken)
    const coinifyId = (yield select(
      selectors.core.kvStore.buySell.getCoinifyUser
    )).getOrElse(null)
    const { userId, token: lifetimeToken } = yield call(
      api.createUser,
      retailToken,
      coinifyId
    )
    yield put(
      actions.core.kvStore.userCredentials.setUserCredentials(
        userId,
        lifetimeToken
      )
    )
    return { userId, lifetimeToken }
  }

  const recoverUser = function * () {
    const retailToken = yield call(generateRetailToken)
    const userId = (yield select(
      selectors.core.kvStore.userCredentials.getUserId
    )).getOrFail()
    const lifetimeToken = (yield select(
      selectors.core.kvStore.userCredentials.getLifetimeToken
    )).getOrFail()
    yield call(api.recoverUser, userId, lifetimeToken, retailToken)
    const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
    const guid = yield select(selectors.core.wallet.getGuid)
    yield call(setSession, userId, lifetimeToken, email, guid)
  }

  const createUser = function * () {
    const token = yield select(S.getApiToken)
    if (!Remote.NotAsked.is(token)) return

    const userIdR = yield select(
      selectors.core.kvStore.userCredentials.getUserId
    )
    const lifetimeTokenR = yield select(
      selectors.core.kvStore.userCredentials.getLifetimeToken
    )
    const authCredentialsR = lift((userId, lifetimeToken) => ({
      userId,
      lifetimeToken
    }))(userIdR, lifetimeTokenR)
    const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
    const guid = yield select(selectors.core.wallet.getGuid)

    const { userId, lifetimeToken } = yield authCredentialsR
      .map(authCredentials => {
        const { userId, lifetimeToken } = authCredentials
        if (!userId || !lifetimeToken) return call(generateAuthCredentials)
        return authCredentials
      })
      .getOrElse({})

    yield call(setSession, userId, lifetimeToken, email, guid)
  }

  const updateUser = function * ({ payload }) {
    const { data } = payload
    const userR = S.getUserData(yield select())
    const user = userR.getOrElse({
      id: undefined,
      address: undefined,
      mobile: undefined,
      mobileVerified: undefined,
      state: undefined,
      kycState: undefined
    })
    const {
      id,
      address,
      mobile,
      mobileVerified,
      state,
      kycState,
      ...userData
    } = user
    const updatedData = { ...userData, ...data }

    if (equals(updatedData, userData)) return user

    yield call(api.updateUser, updatedData)
    return yield call(fetchUser)
  }

  const updateUserAddress = function * ({ payload }) {
    const { address } = payload
    const user = (yield select(S.getUserData)).getOrElse({})
    const { address: prevAddress } = user

    if (equals(address, prevAddress)) return user

    yield call(api.updateUserAddress, address)
    return yield call(fetchUser)
  }

  const syncUserWithWallet = function * () {
    const retailToken = yield call(generateRetailToken)
    const userData = yield call(api.syncUserWithWallet, retailToken)
    yield put(A.fetchUserDataSuccess(userData))
  }

  const fetchUserCampaigns = function * () {
    try {
      yield put(A.fetchUserCampaignsLoading())
      yield call(waitForUserData)
      const userCampaigns = yield call(api.getUserCampaigns)
      yield put(A.fetchUserCampaignsSuccess(userCampaigns))
    } catch (e) {
      yield put(A.fetchUserCampaignsFailure(e))
    }
  }

  const fetchTiers = function * () {
    try {
      const tiers = yield select(S.getTiers)
      if (!Remote.Success.is(tiers)) yield put(A.fetchTiersLoading())
      const tiersData = yield call(api.fetchTiers)
      yield put(
        A.fetchTiersSuccess(
          compose(
            tail,
            // @ts-ignore
            sortBy(prop('index'))
          )(tiersData.tiers)
        )
      )
    } catch (e) {
      yield put(A.fetchTiersFailure(e))
    }
  }

  const shareWalletAddressesWithExchange = function * () {
    try {
      yield put(A.shareWalletAddressesWithExchangeLoading())
      // TODO: move to goal and pass remaining coins to saga
      // Only run saga if remainingCoins is !empty
      const supportedCoinsList = (yield select(
        selectors.core.walletOptions.getSyncToExchangeList
      )).getOrFail('no_supported_coins')
      const walletAddresses = (yield select(S.getWalletAddresses)).getOrFail(
        'no_deposit_addresses'
      )
      const walletAddressesList = keys(walletAddresses)
      const remainingCoins = difference(supportedCoinsList, walletAddressesList)
      // BTC
      const defaultIdx = yield select(
        selectors.core.wallet.getDefaultAccountIndex
      )
      const BTC = selectors.core.common.btc.getNextAvailableReceiveAddress(
        networks.btc,
        defaultIdx
      )
      // BCH
      const BCH = selectors.core.common.bch.getNextAvailableReceiveAddressFormatted(
        networks.btc,
        defaultIdx
      )
      // ETH
      const ETH = selectors.core.kvStore.eth.getContext
      // XLM
      const XLM = selectors.core.kvStore.xlm.getDefaultAccountId
      const addressSelectors = { BTC, BCH, ETH, XLM, PAX: ETH }
      const state = yield select()
      const remainingAddresses = remainingCoins.reduce((res, coin) => {
        res[coin] = addressSelectors[coin](state).getOrElse(null)
        return res
      }, walletAddresses)
      const data = yield call(
        api.shareWalletDepositAddresses,
        remainingAddresses
      )
      yield put(A.shareWalletAddressesWithExchangeSuccess(data))
    } catch (e) {
      yield put(A.shareWalletAddressesWithExchangeFailure(e))
    }
  }

  const linkFromExchangeAccount = function * ({ payload }) {
    try {
      const { linkId } = payload
      yield put(A.linkFromExchangeAccountLoading())
      // ensure email is verified else wait
      const isEmailVerified = (yield select(
        selectors.core.settings.getEmailVerified
      )).getOrElse(true)
      if (!isEmailVerified)
        yield take(actionTypes.core.settings.SET_EMAIL_VERIFIED)
      // get or create user
      const isUserStateNone = (yield select(S.isUserStateNone)).getOrElse(false)
      if (isUserStateNone) yield call(createUser)
      // link Account
      const data = yield call(api.linkAccount, linkId)
      // share addresses
      yield put(A.shareWalletAddressesWithExchange())
      yield put(A.linkFromExchangeAccountSuccess(data))
      // update user
      yield call(fetchUser)
    } catch (e) {
      yield put(A.linkFromExchangeAccountFailure(e))
    }
  }

  const linkToExchangeAccount = function * ({ payload }) {
    try {
      const { utmCampaign } = payload
      yield put(A.linkToExchangeAccountLoading())
      // check if wallet is already linked
      const isExchangeAccountLinked = (yield select(
        S.isExchangeAccountLinked
      )).getOrFail()
      if (isExchangeAccountLinked) {
        throw new Error('Account has already been linked.')
      }
      // ensure email address is verified
      const isEmailVerified = (yield select(
        selectors.core.settings.getEmailVerified
      )).getOrFail()
      if (!isEmailVerified) {
        throw new Error('Email address is not verified.')
      }
      // get or create nabu user
      const isUserStateNone = (yield select(S.isUserStateNone)).getOrFail()
      if (isUserStateNone) yield call(createUser)
      // get exchange linkId, exchange domain and user email
      const domains = (yield select(
        selectors.core.walletOptions.getDomains
      )).getOrFail()
      const exchangeDomain = prop('exchange', domains)
      const data = yield call(api.createLinkAccountId)
      const exchangeLinkId = prop('linkId', data)
      const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
      const accountDeeplinkUrl = `${exchangeDomain}/trade/link/${exchangeLinkId}?email=${encodeURIComponent(
        email
      )}&utm_source=web_wallet&utm_medium=referral&utm_campaign=${utmCampaign ||
        'wallet_exchange_page'}`
      // share addresses
      yield put(A.shareWalletAddressesWithExchange())
      // simulate wait while allowing user to read modal
      yield delay(2000)
      // attempt to open url for user
      window.open(accountDeeplinkUrl, '_blank', 'noreferrer')
      yield put(A.setLinkToExchangeAccountDeepLink(accountDeeplinkUrl))
      // poll for account link
      yield race({
        task: call(pollForAccountLinkSuccess, 0),
        cancel: take([
          AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE,
          AT.LINK_TO_EXCHANGE_ACCOUNT_SUCCESS,
          actionTypes.modals.CLOSE_MODAL
        ])
      })
    } catch (e) {
      yield put(A.linkToExchangeAccountFailure(e.message))
    }
  }

  const pollForAccountLinkSuccess = function * (attemptCount) {
    try {
      // check every 10 seconds
      yield delay(10000)
      attemptCount++
      // if 5 minutes has passed, cancel poll and mark as timeout
      if (equals(30, attemptCount)) {
        yield put(
          A.linkToExchangeAccountFailure(
            'Timeout waiting for account connection status.'
          )
        )
        return
      }
      yield call(fetchUser)
      const isExchangeAccountLinked = (yield select(
        S.isExchangeAccountLinked
      )).getOrElse(false)
      if (isExchangeAccountLinked) {
        yield put(A.linkToExchangeAccountSuccess())
      } else {
        yield call(pollForAccountLinkSuccess, attemptCount)
      }
    } catch (e) {
      yield put(
        A.linkToExchangeAccountFailure(
          'Unable to check current account status.'
        )
      )
    }
  }

  return {
    clearSession,
    createUser,
    fetchTiers,
    fetchUser,
    fetchUserCampaigns,
    generateAuthCredentials,
    generateRetailToken,
    getCampaignData,
    linkFromExchangeAccount,
    linkToExchangeAccount,
    recoverUser,
    renewApiSockets,
    renewSession,
    renewUser,
    setSession,
    shareWalletAddressesWithExchange,
    signIn,
    syncUserWithWallet,
    updateUser,
    updateUserAddress
  }
}
