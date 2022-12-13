import Powerup from './Powerup'
export default class PowerupGravity extends Powerup {
  constructor(scene, x, y, frameName) {

    super(scene, x, y, 'pack1', 'power-up-gravity.png', { destroy: true }).setDepth(1)
    scene.add.existing(this)
    this.PosX = x
    this.PosY = y
    this.setPosition(this.PosX, this.PosY)

    this.scene = scene
  }

  onHit() {
    if (this.scene.audioEnabled === true) {
      this.scene.sfxpugravitystart.play()
    }

    this.scene.actionGravity()

    this.setActive(false)
    this.setVisible(false)

    this.scene.addScore(1000, { animate: true })
  }
}
