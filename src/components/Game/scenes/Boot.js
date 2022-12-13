import Phaser from 'phaser'

export default class Boot extends Phaser.Scene {
  constructor(config) {
    config = Object.assign({ key: 'boot' }, config)
    super(config)
  }

  init() {
    // Toss in optional custom object factories here.
    // E.g: Phaser.GameObjects.GameObjectFactory.register('target', targetFactoryFunc)
  }

  preload() {
    // Preload audio, images, etc.
  }

  create() {
    /* Webfont.load({
      custom: {
        families: ['BadaboomBB_Reg'],
      },
      active: () => {
        this.scene.start('instructions')
      },
    }) */
    this.scene.start('main')
    // const scenename = localStorage.getItem('scene')
    // if (scenename === 'edit') {
    //   this.scene.start('mapedit')
    // } else if (scenename === 'main') {
    //   this.scene.start('main')
    // } else {
    //   this.scene.start('mapedit')
    // }


  }
}
