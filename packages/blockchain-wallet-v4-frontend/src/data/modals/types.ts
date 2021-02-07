import * as AT from './actionTypes'

export type ModalNamesType =
  | '@KYC.IdentityVerification'
  | '@MODAL.REQUEST.BCH'
  | '@MODAL.REQUEST.BTC'
  | '@MODAL.REQUEST.ETH'
  | '@MODAL.REQUEST.XLM'
  | '@MODAL.SEND.BCH'
  | '@MODAL.SEND.BTC'
  | '@MODAL.SEND.ETH'
  | '@MODAL.SEND.XLM'
  | 'AddBtcWallet'
  | 'AirdropClaim'
  | 'AirdropSuccess'
  | 'BitPayInvoiceExpired'
  | 'BORROW_MODAL'
  | 'ADD_BANK_MODAL'
  | 'BANK_DETAILS_MODAL'
  | 'REMOVE_BANK_MODAL'
  | 'Confirm'
  | 'CUSTODY_WITHDRAW_MODAL'
  | 'DeleteAddressLabel'
  | 'EditTxDescription'
  | 'FAQ_MODAL'
  | 'ImportBtcAddress'
  | 'INTEREST_MODAL'
  | 'KycDocResubmit'
  | 'KycTierUpgrade'
  | 'LinkFromExchangeAccount'
  | 'LinkToExchangeAccount'
  | 'PairingCode'
  | 'RECOVERY_PHRASE_MODAL'
  | 'REQUEST_CRYPTO_MODAL'
  | 'ShowBtcPrivateKey'
  | 'ShowUsedAddresses'
  | 'ShowXPub'
  | 'SignMessage'
  | 'SIMPLE_BUY_MODAL'
  | 'SWAP_MODAL'
  | 'SwapGetStarted'
  | 'TRANSACTION_REPORT'
  | 'TransferEth'
  | 'UpgradeForAirdrop'
  | 'VerifyMessage'
  | 'WELCOME_MODAL'
  | 'WITHDRAWAL_MODAL'

export type ModalOriginType =
  | 'AirdropClaimGoal'
  | 'AddBankModal'
  | 'BankDetailsModal'
  | 'BorrowHistorySection'
  | 'BorrowLandingPage'
  | 'EmptyFeed'
  | 'ExchangeForm'
  | 'FeaturesTopNav'
  | 'Header'
  | 'InterestPage'
  | 'KycDocResubmitGoal'
  | 'KycRequiredStep'
  | 'PaymentProtocolGoal'
  | 'PendingOrder'
  | 'PriceChart'
  | 'Request'
  | 'RetrySendEth'
  | 'RunKycGoal'
  | 'SBEnterAmountCheckout'
  | 'SBPaymentMethodSelection'
  | 'SellEmpty'
  | 'Send'
  | 'SendBch'
  | 'SendBtc'
  | 'SendEth'
  | 'SendExchangePromo'
  | 'SendXlm'
  | 'SettingsGeneral'
  | 'SettingsPage'
  | 'SettingsProfile'
  | 'SideNav'
  | 'SimpleBuyLink'
  | 'Swap'
  | 'SwapGetStarted'
  | 'SwapPrompt'
  | 'SwapLimitPrompt'
  | 'TheExchangePage'
  | 'TransactionList'
  | 'Unknown'
  | 'WalletBalanceDropdown'
  | 'WelcomeModal'
  | 'WithdrawModal'

export type ModalParamPropsType = {
  [key: string]: any
  origin: ModalOriginType
}

export type ModalType = {
  options: any
  props: ModalParamPropsType
  type: ModalNamesType
}

// State
export type ModalsState = Array<ModalType>

// Actions
interface CloseAllModals {
  type: typeof AT.CLOSE_ALL_MODALS
}

interface CloseModal {
  payload: {
    modalName?: ModalNamesType
  }
  type: typeof AT.CLOSE_MODAL
}

interface ShowModal {
  payload: ModalType
  type: typeof AT.SHOW_MODAL
}

interface UpdateModalOptions {
  payload: {
    options: any
  }
  type: typeof AT.UPDATE_MODAL
}

export type ModalActionTypes =
  | CloseAllModals
  | CloseModal
  | ShowModal
  | UpdateModalOptions
