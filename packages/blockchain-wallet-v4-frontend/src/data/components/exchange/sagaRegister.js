import { actionTypes as formActionTypes } from 'redux-form'
import { takeEvery, takeLatest, fork } from 'redux-saga/effects'
import * as AT from './actionTypes'
import exchangeSagas from './exchange.sagas'
import shapeshiftSagas from './shapeshift.sagas'

const registerExchangeSagas = function*(exchange) {
  yield takeLatest(AT.INITIALIZE, exchange.exchangeFormInitialized)
  yield takeLatest(AT.CHANGE_SOURCE, exchange.changeSource)
  yield takeLatest(AT.CHANGE_TARGET, exchange.changeTarget)
  yield takeLatest(AT.CHANGE_SOURCE_AMOUNT, exchange.changeSourceAmount)
  yield takeLatest(AT.CHANGE_TARGET_AMOUNT, exchange.changeTargetAmount)
  yield takeLatest(
    AT.CHANGE_SOURCE_FIAT_AMOUNT,
    exchange.changeSourceFiatAmount
  )
  yield takeLatest(
    AT.CHANGE_TARGET_FIAT_AMOUNT,
    exchange.changeTargetFiatAmount
  )
  yield takeLatest(AT.CHANGE_FIX, exchange.changeFix)
}

const registerShapeshiftSagas = function*(shapeshift) {
  yield takeLatest(
    AT.EXCHANGE_FIRST_STEP_INITIALIZED,
    shapeshift.firstStepInitialized
  )
  yield takeLatest(AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED, shapeshift.swapClicked)
  yield takeLatest(
    AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED,
    shapeshift.minimumClicked
  )
  yield takeLatest(
    AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED,
    shapeshift.maximumClicked
  )
  yield takeLatest(
    AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED,
    shapeshift.firstStepSubmitClicked
  )
  yield takeLatest(
    AT.EXCHANGE_THIRD_STEP_INITIALIZED,
    shapeshift.thirdStepInitialized
  )
  yield takeLatest(
    AT.EXCHANGE_SECOND_STEP_SUBMIT_CLICKED,
    shapeshift.secondStepSubmitClicked
  )
  yield takeLatest(
    AT.EXCHANGE_US_STATE_REGISTERED,
    shapeshift.usStateRegistered
  )
  yield takeLatest(AT.EXCHANGE_DESTROYED, shapeshift.destroyed)
  yield takeEvery(formActionTypes.CHANGE, shapeshift.change)
}

export default ({ api, coreSagas, options, networks }) => {
  const shapeshift = shapeshiftSagas({ api, coreSagas, options, networks })
  const exchange = exchangeSagas({ api, coreSagas, options, networks })

  return function*() {
    yield fork(registerShapeshiftSagas, shapeshift)
    yield fork(registerExchangeSagas, exchange)
  }
}
