import React, { useContext, useEffect, useState } from 'react'
import StepDispatch from '../contexts/StepCompleteDispatch'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import bgImage from '../media/app-ui/marvin-bg-desktop.png'
import marvinImage from '../media/app-ui/marvin.png'
import { STEPS } from '../constants/appSteps'

const Container = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
`

const Text = styled.div`
  width: 80%;
  background: #0F3D58;
  text-align: center;
  border: 0.125rem solid #1A9FDB;
  box-sizing: border-box;
  border-radius: 0.7em;
  font-size: 1.125rem;
  text-transform: uppercase;
  font-weight: bold;
  padding: 1em;
  margin-bottom: 67.5vh;

  ${up('md')}{
    width: 60%;
    font-size: 2.4rem;
  }
`

const MarvinImage = styled.img`
  position: absolute;
  height: 62.13%;
  bottom: 8%;
  z-index: 5;
`

const INSTRUCTIONS = [
  { text: 'Oh, Hello Earthling. Welcome to the Looney Shots Game Designer.', time: 3500},
  { text: 'Here you can modify my incredible simulation by adjusting graphics, physics and more to create your own game.', time: 6000},
  { text: 'Familiarize yourself with my version first and tap “edit” when you’re ready to design your own.', time: 5000},
]

const Intro = () => {
  const stepCompleted = useContext(StepDispatch)
  const [introStep, setStep] = useState(0)
  const [introText, setIntroText] = useState('')

  useEffect(() => {
    const step = INSTRUCTIONS[introStep]
    if (!step) {
      stepCompleted(STEPS.INTRO)
      return
    }
    setIntroText(step.text)
    const timeout = setTimeout(() => {
      setStep((value) => ++value)
    }, step.time)
    return () => {clearTimeout(timeout)}
  }, [introStep, stepCompleted])

  const onTapScreen = () => {
    setStep((value) => ++value)
  }

  return (
    <Container onClick={onTapScreen}>
      <Text dangerouslySetInnerHTML={{ __html: introText }} />
      <MarvinImage src={marvinImage} alt={'Marvin the Martian'}/>
    </Container>
  )
}

export default Intro
