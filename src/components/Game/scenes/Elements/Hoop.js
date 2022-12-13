import Phaser from 'phaser'

const BOARD_TEXTURES = [
  'basket-board-default.png',
  'basket-board-purple.png',
  'basket-board-gold.png',
  'basket-board-orange.png',
]
const HOOP_TEXTURES = [
  'basket-hoop-default.png',
  'basket-hoop-purple.png',
  'basket-hoop-gold.png',
  'basket-hoop-orange.png',
]

// Hoop animation was not created to match the art we're using, so tweaks need to be made
const HOOP_ANIM_SCALE_FACTOR = 3
// Animation isn't centered, either...
const HOOP_ANIM_CENTER_ADJUST_X = -15
const HOOP_ANIM_CENTER_ADJUST_Y = -10

class Hoop extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, hoopScale = 0.5, color = 0) {
    super(scene, x, y, 'pack1', BOARD_TEXTURES[color])

    scene.add.existing(this)

    // If this is moved, the colliders (s1, s2), zones, and animation will need to move, too.
    this.baskethoop = scene.add.image(x, y, 'pack1', HOOP_TEXTURES[color]).setDepth(3)
    this.baskethoop.setScale(hoopScale, 1)

    this.PosX = x
    this.PosY = y
    this.setPosition(this.PosX, this.PosY)

    // If these are moved, the hoop, animation and zones will need to move, too.
    this.s1 = scene.matter.add.image(this.PosX - 160 * hoopScale, this.PosY + 95, 'pack1', 'platform-square.png').setScale(0.07, 0.4).setStatic(true)
    this.s2 = scene.matter.add.image(this.PosX + 160 * hoopScale, this.PosY + 95, 'pack1', 'platform-square.png').setScale(0.07, 0.4).setStatic(true)

    this.s1.setAlpha(0)
    this.s2.setAlpha(0)
    // setScale doesn't seem to work as expected on zones, so sizing is happening directly here.

    // If these zones are moved, the hoop, animation, etc will need to move, too.
    // Note: This zone needs to overlap with this.bottomZone

    this.magnetTarget = scene.add.image(this.PosX, this.PosY).setDepth(3)


    this.topZone = scene.add.zone(this.PosX, this.PosY + 70, 360 * hoopScale * 0.5, 90)
    scene.matter.add.gameObject(this.topZone, {
      isSensor: true,
      isStatic: true,
    })
    this.topZone.world.on('collisionstart', this.onTopCollide, this)
    this.topZone.world.on('collisionend', this.onTopCollideEnd, this)

    // Setting the final bottomZone below the rim so that the ball has a chance visibly fall thru the hoop.
    this.bottomZone = scene.add.zone(this.PosX, this.PosY + 140, 360 * hoopScale * 0.5, 50)
    scene.matter.add.gameObject(this.bottomZone, {
      isSensor: true,
      isStatic: true,
    })
    this.bottomZone.world.on('collisionstart', this.onBottomCollide, this)

    // If the hoop is moved, this animation probably needs to move, as well.
    this.animSprite = this.scene.add.sprite(this.PosX + (HOOP_ANIM_CENTER_ADJUST_X * hoopScale), this.PosY + (HOOP_ANIM_CENTER_ADJUST_Y * hoopScale), 'basket-made')
    this.animSprite.setAlpha(0)
    this.animSprite.setScale(hoopScale * HOOP_ANIM_SCALE_FACTOR, hoopScale * HOOP_ANIM_SCALE_FACTOR)

    this.scene = scene
  }

  initHoop() {
    this.hoopStart = false
  }

  onTopCollide(event) {
    const body = this.topZone.body
    if (event.pairs.length === 0 || !body) return

    const thisId = body.id
    const weCollided = event.pairs.find((pair) => {
      return pair.bodyA.id === thisId || pair.bodyB.id === thisId
    })

    if (!weCollided) return
    this.hoopStart = true
  }

  onTopCollideEnd(event) {
    const body = this.bottomZone.body
    if (event.pairs.length === 0 || !body) return

    const thisId = body.id
    const weCollided = event.pairs.find((pair) => {
      return pair.bodyA.id === thisId || pair.bodyB.id === thisId
    })

    if (!weCollided) return
    this.hoopStart = false
  }

  onBottomCollide(event) {
    if (!this.hoopStart) return

    const body = this.bottomZone.body
    if (event.pairs.length === 0 || !body) return

    const thisId = body.id
    const weCollided = event.pairs.find((pair) => {
      return pair.bodyA.id === thisId || pair.bodyB.id === thisId
    })

    if (!weCollided) return
    this.onHoop()
  }

  onHoop() {
    this.animSprite.setAlpha(1)
    this.animSprite.play({ key: 'basket-made', repeat: 0 })
    this.animSprite.on('animationcomplete', () => {
      this.animSprite.setAlpha(0)
    }, this)

    if (this.scene.audioEnabled === true) {
      this.scene.sfxbasketmadeswish.play()
    }

    this.scene.actionHoop()
  }
}
export default Hoop
