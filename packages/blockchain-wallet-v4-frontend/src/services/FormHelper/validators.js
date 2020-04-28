import * as M from './validationMessages'
import { all, any, equals, path, prop, propOr } from 'ramda'
import {
  isAlphaNumeric,
  isDOB,
  isEmail,
  isGuid,
  isIpValid,
  isNumeric,
  isOverEighteen,
  isSSN,
  isUsZipcode
} from 'services/ValidationHelper'
import { isValidBIC, isValidIBAN } from 'ibantools'
import { isValidNumber } from 'libphonenumber-js'
import { model } from 'data'
import { utils } from 'blockchain-wallet-v4/src'
import { validate } from 'postal-codes-js'
import bip39 from 'bip39'
import isObject from 'isobject'
import postalCodes from 'postal-codes-js/generated/postal-codes-alpha2'
import React from 'react'

const { BAD_2FA } = model.profile.ERROR_TYPES

export const required = value => (value ? undefined : <M.RequiredMessage />)

export const optional = validator => value =>
  value === undefined || value === '' ? undefined : validator(value)

export const termsCheckBoxChecked = value =>
  value ? undefined : <M.UnacceptedTermsMessage />

export const validNumber = value =>
  isNumeric(value) ? undefined : <M.InvalidNumberMessage />

export const requiredNumber = value =>
  isNumeric(value) && value > 0 ? undefined : <M.RequiredNumberMessage />

export const validEmail = value =>
  isEmail(value) ? undefined : <M.InvalidEmailMessage />

export const validEmailNotAllowed = value =>
  isEmail(value) ? <M.ValidEmailNotAllowed /> : undefined

export const validMnemonic = value =>
  bip39.validateMnemonic(value) ? undefined : <M.InvalidPassphraseMessage />

export const validWalletId = value =>
  isGuid(value) ? undefined : <M.InvalidWalletIdMessage />

export const validMobileNumber = value =>
  isValidNumber(value) ? undefined : <M.InvalidMobileNumberMessage />

export const validIpList = ipList => {
  return !ipList || all(isIpValid)(ipList.split(',')) ? (
    undefined
  ) : (
    <M.InvalidIpListMessage />
  )
}

export const validPasswordConfirmation = passwordFieldName => (
  value,
  allValues
) =>
  value === allValues[passwordFieldName] ? undefined : <M.PasswordsDoNotMatch />

export const validCurrentPassword = (
  value,
  allValues,
  { currentWalletPassword }
) => (value === currentWalletPassword ? undefined : <M.IncorrectPassword />)

export const isNotCurrentPassword = (
  value,
  allValues,
  { currentWalletPassword }
) => (value !== currentWalletPassword ? undefined : <M.SamePasswordAsCurrent />)

export const validPasswordStretchingNumber = value =>
  value > 1 && value <= 20000 ? (
    undefined
  ) : (
    <M.InvalidPasswordStretchingNumberMessage />
  )

export const validEthAddress = ({ value: dropdownValue }) => {
  if (!dropdownValue) return
  const { value } = dropdownValue
  const address = propOr(value, ['address'], value)
  if (address === BAD_2FA) {
    return <M.ExchangeRequires2FAMessage />
  }
  return utils.eth.isValidAddress(address) ? (
    undefined
  ) : (
    <M.InvalidEthAddressMessage />
  )
}

export const validXlmAddress = ({ value: dropdownValue }) => {
  if (!dropdownValue) return
  const { value } = dropdownValue
  const address = propOr(value, ['address'], value)
  if (address === BAD_2FA) {
    return <M.ExchangeRequires2FAMessage />
  }
  return utils.xlm.isValidAddress(address) ? (
    undefined
  ) : (
    <M.InvalidXlmAddressMessage />
  )
}

export const validBtcAddress = (value, allValues, props) => {
  let address = value
  if (isObject(value)) {
    if (!value.value) return
    const { value: dropdownValue } = value
    const { value: option } = dropdownValue
    if (prop('xpub', option)) return
    if (prop('address', option)) return
    if (prop('value', dropdownValue)) address = prop('value', dropdownValue)
  }

  if (address === BAD_2FA) {
    return <M.ExchangeRequires2FAMessage />
  }

  return utils.btc.isValidBtcAddress(address, props.network) ? (
    undefined
  ) : (
    <M.InvalidBtcAddressMessage />
  )
}

export const validBchAddress = (value, allValues, props) => {
  let address = value
  if (isObject(value)) {
    const { value: dropdownValue } = value
    const { value: option } = dropdownValue
    if (prop('xpub', option)) return
    if (prop('address', option)) return
    if (prop('value', dropdownValue)) address = prop('value', dropdownValue)
  }
  if (address === BAD_2FA) {
    return <M.ExchangeRequires2FAMessage />
  }
  return utils.btc.isValidBtcAddress(address, props.network) ||
    utils.bch.isCashAddr(address) ? (
    undefined
  ) : (
    <M.InvalidBchAddressMessage />
  )
}

export const validEmailCode = value =>
  isAlphaNumeric(value) ? undefined : <M.InvalidEmailCodeMessage />

export const validBtcPrivateKey = (value, allValues, props) =>
  utils.btc.isValidBtcPrivateKey(value, props.network) ? (
    undefined
  ) : (
    <M.InvalidBtcPrivateKeyMessage />
  )

export const validBtcAddressOrPrivateKey = (value, allValues, props) =>
  utils.btc.isValidBtcPrivateKey(value, props.network) ||
  utils.btc.isValidBtcAddress(value, props.network) ? (
    undefined
  ) : (
    <M.InvalidBtcAddressAndPrivateKeyMessage />
  )

export const isSegwitAddress = value =>
  utils.btc.isSegwitAddress(value) ? <M.SegwitAddressMessage /> : undefined

export const validIban = value =>
  isValidIBAN(value) ? undefined : 'Invalid IBAN'

export const validBIC = value => (isValidBIC(value) ? undefined : 'Invalid BIC')

export const ageOverEighteen = value =>
  isOverEighteen(value) ? undefined : <M.AgeOverEighteenMessage />

export const requiredSSN = value =>
  isSSN(value) ? undefined : <M.RequiredSSNMessage />

export const requiredDOB = value =>
  isDOB(value) ? undefined : <M.RequiredDOBMessage />

export const requiredUsZipcode = value =>
  isUsZipcode(value) ? undefined : <M.RequiredUSZipCodeMessage />

export const countryUsesPostalcode = countryCode => {
  return path([countryCode, 'postalCodeFormat'], postalCodes)
}

export const countryUsesZipcode = countryCode => countryCode === 'US'

export const requiredZipCode = (value, allVals) => {
  const countryCode =
    path(['country', 'code'], allVals) || path(['country'], allVals)
  if (!path([countryCode, 'postalCodeFormat'], postalCodes)) return undefined
  if (!value) return <M.RequiredMessage />

  return validate(countryCode, value) === true ? (
    undefined
  ) : (
    <M.InvalidZipCodeMessage />
  )
}

export const requireUniqueDeviceName = (value, usedDeviceNames) => {
  return any(equals(value))(usedDeviceNames) ? (
    <M.UniqueDeviceName />
  ) : (
    undefined
  )
}

export const requireUniqueWalletName = (value, allWalletLabels, index) => {
  const walletIdx = allWalletLabels.indexOf(value)
  return walletIdx !== index && walletIdx > -1 ? (
    <M.UniqueWalletName />
  ) : (
    undefined
  )
}
