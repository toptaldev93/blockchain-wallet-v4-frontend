import { isNil, lift, mapObjIndexed, reject, values } from 'ramda'

import {
  AccountTokensBalancesResponseType,
  CoinTypeEnum,
  ExtractSuccess,
  SupportedWalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getSupportedCoinsWithMethodAndOrder = (state: RootState) => {
  const sbMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const erc20sR = selectors.core.data.eth.getErc20AccountTokenBalances(state)

  const transform = (
    paymentMethods: ExtractSuccess<typeof sbMethodsR>,
    supportedCoins: ExtractSuccess<typeof supportedCoinsR>,
    erc20s: AccountTokensBalancesResponseType['tokenAccounts']
  ) => {
    // remove coins that may not yet exist in wallet options to avoid app crash
    const coinOrder = reject(isNil)([
      supportedCoins.USD,
      supportedCoins.EUR,
      supportedCoins.GBP,
      supportedCoins.BTC,
      supportedCoins.ETH,
      supportedCoins.BCH,
      supportedCoins.XLM,
      supportedCoins.ALGO,
      supportedCoins.DOT,
      ...erc20s.map((value) => {
        return window.coins[value.symbol!]
      })
    ])

    return values(
      mapObjIndexed((coin: SupportedWalletCurrencyType) => {
        return {
          ...coin,
          method:
            coin.coinCode in CoinTypeEnum ||
            !!paymentMethods.methods.find(
              (method) => method.currency === coin.coinCode && method.type === 'FUNDS'
            )
        }
      }, coinOrder)
    )
  }

  return lift(transform)(sbMethodsR, supportedCoinsR, erc20sR)
}

export default getSupportedCoinsWithMethodAndOrder
