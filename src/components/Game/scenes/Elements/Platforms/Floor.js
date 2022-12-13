import Phaser from 'phaser'

export default class Floor extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y, scalex, scaley) {

    super(scene.matter.world, x, y, 'pack1', 'platform-square.png').setScale(scalex, scaley)

    this.setStatic(true)
    this.setDepth(1)
    this.setFriction(0.005)
    scene.add.existing(this)
  }
}

