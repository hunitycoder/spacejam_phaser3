import Phaser from 'phaser'
import Obstacle from './Obstacle'
import { OBSTACLES } from '../../../../../constants/params'

const SCALE_MIN = OBSTACLES.goop.params.size.min
const SCALE_MAX = OBSTACLES.goop.params.size.max

export default class ObsGoop extends Obstacle {
  constructor(scene, x, y) {
    const sizeParam = scene.game.gameParams.obstacles.goop.size
    const adjustedScale = Phaser.Math.Linear(SCALE_MIN, SCALE_MAX, sizeParam)

    super(scene, x, y, 'pack1', 'obstacle-goop.png', { destroy: true }).setDepth(1)
    scene.add.existing(this)
    this.PosX = x
    this.PosY = y
    this.setPosition(this.PosX, this.PosY)
    this.setScale(adjustedScale)
    this.scene = scene

  }

  onHit() {
    let animSprite = this.scene.add.sprite(this.PosX, this.PosY, 'goop-splat')
    animSprite.play({ key: 'goop-splat', repeat: 0 })
    animSprite.on('animationcomplete', () => {
      animSprite.setAlpha(0)
    }, this)
    if (this.scene.audioEnabled === true) {
      this.scene.sfxgoop.play()
    }
    this.scene.actionGoop()

    this.setActive(false)
    this.setVisible(false)

    this.scene.addScore(500, { animate: true })
  }
}

