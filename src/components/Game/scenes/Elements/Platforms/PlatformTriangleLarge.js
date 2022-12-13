import Phaser from 'phaser'

const BODY_OFFSET = 66.6
const X_OFFSETS = [-1, 1, 1, -1]
const Y_OFFSETS = [-1, -1, 1, 1]

export default class PlatformTriangleLarge extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y, orientation) {
    super(scene.matter.world, x, y, 'pack1', 'platform-corner-lg.png', {
      shape: {
        type: 'fromVerts',
        verts: [
          { x: 0, y: 0 },
          { x: 400, y: 0 },
          { x: 0, y: 400 },
        ],
      },
    })
 
    this.setStatic(true)
    this.setRotation(orientation * Math.PI / 2)

    this.x += X_OFFSETS[orientation] * BODY_OFFSET
    this.y += Y_OFFSETS[orientation] * BODY_OFFSET

    scene.add.existing(this)
  }
}

