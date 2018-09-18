import { call, put, select } from 'redux-saga/effects'
import { compose, isNil, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, XLM } from '../config'
import { getMnemonic } from '../../wallet/selectors'

import BIP39 from 'bip39'
import * as ed25519 from 'ed25519-hd-key'
import * as StellarSDK from 'stellar-sdk'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api, networks } = {}) => {
  const callTask = function*(task) {
    return yield call(
      compose(
        taskToPromise,
        () => task
      )
    )
  }

  const createXlm = function*({ kv, password }) {
    try {
      const obtainMnemonic = state => getMnemonic(state, password)
      const mnemonicT = yield select(obtainMnemonic)
      const mnemonic = yield call(() => taskToPromise(mnemonicT))
      // TODO: tests https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md
      // const seed = BIP39.mnemonicToSeed('illness spike retreat truth genius clock brain pass fit cave bargain toe')
      const seed = BIP39.mnemonicToSeed(mnemonic)
      const seedHex = seed.toString('hex')
      const masterKey = ed25519.derivePath("m/44'/148'/0'", seedHex)
      const keypair = StellarSDK.Keypair.fromRawEd25519Seed(masterKey.key)
      console.info(keypair.publicKey())
      console.info(keypair.secret())
      const xlm = {
        addr: null
      }
      const newkv = set(KVStoreEntry.value, { xlm }, kv)
      yield put(A.createMetadataXlm(newkv))
    } catch (e) {
      throw new Error(
        '[NOT IMPLEMENTED] MISSING_SECOND_PASSWORD in core.createXlm saga'
      )
    }
  }

  const fetchMetadataXlm = function*(secondPasswordSagaEnhancer) {
    try {
      const typeId = derivationMap[XLM]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataXlmLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(secondPasswordSagaEnhancer(createXlm), { kv })
      } else {
        yield put(A.fetchMetadataXlmSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataXlmFailure(e.message))
    }
  }

  return {
    createXlm,
    fetchMetadataXlm
  }
}
