import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Text, Button, Icon } from 'blockchain-info-components'
import FaqRow from 'components/Faq/FaqRow'
import CountdownTimer from 'components/Form/CountdownTimer'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { flex, spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { OrderDetailsTable, OrderDetailsRow } from './OrderDetails'
import FundingSource from './FundingSource'

const StyledFaqRow = styled(FaqRow)`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const MethodContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 42px;
  border: 1px solid ${props => props.theme['gray-2']}
`

const renderDetailsRow = (id, message, value, color) => (
  <OrderDetailsRow>
    <Text size='13px' weight={400}><FormattedMessage id={id} defaultMessage={message} /></Text>
    <Text size='13px' weight={300} color={color}>{value}</Text>
  </OrderDetailsRow>
)

export const BuyOrderDetails = ({ quoteR, account, onRefreshQuote }) => (
  <ExchangeCheckoutWrapper>
    <Text size='32px' weight={600} style={spacing('mb-10')}>
      <FormattedMessage id='buy.almost_there' defaultMessage="You're almost there" />
    </Text>
    <Text size='14px' weight={300} style={spacing('mb-20')}>
      <FormattedMessage id='buy.review_order_subtext' defaultMessage='Before we can start processing your order, review the order details below. If everything looks good to you, click submit to complete your order.' />
    </Text>
    <Text size='14px' weight='normal' style={spacing('mt-20')}>
      <FormattedMessage id='buy.connected_account' defaultMessage='Your Connected Account' />:
    </Text>
    <MethodContainer style={spacing('mt-10')}>
      <Icon style={spacing('ml-15')} name='bank-filled' size='26px' />
      <FundingSource account={account} />
    </MethodContainer>
    <div style={{ ...flex('row align/center justify/end'), ...spacing('mt-20') }}>
      <Text size='12px' weight={500} style={spacing('mr-10')}>
        <FormattedMessage id='exchange_rate' defaultMessage='Exchange Rate' />
      </Text>
      <Text size='12px' weight={300}>
        1 BTC = {quoteR.map((quote) => `$${quote.rate}`).getOrElse('~')}
      </Text>
    </div>
    <OrderDetailsTable style={spacing('mt-10')}>
      {renderDetailsRow(
        'order_details.amount_to_purchase',
        'BTC Amount to Purchase',
        quoteR.map(quote => `${quote.baseAmount} BTC`).getOrElse('~')
      )}
      {renderDetailsRow(
        'order_details.trading_fee',
        'Trading Fee',
        quoteR.map(quote => `- $${quote.feeAmount}`).getOrElse('~')
      )}
      {renderDetailsRow(
        'order_details.amount_to_receive',
        'BTC Amount to be Received',
        quoteR.map(quote => `${quote.quoteAmount} BTC`).getOrElse('~'),
        'success'
      )}
    </OrderDetailsTable>
    {quoteR.map((quote) => (
      <CountdownTimer
        style={spacing('mt-20')}
        expiryDate={quote.expiresAt.getTime()}
        handleExpiry={onRefreshQuote}
      />
    )).getOrElse(null)}
  </ExchangeCheckoutWrapper>
)

export const BuyOrderSubmit = ({ onSubmit }) => (
  <Fragment>
    <Button nature='primary' onClick={onSubmit}>
      <FormattedMessage id='submit' defaultMessage='Submit' />
    </Button>
    <StyledFaqRow
      title={<FormattedMessage id='faq.how_long_to_receive_q' defaultMessage='How long does it take to get my funds?' />}
      description={<FormattedMessage id='faq.how_long_to_receive_a' defaultMessage='A bitcoin is never late, nor is it early. A bitcoin arrives precisely when it intends to.' />}
    />
    <StyledFaqRow
      title={<FormattedMessage id='faq.exchange_rate_q' defaultMessage='What is the exchange rate?' />}
      description={<FormattedMessage id='faq.exchange_rate_a' defaultMessage='The exchange rate varies from minute to minute.' />}
    />
    <StyledFaqRow
      title={<FormattedMessage id='faq.exchange_fees_q' defaultMessage='What are the fees?' />}
      description={<FormattedMessage id='faq.exchange_fees_a' defaultMessage='Each exchange takes a small percentage of the total amount as a fee.' />}
    />
  </Fragment>
)
