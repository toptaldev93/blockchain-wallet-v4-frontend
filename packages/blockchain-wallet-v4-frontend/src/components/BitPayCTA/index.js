import { FormattedMessage } from 'react-intl'
import { Icon, Link, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: ${props => props.theme['blue000']};
  border-radius: 4px;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const TextGroup = styled(Text)`
  display: flex;
  align-items: flex-end;
`
const CustomLink = styled(Link)`
  display: flex;
  align-items: center;
`
const BitPayIcon = styled(Icon)`
  margin: 0 3px;
`
const ArrowIcon = styled(Icon)`
  transform: rotate(-90deg);
  margin-left: 16px;
`

const BitPayCTA = ({ coin }) => {
  return (
    <Wrapper>
      <TextGroup size='12px' weight={500} color='grey600'>
        <FormattedMessage
          id='bitpaycta.nowsupporting'
          defaultMessage='Your {coin} wallet now supports'
          values={{ coin }}
        />{' '}
        <BitPayIcon size='12px' name='bitpay' color='#2A3F90' /> <>urls.</>
      </TextGroup>
      <CustomLink size='12px' weight={500}>
        <FormattedMessage
          id='bitpaycta.learnmore'
          defaultMessage='Learn more'
        />
        <ArrowIcon
          size='8px'
          weight={800}
          color='blue'
          name='down-arrow-filled'
        />
      </CustomLink>
    </Wrapper>
  )
}

export default BitPayCTA
