import Phaser from 'phaser'
export default class ButonCell extends Phaser.GameObjects.Sprite {
  constructor(config) {

    if (!config.scene) {
      console.log('missing scene')
      return
    }
    //check if config contains a key
    if (!config.filename) {
      console.log('missing key!')
      return
    }


    //if there is no up property assume 0

    super(config.scene, config.x, config.y, 'pack1', config.filename).setDepth(2)
    config.scene.add.existing(this)

    this.scene = config.scene
    this.key = config.key

    this.setInteractive()
    this.on('pointerdown', () => { config.scene.addCell(config.key, -1, -1) }, this)
    this.on('pointerup', this.onUp, this)
    this.on('pointerover', this.onOver, this)
    this.on('pointerout', this.onUp, this)
  }
  onDown() {
    this.setAlpha(0.3)
  }
  onOver() {
    this.setAlpha(0.7)
    // this.setFrame(this.config.over)
  }
  onUp() {
    // this.setFrame(this.config.up)
    this.setAlpha(1)
  }
}
