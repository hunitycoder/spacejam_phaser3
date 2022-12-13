import React from 'react'

export const ACTIONS = {
  POWERUP: 'gd:powerup',
  POSITION: 'gd:position',
  OBSTACLE: 'gd:obstacle',
  ZOOM_CHANGE: 'gd:zoom',
  SCORE_CHANGE: 'gd:score-change',
  PHASE_CHANGE: 'gd:phase-change',
}
Object.freeze(ACTIONS)

const GameDispatch = React.createContext(null)

export function gameReducer(state, action) {

  if (window.appConfig.dev.notifyStepChanges) {
    console.log('state', JSON.stringify(state))
    console.log('action', JSON.stringify(action))
  }

  switch (action.type) {
  case ACTIONS.POWERUP:
  case ACTIONS.POSITION:
  case ACTIONS.OBSTACLE:
  case ACTIONS.SCORE_CHANGE:
  case ACTIONS.ZOOM_CHANGE:
  case ACTIONS.PHASE_CHANGE:
    return { event: action.type, data: action.data }
  default:
    console.warn('Ignoring unrecongized game event:', action)
  }
}

export default GameDispatch

