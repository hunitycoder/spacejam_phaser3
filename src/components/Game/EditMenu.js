import React, { useEffect, useState } from 'react'
import EditPanel from './EditPanel'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import { useWindowWidth } from '@react-hook/window-size'
import FancyText from '../FancyText'
import { Button } from '../Buttons/Button'
import bgDesktopImage from '../../media/app-ui/main-bg-desktop.png'
import bgMobileImage from '../../media/app-ui/main-bg-mobile.png'
import ballIcon from '../../media/app-ui/ball-traditional-lg.png'
import basketIcon from '../../media/app-ui/basket-default.png'
import obstacleIcon from '../../media/app-ui/obstacle-tnt-lg.png'
//import powerupIcon from '../../media/app-ui/power-up-speed-lg.png'
import physicsIcon from '../../media/app-ui/icon-physics.png'

const Container = styled.div`
  background-image: url(${bgMobileImage});
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 10;
  align-items: center;
  display: flex;
  flex-direction: column;

  ${up('md')} {
    background-image: url(${bgDesktopImage});
    left: 0;
    width: 35.5%;
    justify-content: center;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-color: white;
      border-style: solid;
      border-width: 0 0.3rem;
      mix-blend-mode: overlay;
      pointer-events: none;
    }
  }
`
const Title = styled.div`
  margin: 0.6rem;
  ${up('md')} {
    display: none;
  }
`
const Options = styled.div`
  width: 90%;
  ${up('md')} {
    width: 60%;
    margin-top: 15%;
  }
`
const OptionDiv = styled.div`
  width: 100%;
  background-color: ${({isSelected}) => isSelected ? 'rgb(35 201 255 / 44%)' : '#0F3D58'};
  border-width: 0.125rem;
  border-style: solid;
  border-color: ${({isSelected}) => isSelected ? 'white' : '#1A9FDB'};
  box-sizing: border-box;
  border-radius: 1.125rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  span {
    flex-grow: 1;
    text-align: center;
    font-size: 1.25rem;
    font-family: ATTAleckCd;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em
    margin-right: 0.5rem;
    ${up('md')} {
      font-size: 1.5rem;
    }
  }
`
const Icon = styled.img`
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  margin-left: 0.5rem;
  ${up('md')} {
    width: 5rem;
    height: 5rem;
    }
`
const BottomButtonRow = styled.div`
  flex-grow: 1;
  align-items: center;
  width: 90%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  ${up('md')} {
    align-items: center;
    flex-grow: 0;
    height: 30%;
  }
`

const EditMenu = ({ allParams, setGameParams }) => {
  const [selected, setSelected] = useState(null)
  const [pendingParams, setPendingParams] = useState(Object.assign({}, allParams))

  // desktop layout requires a selection
  const windowWidth = useWindowWidth({leading: true})
  useEffect(() => {
    // Note: this width should match the 'md' css breakpoint (see theme in index.js)
    if (windowWidth > 768) {
      setSelected('ball')
    }
  }, [windowWidth])

  const onPlay = () => {
    setGameParams(pendingParams)
  }

  const onClosePanel = () => {
    setSelected(false)
  }

  const Option = ({param, text, iconImage}) => {
    return (
      <OptionDiv
        isSelected={param === selected}
        onClick={() => setSelected(param)}
      >
        <Icon src={iconImage}/>
        <span>{text}</span>
      </OptionDiv>
    )
  }

  return (
    <>
      {selected && <EditPanel
        name={selected}
        params={pendingParams}
        updateParams={setPendingParams}
        onClosePanel={onClosePanel}
      />}
      <Container>
        <Title>
          <FancyText text={'Editor'} />
        </Title>
        <Options>
          <Option param={'ball'} text={'Ball'} iconImage={ballIcon} />
          <Option param={'hoop'} text={'Hoop'} iconImage={basketIcon} />
          <Option param={'obstacles'} text={'Obstacles'} iconImage={obstacleIcon} />
          {/* <Option param={'powerUps'} text={'Power-ups'} iconImage={powerupIcon} /> */}
          <Option param={'physics'} text={'Physics'} iconImage={physicsIcon} />
        </Options>
        <BottomButtonRow>
          <Button onPress={onPlay}>Play Test</Button>
        </BottomButtonRow>
      </Container>
    </>
  )
}

export default EditMenu
