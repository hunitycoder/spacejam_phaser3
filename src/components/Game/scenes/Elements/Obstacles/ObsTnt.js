import Obstacle from './Obstacle'

export default class ObsTnt extends Obstacle {
  constructor(scene, x, y) {

    super(scene, x, y, 'pack1', 'obstacle-tnt.png', { destroy: true }).setDepth(1)
    scene.add.existing(this)
    this.PosX = x
    this.PosY = y
    this.setPosition(this.PosX, this.PosY)

    this.scene = scene
  }

  onHit() {
    let animSprite = this.scene.add.sprite(this.PosX, this.PosY, 'tnt-explosion')
    animSprite.play({ key: 'tnt-explosion', repeat: 0 })
    animSprite.on('animationcomplete', () => {
      animSprite.setAlpha(0)
    }, this)
    if (this.scene.audioEnabled === true) {
      this.scene.sfxtnt.play()
    }

    this.setActive(false)
    this.setVisible(false)

    this.scene.actionTnt()

    this.scene.addScore(500, { animate: true })
  }
}

