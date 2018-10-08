import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'
import { LoadingBalance } from 'components/Balances'

class XlmBalance extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentWillMount () {
    this.props.actions.fetchAccount()
  }

  handleRefresh () {
    this.props.actions.fetchAccount()
  }

  render () {
    const { data, large } = this.props

    return data.cata({
      Success: value => <Success balance={value} large={large} />,
      Failure: message => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance large={large} coin='XLM' />,
      NotAsked: () => <LoadingBalance large={large} coin='XLM' />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.xlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(XlmBalance)
