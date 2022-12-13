import Phaser from 'phaser'
import Obstacle from './Obstacle'
import { OBSTACLES } from '../../../../../constants/params'

const SCALE_MIN = OBSTACLES.mace.params.size.min
const SCALE_MAX = OBSTACLES.mace.params.size.max

export default class ObsMace extends Obstacle {
  constructor(scene, x, y) {
    const sizeParam = scene.game.gameParams.obstacles.mace.size
    const adjustedScale = Phaser.Math.Linear(SCALE_MIN, SCALE_MAX, sizeParam)

    super(scene, x, y, 'pack1', 'obstacle-mace.png', { destroy: false }).setDepth(1)
    scene.add.existing(this)
    this.PosX = x
    this.PosY = y
    this.setPosition(this.PosX, this.PosY)
    this.setScale(adjustedScale)
    this.scene = scene
  }

  onHit() {
    if (this.scene.audioEnabled === true) {
      this.scene.sfxmace.play()
    }
    this.scene.actionMace()
    this.scene.addScore(500, { animate: true })
  }
}

