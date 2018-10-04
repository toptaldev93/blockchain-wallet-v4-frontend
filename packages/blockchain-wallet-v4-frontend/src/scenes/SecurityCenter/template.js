import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Icon, Button } from 'blockchain-info-components'

import SecuritySteps from './SecuritySteps'
import SecurityTabs from './SecurityTabs'
import EmailAddress from './EmailAddress'
import TwoStepVerification from './TwoStepVerification'
import WalletRecoveryPhrase from './WalletRecoveryPhrase'
import { spacing } from 'services/StyleService'

import Advanced from './Advanced'

const Wrapper = styled.div`
  padding: 30px;
  box-sizing: border-box;
`
const TopContainer = styled.div`
  justify-content: space-between;
  align-items: center;
  @media (min-width: 992px) {
    display: flex;
    flex-direction: row;
  }
`
const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;

  @media (min-width: 992px) {
    width: ${props => (props.progress === 3 ? '100%' : '40%')};
  }
`
const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  & > * {
    margin-top: 20px;
  }
`
const IntroText = styled(Text)`
  padding: 20px 0px;
`
const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`
const PageContainer = styled.div`
  width: 100%;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    width: 50%;
    margin-bottom: 10px;
  }
  @media (min-width: 992px) {
    flex-direction: row;
    button {
      width: 25%;
    }
  }
`

const SecurityCenter = props => {
  const { enabling, setView } = props
  const showTabs = props.progress === 3

  const renderSteps = () => {
    if (enabling === 'email') {
      return (
        <BodyContainer>
          <EmailAddress alone={1} goBackOnSuccess={props.onClose} />
        </BodyContainer>
      )
    }
    if (enabling === '2fa') {
      return (
        <BodyContainer>
          <TwoStepVerification alone={1} goBackOnSuccess={props.onClose} />
        </BodyContainer>
      )
    }
    if (enabling === 'recovery') {
      return (
        <BodyContainer>
          <WalletRecoveryPhrase alone={1} goBackOnSuccess={props.onClose} />
        </BodyContainer>
      )
    }
    return (
      <BodyContainer>
        <EmailAddress
          handleEnable={() => props.handleEnable('email')}
          goBackOnSuccess={props.onClose}
        />
        <TwoStepVerification
          handleEnable={() => props.handleEnable('2fa')}
          goBackOnSuccess={props.onClose}
        />
        <WalletRecoveryPhrase
          handleEnable={() => props.handleEnable('recovery')}
          goBackOnSuccess={props.onClose}
        />
        {!showTabs && (
          <ButtonContainer>
            <Button nature='empty' onClick={() => props.setView('advanced')}>
              <FormattedMessage
                id='scenes.securitycenter.introadvancedbutton'
                defaultMessage='Advanced Settings'
              />
            </Button>
            <Text size='14px' weight={300} style={spacing('pl-15')}>
              <FormattedMessage
                id='scenes.securitycenter.introadvancedexplainer'
                defaultMessage='We recommend you complete these 3 steps before moving into the advanced security settings.'
              />
            </Text>
          </ButtonContainer>
        )}
      </BodyContainer>
    )
  }

  return (
    <PageContainer>
      {showTabs && <SecurityTabs data={props.data} setView={setView} />}
      {props.viewing === 'security' ? (
        <Wrapper>
          {enabling && (
            <IconContainer>
              <Icon
                name='close'
                size='20px'
                weight={300}
                color='gray-5'
                cursor
                onClick={props.onClose}
              />
            </IconContainer>
          )}
          <TopContainer>
            <IntroContainer progress={props.progress}>
              <IntroText size='14px' weight={300}>
                <FormattedMessage
                  id='scenes.securitycenter.introtextnone'
                  defaultMessage='Complete the steps below to help prevent unauthorized access to your wallet. Add additional verification to access your funds at any time.'
                />
              </IntroText>
            </IntroContainer>
            {props.progress < 3 && <SecuritySteps data={props.data} />}
          </TopContainer>
          {renderSteps()}
        </Wrapper>
      ) : (
        <Wrapper>
          <BodyContainer>
            <Advanced showTabs={showTabs} setView={setView} />
          </BodyContainer>
        </Wrapper>
      )}
    </PageContainer>
  )
}

export default SecurityCenter
