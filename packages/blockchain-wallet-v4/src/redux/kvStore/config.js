export const BCH = 'bch'
export const BUYSELL = 'buySell'
export const BTC = 'btc'
export const CONTACTS = 'contacts'
export const ETH = 'eth'
export const LOCKBOX = 'lockbox'
export const ROOT = 'root'
export const SHAPESHIFT = 'shapeshift'
export const WHATSNEW = 'whatsNew'
export const USER_CREDENTIALS = 'userCredentials'
export const XLM = 'xlm'
export const WALLET_CREDENTIALS = 'walletCredentials'

export const derivationMap = {
  [ROOT]: -1,
  [WHATSNEW]: 2, // TODO: Deprecate
  [BUYSELL]: 3,
  [CONTACTS]: 4,
  [ETH]: 5,
  [SHAPESHIFT]: 6,
  [BCH]: 7,
  [BTC]: 8,
  [LOCKBOX]: 9,
  [USER_CREDENTIALS]: 10,
  [XLM]: 11,
  [WALLET_CREDENTIALS]: 12
}
