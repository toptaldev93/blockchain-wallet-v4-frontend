import * as AT from './actionTypes'

//
// ETH
//

export const fetchData = () => ({ type: AT.FETCH_ETH_DATA })
export const fetchDataLoading = () => ({
  type: AT.FETCH_ETH_DATA_LOADING
})
export const fetchDataSuccess = data => ({
  type: AT.FETCH_ETH_DATA_SUCCESS,
  payload: data
})
export const fetchDataFailure = error => ({
  type: AT.FETCH_ETH_DATA_FAILURE,
  payload: error
})

export const fetchFee = () => ({ type: AT.FETCH_ETH_FEE })
export const fetchFeeLoading = () => ({ type: AT.FETCH_ETH_FEE_LOADING })
export const fetchFeeSuccess = data => ({
  type: AT.FETCH_ETH_FEE_SUCCESS,
  payload: data
})
export const fetchFeeFailure = error => ({
  type: AT.FETCH_ETH_FEE_FAILURE,
  payload: error
})

export const fetchLatestBlock = () => ({
  type: AT.FETCH_ETH_LATEST_BLOCK
})
export const fetchLatestBlockLoading = () => ({
  type: AT.FETCH_ETH_LATEST_BLOCK_LOADING
})
export const fetchLatestBlockSuccess = data => ({
  type: AT.FETCH_ETH_LATEST_BLOCK_SUCCESS,
  payload: data
})
export const fetchLatestBlockFailure = error => ({
  type: AT.FETCH_ETH_LATEST_BLOCK_FAILURE,
  payload: error
})

export const fetchCurrentBalance = () => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE
})
export const fetchCurrentBalanceLoading = () => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE_LOADING
})
export const fetchCurrentBalanceSuccess = balance => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE_SUCCESS,
  payload: { balance }
})
export const fetchCurrentBalanceFailure = error => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE_FAILURE,
  payload: error
})

export const fetchLegacyBalance = () => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE
})
export const fetchLegacyBalanceLoading = () => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE_LOADING
})
export const fetchLegacyBalanceSuccess = balance => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE_SUCCESS,
  payload: { balance }
})
export const fetchLegacyBalanceFailure = error => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE_FAILURE,
  payload: error
})

export const fetchRates = () => ({ type: AT.FETCH_ETH_RATES })
export const fetchRatesLoading = () => ({
  type: AT.FETCH_ETH_RATES_LOADING
})
export const fetchRatesSuccess = data => ({
  type: AT.FETCH_ETH_RATES_SUCCESS,
  payload: data
})
export const fetchRatesFailure = error => ({
  type: AT.FETCH_ETH_RATES_FAILURE,
  payload: error
})

export const fetchTransactions = (address, reset) => ({
  type: AT.FETCH_ETH_TRANSACTIONS,
  payload: { address, reset }
})
export const fetchTransactionsLoading = (address, reset) => ({
  type: AT.FETCH_ETH_TRANSACTIONS_LOADING,
  payload: { address, reset }
})
export const fetchTransactionsSuccess = (transactions, reset) => ({
  type: AT.FETCH_ETH_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_ETH_TRANSACTIONS_FAILURE,
  payload: error
})

export const transactionsAtBound = payload => ({
  type: AT.ETH_TRANSACTIONS_AT_BOUND,
  payload
})

//
// ERC20
//
export const fetchErc20Data = token => ({
  type: AT.FETCH_ERC20_TOKEN_DATA,
  payload: { token }
})
export const fetchErc20DataLoading = token => ({
  type: AT.FETCH_ERC20_TOKEN_DATA_LOADING,
  payload: { token }
})
export const fetchErc20DataSuccess = (token, data) => ({
  type: AT.FETCH_ERC20_TOKEN_DATA_SUCCESS,
  payload: { token, data }
})
export const fetchErc20DataFailure = (token, error) => ({
  type: AT.FETCH_ERC20_TOKEN_DATA_FAILURE,
  payload: { token, error }
})

export const fetchErc20Balance = token => ({
  type: AT.FETCH_ERC20_TOKEN_BALANCE,
  payload: { token }
})
export const fetchErc20BalanceLoading = token => ({
  type: AT.FETCH_ERC20_TOKEN_BALANCE_LOADING,
  payload: { token }
})
export const fetchErc20BalanceSuccess = (token, balance) => ({
  type: AT.FETCH_ERC20_TOKEN_BALANCE_SUCCESS,
  payload: { token, balance }
})
export const fetchErc20BalanceFailure = (token, error) => ({
  type: AT.FETCH_ERC20_TOKEN_BALANCE_FAILURE,
  payload: { token, error }
})

export const fetchErc20Transactions = (token, address, reset) => ({
  type: AT.FETCH_ERC20_TOKEN_TRANSACTIONS,
  payload: { token, address, reset }
})
export const fetchErc20TransactionsLoading = (token, address, reset) => ({
  type: AT.FETCH_ERC20_TOKEN_TRANSACTIONS_LOADING,
  payload: { token, address, reset }
})
export const fetchErc20TransactionsSuccess = (token, transactions, reset) => ({
  type: AT.FETCH_ERC20_TOKEN_TRANSACTIONS_SUCCESS,
  payload: { token, transactions, reset }
})
export const fetchErc20TransactionsFailure = (token, error) => ({
  type: AT.FETCH_ERC20_TOKEN_TRANSACTIONS_FAILURE,
  payload: { token, error }
})

export const erc20TransactionsAtBound = (token, isAtBound) => ({
  type: AT.ERC20_TOKEN_TX_AT_BOUND,
  payload: { token, isAtBound }
})
