import * as AT from './actionTypes'
import {
  CoinType,
  CurrenciesType,
  FiatEligibleType,
  FiatType,
  SBAccountType,
  SBBalancesType,
  SBOrderType,
  SBPairType,
  SBSuggestedAmountType
} from 'core/types'
import { SimpleBuyActionTypes } from './types'

export const createSBOrder = () => ({
  type: AT.CREATE_ORDER
})

export const destroyCheckout = () => ({
  type: AT.DESTROY_CHECKOUT
})

export const fetchSBBalances = (currency?: CoinType) => ({
  type: AT.FETCH_SB_BALANCES,
  currency
})

export const fetchSBBalancesFailure = (
  error: string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_BALANCES_FAILURE,
  payload: {
    error
  }
})

export const fetchSBBalancesLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_BALANCES_LOADING
})

export const fetchSBBalancesSuccess = (
  balances: SBBalancesType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_BALANCES_SUCCESS,
  payload: {
    balances
  }
})

export const fetchSBFiatEligible = (currency: FiatType) => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE,
  currency
})

export const fetchSBFiatEligibleFailure = (
  error: string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE,
  payload: {
    error
  }
})

export const fetchSBFiatEligibleLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_LOADING
})

export const fetchSBFiatEligibleSuccess = (
  fiatEligible: FiatEligibleType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS,
  payload: {
    fiatEligible
  }
})

export const fetchSBOrders = () => ({
  type: AT.FETCH_SB_ORDERS
})

export const fetchSBOrdersFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_ORDERS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBOrdersLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_ORDERS_LOADING
})

export const fetchSBOrdersSuccess = (
  orders: Array<SBOrderType>
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_ORDERS_SUCCESS,
  payload: {
    orders
  }
})

export const fetchSBPairs = (currency: FiatType) => ({
  type: AT.FETCH_SB_PAIRS,
  currency
})

export const fetchSBPairsFailure = (error: string): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBPairsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_LOADING
})

export const fetchSBPairsSuccess = (
  pairs: Array<SBPairType>
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_SUCCESS,
  payload: {
    pairs
  }
})

export const fetchSBPaymentAccount = () => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT
})

export const fetchSBPaymentAccountFailure = (
  error: string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_FAILURE,
  payload: {
    error
  }
})

export const fetchSBPaymentAccountLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_LOADING
})

export const fetchSBPaymentAccountSuccess = (
  account: SBAccountType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAYMENT_ACCOUNT_SUCCESS,
  payload: {
    account
  }
})

export const fetchSBSuggestedAmounts = (currency: keyof CurrenciesType) => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS,
  currency
})

export const fetchSBSuggestedAmountsFailure = (
  error: Error | string
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBSuggestedAmountsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_LOADING
})

export const fetchSBSuggestedAmountsSuccess = (
  amounts: SBSuggestedAmountType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_SUCCESS,
  payload: {
    amounts
  }
})

export const handleSBSuggestedAmountClick = (amount: string) => ({
  type: AT.HANDLE_SB_SUGGESTED_AMOUNT_CLICK,
  payload: {
    amount
  }
})

export const initializeCheckout = (pairs: Array<SBPairType>) => ({
  type: AT.INITIALIZE_CHECKOUT,
  pairs
})

export const setStep = (
  payload:
    | { step: 'CURRENCY_SELECTION' }
    | { order: SBOrderType; step: 'TRANSFER_DETAILS' | 'ORDER_SUMMARY' }
    | { fiatCurrency: FiatType; step: 'ENTER_AMOUNT' }
): SimpleBuyActionTypes => ({
  type: AT.SET_STEP,
  payload:
    payload.step === 'ENTER_AMOUNT'
      ? {
          step: payload.step,
          fiatCurrency: payload.fiatCurrency
        }
      : payload.step === 'TRANSFER_DETAILS' || payload.step === 'ORDER_SUMMARY'
      ? { step: payload.step, order: payload.order }
      : {
          step: payload.step
        }
})

export const showModal = (): SimpleBuyActionTypes => ({
  type: AT.SHOW_MODAL
})
