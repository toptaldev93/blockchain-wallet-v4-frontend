import { INVALID_COIN_TYPE } from './model'
import { RootState } from '../../rootReducer'
import { selectors } from 'data'

export const getCoinType = (state: RootState) => state.components.borrow.coin

export const getPayment = (state: RootState) => state.components.borrow.payment

export const getOffers = (state: RootState) => state.components.borrow.offers

export const getRates = (state: RootState) => {
  const coinType = getCoinType(state)

  switch (coinType) {
    case 'BTC':
      return selectors.core.data.btc.getRates(state)
    default:
      throw new Error(INVALID_COIN_TYPE)
  }
}
