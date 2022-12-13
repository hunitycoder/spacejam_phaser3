import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import Game from './Game/Game'
//import { Directus } from '@directus/sdk'
import EditMenu from './Game/EditMenu'
import { Button } from './Buttons/Button'
import GameState from '../contexts/GameState'
import bgDesktopImage from '../media/app-ui/main-bg-desktop.png'

const DEFAULT_GAME_PARAMS = {
  ball: {
    ballColor: 0,
    trailColor: 0,
    trailLength: 0.5,
  },
  hoop: {
    color: 0,
    size: 0.0,
  },
  obstacles: {
    tnt: {
      freq: 0.7,
      force: 0.5,
    },
    goop: {
      freq: 0.3,
      size: 0.5,
    },
    mace: {
      freq: 0.1,
      size: 0.5,
    },
  },
  powerUps: {
    speed: {
      dur: 0.5,
    },
    hoopMagnet: {
      dur: 1.0,
    },
    reverseGrav: {
      dur: 0.0,
    },
  },
  physics: {
    gravity: {
      magnitude: 0.5,
    },
    friction: {
      magnitude: 0.5,
    },
    bounciness: {
      magnitude: 0.5,
    },
  },
}

const Container = styled.div`
  height: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-flow: column-reverse;
  justify-content: flex-end;

  ${up('md')} {
    flex-direction: row;
    flex-flow: row;
    justify-content: flex-start;
  }
`
const MainMenu = styled.div`
  flex-grow: 1;
  align-items: center;
  width: 90%;
  height: inherit;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0 1rem;

  ${up('md')} {
    position: relative;
    height: 100%;
    width: 35.5%;
    margin-bottom: 0;
    flex-direction: column;
    justify-content: space-around;
    background-image: url(${bgDesktopImage});
    background-size: cover;
    background-position: center;

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
const GameAndEditor = styled.div`
  width: 100%;
  height: 100%;

  ${up('md')} {
    width: 64.5%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const MenuText = styled.div`
  display: none;
  width: 100%;
  justify: content: center;
  flex-direction: column;
  align-items: center;
  ${up('md')} {
    display: flex;
  }
`
const Title = styled.h1`
  font-family: Politica;
  font-weight: 900;
  font-size: 3.875rem;
  text-transform: uppercase;
  text-align: center;
  width: 90%;
  margin-top: 2rem;
  margin-bottom: 2rem;
`
const Description = styled.p`
  display: block;
  font-size: 1.5rem;
  line-height: 1.4;
  width: 72%;
  text-align: center;
`

const Editor = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [gameParams, setGameParams] = useState(DEFAULT_GAME_PARAMS)
  //const [gameName, setGameName] = useState('gamename')

  const { resetGameState } = useContext(GameState)

  useEffect(() => {
    setTimeout(() => {
      setShowMenu(false)
      resetGameState()
    }, 10)
  }, [resetGameState, gameParams])

  const onEdit = () => {
    // save level data
    setTimeout(() => {
      setShowMenu(true)
    }, 10)
  }

  /*const onPublish = async () => {
    const directus = new Directus('https://spacejam-gamedesigner-directus.attexp.com')
    // We've encountered lingering old access_keys in storage that interfere with subsequent
    // authentication attempts
    directus.storage.delete('auth_key')
    await directus.auth.static(process.env.CMS_ACCESS_KEY)
    await directus.items('levels').createOne({
      name: gameName,
      params: gameParams,
    })
  } */

  return (
    <Container>
      <MainMenu>
        <MenuText>
          <Title>Game Designer</Title>
          <Description>Step onto the court and give the game a go. Hit “EDIT” when you’re ready to put your own spin on things.</Description>
        </MenuText>
        <Button onPress={onEdit}>Edit</Button>
        {/* <Button isDisabled={true} onPress={onPublish}>Publish</Button> */}
      </MainMenu>
      <GameAndEditor>
        {showMenu && <EditMenu allParams={gameParams} setGameParams={setGameParams} />}
        {!showMenu && <Game gameParams={gameParams} />}
      </GameAndEditor>
    </Container>
  )
}

export default Editor
