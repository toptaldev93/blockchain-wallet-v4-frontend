import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { includes } from 'ramda'

import { actions, selectors } from 'data'
import TransactionListItem from './template'

class ListItemContainer extends React.PureComponent {
  state = { isToggled: false }

  handleToggle = () => {
    this.setState({ isToggled: !this.state.isToggled })
  }

  handleEditDescription = value => {
    const { coin, erc20List, transaction } = this.props
    // TODO: remove switch and make generic
    switch (true) {
      case coin === 'ETH': {
        this.props.ethActions.setTxNotesEth(transaction.hash, value)
        break
      }
      case coin === 'BTC': {
        this.props.walletActions.setTransactionNote(transaction.hash, value)
        break
      }
      case coin === 'BCH': {
        this.props.bchActions.setTxNotesBch(transaction.hash, value)
        break
      }
      case coin === 'BSV': {
        this.props.bsvActions.setTxNotesBsv(transaction.hash, value)
        break
      }
      case coin === 'XLM': {
        this.props.xlmActions.setTxNotesXlm(transaction.hash, value)
        break
      }
      case includes(coin, erc20List): {
        this.props.ethActions.setTxNoteErc20(coin, transaction.hash, value)
        break
      }
      default: {
        this.props.logActions.logErrorMessage(
          'components/TransactionListItem',
          'handleEditDescription',
          'Unsupported Coin Code'
        )
      }
    }
  }

  render () {
    const { coin, currency, transaction, buySellPartner } = this.props
    return (
      <TransactionListItem
        coin={coin}
        currency={currency}
        isToggled={this.state.isToggled}
        handleToggle={this.handleToggle}
        transaction={transaction}
        buySellPartner={buySellPartner}
        handleEditDescription={this.handleEditDescription}
      />
    )
  }
}

const mapStateToProps = state => ({
  erc20List: selectors.core.walletOptions.getErc20CoinList(state).getOrFail()
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  bsvActions: bindActionCreators(actions.core.kvStore.bsv, dispatch),
  ethActions: bindActionCreators(actions.core.kvStore.eth, dispatch),
  logActions: bindActionCreators(actions.logs, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  xlmActions: bindActionCreators(actions.core.kvStore.xlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItemContainer)
