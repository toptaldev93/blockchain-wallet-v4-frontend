import React from 'react'
import styled from 'styled-components'
import { includes, path, prop, propEq } from 'ramda'

import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from '../OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import AddBankDetails from './AddBankDetails'
import AddCustomerDetails from './AddCustomerDetails'
import SelectAccounts from './SelectAccounts'
import ISignThis from 'components/BuySell/Coinify/ISignThis'
import KYCNotification from '../KYCNotification'
import SellUnavailable from './SellUnavailable'
import { CheckoutWrapper } from '../Buy/template.success'

const OrderSubmitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Sell = props => {
  const {
    canTrade,
    cannotTradeReason,
    canTradeAfter,
    changeTab,
    fetchSellQuote,
    refreshQuote,
    sellQuoteR,
    rateQuoteR,
    clearTradeError,
    currency,
    checkoutBusy,
    setMax,
    setMin,
    paymentMedium,
    initiateSell,
    step,
    busy,
    trade,
    value,
    onOrderCheckoutSubmit,
    checkoutError,
    handleKycAction,
    kycState,
    kycVerified,
    level,
    country
  } = props
  const profile = value.profile || {
    _limits: service.mockedLimits,
    _level: { currency: 'EUR' }
  }
  const sellCurrencies = ['EUR', 'DKK', 'GBP', 'USD']
  const defaultCurrency = includes(currency, sellCurrencies) ? currency : 'EUR' // profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]
  const levelName = prop('name', level.getOrElse())
  const limits = service.getLimits(
    profile._limits,
    defaultCurrency,
    path(['payment', 'effectiveBalance'], value)
  )

  if (step !== 'isx') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <OrderCheckout
              canTrade={canTrade}
              changeTab={changeTab}
              quoteR={sellQuoteR}
              rateQuoteR={rateQuoteR}
              onFetchQuote={fetchSellQuote}
              limits={limits.sell}
              type={'sell'}
              reason={'has_remaining'} // placeholder for now - coinify does not require a reason
              defaultCurrency={defaultCurrency}
              symbol={symbol}
              checkoutBusy={checkoutBusy}
              setMax={setMax}
              setMin={setMin}
              onOrderCheckoutSubmit={onOrderCheckoutSubmit}
              checkoutError={checkoutError}
              increaseLimit={handleKycAction}
              verified={kycVerified}
              cannotTradeReason={cannotTradeReason}
              canTradeAfter={canTradeAfter}
            />
            {!kycVerified && levelName < 2 && (
              <KYCNotification
                limits={limits.sell}
                symbol={symbol}
                onTrigger={handleKycAction}
                type='sell'
                canTrade={canTrade}
                kycState={kycState}
              />
            )}
            {propEq('US', country) && <SellUnavailable />}
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <SelectAccounts />
        </StepView>
        <StepView step={2}>
          <AddBankDetails quoteR={sellQuoteR} />
        </StepView>
        <StepView step={3}>
          <AddCustomerDetails />
        </StepView>
        <StepView step={4}>
          <OrderDetails
            quoteR={sellQuoteR}
            onRefreshQuote={refreshQuote}
            type={'sell'}
            medium={paymentMedium}
          />
          <OrderSubmitWrapper>
            <OrderSubmit
              quoteR={sellQuoteR}
              onSubmit={initiateSell}
              busy={busy}
              type='sell'
              clearTradeError={clearTradeError}
            />
          </OrderSubmitWrapper>
        </StepView>
      </Stepper>
    )
  } else if (step === 'isx') {
    return (
      <ISignThis
        iSignThisId={prop('iSignThisID', trade)}
        options={props.options}
      />
    )
  }
}

export default Sell
