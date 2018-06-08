import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success'
import Loading from 'components/BuySell/Loading'

class SellContainer extends React.Component {
  constructor (props) {
    super(props)
    this.submitQuote = this.submitQuote.bind(this)
    this.startSell = this.startSell.bind(this)
  }

  componentDidMount () {
    this.props.coinifyDataActions.getKycs()
    this.props.sendBtcActions.sendBtcInitialized({ feeType: 'priority' })
    this.props.coinifyActions.initializeCheckoutForm('sell')
  }

  submitQuote () {
    const { sellQuoteR } = this.props
    sellQuoteR.map(quote => this.props.coinifyDataActions.getMediumsWithBankAccounts(quote))
    this.props.coinifyActions.saveMedium('blockchain')
  }

  startSell () {
    const { coinifyActions } = this.props
    coinifyActions.initiateSell()
  }

  render () {
    const { data, modalActions, coinifyActions, coinifyDataActions, formActions,
      rateQuoteR, sellQuoteR, currency, paymentMedium, trade, ...rest } = this.props
    const { canTrade, step, checkoutBusy, coinifyBusy, checkoutError } = rest
    const { handleTrade, fetchQuote, refreshSellQuote } = coinifyDataActions
    const { showModal } = modalActions
    const { coinifyNotAsked, openKYC } = coinifyActions

    const busy = coinifyBusy.cata({
      Success: () => false,
      Failure: (err) => err,
      Loading: () => true,
      NotAsked: () => false
    })

    return data.cata({
      Success: (value) => <Success
        value={value}
        canTrade={canTrade}
        handleTrade={handleTrade}
        showModal={showModal}
        sellQuoteR={sellQuoteR}
        rateQuoteR={rateQuoteR}
        fetchSellQuote={(quote) => fetchQuote({ quote, nextAddress: value.nextAddress })}
        currency={currency}
        checkoutBusy={checkoutBusy}
        setMax={(btcAmt) => formActions.change('coinifyCheckoutSell', 'rightVal', btcAmt)}
        setMin={(btcAmt) => formActions.change('coinifyCheckoutSell', 'rightVal', btcAmt)}
        paymentMedium={paymentMedium}
        initiateSell={this.startSell}
        step={step}
        busy={busy}
        clearTradeError={() => coinifyNotAsked()}
        trade={trade}
        onOrderCheckoutSubmit={this.submitQuote}
        checkoutError={checkoutError}
        handleKycAction={kyc => openKYC(kyc)}
        refreshQuote={refreshSellQuote}
      />,
      Failure: (msg) => <div>Failure: {msg.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendBtcActions: bindActionCreators(actions.components.sendBtc, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SellContainer)
