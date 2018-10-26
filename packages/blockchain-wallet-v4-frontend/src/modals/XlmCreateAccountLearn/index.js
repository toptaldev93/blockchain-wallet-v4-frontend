import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import modalEnhancer from 'providers/ModalEnhancer'
import { model } from 'data'

import {
  Modal,
  ModalHeader,
  ModalBody,
  Text,
  Icon,
  Link
} from 'blockchain-info-components'

const Header = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const Title = styled(Text)`
  font-size: 22px;
  font-weight: 300;
  margin-bottom: 16px;
`
const Paragraph = styled(Text)`
  font-size: 14px;
  font-weight: 200;
`
const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 200;
`
const BackIcon = styled(Icon)`
  font-size: 20px;
  font-weight: 800;
  margin-right: 16px;
`

class XlmCreateAccountLearn extends React.PureComponent {
  render () {
    const { position, total, close, reserveXlm } = this.props
    return (
      <Modal size='medium' position={position} total={total} closeAll={close}>
        <ModalHeader onClose={close}>
          <Header onClick={close}>
            <BackIcon name='left-arrow' />
            <FormattedMessage
              id='modal.createaccountlearn.back'
              defaultMessage='Back.'
            />
          </Header>
        </ModalHeader>
        <ModalBody>
          <Title>
            <FormattedMessage
              id='modal.createaccountlearn.title'
              defaultMessage='Stellar mimimum balance requirement.'
            />
          </Title>
          <Paragraph>
            <FormattedMessage
              id='modal.createaccountlearn.info1'
              defaultMessage='To submit transactions, an address must hold a minimum amount of XLM in the shared global ledger. You cannot send this XLM to other addresses. To fund a new address, you must send enough XLM to meet the reserve requirement.'
            />
          </Paragraph>
          <br />
          <Paragraph>
            <FormattedMessage
              id='modal.createaccountlearn.info2'
              defaultMessage='The current minimum reserve requirement is {reserveXlm} XLM; this is the cost of an address that owns no other objects in the ledger.'
              values={{ reserveXlm }}
            />
          </Paragraph>
          <br />
          <Paragraph>
            <FormattedMessage
              id='modal.createaccountlearn.info3'
              defaultMessage='You can read more information on the'
            />
            {': '}
            <StyledLink href='' target='_blank'>
              <FormattedMessage
                id='modal.createaccountlearn.link'
                defaultMessage='Stellar (XLM) reserve requirements in the official documentation.'
              />
            </StyledLink>
          </Paragraph>
        </ModalBody>
      </Modal>
    )
  }
}

XlmCreateAccountLearn.propTypes = {
  reserveXlm: PropTypes.string.isRequired
}

export default modalEnhancer(
  model.components.sendXlm.CREATE_ACCOUNT_LEARN_MODAL
)(XlmCreateAccountLearn)
