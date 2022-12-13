import Phaser from 'phaser'
import { CONTROL_EVENTS } from '../events'
import { ACTIONS } from '../../../contexts/GameDispatch'
import { PHASES } from '../../../contexts/GameState'
import LEVELS from '../../../constants/levels'
import { calculateObstacleCounts, lerp } from '../utils'
import GameBg from '../../../media/game-bg.png'
import PackJson from '../../../media/spritesheet.json'
import PackData from '../../../media/spritesheet.png'

import PowerBallJson from '../../../media/flares.json'
import PowerBallData from '../../../media/flares.png'

import TntExplosionAnimationData from '../../../media/animations/tnt-explosion.png'
import BasketMadeAnimationData from '../../../media/animations/basket-made.png'
import BallPopAnimationData from '../../../media/animations/ball-pop.png'
import PickupAnimationData from '../../../media/animations/pickup.png'
import GoopSplatAnimationData from '../../../media/animations/goop-splat.png'

import Hoop from './Elements/Hoop'

import BallTrailer from './Elements/BallTrailer'

import PowerupJAM from './Elements/PowerUps/PowerupJAM'
import PowerupSpeed from './Elements/PowerUps/PowerupSpeed'
import PowerupMagnet from './Elements/PowerUps/PowerupMagnet'
import PowerupGravity from './Elements/PowerUps/PowerupGravity'

import ObsGoop from './Elements/Obstacles/ObsGoop'
import ObsTnt from './Elements/Obstacles/ObsTnt'
import ObsMace from './Elements/Obstacles/ObsMace'

import PlatformTriangleLarge from './Elements/Platforms/PlatformTriangleLarge'
import PlatformTriangle from './Elements/Platforms/PlatformTriangle'
import PlatformSquare from './Elements/Platforms/PlatformSquare'
import { OBSTACLES, PHYSICS } from '../../../constants/params'

import SfxLauncherShoot from '../../../media/sfx/launcher-shoot.mp3'
import SfxLauncherAim from '../../../media/sfx/launcher-aim.mp3'
import SfxLauncherPower from '../../../media/sfx/launcher-power.mp3'

import SfxObsGoop from '../../../media/sfx/obstacle-goop.mp3'
import SfxObsTnt from '../../../media/sfx/obstacle-tnt.mp3'
import SfxObsMace from '../../../media/sfx/obstacle-Mace.mp3'

import SfxCountdownBuzzer from '../../../media/sfx/countdown-buzzer.mp3'
import SfxBasketMadeSwish from '../../../media/sfx/basket-made-swish.mp3'
import SfxBasketMadeApplause from '../../../media/sfx/basket-made-applause.mp3'
import SfxBasketAlmostIn from '../../../media/sfx/basket-almost-in.mp3'
import SfxBallBounce from '../../../media/sfx/ball-bounce.mp3'
import SfxPuGravityFlipOn from '../../../media/sfx/power-up-gravity-flip-on.mp3'
import SfxPuGravityFlipStart from '../../../media/sfx/power-up-gravity-flip-start.mp3'
import SfxPuJAM from '../../../media/sfx/power-up-j-a-m.mp3'
import SfxPuMagnetOn from '../../../media/sfx/power-up-magnet-on.mp3'
import SfxPuMagnetStart from '../../../media/sfx/power-up-magnet-start.mp3'
import SfxPuSpeedOn from '../../../media/sfx/power-up-speed-on.mp3'
import SfxPuSpeedStart from '../../../media/sfx/power-up-speed-start.mp3'

import ScoreEffect from './Elements/Score/ScoreEffect'
import Wall from './Elements/Platforms/Wall'
import Floor from './Elements/Platforms/Floor'

const BALL_TEXTURES = [
  'ball-traditional.png',
  'ball-oilspill.png',
  'ball-gold.png',
  'ball-platinum.png',
]

export const WORLD_WIDTH = window.appConfig.game.world.width
export const WORLD_HEIGHT = window.appConfig.game.world.height
export const CAMERA_ZOOM_NORMAL = window.appConfig.game.canvas.width / WORLD_HEIGHT
export const CAMERA_ZOOM_IN = 0.8
const DEV_KEYS = window.appConfig.dev.specialKeys
const CHARGE_RATE_MS = 400
const SHOT_POWER_BASE = 0.6
const SPEED_ZERO = 1.4
const REST_THRESHOLD = 20 // how many consecutive frames the ball speed is below SPEED_ZERO
const ROTATE_SPEED = Math.PI / 300
const ROTATE = {
  NONE: 'n',
  LEFT: 'l',
  RIGHT: 'r',
}
const ROTATE_RANGE = {
  MIN: -1.05,
  MAX: 1.05,
}

export default class Main extends Phaser.Scene {
  constructor(config) {
    config = Object.assign({}, { key: 'main' }, config)
    super(config)
  }

  init() {
    this.powerups = []
    this.obstacles = []
    this.platforms = []
    this.level = 1
    this.score = 0
    this.controlState = {
      rotating: ROTATE.NONE,
      charging: false,
    }
    this.shotPower = {
      level: 0,
      max: 4,
      lastUpdate: 0,
    }
    this.angle = 0
    this.ballRestCount = 0
    this.chargeOrAimingStart = false
    this.targetZoom = CAMERA_ZOOM_NORMAL
    this.gamePhase = PHASES.AIMING
    this.scoreTimer = null
    this.audioEnabled = true
  }

  preload() {
    this.load.atlas('pack1', PackData, PackJson)
    this.load.atlas('powerball', PowerBallData, PowerBallJson)
    this.load.image('gamebg', GameBg)
    this.load.spritesheet('tnt-explosion', TntExplosionAnimationData, { frameWidth: 600, frameHeight: 600, endFrame: 5 })
    this.load.spritesheet('basket-made', BasketMadeAnimationData, { frameWidth: 600, frameHeight: 600, endFrame: 11 })
    this.load.spritesheet('ball-pop', BallPopAnimationData, { frameWidth: 600, frameHeight: 600, endFrame: 6 })
    this.load.spritesheet('pickup', PickupAnimationData, { frameWidth: 600, frameHeight: 600, endFrame: 11 })
    this.load.spritesheet('goop-splat', GoopSplatAnimationData, { frameWidth: 600, frameHeight: 600, endFrame: 9 })

    this.load.audio('launchershoot', SfxLauncherShoot)
    this.load.audio('launcheraim', SfxLauncherAim)
    this.load.audio('launcherpower', SfxLauncherPower)

    this.load.audio('obsgoop', SfxObsGoop)
    this.load.audio('obsmace', SfxObsMace)
    this.load.audio('obstnt', SfxObsTnt)

    this.load.audio('countdownbuzzer', SfxCountdownBuzzer)
    this.load.audio('basketmadeswish', SfxBasketMadeSwish)
    this.load.audio('basketmadeapplause', SfxBasketMadeApplause)
    this.load.audio('basketalmostin', SfxBasketAlmostIn)
    this.load.audio('ballbounce', SfxBallBounce)

    this.load.audio('powerupjam', SfxPuJAM)

    this.load.audio('powerupgravityon', SfxPuGravityFlipOn)
    this.load.audio('powerupgravitystart', SfxPuGravityFlipStart)
    this.load.audio('powerupspeedon', SfxPuSpeedOn)
    this.load.audio('powerupspeedstart', SfxPuSpeedStart)
    this.load.audio('powerupmagneton', SfxPuMagnetOn)
    this.load.audio('powerupmagnetstart', SfxPuMagnetStart)
  }

  create() {
    const middle = {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
    }

    this.matter.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 400)

    this.bg = this.add.sprite(middle.x, middle.y, 'gamebg')

    this.cannonBody = this.add.sprite(middle.x, WORLD_HEIGHT, 'pack1', 'launcher-base.png').setDepth(1)
    this.cannonBody.setOrigin(0.5, 0.3)
    this.cannonHead = this.add.sprite(middle.x, WORLD_HEIGHT + 70, 'pack1', 'launcher-tip-0.png').setDepth(2)
    this.cannonHead.setOrigin(0.5, 1.35)
    this.cannonHead.setTexture('pack1', 'launcher-tip-4.png')

    this.cameraTarget = this.add.sprite(middle.x, WORLD_HEIGHT - 200, 'pack1', 'platform-square.png').setVisible(false)
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setZoom(CAMERA_ZOOM_NORMAL)
    this.cameras.main.startFollow(this.cameraTarget, false, 0.5, 0.5)

    const hoopWidth = Phaser.Math.Linear(0.39, 1.0, this.game.gameParams.hoop.size)
    this.hoop = new Hoop(this, middle.x, middle.y, hoopWidth, this.game.gameParams.hoop.color)

    this.platforms.push(new PlatformTriangleLarge(this, 200, 200, 0))
    this.platforms.push(new PlatformTriangleLarge(this, WORLD_WIDTH - 200, 200, 1))

    this.wallleft = new Wall(this, -92, middle.y, 1, 15)
    this.wallright = new Wall(this, WORLD_WIDTH + 92, middle.y, 1, 15)
    this.walltop = new Wall(this, middle.x, -95, 15, 1)

    this.floor = new Floor(this, middle.x, WORLD_HEIGHT + 95, 15, 1)

    // temporary hard-coded obstacles for testing
    // this.obstacles.push(new ObsTnt(this, 1500, 2300))
    // this.obstacles.push(new ObsGoop(this, 1300, 2300))
    // this.obstacles.push(new ObsMace(this, 1700, 2300))
    // this.powerups.push(new PowerupJAM(this, 1100, 2000, 'points-J.png'))
    // this.powerups.push(new PowerupJAM(this, 1300, 2000, 'points-A.png'))
    // this.powerups.push(new PowerupJAM(this, 1500, 2000, 'points-M.png'))
    // this.powerups.push(new PowerupGravity(this, 1100, 2000))
    // this.powerups.push(new PowerupSpeed(this, 1300, 2000))
    // this.powerups.push(new PowerupMagnet(this, 1500, 2000))

    this.setupAnimations()
    this.addAudios()
    this.loadLevelData()
    this.createBall()
    this.initPlay()

    this.game.events.on(CONTROL_EVENTS.DOWN, (control) => {
      console.log(`Button down: ${control}`)
      if (control === 'left') {
        this.controlState.rotating = ROTATE.LEFT
      } else if (control === 'right') {
        this.controlState.rotating = ROTATE.RIGHT
      } else if (control === 'fire') {
        this.controlState.charging = true
      }
    })
    this.game.events.on(CONTROL_EVENTS.UP, (control) => {
      console.log(`Button up: ${control}`)
      if (control === 'left' || control === 'right') {
        this.controlState.rotating = ROTATE.NONE
      } else if (control === 'fire') {
        this.controlState.charging = false
      } else if (control === 'zoom') {
        if (this.targetZoom === CAMERA_ZOOM_IN) {
          this.zoomOutCamera()
        } else {
          this.zoomInCamera()
        }
      }
    })

    // this will likely be overhauled once we have multiplayer, but for the single
    // playtest version, this restart event will restart the scene
    this.game.events.on(CONTROL_EVENTS.RESTART, () => {
      this.input.removeAllListeners()
      this.game.events.removeAllListeners()
      this.scene.restart()
    })

    this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      // console.log(bodyA, bodyB)
      if (bodyA.label === 'Rectangle Body' && bodyB.label === 'Circle Body') {
        if (this.audioEnabled === true) {
          if (this.ball.visible === true) {
            this.sfxballbounce.play()
          }
        }
        this.addScore(100, { animate: false })
      }
    })

    if (process.env.NODE_ENV !== 'production' && DEV_KEYS === true) {
      this.input.on('pointermove', function (pointer) {
        pointer.x = pointer.worldX
        pointer.y = pointer.worldY
        this.angle = Phaser.Math.Angle.BetweenPoints(this.cannonHead, pointer) + Math.PI / 2
        if (this.angle > ROTATE_RANGE.MIN && this.angle < ROTATE_RANGE.MAX) {
          this.cannonHead.rotation = this.angle
        }
      }, this)

      this.cursors = this.input.keyboard.createCursorKeys()

      // Drop the ball above and slightly off-center to hit the hoop collider and go in
      this.input.keyboard.on('keydown-H', () => {
        this.ball.setPosition(WORLD_WIDTH / 2 + 40, 1000)
        this.ball.setVelocity(0, 0)
      })
    }
  }

  addAudios() {
    this.sfxlshoot = this.sound.add('launchershoot')
    this.sfxlaim = this.sound.add('launcheraim', { volume: 0.3 })
    this.sfxlpower = this.sound.add('launcherpower')
    this.sfxgoop = this.sound.add('obsgoop')
    this.sfxtnt = this.sound.add('obstnt')
    this.sfxmace = this.sound.add('obsmace')
    this.sfxballbounce = this.sound.add('ballbounce', { volume: 0.3 })
    this.sfxbasketmadeswish = this.sound.add('basketmadeswish')
    this.sfxbasketmadeapplause = this.sound.add('basketmadeapplause')
    this.sfxpujam = this.sound.add('powerupjam')
    this.sfxpugravitystart = this.sound.add('powerupgravitystart')
    this.sfxpugravityon = this.sound.add('powerupgravityon')
    this.sfxpuspeedstart = this.sound.add('powerupspeedstart')
    this.sfxpuspeedon = this.sound.add('powerupspeedon')
    this.sfxpumagnetstart = this.sound.add('powerupmagnetstart')
    this.sfxpumagneton = this.sound.add('powerupmagneton')
  }

  stopSound() {
    this.sound.stopAll()
  }

  initPlay() {
    this.ball.thrown = false
    this.ball.speed = 0
    this.ball.setActive(false)
    this.ball.setVisible(false)
    this.ball.setPosition(this.cannonBody.x, this.cannonBody.y - 50)
    this.game.reactDispatch({ type: ACTIONS.PHASE_CHANGE, data: { phase: PHASES.AIMING } })
  }

  update() {

    // Convenience keys for Dev.  Check this.devRotation to avoid cancelling button input.
    if (process.env.NODE_ENV !== 'production' && DEV_KEYS === true) {
      if (this.cursors.left.isDown) {
        this.controlState.rotating = ROTATE.LEFT
        this.devRotation = true
      } else if (this.cursors.right.isDown) {
        this.controlState.rotating = ROTATE.RIGHT
        this.devRotation = true
      } else if (this.devRotation && this.cursors.right.isUp && this.controlState.rotating === ROTATE.RIGHT) {
        this.controlState.rotating = ROTATE.NONE
        this.devRotation = false
      } else if (this.devRotation && this.cursors.left.isUp && this.controlState.rotating === ROTATE.LEFT) {
        this.controlState.rotating = ROTATE.NONE
        this.devRotation = false
      }

      if (this.cursors.space.isDown || this.input.mousePointer.primaryDown) {
        this.controlState.charging = true
        this.devCharge = true
      }
      if (this.devCharge && this.cursors.space.isUp && !this.input.mousePointer.primaryDown) {
        this.controlState.charging = false
        this.devCharge = false
      }
    }

    if (this.controlState.rotating === ROTATE.LEFT) {
      this.zoomInCamera()
      this.rotateLauncherLeft()
    } else if (this.controlState.rotating === ROTATE.RIGHT) {
      this.zoomInCamera()
      this.rotateLauncherRight()
    }
    const rotating = this.controlState.rotating === ROTATE.LEFT || this.controlState.rotating === ROTATE.RIGHT
    if (this.audioEnabled === true && rotating && !this.sfxlaim.isPlaying) {
      this.sfxlaim.setLoop(true)
      this.sfxlaim.play()
    } else if (!rotating) {
      this.sfxlaim.stop()
    }

    if (this.controlState.charging) {
      this.chargeShot()
    }

    // Only do something if we actually started to fire.
    if (this.shotPower.level > 0 && !this.controlState.charging) {
      this.fireBall()
    }

    if (this.ball.thrown) {
      if (this.ball.body.speed < SPEED_ZERO) {
        this.ballRestCount++
        if (this.ballRestCount >= REST_THRESHOLD) {
          this.playEnded()
        }
      } else {
        this.ballRestCount = 0
      }
      if (this.ball.x < 0 || this.ball.x > WORLD_WIDTH || this.ball.y < 0 || this.ball.y > WORLD_HEIGHT) {
        this.playEnded()
      }
    }

    if (Math.abs(this.cameras.main.zoom - this.targetZoom) > 0.0001) {
      const nextZoom = (4 * this.cameras.main.zoom + this.targetZoom) / 5
      this.cameras.main.setZoom(nextZoom)
    }

    this.ballTrailer.updateLine()
    this.ball.followTarget()
  }

  setupAnimations() {
    this.anims.create({
      key: 'tnt-explosion',
      frames: this.anims.generateFrameNumbers('tnt-explosion', { start: 0, end: 4 }),
      frameRate: 10,
    })
    this.anims.create({
      key: 'basket-made',
      frames: this.anims.generateFrameNumbers('basket-made', { start: 0, end: 11 }),
      frameRate: 10,
    })
    this.anims.create({
      key: 'ball-pop',
      frames: this.anims.generateFrameNumbers('ball-pop', { start: 0, end: 6 }),
      frameRate: 10,
    })
    this.anims.create({
      key: 'pickup',
      frames: this.anims.generateFrameNumbers('pickup', { start: 0, end: 11 }),
      frameRate: 15,
    })
    this.anims.create({
      key: 'goop-splat',
      frames: this.anims.generateFrameNumbers('goop-splat', { start: 0, end: 9 }),
      frameRate: 15,
    })
  }

  createBall() {
    const bounceParam = this.game.gameParams.physics.bounciness.magnitude
    const airFricParam = this.game.gameParams.physics.friction.magnitude

    const ballBounce = Phaser.Math.Linear(PHYSICS.bounciness.params.magnitude.min, PHYSICS.bounciness.params.magnitude.max, bounceParam)
    const airFric = Phaser.Math.Linear(PHYSICS.friction.params.magnitude.min, PHYSICS.friction.params.magnitude.max, airFricParam)

    const ballTexture = BALL_TEXTURES[this.game.gameParams.ball.ballColor]
    this.ball = this.matter.add.image(this.cannonBody.x, this.cannonBody.y - 50, 'pack1', ballTexture).setDepth(2)
    this.ball.setCircle((this.ball.height / 2.0) * 0.75)
    this.ball.setFrictionAir(airFric)
    this.ball.setFriction(0.003)
    this.ball.setBounce(ballBounce)
    this.ball.setMass(5)
    this.ball.setActive(false)
    this.ball.setVisible(false)
    this.ball.thrown = false

    this.ball.target = this.hoop.magnetTarget
    console.log(this.hoop.magnetTarget)
    this.ball.following = false

    this.ball.startFollow = () => {
      this.ball.following = true
      this.tempGravityY = this.matter.world.localWorld.gravity.y
      this.matter.world.localWorld.gravity.y = 0
    }

    this.ball.stopFollow = () => {
      this.ball.following = false
      this.matter.world.localWorld.gravity.y = this.tempGravityY
    }

    this.ball.followTarget = () => {
      if (this.ball.following === false) return
      this.ball.body.speed = 0
      const ballPos = this.ball.body.position
      const newPosX = lerp(ballPos.x, this.ball.target.x, 0.002)
      const newPosY = lerp(ballPos.y, this.ball.target.y, 0.002)
      this.ball.body.position.x = newPosX
      this.ball.body.position.y = newPosY
    }

    this.ballTrailer = new BallTrailer(this, this.ball, this.game.gameParams.ball.trailColor, this.game.gameParams.ball.trailLength)
  }

  rotateLauncherRight() {
    this.angle = this.cannonHead.rotation
    this.angle += ROTATE_SPEED
    if (this.angle < ROTATE_RANGE.MIN || this.angle > ROTATE_RANGE.MAX) return
    this.cannonHead.rotation = this.angle
    this.cameraTarget.setX(WORLD_WIDTH / 2 + 100 * Math.cos(this.angle - Math.PI / 2))
  }

  rotateLauncherLeft() {
    this.angle = this.cannonHead.rotation
    this.angle -= ROTATE_SPEED
    if (this.angle < ROTATE_RANGE.MIN || this.angle > ROTATE_RANGE.MAX) return
    this.cannonHead.rotation = this.angle
    this.cameraTarget.setX(WORLD_WIDTH / 2 + 100 * Math.cos(this.angle - Math.PI / 2))
  }

  chargeShot() {
    const now = this.time.now

    if (this.chargeOrAimingStart === false) {
      this.zoomInCamera()
      this.chargeOrAimingStart = true
      this.shotPower.lastUpdate = now
      if (this.audioEnabled === true) {
        this.sfxlpower.play()
      }
    }

    const elapsedMillis = now - this.shotPower.lastUpdate
    const power = Phaser.Math.Clamp(elapsedMillis / CHARGE_RATE_MS, 0, this.shotPower.max - 1)
    this.shotPower.level = 1 + power

    const visualLevel = Math.floor(this.shotPower.level)
    this.cannonHead.setTexture('pack1', 'launcher-tip-' + visualLevel + '.png')
  }

  fireBall() {
    this.ball.thrown = true
    this.chargeOrAimingStart = false
    const R = 175
    let ballPosX = this.cannonHead.x
    let ballPosY = this.cannonHead.y

    var fireAngle = this.cannonHead.rotation - Math.PI / 2

    ballPosX = Math.cos(fireAngle) * R + this.cannonHead.x
    ballPosY = Math.sin(fireAngle) * R + this.cannonHead.y

    const SPEED = SHOT_POWER_BASE * this.shotPower.level

    this.ball.setAwake()
    this.ball.setPosition(ballPosX, ballPosY)
    this.ball.setActive(true)
    this.ball.setVisible(true)

    this.ball.setAngle(fireAngle)

    this.hoop.initHoop()

    this.matter.applyForceFromAngle(this.ball, SPEED, fireAngle)
    this.shotPower.level = 0
    this.game.reactDispatch({ type: ACTIONS.PHASE_CHANGE, data: { phase: PHASES.PLAYING } })
    this.gamePhase = PHASES.PLAYING

    // clearInterval(this.scoreTimer)
    // this.scoreTimer = setInterval(() => {
    //   this.addScore(50, { animate: false })
    // }, 1000)

    this.cameras.main.startFollow(this.ball, true, 0.5, 0.5)
    this.targetZoom = CAMERA_ZOOM_IN
    this.zoomInAnim = true
    if (this.audioEnabled === true) {
      this.sfxlpower.stop()
      this.sfxlshoot.play()
    }
  }

  zoomInCamera() {
    console.log('zoom in')
    this.targetZoom = CAMERA_ZOOM_IN
    this.game.reactDispatch({ type: ACTIONS.ZOOM_CHANGE, data: { level: 'in' } })
  }

  zoomOutCamera() {
    console.log('zoom out')
    this.targetZoom = CAMERA_ZOOM_NORMAL
    this.game.reactDispatch({ type: ACTIONS.ZOOM_CHANGE, data: { level: 'out' } })
  }

  loadLevelData() {
    this.leveldata = LEVELS[this.level]
    if (!this.leveldata) {
      this.leveldata = JSON.parse(localStorage.getItem('level'))
    }

    if (this.leveldata === null) return
    console.log('level data', this.leveldata)
    this.leveldata.levelstates.cells.forEach(cell => {
      if (cell.type === 'Obstacle') {
        this.addObstaclesFromLevelData(cell.positions)
      }
      for (let _idx = 0; _idx < cell.positions.length; _idx++) {
        const _key = cell.type
        const _filename = cell.filename
        const _posX = cell.positions[_idx].x
        const _posY = cell.positions[_idx].y
        const _orientation = cell.positions[_idx].orientation

        if (_key === 'A' || _key === 'J' || _key === 'M') {
          this.powerups.push(new PowerupJAM(this, _posX, _posY, 'points-' + _key + '.png'))
        }
        if (_key === 'Magnet') {
          this.powerups.push(new PowerupMagnet(this, _posX, _posY, _filename))
        }
        if (_key === 'Speed') {
          this.powerups.push(new PowerupSpeed(this, _posX, _posY, _filename))
        }
        if (_key === 'Gravity') {
          this.powerups.push(new PowerupGravity(this, _posX, _posY, _filename))
        }
        if (_key === 'Square') {
          this.platforms.push(new PlatformSquare(this, _posX, _posY, _orientation))
        }
        if (_key === 'Triangle') {
          this.platforms.push(new PlatformTriangle(this, _posX, _posY, _orientation))
        }
      }
    })
  }

  addObstaclesFromLevelData(obstacleData) {
    const numberOfObstacles = obstacleData.length
    const obstacleCounts = calculateObstacleCounts(this.game.gameParams, numberOfObstacles)
    let i
    let obstacleTypes = []
    for (i = 0; i < obstacleCounts.tntCount; i++) {
      obstacleTypes.push('Tnt')
    }
    for (i = 0; i < obstacleCounts.goopCount; i++) {
      obstacleTypes.push('Goop')
    }
    for (i = 0; i < obstacleCounts.maceCount; i++) {
      obstacleTypes.push('Mace')
    }
    for (i = 0; i < obstacleCounts.speedCount; i++) {
      obstacleTypes.push('Speed')
    }
    for (i = 0; i < obstacleCounts.magicCount; i++) {
      obstacleTypes.push('Magic')
    }
    for (i = 0; i < obstacleCounts.gravityCount; i++) {
      obstacleTypes.push('Gravity')
    }

    for (i = 0; i < numberOfObstacles - obstacleCounts.totalCount; i++) {
      obstacleTypes.push(null)
    }
    obstacleTypes = Phaser.Utils.Array.Shuffle(obstacleTypes)

    for (i = 0; i < obstacleData.length; i++) {
      const obstacle = obstacleData[i]
      if (obstacleTypes[i] === 'Tnt') {
        this.obstacles.push(new ObsTnt(this, obstacle.x, obstacle.y))
      }
      if (obstacleTypes[i] === 'Goop') {
        this.obstacles.push(new ObsGoop(this, obstacle.x, obstacle.y))
      }
      if (obstacleTypes[i] === 'Mace') {
        this.obstacles.push(new ObsMace(this, obstacle.x, obstacle.y))
      }
      // if (obstacleTypes[i] === 'Speed') {
      //   this.obstacles.push(new PowerupSpeed(this, obstacle.x, obstacle.y))
      // }
      // if (obstacleTypes[i] === 'Magnet') {
      //   this.obstacles.push(new PowerupMagnet(this, obstacle.x, obstacle.y))
      // }
      // if (obstacleTypes[i] === 'Gravity') {
      //   this.obstacles.push(new PowerupGravity(this, obstacle.x, obstacle.y))
      // }
    }
  }

  // obstacle actions
  actionTnt() {
    const throwAngle = -Math.random() * Math.PI
    const tntForceParam = this.game.gameParams.obstacles.tnt.force
    const TntForceValue = Phaser.Math.Linear(OBSTACLES.tnt.params.force.min, OBSTACLES.tnt.params.force.max, tntForceParam)
    const tntForceX = TntForceValue * Math.cos(throwAngle)
    const tntForceY = TntForceValue * Math.sin(throwAngle)
    this.matter.setVelocity(this.ball, tntForceX, tntForceY)
  }

  actionMace() {
    let ballpopanim = this.add.sprite(this.ball.x, this.ball.y, 'ball-pop').setDepth(2)
    ballpopanim.play({ key: 'ball-pop', repeat: 0 })
    ballpopanim.on('animationcomplete', () => {
      ballpopanim.setAlpha(0)
    }, this)
    this.ball.setVisible(false)
    this.ballTrailer.stop()
    this.playEnded(600)
  }

  actionGoop() {
    // reduce the velocity of the ball according to goop size
    const MIN = OBSTACLES.goop.params.speedFraction.min
    const MAX = OBSTACLES.goop.params.speedFraction.max
    const goopParam = this.game.gameParams.obstacles.goop.size
    const reduceValue = Phaser.Math.Linear(MIN, MAX, goopParam)
    this.ball.setVelocity(this.ball.body.velocity.x * reduceValue, this.ball.body.velocity.y * reduceValue)
  }

  //powerup actions
  actionMagnet() {
    const magnetDur = this.game.gameParams.powerUps.hoopMagnet.dur * 1000
    // const magnetDur = 3000 //test\
    this.ballTrailer.magnetballEmitter.start()
    setTimeout(() => {
      if (this.audioEnabled === true) {
        this.sfxpumagneton.play()
      }
    }, 500)

    this.ball.startFollow()
    setTimeout(() => {
      this.sfxpumagneton.stop()
      this.ball.stopFollow()
      this.ballTrailer.magnetballEmitter.stop()
    }, magnetDur)
  }

  actionSpeed() {
    let speedDur = this.game.gameParams.powerUps.speed.dur * 1000
    // speedDur = 5000 // test
    this.ballTrailer.speedballEmitter.start()
    setTimeout(() => {
      if (this.audioEnabled === true) {
        this.sfxpuspeedon.play()
      }
    }, 500)

    const newSpeed = 5 //test

    const speedX = this.ball.body.velocity.x * newSpeed
    const speedY = this.ball.body.velocity.y * newSpeed
    this.ball.setVelocity(speedX, speedY)

    setTimeout(() => {
      this.sfxpuspeedon.stop()
      this.ballTrailer.speedballEmitter.stop()
    }, speedDur)
  }

  actionGravity() {
    let reverseGravDur = this.game.gameParams.powerUps.reverseGrav.dur * 1000
    // reverseGravDur = 3000 // test
    const gravityY = this.matter.world.localWorld.gravity.y
    this.matter.world.localWorld.gravity.y = -Math.abs(gravityY)

    setTimeout(() => {
      if (this.audioEnabled === true) {
        this.sfxpugravityon.play()
      }
    }, 500)
    setTimeout(() => {
      this.sfxpugravityon.stop()
      this.matter.world.localWorld.gravity.y = Math.abs(gravityY)
    }, reverseGravDur)
  }

  //hoop action
  actionHoop() {
    this.ball.setVisible(false)
    this.ballTrailer.stop()
    this.cameras.main.startFollow(this.hoop, true, 0.1, 0.1)
    this.targetZoom = 1
    this.sfxbasketmadeapplause.play()
    this.addScore(10000, { animate: true })
    this.playEnded(1000)
  }



  // scoring effect
  addScore(_value, conf) {
    if (!this.ball.thrown) return

    this.score += _value

    if (conf.animate === true) {
      new ScoreEffect(this, this.ball.x, this.ball.y, _value, conf)
    }
    this.game.reactDispatch({ type: ACTIONS.SCORE_CHANGE, data: { score: this.score } })
  }

  playEnded(delayDuration = 0) {
    this.matter.pause()
    // clearInterval(this.scoreTimer)
    this.ball.thrown = false
    // potentially delay dimming the screen for animation/sound to be enjoyed
    setTimeout(() => {
      this.gamePhase = PHASES.ENDING
      this.game.reactDispatch({ type: ACTIONS.PHASE_CHANGE, data: { phase: PHASES.ENDING } })
    }, delayDuration)
  }

  nextTurn() {

  }
}
