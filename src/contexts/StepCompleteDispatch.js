import React from 'react'
import { STEPS } from '../constants/appSteps'

const StepCompleteDispatch = React.createContext(undefined)

/**
 * Dispatch a "step completed" action.
 *
 * @param state
 * @param {string} step
 *  The name of the step that has been completed.
 * @returns {string}
 */
export function stepReducer(state, step) {
  // Validate that this is a recognized input...
  const found = Object.values(STEPS).find(val => {
    return val === step
  })
  return found
}

export default StepCompleteDispatch
