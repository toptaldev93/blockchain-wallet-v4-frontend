import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  BlockchainLoader,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import App from './template'

const Wrapper = styled(ModalBody)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
`
const Loader = styled(BlockchainLoader)`
  margin: 25px;
`
const appNameDict = {
  BTC: 'Bitcoin',
  BCH: 'Bitcoin Cash',
  ETH: 'Ethereum',
  XLM: 'Stellar'
}
const getKeyByValue = value => {
  return Object.keys(appNameDict).find(key => appNameDict[key] === value)
}

class AppManagerContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { appName: '', changeType: '' }
    this.onAppInstall = this.onAppInstall.bind(this)
    this.onAppUninstall = this.onAppUninstall.bind(this)
    this.onContinue = this.onContinue.bind(this)
  }

  componentDidMount () {
    this.props.lockboxActions.initializeAppManager(this.props.deviceIndex)
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetAppChangeStatus()
    this.props.lockboxActions.resetConnectionStatus()
  }

  onAppInstall (appName, coin) {
    this.setState({ changeType: 'Installing', appName })
    this.props.lockboxActions.installApplication(coin)
  }

  onAppUninstall (appName) {
    this.setState({ changeType: 'Uninstalling', appName })
    this.props.lockboxActions.uninstallApplication(appName)
  }

  onContinue () {
    this.setState({ changeType: '', appName: '' })
    this.props.lockboxActions.resetAppChangeStatus()
  }

  render () {
    const {
      appChangeStatus,
      appVersionInfos,
      closeAll,
      connection,
      position,
      total
    } = this.props
    const appUpdateStatus = appChangeStatus.cata({
      Success: val => (
        <React.Fragment>
          <TextGroup inline>
            <Text>{this.state.changeType}</Text>
            <Text>{this.state.appName} Success</Text>
          </TextGroup>
          <Button onClick={this.onContinue}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.continue'
              defaultMessage='Continue'
            />
          </Button>
        </React.Fragment>
      ),
      Failure: val => (
        <React.Fragment>
          <TextGroup inline>
            <Text>{this.state.changeType}</Text>
            <Text>{this.state.appName} FAILED</Text>
          </TextGroup>
          <Text>{val.error()}</Text>
          <Button onClick={this.onContinue}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.continue'
              defaultMessage='Continue'
            />
          </Button>
        </React.Fragment>
      ),
      Loading: () => (
        <React.Fragment>
          <TextGroup inline>
            <Text>{this.state.changeType}</Text>
            <Text>{this.state.appName}</Text>
          </TextGroup>
          <BlockchainLoader width='75px' height='75px' />
        </React.Fragment>
      ),
      NotAsked: () => null
    })
    const appListView = appVersionInfos.cata({
      Success: apps => {
        return apps.map((app, i) => {
          const coin = getKeyByValue(app.name)
          return (
            <App
              key={i}
              app={app}
              coin={coin}
              installApp={() => {
                this.onAppInstall(app.name, coin)
              }}
              uninstallApp={() => {
                this.onAppUninstall(app.name, coin)
              }}
            />
          )
        })
      },
      Failure: () => (
        <Text size='16px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockbox.appmanager.appfailure'
            defaultMessage='Failed to load application list. Please try again later.'
          />
        </Text>
      ),
      Loading: () => <Loader width='75px' height='75px' />,
      NotAsked: () => <Loader width='75px' height='75px' />
    })

    return (
      <Modal size='large' position={position} total={total}>
        <ModalHeader onClose={closeAll}>
          <FormattedMessage
            id='modals.lockbox.appmanager.title'
            defaultMessage='App Catalog'
          />
        </ModalHeader>
        <Wrapper>
          {connection.app !== 'DASHBOARD' ? (
            <Text size='16px' weight={300}>
              <FormattedHTMLMessage
                id='modals.lockbox.appmanager.connectdevice'
                defaultMessage='Plug in device, unlock and open the dashboard on your device'
              />
            </Text>
          ) : (
            appUpdateStatus || appListView
          )}
        </Wrapper>
      </Modal>
    )
  }
}

AppManagerContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  appChangeStatus: selectors.components.lockbox.getAppChangeStatus(state),
  appVersionInfos: selectors.components.lockbox.getLatestApplicationVersions(
    state
  ),
  connection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxAppManager'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(AppManagerContainer)
