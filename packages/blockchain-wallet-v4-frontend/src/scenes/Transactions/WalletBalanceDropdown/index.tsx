import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { getData } from './selectors'
import { Icon, Text } from 'blockchain-info-components'
import { RemoteDataType } from 'core/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import media from 'services/ResponsiveService'
import React, { Component } from 'react'
import SelectBox from 'components/Form/SelectBox'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

// FIXME: TypeScript use CoinType and SupportedCoinType
export type OwnProps = {
  coin: 'BTC' | 'BCH' | 'ETH' | 'PAX' | 'XLM',
  coinModel: any
}

type LinkStatePropsType = {
  // FIXME: TypeScript use AccountTypes
  data: RemoteDataType<string | Error, { addressData: { data: Array<any> }, balanceData: number }>
}

type Props = OwnProps & LinkStatePropsType

const Wrapper = styled.div`
  width: 320px;
  z-index: 2;
`
// FIXME: TypeScript use SupportedCoinsType
const DisplayContainer = styled.div<{ isItem?: boolean, coinType: any }>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: ${props => (props.isItem ? '6px 6px 0px 0px' : '16px 4px')};
  > span {
    color: ${props => props.theme[props.coinType.colorCode]} !important;
  }
`

const AccountContainer = styled.div<{ isItem?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.isItem ? '0px' : '12px'};
  width: 100%;
  cursor: pointer;
  .bc__single-value {
    position: relative;
    top: 0;
    transform: initial;
  }
  input {
    height: 0;
  }
`

const AmountContainer = styled.div`
  margin-top: 4px;
  display: flex;
`

const FiatContainer = styled.div`
  display: flex;
  font-size: 12px;
  color: ${props => props.theme.grey400};
`

export class WalletBalanceDropdown extends Component<Props> {
  state = {}

  // FIXME: TypeScript use value: { AccountTypes }
  renderDisplay = (props: { value }, children) => {
    const coinType = this.props.coinModel
    const icon = coinType.icons.circleFilled
    const color = coinType.colorCode
    const balance = props.value === 'all' ? this.props.data.getOrElse({ balanceData: 0 }).balanceData : props.value.balance

    return (
      <DisplayContainer coinType={coinType}>
        <Icon size='32px' color={color} name={icon} />
        <AccountContainer>
          {children && children.length && children[1]}
          <Text weight={500} color='grey400'>{props.value === 'all' ? this.props.coin : props.value.label} <FormattedMessage id='scenes.transactions.walletbalancedropdown.balance' defaultMessage='Balance' /></Text>
          <AmountContainer>
            <CoinDisplay
              coin={this.props.coin}
              size='12px'
              weight={500}
              cursor='pointer'
              color='grey800'
            >
              {balance}
            </CoinDisplay>
            <div style={{ width: '8px' }} />
            <FiatContainer>
              (
              <FiatDisplay
                coin={this.props.coin}
                size='12px'
                weight={500}
                color='grey400'
                cursor='pointer'
              >
                {balance}
              </FiatDisplay>
              )
            </FiatContainer>
          </AmountContainer>
        </AccountContainer>
      </DisplayContainer>
    )
  }

  renderItem = (props: { value, label }) => {
    const coinType = this.props.coinModel
    const balance = props.value === 'all' ? this.props.data.getOrElse({ balanceData: 0 }).balanceData : props.value.balance

    return (
      <DisplayContainer coinType={coinType} isItem>
        <AccountContainer isItem>
          {props.value === 'all' ? props.label : props.value.label}
          <AmountContainer>
            <CoinDisplay
              coin={this.props.coin}
              size='12px'
              weight={500}
              cursor='pointer'
              color='grey800'
            >
              {balance}
            </CoinDisplay>
            <div style={{ width: '8px' }} />
            <FiatContainer>
              (
              <FiatDisplay
                coin={this.props.coin}
                size='12px'
                weight={500}
                color='grey400'
                cursor='pointer'
              >
                {balance}
              </FiatDisplay>
              )
            </FiatContainer>
          </AmountContainer>
        </AccountContainer>
      </DisplayContainer>
    )
  }

  render () {
    console.log(this.props.data)

    return this.props.data.cata({
      Success: values => {
        return (
          <Wrapper>
            <Field
              component={SelectBox}
              elements={values.addressData.data}
              grouped
              hideIndicator={values.addressData.data.length <= 1}
              openMenuOnClick={values.addressData.data.length > 1}
              options={values.addressData.data}
              name='source'
              searchEnabled={false}
              templateDisplay={this.renderDisplay}
              templateItem={this.renderItem}
            />
          </Wrapper>
        )
      },
      Failure: e => <Text>{typeof e === 'string' ? e : e.message}</Text>,
      Loading: () => <Text size='24px'>...</Text>,
      NotAsked: () => <Text size='24px'>...</Text>
    })
  }
}

const mapStateToProps = (state, ownProps): LinkStatePropsType => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(WalletBalanceDropdown)
