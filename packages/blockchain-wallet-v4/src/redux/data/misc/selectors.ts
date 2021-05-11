import { Remote } from 'blockchain-wallet-v4/src'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import {
  CoinType,
  RatesType,
  RemoteDataType,
  TimeRange,
  WalletCurrencyType
} from 'core/types'
import { RootState } from 'data/rootReducer'

import * as selectors from '../../selectors'

export const getCaptcha = (state: RootState) => state.dataPath.misc.captcha

export const getPriceIndexSeries = (state: RootState) =>
  state.dataPath.misc.price_index_series

export const getLogs = (state: RootState) => state.dataPath.misc.logs

export const getPairingCode = (state: RootState) =>
  state.dataPath.misc.pairing_code

export const authorizeLogin = (state: RootState) =>
  state.dataPath.misc.authorize_login

export const handle2FAReset = (state: RootState) =>
  state.dataPath.misc.handle_2fa_reset

export const verifyEmailToken = (state: RootState) =>
  state.dataPath.misc.verify_email_token

export const getPriceChange = (
  coin: CoinType,
  range: TimeRange,
  state: RootState
) => state.dataPath.misc.price_change[range][coin]

export const getRatesSelector = (
  coin: WalletCurrencyType,
  state
): RemoteDataType<string, RatesType> => {
  switch (coin) {
    case 'EUR':
    case 'GBP':
    case 'USD':
    case 'BTC':
      return selectors.data.btc.getRates(state)
    case 'BCH':
      return selectors.data.bch.getRates(state)
    case 'DOT':
      return selectors.data.dot.getRates(state)
    case 'ETH':
      return selectors.data.eth.getRates(state)
    case 'XLM':
      return selectors.data.xlm.getRates(state)
    case 'ALGO':
      return selectors.data.algo.getRates(state)
    case 'USDT':
    case 'WDGLD':
    case 'PAX':
    case 'AAVE':
    case 'YFI':
      return selectors.data.eth.getErc20Rates(state, coin)
    default:
      return Remote.Failure(INVALID_COIN_TYPE)
  }
}
