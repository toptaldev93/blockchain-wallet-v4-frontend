import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { getData } from './selectors'
import { model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

const Row = styled(Text)`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`
const Footer = styled(ModalFooter)`
  > div {
    justify-content: flex-end;
  }
`
const Header = styled(ModalHeader)`
  font-size: 18px;
`

const { USER_EXISTS_MODAL } = model.components.identityVerification

export const UserExists = ({ position, total, email, closeAll }) => {
  return (
    <Modal size='medium' position={position} total={total}>
      <Header onClose={closeAll}>
        <FormattedMessage
          id='modals.userexists.title'
          defaultMessage='Oops! Looks like we have this email already'
        />
      </Header>
      <ModalBody>
        <Row size='14px' weight={400}>
          <FormattedHTMLMessage
            id='modals.userexists.emailused'
            defaultMessage='You may have started the verification process in a different Blockchain Wallet.'
            values={{ email }}
          />
        </Row>
        <Row size='14px' weight={400}>
          <FormattedHTMLMessage
            id='modals.userexists.kycnotcomplete'
            defaultMessage='In order to complete verification, please consider using another email address.'
          />
        </Row>
        <Row size='14px' weight={400}>
          <FormattedMessage
            id='modals.userexists.kyccomplete'
            defaultMessage='If you have already verified your profile on another Blockchain Wallet, we are unable to verify you again on another wallet.'
          />
        </Row>
      </ModalBody>
      <Footer>
        <LinkContainer to='/security-center'>
          <Button nature='primary'>
            <FormattedMessage
              id='modals.userexists.changeemail'
              defaultMessage='Change Email'
            />
          </Button>
        </LinkContainer>
      </Footer>
    </Modal>
  )
}

UserExists.propTypes = {
  email: PropTypes.string.isRequired
}

const enhance = compose(
  modalEnhancer(USER_EXISTS_MODAL),
  connect(getData)
)

export default enhance(UserExists)
