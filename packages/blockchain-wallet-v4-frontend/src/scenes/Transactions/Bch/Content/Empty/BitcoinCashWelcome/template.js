import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Icon, Image, Link, Separator, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: ${props => props.displayed ? 'flex' : 'none'};
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  background-color: ${props => props.theme['brand-quaternary']};
`
const BitcoinCashImage = styled(Image)`
  display: none;
  height: 230px;
  opacity: 0.3;
  @media(min-width: 1200px) { display: block; }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 20px 30px 0 30px;
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  @media(min-width: 1200px) {
    flex-direction: row;
  }
`
const Cell = styled.div`
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  @media(min-width: 768px) { ${props => props.small ? '30%' : '35%'}; }
`
const CloseArrow = styled(Icon)`
  height: 30px;
  width: 30px;
  margin-top: 20px;
`
const BitcoinCashWelcome = props => {
  const { displayed, handleClick } = props

  return (
    <Wrapper displayed={displayed}>
      <BitcoinCashImage name='half-bitcoincash' />
      <Container>
        <Row>
          <LinkContainer to='/exchange'>
            <Button nature='primary' bold fullwidth uppercase>
              <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.getstarted' defaultMessage='Get started with Bitcoin Cash' />
            </Button>
          </LinkContainer>
        </Row>
        <Row>
          <Cell small>
            <Text size='28px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.welcome' defaultMessage='Welcome to Bitcoin Cash!' />
            </Text>
            <Link href='https://support.blockchain.com/hc/en-us/categories/115001262946-Bitcoin-Cash' target='_blank' weight={300} uppercase>
              <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.learnmore' defaultMessage='Learn More' />
              <Icon name='right-arrow' color='brand-secondary' />
            </Link>
          </Cell>
          <Cell>
            <Text size='18px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.what' defaultMessage='What is Bitcoin Cash?' />
            </Text>
            <Separator />
            <TextGroup inline>
              <Text weight={300}>
                <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.currency' defaultMessage='Bitcoin Cash is a form of peer-to-peer electronic cash that was created after a fork of the Bitcoin block chain in August 2017.' />
              </Text>
              <Text weight={300}>
                <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.top' defaultMessage='Bitcoin Cash has since grown to be one of the top cryptocurrencies, along with bitcoin and ether.' />
              </Text>
            </TextGroup>
          </Cell>
          <Cell>
            <Text size='18px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.why' defaultMessage='How do I get Bitcoin Cash?' />
            </Text>
            <Separator />
            <TextGroup inline>
              <Text weight={300}>
                <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.fees' defaultMessage='If you had bitcoin in your Blockchain wallet before the fork in August, you already have Bitcoin Cash.' />
              </Text>
              <Text weight={300}>
                <FormattedMessage id='scenes.transaction.bitcoincash.content.empty.bitcoincashwelcome.fees' defaultMessage='If you’re new to Blockchain, you can get started with Bitcoin Cash by exchanging bitcoin or ether.' />
              </Text>
            </TextGroup>
          </Cell>
        </Row>
      </Container>
      <CloseArrow name='close' size='14px' cursor onClick={handleClick} />
    </Wrapper>
  )
}

BitcoinCashWelcome.propTypes = {
  displayed: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default BitcoinCashWelcome
