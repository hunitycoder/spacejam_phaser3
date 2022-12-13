import Phaser from 'phaser'

export default class Powerup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, option) {
    super(scene, x, y, texture, frame)

    scene.matter.add.gameObject(this)
      .setCircle(60)
      .setStatic(true)
      .setSensor(true)

    this.world.on('collisionstart', this.onCollide, this)

    this.option = option
  }

  onCollide(event) {
    if (!this.body) {
      console.warn('onCollide handler happening on destroyed object')
    }

    if (event.pairs.length === 0 || !this.body) return

    const thisId = this.body.id
    const weCollided = event.pairs.find((pair) => {
      return pair.bodyA.id === thisId || pair.bodyB.id === thisId
    })

    if (!weCollided) return

    this.onHit()
    if (this.option !== undefined && this.option.destroy === true) {
      console.log('destroy')
      this.world.off('collisionstart', this.onCollide, this)
      this.destroy(true)
    }
  }

  onHit() {
    // Override here...
  }
}
