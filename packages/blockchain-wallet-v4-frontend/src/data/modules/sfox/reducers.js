import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = []

const sfoxSignup = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.NEXT_STEP: {
      return assoc('signupStep', payload, state)
    }
    case AT.SIGNUP_FAILURE: {
      return assoc('signupError', payload, state)
    }
    case AT.CLEAR_SIGNUP_ERROR: {
      return assoc('signupError', null, state)
    }
    default:
      return state
  }
}

export default sfoxSignup
