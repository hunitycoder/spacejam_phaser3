import Phaser from 'phaser'

const TEXT_STYLE = {
  fontFamily: 'Politica, sans-serif',
  fontSize: '60px',
  align: 'center',
}

export default class ScoreEffect extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, value, action) {

    super(scene, x, y).setDepth(2)
    scene.add.existing(this)
    this.setAlpha(1)
    this.PosX = x
    this.PosY = y - 100
    this.setPosition(this.PosX, this.PosY)

    if (action.animate === true) {
      this.txtScore = scene.add.text(this.PosX, this.PosY, '+' + value, TEXT_STYLE)
        .setDepth(3)

      this.scene = scene
      this.alphaTween = scene.tweens.add({
        targets: this.txtScore,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
      }, this)

      this.positionTween = scene.tweens.add({
        targets: this.txtScore,
        x: this.PosX,
        y: this.PosY - 300,
        duration: 1001,
        ease: 'Power2',
        onComplete: this.kill,
        onCompleteScope: this,
      }, this)
    }
  }

  kill() {
    this.scene.tweens.remove(this.alphaTween)
    this.scene.tweens.remove(this.positionTween)
    this.txtScore.destroy()
    this.destroy()
  }
}

