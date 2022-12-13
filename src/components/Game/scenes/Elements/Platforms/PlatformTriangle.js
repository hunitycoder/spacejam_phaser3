import Phaser from 'phaser'

const BODY_OFFSET = 33.3
const X_OFFSETS = [-1, 1, 1, -1]
const Y_OFFSETS = [-1, -1, 1, 1]

export default class PlatformTriangle extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y, orientation) {
    super(scene.matter.world, x, y, 'pack1', 'platform-corner-sm.png', {
      shape: {
        type: 'fromVerts',
        verts: [
          { x: 0, y: 0 },
          { x: 200, y: 0 },
          { x: 0, y: 200 },
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

