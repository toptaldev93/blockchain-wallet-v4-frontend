import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const dataXlmSagas = sagas({ api, networks })

  return function*() {
    yield takeLatest(AT.FETCH_LEDGER_DETAILS, dataXlmSagas.fetchLedgerDetails)
    yield takeLatest(AT.FETCH_DATA, dataXlmSagas.fetchData)
    yield takeLatest(AT.FETCH_RATES, dataXlmSagas.fetchRates)
    yield takeEvery(AT.FETCH_TRANSACTIONS, dataXlmSagas.fetchTransactions)
  }
}
