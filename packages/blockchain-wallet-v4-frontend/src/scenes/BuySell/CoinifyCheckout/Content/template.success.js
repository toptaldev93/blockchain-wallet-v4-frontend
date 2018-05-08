import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from './OrderCheckout'
import { Text } from 'blockchain-info-components'
import { OrderDetails, OrderSubmit } from './OrderReview'
import { Remote } from 'blockchain-wallet-v4/src'
import { flex } from 'services/StyleService'
import * as service from 'services/CoinifyService'
import Payment from '../../../../modals/CoinifyExchangeData/Payment'
import ISignThis from '../../../../modals/CoinifyExchangeData/ISignThis'
import OrderHistory from '../../OrderHistory'
import { filter, path, contains } from 'ramda'

const CheckoutWrapper = styled.div`
  width: 55%;
`
const OrderSubmitWrapper = CheckoutWrapper.extend`
  width: 35%;
  padding: 30px 30px 30px 10%;
`
const OrderHistoryWrapper = styled.div`
  width: 100%;
  > div:last-child > div:last-child {
    margin-bottom: 0px;
  }
`
const OrderHistoryContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  > div:last-child {
    margin-bottom: 20px;
  }
`
const isPending = (t) => t.state === 'processing' || t.state === 'awaiting_transfer_in'
const isCompleted = (t) => contains(t.state, ['completed', 'rejected', 'cancelled', 'expired'])

const Success = props => {
  const {
    fetchBuyQuote,
    fetchSellQuote,
    refreshQuote,
    submitSellQuote,
    buyQuoteR,
    sellQuoteR,
    showModal,
    clearTradeError,
    currency,
    rateQuoteR,
    checkoutBusy,
    setMax,
    paymentMedium,
    initiateBuy,
    step,
    busy,
    trade,
    triggerKyc,
    ...rest } = props

  const { trades, type, value } = rest
  const profile = Remote.of(value.profile).getOrElse({ _limits: service.mockedLimits, _level: { currency: 'EUR' } })
  const level = value.level

  const defaultCurrency = currency || 'EUR'// profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]

  const limits = service.getLimits(profile._limits, defaultCurrency)
  console.log('success template', props, value)
  if (type === 'buy' || !type) {
    if (step !== 'isx') {
      return (
        <Stepper initialStep={0}>
          <StepView step={0}>
            <CheckoutWrapper>
              <OrderCheckout
                quoteR={buyQuoteR}
                rateQuoteR={rateQuoteR}
                onFetchQuote={fetchBuyQuote}
                limits={limits.buy}
                type={'buy'}
                reason={'has_remaining'} // placeholder for now - coinify does not require a reason
                defaultCurrency={defaultCurrency}
                symbol={symbol}
                checkoutBusy={checkoutBusy}
                setMax={setMax}
                increaseLimit={triggerKyc}
                level={level}
              />
            </CheckoutWrapper>
          </StepView>
          <StepView step={1}>
            <Payment />
          </StepView>
          <StepView step={2}>
            <div style={flex('row')}>
              <CheckoutWrapper>
                <OrderDetails
                  quoteR={buyQuoteR}
                  onRefreshQuote={refreshQuote}
                  type={'buy'}
                  medium={paymentMedium}
                />
              </CheckoutWrapper>
              <OrderSubmitWrapper style={{ ...flex('col') }}>
                <OrderSubmit
                  quoteR={buyQuoteR}
                  onSubmit={initiateBuy}
                  busy={busy}
                  clearTradeError={clearTradeError}
                />
              </OrderSubmitWrapper>
            </div>
          </StepView>
        </Stepper>
      )
    } else if (step === 'isx') {
      return (
        <ISignThis
          iSignThisId={path(['iSignThisID'], trade)}
          options={props.options}
        />
      )
    }
  } else if (trades) {
    return (
      <OrderHistoryWrapper>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.coinifycheckout.trades.pending' defaultMessage='Pending Orders' />
          </Text>
          <OrderHistory trades={filter(isPending, trades)} conversion={100} handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })} />
        </OrderHistoryContent>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.coinifycheckout.trades.completed' defaultMessage='Completed Orders' />
          </Text>
          <OrderHistory trades={filter(isCompleted, trades)} conversion={100} handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })} />
        </OrderHistoryContent>
      </OrderHistoryWrapper>
    )
  }
}

export default Success
