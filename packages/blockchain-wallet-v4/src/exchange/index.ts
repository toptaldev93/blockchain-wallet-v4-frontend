import { BigNumber } from 'bignumber.js'
import { path, prop } from 'ramda'

import {
  CoinType,
  FiatType,
  RatesType,
  WalletCurrencyType,
  WalletFiatType
} from 'core/types'

import Currencies, { CurrenciesType } from './currencies'
import * as Currency from './currency'
import * as Pairs from './pairs'

type KeysOfUnion<T> = T extends any ? keyof T : never
export type UnitType = KeysOfUnion<
  CurrenciesType[keyof CurrenciesType]['units']
>

const DefaultConversion = {
  value: '0',
  unit: {
    rate: '0',
    symbol: 'N/A',
    decimal_digits: 0,
    currency: 'N/A'
  }
}

const DefaultDisplay = 'N/A'

// =====================================================================
// ============================== DECIMALS =============================
// =====================================================================
const convertCoinToCoin = ({
  baseToStandard = true,
  coin,
  isFiat = false,
  value
}: {
  baseToStandard?: boolean
  coin: WalletCurrencyType | 'FIAT'
  isFiat?: boolean
  value: number | string
}): string => {
  if (isFiat || coin === 'FIAT') {
    return baseToStandard
      ? new BigNumber(value).dividedBy(100).valueOf()
      : new BigNumber(value).multipliedBy(100).valueOf()
  }

  const { coinfig } = window.coins[coin]

  return transformCoinToCoin({
    coin: coin as CoinType,
    value,
    fromPrecision: baseToStandard ? 1 : coinfig.precision,
    toPrecision: baseToStandard ? coinfig.precision : 1
  }).getOrElse(DefaultConversion).value
}

const convertCoinToFiat = (
  coin: CoinType,
  value: number | string,
  // TODO: not necessary
  fromUnit: UnitType,
  currency: keyof CurrenciesType,
  rates: RatesType
): string => {
  return transformCoinToFiat({
    coin,
    value,
    toCurrency: currency,
    rates
  }).getOrElse(DefaultConversion).value
}

// Still used for gwei => eth conversion
const convertGweiToWei = ({
  value
}: {
  value: number | string
}) => {
  return transformCoinToCoin({
    coin: 'ETH',
    value,
    fromPrecision: 9,
    toPrecision: 1
  }).getOrElse(DefaultConversion)
}

const convertFiatToCoin = ({
  coin,
  currency,
  rates,
  value
}: {
  coin: CoinType
  currency: keyof CurrenciesType
  rates: RatesType
  value: number | string
}): string => {
  const config = Currencies[coin]
  return transformFiatToCoin({
    coin,
    value,
    fromCurrency: currency,
    toUnit: config.code as UnitType,
    rates
  }).getOrElse(DefaultConversion).value
}

// 🔺Triangulate Wallet Fiat -> BTC -> To other Fiat
const convertFiatToFiat = ({
  fromCurrency,
  rates,
  toCurrency,
  value
}: {
  fromCurrency: WalletFiatType
  rates: RatesType
  toCurrency: WalletFiatType
  value: number | string
}) => {
  const btcAmt = transformFiatToCoin({
    coin: 'BTC',
    value,
    fromCurrency,
    toUnit: 'BTC',
    rates
  }).getOrElse(DefaultConversion)
  const fiatAmt = transformCoinToFiat({
    coin: 'BTC',
    value: btcAmt.value,
    toCurrency,
    rates
  }).getOrElse(DefaultConversion)

  return fiatAmt
}

// =====================================================================
// =============================== STRING ==============================
// =====================================================================
const displayCoinToCoin = ({
  coin,
  isFiat,
  value
}: {
  coin: WalletCurrencyType
  isFiat?: boolean
  value: number | string
}): string => {
  if (isFiat) {
    return Currency.fiatToString({ value, unit: coin as FiatType })
  }

  const { coinfig } = window.coins[coin]

  return transformCoinToCoin({
    coin: coin as CoinType,
    value,
    fromPrecision: 1,
    toPrecision: coinfig.precision
  })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayCoinToFiat = ({
  coin,
  rates,
  toCurrency,
  value
}: {
  coin: CoinType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}): string => {
  return transformCoinToFiat({
    coin,
    value,
    toCurrency,
    rates
  })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayFiatToFiat = ({ value }: { value: number | string }) => {
  return new BigNumber(value).toFixed(2)
}

// =====================================================================
// ======================== CALCULATION (internal) =====================
// =====================================================================
const transformCoinToCoin = ({
  fromPrecision,
  toPrecision,
  value
}: {
  coin: CoinType
  fromPrecision: number
  toPrecision: number
  value: number | string
}) => {
  return Currency.fromUnit({ value, precision: fromPrecision }).chain(
    Currency.toUnit(toPrecision)
  )
}

const transformFiatToCoin = ({
  coin,
  fromCurrency,
  rates,
  toUnit,
  value
}: {
  coin: CoinType
  fromCurrency: keyof CurrenciesType
  rates: RatesType
  toUnit: UnitType
  value: number | string
}) => {
  // TODO: remove Currencies reference
  const config = Currencies[coin]
  const pairs = Pairs.create(config, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], config)
  
  // @ts-ignore
  return Currency.fromUnit({ value, precision: sourceCurrencyUnit.decimal_digits })
    .chain(Currency.convert(pairs, config))
    .chain(Currency.toUnit(targetUnit))
}

const transformCoinToFiat = ({
  coin,
  rates,
  toCurrency,
  value
}: {
  coin: CoinType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  const config = Currencies[coin]
  const pairs = Pairs.create(config.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)

  const { coinfig } = window.coins[coin]
  
  return Currency.fromUnit({ value, precision: coinfig.precision })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const getSymbol = (currency): string => {
  const data = Currencies[currency]
  const tradeUnit = prop('trade', data)
  return path(['units', tradeUnit, 'symbol'], data) as string
}

export {
  convertCoinToCoin,
  convertCoinToFiat,
  convertFiatToCoin,
  convertFiatToFiat,
  convertGweiToWei,
  DefaultConversion,
  displayCoinToCoin,
  displayCoinToFiat,
  displayFiatToFiat,
  getSymbol
}
