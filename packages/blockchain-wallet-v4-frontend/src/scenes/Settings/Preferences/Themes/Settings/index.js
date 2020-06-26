import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { equals, isNil } from 'ramda'
import { formValueSelector } from 'redux-form'
import React from 'react'
import Settings from './template'

class SettingsContainer extends React.PureComponent {
  componentDidMount() {
    this.props.formActions.initialize('settingTheme', {
      theme: this.props.theme
    })
  }

  componentDidUpdate(prevProps) {
    const { theme, newTheme } = this.props
    if (
      !isNil(newTheme) &&
      !equals(theme, newTheme) &&
      !equals(prevProps.newTheme, newTheme)
    ) {
      this.props.preferencesActions.setTheme(newTheme)
    }
  }

  render() {
    return <Settings />
  }
}

const mapStateToProps = state => ({
  theme: selectors.preferences.getTheme(state),
  newTheme: formValueSelector('settingTheme')(state, 'theme')
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
