import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { CoinType, FiatType } from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InterestStep, InterestStepMetadata } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import AccountSummary from './AccountSummary'
import DepositForm from './DepositForm'
import WithdrawalForm from './WithdrawalForm'

class Interest extends PureComponent<Props, State> {
  state: State = { show: false, showSuplyInformation: false }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.props.fetchInterestEDDStatus()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  handleSBClick = coin => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
      this.props.simpleBuyActions.showModal('InterestPage', coin)
    }, duration / 2)
  }

  showSuply = (show: boolean) => {
    this.setState({
      showSuplyInformation: show
    })
  }

  render() {
    const { coin, position, step, total, walletCurrency } = this.props
    return (
      <Flyout
        position={position}
        isOpen={this.state.show}
        userClickedOutside={this.props.userClickedOutside}
        onClose={this.handleClose}
        data-e2e='interestModal'
        total={total}
      >
        {step.name === 'ACCOUNT_SUMMARY' && (
          <FlyoutChild>
            <AccountSummary
              handleClose={this.handleClose}
              handleSBClick={() => this.handleSBClick(coin)}
              stepMetadata={step.data}
              coin={coin}
              showSuply={this.state.showSuplyInformation}
            />
          </FlyoutChild>
        )}
        {step.name === 'DEPOSIT' && (
          <FlyoutChild>
            <DepositForm coin={coin} />
          </FlyoutChild>
        )}
        {step.name === 'WITHDRAWAL' && (
          <FlyoutChild>
            <WithdrawalForm
              coin={coin}
              walletCurrency={walletCurrency}
              setShowSuply={this.showSuply}
            />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  step: selectors.components.interest.getStep(state),
  coin: selectors.components.interest.getCoinType(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  fetchInterestEDDStatus: () =>
    dispatch(actions.components.interest.fetchEDDStatus())
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  coin: CoinType
  step: {
    data: InterestStepMetadata
    name: InterestStep
  }
  walletCurrency: FiatType
}

type State = { show: boolean; showSuplyInformation: boolean }
type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose<any>(
  modalEnhancer('INTEREST_MODAL', { transition: duration }),
  connector
)

export default enhance(Interest)
