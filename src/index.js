import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import './fonts/fonts.css'
import GlobalStyles from './GlobalStyles'
import styled, { ThemeProvider } from 'styled-components'
import Title from './components/Title'
import Intro from './components/Intro'
import Editor from './components/Editor'
import GameDispatch, { ACTIONS, gameReducer } from './contexts/GameDispatch'
import StepCompleteDispatch, { stepReducer } from './contexts/StepCompleteDispatch'
import GameState, { PHASES } from './contexts/GameState'
import { STEPS } from './constants/appSteps'

// TODO: Do something with the Ably key.
const ABLY_KEY = process.env.ABLY_ACCESS_KEY
if (!ABLY_KEY) {
  console.warn('Missing Ably key')
}

const ROOT_ELEMENT = document.getElementById('root')

const FIRST_STEP = STEPS.TITLE

const Container = styled.div`
  height: 100%;
  width: 100%;
`

const theme = {
  // these are default breakpoints
  // currently only using 'md' for switching between mobile and desktop
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
}

const App = () => {
  const [gameEvent, onGameEvent] = useReducer(gameReducer)
  const [prevStepData, stepFinished] = useReducer(stepReducer)
  const [step, setStep] = useState(FIRST_STEP)

  // game state provided to other components via GameState Context
  const [gamePhase, setGamePhase] = useState(PHASES.AIMING)
  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [secondsLeft/*, setSecondsLeft */] = useState(0)
  const [score, setScore] = useState(0)
  const resetGameState = useCallback(() => {
    setGamePhase(PHASES.AIMING)
    setScore(0)
  }, [])

  // Handle a new game event returned by the Phaser game.
  useEffect(() => {
    if (window.appConfig.dev.notifyPhaserEvents) {
      console.log('gameEvent', gameEvent)
    }

    if (!gameEvent) return
    switch (gameEvent.event) {
    case ACTIONS.ZOOM_CHANGE:
      setIsZoomedIn(gameEvent.data.level === 'in')
      return
    case ACTIONS.PHASE_CHANGE:
      setGamePhase(gameEvent.data.phase)
      return
    case ACTIONS.SCORE_CHANGE:
      setScore(gameEvent.data.score)
      return
    default:
      console.warn('Unexpected game event:', gameEvent.event)
    }
  }, [gameEvent])

  // React to completed steps; move on to the next step.
  const prevData = useRef(step)
  useEffect(() => {
    if (window.appConfig.dev.notifyStepChanges) {
      console.log('prevStepData', prevStepData)
      console.log('stored prevStep', prevData.current)
    }

    // Guard against useEffect triggering on non-step changes.
    if (prevData.current === prevStepData) return
    prevData.current = prevStepData

    const completed = prevStepData

    // State machine
    switch (completed) {
    case STEPS.TITLE:
      setStep(STEPS.INTRO)
      return
    case STEPS.INTRO:
      setStep(STEPS.EDITOR)
      return
    case STEPS.NONE:
      setStep(STEPS.TITLE)
      return
    default:
      setStep(FIRST_STEP)
    }

  }, [prevStepData])


  // prevent long press or right click from bringing up the context menu
  useEffect(() => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
  })

  return (
    <>
      <GlobalStyles />
      <StepCompleteDispatch.Provider value={stepFinished}>
        <GameDispatch.Provider value={onGameEvent}>
          <GameState.Provider value={{
            isZoomedIn,
            secondsLeft,
            score,
            gamePhase,
            resetGameState,
          }}>
            <ThemeProvider theme={theme}>
              <Container>
                {step === STEPS.TITLE &&
                <Title />
                }
                {step === STEPS.INTRO &&
                <Intro />
                }
                {step === STEPS.EDITOR &&
                <Editor />
                }
              </Container>
            </ThemeProvider>
          </GameState.Provider>
        </GameDispatch.Provider>
      </StepCompleteDispatch.Provider>
    </>
  )
}

ReactDOM.render(<App />, ROOT_ELEMENT)
