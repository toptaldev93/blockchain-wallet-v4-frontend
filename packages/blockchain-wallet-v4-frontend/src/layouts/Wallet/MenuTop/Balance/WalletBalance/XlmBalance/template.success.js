import React from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'
import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  const { balance, large } = props

  return (
    <LinkContainer to='/xlm/transactions'>
      <div data-e2e='balanceDropdown-wallet-xlm'>
        <CoinBalanceWrapper coin='XLM' balance={balance} large={large} />
      </div>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
