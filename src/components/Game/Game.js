import React, { useContext, useEffect, useRef } from 'react'
import Phaser from 'phaser'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import Boot from './scenes/Boot'
import Main from './scenes/Main'
import MapEdit from './scenes/MapEdit'
import { CONTROL_EVENTS as EVENTS } from './events'
import GameDispatch from '../../contexts/GameDispatch'
import { FireButton, AimButton } from '../Buttons/ControlButtons'
import ZoomButton from '../Buttons/ZoomButton'
import FancyText from '../FancyText'
import GameState, { PHASES } from '../../contexts/GameState'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
import { PHYSICS } from '../../constants/params'
const matterDebug = window.appConfig.dev.debugPhysics ? {
  showBody: true,
  showStaticBody: true,
  showVelocity: true,
  showBounds: true,
  lineColor: 0xFF00FF,
  staticLineColor: 0x9900FF,
  sensorLineColor: 0xFF0099,
  lineThickness: 5,
} : false
const config = {
  type: Phaser.AUTO,
  scene: [Boot, Main, MapEdit],
  width: window.appConfig.game.world.width,
  height: window.appConfig.game.world.height,
  scale: {
    width: window.appConfig.game.canvas.width,
    height: window.appConfig.game.canvas.height,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 4,
        // scale: 1,
      },
      debug: matterDebug,
      plugins: {
        attractors: true,
      },
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision',
      },
    ],
  },
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  ${up('md')} {
    width: 45vw;
  }
`

const GameWrap = styled.div`
  border: 0.1875rem solid #1A9FDB;
  padding: 1rem;
  background-color: #043E5B;
  line-height: 0;

  canvas {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 0.125rem solid #1A9FDB;
  }
`
const AboveGameArea = styled.div`
  display: flex;
  justify-content: center;
  height: 3.125rem;
  position: relative;
  width: 100%;
`
/*const TimeDisplay = styled.div`
  font-family: Politica;
  font-weight: 900;
  font-size: 2.5rem;
  text-transform: uppercase;
` */
const BelowGameArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    margin: 0.8rem 0.5rem;
  }
`
const GameContainer = styled.div`
  position: relative;
`
const GameOverlay = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1.3125rem;
  width: calc(100% - 2 * 1.3125rem);
  height: calc(100% - 2 * 1.3125rem);
  background-color: rgb(0 0 0 / 75%);
`

const ENDING_PHASE_DURATION_MS = 1500

const Game = ({ gameParams }) => {
  const gameDiv = useRef(null)
  const game = useRef(null)
  const dispatch = useContext(GameDispatch)

  const { isZoomedIn, score/*, secondsLeft*/, resetGameState, gamePhase } = useContext(GameState)

  useEffect(() => {
    config.parent = gameDiv.current
    const gravParam = gameParams.physics.gravity.magnitude
    config.physics.matter.gravity.y = Phaser.Math.Linear(PHYSICS.gravity.params.magnitude.min, PHYSICS.gravity.params.magnitude.max, gravParam)
    game.current = new Phaser.Game(config)
    game.current.reactDispatch = dispatch
    game.current.gameParams = gameParams
    return () => {
      game.current.destroy(true)
    }
  }, [dispatch, gameParams])

  const onControlDown = (control) => {
    if (!game.current) return
    game.current.events.emit(EVENTS.DOWN, control)
  }

  const onControlUp = (control) => {
    if (!game.current) return
    game.current.events.emit(EVENTS.UP, control)
  }

  // once in 'ending' phase, reset the game after a short period
  useEffect(() => {
    let timer
    if (gamePhase === PHASES.ENDING) {
      timer = setTimeout(() => {
        resetGameState()
        game.current.events.emit(EVENTS.RESTART)
      }, ENDING_PHASE_DURATION_MS)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [resetGameState, gamePhase])

  return (
    <Container>
      <AboveGameArea>
        {/* <TimeDisplay>{secondsLeft}</TimeDisplay> */}
        {gamePhase === PHASES.PLAYING &&
          <FancyText text={score.toString()} />
        }
        {gamePhase === PHASES.AIMING &&
          <ZoomButton isZoomedIn={isZoomedIn} onPressStart={onControlDown.bind(this, 'zoom')} onPress={onControlUp.bind(this, 'zoom')} />
        }
      </AboveGameArea>

      <GameContainer>
        <GameWrap ref={gameDiv} />
        {gamePhase === PHASES.ENDING &&
          <GameOverlay><FancyText text={score.toString()} fontSize={3.25} /></GameOverlay>
        }
      </GameContainer>

      <BelowGameArea>
        <AimButton
          isDisabled={gamePhase !== PHASES.AIMING}
          onPressStart={onControlDown.bind(this, 'left')}
          onPressEnd={onControlUp.bind(this, 'left')}
        />
        <FireButton
          isDisabled={gamePhase !== PHASES.AIMING}
          onPressStart={onControlDown.bind(this, 'fire')}
          onPressEnd={onControlUp.bind(this, 'fire')}
        />
        <AimButton
          isRight={true}
          isDisabled={gamePhase !== PHASES.AIMING}
          onPressStart={onControlDown.bind(this, 'right')}
          onPressEnd={onControlUp.bind(this, 'right')}
        />
      </BelowGameArea>
    </Container>
  )
}

export default Game
