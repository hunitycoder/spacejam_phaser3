import React, { useContext } from 'react'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import StepDispatch from '../contexts/StepCompleteDispatch'
import { Button } from './Buttons/Button'
import FancyText from './FancyText'
import logoImage from '../media/app-ui/space-jam-logo.png'
import bgDesktopImage from '../media/app-ui/main-bg-desktop.png'
import bgMobileImage from '../media/app-ui/main-bg-mobile.png'
import { STEPS } from '../constants/appSteps'

const Container = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-image: url(${bgMobileImage});
  background-size: cover;
  background-position: center;
  ${up('md')} {
    background-image: url(${bgDesktopImage});
  }
`
const TitleContainer = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  ${up('md')} {
    padding 0 2rem;
  }
`
const Subtitle = styled.header`
  font-family: ATTAleckCd;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.625rem;
  color: #1A9EDB;
  margin-top: 1rem;
  ${up('md')} {
    font-size: 2.25rem;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 3rem 0;
  ${up('md')} {
    margin: 4rem 0;
  }
`
const MainLogo = styled.div`
  display: flex;
  justify-content: center;
  margin: 3rem 0;
  ${up('md')} {
    margin: 4rem 0;
  }
`
const MainLogoImage = styled.img`
  height: 150px;
  ${up('md')} {
    height: 200px;
  }  
`

const Title = () => {
  const stepCompleted = useContext(StepDispatch)

  const onTapStart = () => {
    stepCompleted(STEPS.TITLE)
  }

  return (
    <Container>
      <MainLogo>
        <MainLogoImage src={logoImage} alt={''}/>
      </MainLogo>
      <TitleContainer><FancyText text={'Looney Shots Game Designer'} fontSize={3.25} /></TitleContainer>
      <Subtitle>Create your custom game</Subtitle>
      <ButtonContainer>
        <Button onPress={onTapStart}>Make My Game</Button>
      </ButtonContainer>
    </Container>
  )
}

export default Title
