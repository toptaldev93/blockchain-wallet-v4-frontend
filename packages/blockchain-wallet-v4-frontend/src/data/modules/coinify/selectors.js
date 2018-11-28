import { compose, prop } from 'ramda'
export const getCoinifyData = prop('coinify')
export const getCoinifyBusy = compose(prop('coinifyBusy'), getCoinifyData)
export const getCoinifySignupStep = compose(prop('signupStep'), getCoinifyData)
export const getCoinifyPayment = compose(prop('payment'), getCoinifyData)
export const getSignupError = compose(prop('signupError'), getCoinifyData)
export const getCoinifyCheckoutBusy = compose(prop('checkoutBusy'), getCoinifyData)
export const getCoinifyMedium = compose(prop('medium'), getCoinifyData)
export const getCoinifyCheckoutStep = compose(prop('checkoutStep'), getCoinifyData)
