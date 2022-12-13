import React from 'react'

export const PHASES = {
  AIMING: 'phase:aiming',
  PLAYING: 'phase:playing',
  ENDING: 'phase:ending',
}
Object.freeze(PHASES)

const GameState = React.createContext(null)

export default GameState

