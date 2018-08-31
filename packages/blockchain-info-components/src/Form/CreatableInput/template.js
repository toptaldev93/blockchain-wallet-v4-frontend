import React from 'react'
import styled from 'styled-components'
import { components } from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'

const StyledCreatableSelect = styled(CreatableSelect)`
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => (props.fontSize === 'small' ? '12px' : '14px')};
`

const MultiValueContainer = props => {
  return (
    <components.MultiValueContainer {...props}>
      {props.selectProps.multiValueContainer
        ? props.selectProps.multiValueContainer(props)
        : props.children}
    </components.MultiValueContainer>
  )
}

const CreatableInput = props => {
  const {
    value,
    inputValue,
    placeholder,
    handleChange,
    handleKeyDown,
    handleInputChange,
    multiValueContainer
  } = props

  return (
    <StyledCreatableSelect
      isClearable
      isMulti
      menuIsOpen={false}
      classNamePrefix='bc'
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onInputChange={handleInputChange}
      placeholder={placeholder}
      inputValue={inputValue}
      components={{
        DropdownIndicator: null,
        MultiValueContainer
      }}
      value={value}
      // Components
      multiValueContainer={multiValueContainer}
    />
  )
}

export default CreatableInput
