import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'

import Template from './template'

export type LinkDispatchPropsType = {
  identityVerificationActions: typeof actions.components.identityVerification
  simpleBuyActions: typeof actions.components.simpleBuy
}

class UpgradeToGold extends PureComponent<Props> {
  render () {
    return <Template {...this.props} />
  }
}

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

const connector = connect(null, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(UpgradeToGold)
