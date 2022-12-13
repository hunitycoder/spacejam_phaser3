import Phaser from 'phaser'

export default class Wall extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y, scalex, scaley) {

    super(scene.matter.world, x, y, 'pack1', 'platform-square.png').setScale(scalex, scaley)

    this.setStatic(true)
    this.setDepth(1)
    this.setAlpha(0)
    scene.add.existing(this)
  }
}

