//
// CUSTOM VARIABLES
//
export const CUSTOM_VARIABLES = {
  KYC_TIER: {
    ID: 1,
    NAME: 'kyc_tier'
  },
  CRYPTO_BALANCES: {
    ID: 2,
    NAME: 'crypto_balances'
  }
}

//
// AB TESTS
//
export const AB_TESTS = {
  PIT_SIDE_NAV_TEST3: 'PitSidenavTest3',
  MIN_MAX_EXCHANGE: 'MinMaxExchange'
}

//
// EVENTS
// format: [event_category, event_action, ?event_name, ?event_value]
//
export const AB_TEST_GOALS = {
  PIT_LINKOUT_CLICKED: ['ab_test_goals', 'pit_linkout_clicked']
}
export const LOCKBOX_EVENTS = {
  INSTALL_APP: ['lockbox', 'apps', 'install'],
  UNINSTALL_APP: ['lockbox', 'apps', 'uninstall'],
  SETTINGS: {
    FIRMWARE_UPDATE: ['lockbox', 'settings', 'firmware_update'],
    RENAME_DEVICE: ['lockbox', 'settings', 'rename_device'],
    REMOVE_DEVICE: ['lockbox', 'settings', 'remove_device'],
    SHOW_XPUBS: ['lockbox', 'settings', 'show_xpubs'],
    TAKE_TOUR: ['lockbox', 'settings', 'take_tour']
  },
  DEVICE_SETUP: {
    SELECT_DEVICE: ['lockbox', 'device_setup', 'lockbox_setup_start'],
    SETUP_TYPE: ['lockbox', 'device_setup', 'lockbox_setup_type'],
    CONNECT_DEVICE: ['lockbox', 'device_setup', 'lockbox_setup_connect'],
    INSTALL_APPS: [
      'lockbox',
      'device_setup',
      'lockbox_setup_connect_install_apps'
    ],
    PAIR_DEVICE: ['lockbox', 'device_setup', 'lockbox_setup_pair_device'],
    COMPLETE: ['lockbox', 'device_setup', 'lockbox_setup_complete'],
    VIEW_TOUR: ['lockbox', 'device_setup', 'view_tour']
  }
}
export const PREFERENCE_EVENTS = {
  GENERAL: {
    ENABLE_BTC_LINKS: 'enable_btc_links'
  },
  SECURITY: {
    ACTIVITY_LOGGING: ['preferences', 'security', 'activity_logging'],
    BACKUP_PHRASE_VERIFIED: [
      'preferences',
      'security',
      'backup_phrase_verified'
    ],
    EMAIL_VERIFIED: ['preferences', 'security', 'email_verified'],
    PASSWORD_CHANGE: ['preferences', 'security', 'password_change'],
    PASSWORD_STRETCHING: ['preferences', 'security', 'password_stretching'],
    IP_WHITELIST_EDIT: ['preferences', 'security', 'edit_ip_whitelist'],
    IP_RESTRICTIONS: ['preferences', 'security', 'ip_restrictions'],
    TWO_FACTOR_ENABLED: ['preferences', 'security', '2fa_enabled'],
    TWO_FACTOR_DISABLED: ['preferences', 'security', '2fa_disabled'],
    TOR_ACCESS: ['preferences', 'security', 'tor_access'],
    VERIFY_DEVICE_ACCEPTED: [
      'preferences',
      'security',
      'verify_device_accepted'
    ],
    VERIFY_DEVICE_EMAIL_SENT: [
      'preferences',
      'security',
      'verify_device_email_sent'
    ],
    VERIFY_DEVICE_REJECTED: [
      'preferences',
      'security',
      'verify_device_rejected'
    ]
  }
}
export const SWAP_EVENTS = {
  ORDER_CONFIRM: ['swap', 'order_form', 'order_confirm'],
  ORDER_CONFIRM_ERROR: ['swap', 'order_form', 'order_confirm_error'],
  ORDER_PREVIEW: ['swap', 'order_form', 'order_preview'],
  ORDER_PREVIEW_ERROR: ['swap', 'order_form', 'order_preview_error'],
  REVERSE_PAIR: ['swap', 'order_form', 'reverse_pair'],
  SUBMIT_SWAP: ['swap', 'order_form', 'submit_swap'],
  FIAT_TO_CRYPTO_CHANGE: ['swap', 'order_form', 'fiat_to_crypto_change'],
  CRYPTO_TO_FIAT_CHANGE: ['swap', 'order_form', 'crypto_to_fiat_change'],
  EXCHANGE_RECEIVE_CHANGE: ['swap', 'order_form', 'exchange_receive_change'],
  VALUE_INPUT: ['swap', 'order_form', 'value_input'],
  USE_MIN: ['swap', 'order_form', 'use_min'],
  USE_MAX: ['swap', 'order_form', 'use_max'],
  VIEW_ORDER_DETAILS: ['swap', 'order_history', 'view_details']
}
export const TRANSACTION_EVENTS = {
  SEND: ['transactions', 'send'],
  REQUEST: ['transactions', 'request'],
  EDIT_DESCRIPTION: ['transactions', 'edit_description'],
  PAYMENT_REQUEST: ['transactions', 'payment_request'],
  SEND_FAILURE: ['send_failure'],
  VIEW_TX_ON_EXPLORER: ['transactions', 'view_tx_explorer'],
  BITPAY_URL_DEEPLINK: ['transactions', 'bitpay', 'bitpay_url_deeplink'],
  BITPAY_FAILURE: ['transactions', 'bitpay', 'bitpay_payment_failure'],
  BITPAY_SUCCESS: ['transactions', 'bitpay', 'bitpay_payment_success']
}

export const GENERAL_EVENTS = {
  VIEW_WHATS_NEW: ['general', 'view_whats_new'],
  VIEW_FAQ: ['general', 'view_faq'],
  WALLET_INTRO_DISMISSED: ['general', 'wallet_intro_tour', 'dismissed'],
  WALLET_INTRO_OFFERED: ['general', 'wallet_intro_tour', 'offered'],
  WALLET_INTRO_STARTED: ['general', 'wallet_intro_tour', 'started'],
  WALLET_INTRO_PORTFOLIO_VIEWED: [
    'general',
    'wallet_intro_tour',
    'step_view_portfolio'
  ],
  WALLET_INTRO_REQUEST_VIEWED: [
    'general',
    'wallet_intro_tour',
    'step_view_request'
  ],
  WALLET_INTRO_SEND_VIEWED: ['general', 'wallet_intro_tour', 'step_view_send'],
  WALLET_INTRO_SWAP_VIEWED: ['general', 'wallet_intro_tour', 'step_view_swap'],
  WALLET_INTRO_BUYSELL_VIEWED: [
    'general',
    'wallet_intro_tour',
    'step_view_buysell'
  ]
}

export const ADS_EVENTS = {
  CLICK_AD: ['navigation', 'click_ad']
}

export const PIT_EVENTS = {
  BANNER_GET_STARTED: ['pit', 'homepage', 'homepage_banner_click'],
  SIDE_NAV: ['pit', 'sidenav', 'sidenav_link_click'],
  CONNECT_NOW: ['pit', 'link_page', 'connect_now_click'],
  LEARN_MORE: ['pit', 'link_page', 'learn_more_click']
}
