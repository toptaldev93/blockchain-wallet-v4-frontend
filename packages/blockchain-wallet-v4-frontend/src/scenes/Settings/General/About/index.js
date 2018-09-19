import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const About = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.about.title'
            defaultMessage='About'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.about.description'
            defaultMessage='Learn more about our company.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button>Here</Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default About
