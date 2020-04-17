import * as AT from './actionTypes'
import { APIType } from 'core/network/api'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api }: { api: APIType }) => {
  const interestSagas = sagas({ api })

  return function * interestSaga () {
    yield takeLatest(
      AT.FETCH_INTEREST_ELIGIBLE,
      interestSagas.fetchInterestEligible
    )
    yield takeLatest(
      AT.FETCH_INTEREST_LIMITS,
      interestSagas.fetchInterestLimits
    )
    yield takeLatest(AT.INITIALIZE_INTEREST, interestSagas.initializeInterest)
  }
}
