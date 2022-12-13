import Phaser from 'phaser'

export default class PlatformSquare extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y, orientation) {

    super(scene.matter.world, x, y, 'pack1', 'platform-square.png')

    this.setStatic(true)
    this.setDepth(1)
    this.setRotation(orientation * Math.PI / 2)

    scene.add.existing(this)
  }
}

