import Powerup from './Powerup'

export default class PowerupJAM extends Powerup {
  constructor(scene, x, y, frameName) {

    super(scene, x, y, 'pack1', frameName, { destroy: true }).setDepth(1)
    scene.add.existing(this)
    this.PosX = x
    this.PosY = y
    this.setPosition(this.PosX, this.PosY)

    this.scene = scene

  }
  onHit() {
    let animSprite = this.scene.add.sprite(this.PosX, this.PosY, 'pickup')
    animSprite.play({ key: 'pickup', repeat: 0 })
    animSprite.on('animationcomplete', () => {
      animSprite.setAlpha(0)
    }, this)
    if (this.scene.audioEnabled === true) {
      this.scene.sfxpujam.play()
    }

    this.setActive(false)
    this.setVisible(false)

    this.scene.addScore(5000, { animate: true })
  }
}
