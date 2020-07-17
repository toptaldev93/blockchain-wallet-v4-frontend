import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'components/Form/CreditCardBox/model'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '../index'
import { SBFormPaymentMethod } from 'data/components/simpleBuy/types'
import { SBPaymentMethodType } from 'core/types'
import Card from './Card'
import Fund from './Fund'
import Payment from './Payment'
import React, { PureComponent, ReactElement } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
`
const PaymentsWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.grey000};
`

const IconContainer = styled.div`
  width: 38px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`

export type Props = OwnProps & SuccessStateType

class Payments extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  getType = (value: SBFormPaymentMethod) => {
    switch (value.type) {
      case 'BANK_ACCOUNT':
        return 'Deposit Cash'
      case 'PAYMENT_CARD':
        return 'Add a Credit or Debit Card'
      case 'USER_CARD':
        return value && value.card
          ? value.card.label
            ? value.card.label
            : value.card.type
          : 'Add a Credit or Debit Card'
      case 'FUNDS':
        return ''
    }
  }

  handleSubmit = (method: SBPaymentMethodType) => {
    this.props.simpleBuyActions.destroyCheckout()
    this.props.simpleBuyActions.setStep({
      step: 'ENTER_AMOUNT',
      fiatCurrency: this.props.fiatCurrency || 'USD',
      pair: this.props.pair,
      method
    })
  }

  getIcon = (value: SBPaymentMethodType): ReactElement => {
    switch (value.type) {
      case 'BANK_ACCOUNT':
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='bank-filled' />
          </IconContainer>
        )
      case 'PAYMENT_CARD':
        return (
          <IconContainer>
            <Icon size='16px' color='blue600' name='credit-card-sb' />
          </IconContainer>
        )
      case 'USER_CARD':
        let cardType = CARD_TYPES.find(
          card => card.type === (value.card ? value.card.type : '')
        )
        return (
          <img
            height='18px'
            width='auto'
            src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
          />
        )
      case 'FUNDS':
        return <></>
    }
  }

  getCardIcon = (value: SBPaymentMethodType): ReactElement => {
    const { card } = value
    if (!card) {
      return <></>
    }
    const cardType = CARD_TYPES.find(cc => cc.type === card.type)
    return (
      <img
        height='18px'
        width='auto'
        src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
      />
    )
  }

  renderCardText = (value: SBPaymentMethodType): string => {
    return value.card
      ? value.card.label
        ? value.card.label
        : value.card.type
      : 'Credit or Debit Card'
  }

  render () {
    const availableCards = this.props.cards.filter(
      card => card.state === 'ACTIVE'
    )
    const defaultMethods = this.props.paymentMethods.methods.map(value => ({
      text: this.getType(value),
      value
    }))

    const funds = defaultMethods.filter(method => method.value.type === 'FUNDS')
    const nonFundsMethods = defaultMethods.filter(
      method => method.value.type !== 'FUNDS'
    )

    const cardMethods = availableCards.map(card => ({
      text: card.card
        ? card.card.label
          ? card.card.label
          : card.card.type
        : 'Credit or Debit Card',
      value: {
        ...card,
        card: card.card,
        type: 'USER_CARD',
        currency: card.currency,
        limits: card.limits ? card.limits : { min: '1000', max: '500000' }
      } as SBPaymentMethodType
    }))

    // card?: SBCard,
    // currency: FiatCurrenciesType,
    // limits: {
    //   max: string
    //   min: string
    // },
    // subTypes?: [] | [CardNameType],
    // type: SBPaymentTypes

    // eslint-disable-next-line
    console.log('cardMethods', cardMethods)
    // eslint-disable-next-line
    console.log(defaultMethods)

    return (
      <Wrapper>
        <Form>
          <FlyoutWrapper>
            <TopText color='grey800' size='20px' weight={600}>
              <Icon
                cursor
                name='arrow-left'
                size='20px'
                color='grey600'
                style={{ marginRight: '28px' }}
                role='button'
                onClick={() =>
                  this.props.simpleBuyActions.setStep({
                    step: 'ENTER_AMOUNT',
                    fiatCurrency: this.props.fiatCurrency || 'USD',
                    pair: this.props.pair
                  })
                }
              />
              <div>
                <FormattedMessage
                  id='modals.simplebuy.paymentmethods'
                  defaultMessage='Payment Methods'
                />
              </div>
            </TopText>
          </FlyoutWrapper>
          <PaymentsWrapper>
            {funds &&
              funds.map((fund, index) => (
                <Fund
                  key={`${fund.text}-${index}`}
                  value={fund.value}
                  icon={this.getIcon(fund.value)}
                  onClick={() => this.handleSubmit(fund.value)}
                />
              ))}
            {cardMethods &&
              cardMethods.map((cardMethod, index) => (
                <Card
                  key={`${cardMethod.text}-${index}`}
                  value={cardMethod.value}
                  text={this.renderCardText(cardMethod.value)}
                  icon={this.getCardIcon(cardMethod.value)}
                  onClick={() => this.handleSubmit(cardMethod.value)}
                />
              ))}
            {nonFundsMethods &&
              nonFundsMethods.map((payment, index) => (
                <Payment
                  key={`${payment.text}-${index}`}
                  {...payment}
                  icon={this.getIcon(payment.value)}
                  onClick={() => this.handleSubmit(payment.value)}
                />
              ))}
          </PaymentsWrapper>
        </Form>
      </Wrapper>
    )
  }
}

export default reduxForm<{}, Props>({
  form: 'sbPaymentMethods',
  destroyOnUnmount: false
})(Payments)
