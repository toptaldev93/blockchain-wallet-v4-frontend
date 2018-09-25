import moment from 'moment'
import { ifElse } from 'ramda'

import { getCoinFromPair } from 'services/ShapeshiftService'
import { model, selectors } from 'data'

const { DATE_FORMAT, isShapeShiftTrade } = model.components.exchangeHistory

const formatExchangeTrade = ({
  id,
  state,
  createdAt,
  deposit,
  withdrawal,
  fiatValue,
  withdrawalFee,
  rate,
  refundAmount
}) => {
  return {
    id,
    status: state,
    date: moment(createdAt).format(DATE_FORMAT),
    sourceCoin: deposit.symbol,
    targetCoin: deposit.symbol,
    depositAmount: deposit.value,
    withdrawalAmount: withdrawal.value,
    targetFiat: fiatValue.value,
    currency: fiatValue.symbol,
    fee: withdrawalFee.value,
    rate,
    refundAmount,
    isShapeShiftTrade: false
  }
}

const formatShapeshiftTrade = trade => {
  const { status, timestamp, quote } = trade
  const { pair, depositAmount, withdrawalAmount, deposit } = quote
  const { sourceCoin, targetCoin } = getCoinFromPair(pair)

  return {
    status,
    date: moment(timestamp).format(DATE_FORMAT),
    sourceCoin,
    targetCoin,
    deposit,
    depositAmount,
    withdrawalAmount,
    isShapeShiftTrade: true
  }
}

export const formatTrade = ifElse(
  isShapeShiftTrade,
  formatShapeshiftTrade,
  formatExchangeTrade
)

export const getData = state => ({
  useShapeShift: selectors.components.exchange.useShapeShift(state)
})
