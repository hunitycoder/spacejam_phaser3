import Phaser from 'phaser'

const CellWidth = 200

export default class Cell extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, orientation, cell) {
    let filename = cell.filename
    super(scene, x, y, 'pack1', filename).setDepth(1)

    scene.add.existing(this)

    this.mapedit = scene
    this.key = cell.key
    this.filename = cell.filename
    this.orientation = orientation
    this.rotation = orientation * Math.PI / 2
    this.setInteractive()
    this.on('pointerdown', (pointer) => {
      if (this.key === 'Triangle' || this.key === 'Square') {
        this.rotate()
      }
      this.mapedit.currentCell = this
    }, this)
    scene.input.setDraggable(this)

    let blankCell = { row: 3, col: 3 }
    if (x === -1 && y === -1) {
      blankCell = this.mapedit.findBlankCell()
      this.row = blankCell.row
      this.col = blankCell.col
    } else {
      this.x = x
      this.y = y
      this.row = Math.floor(y / CellWidth)
      this.col = Math.floor(x / CellWidth)
      blankCell = { row: this.row, col: this.col }

    }

    this.x = this.col * CellWidth + CellWidth / 2
    this.y = this.row * CellWidth + CellWidth / 2

    this.mapedit.currentCell = this
  }

  rotate() {
    this.orientation = (this.orientation + 1) % 4
    this.rotation = Math.PI / 2 * this.orientation
  }

  remove() {
    console.log('remove')
  }

  snapGrid(x, y) {

    this.row = Math.floor(y / CellWidth)
    this.col = Math.floor(x / CellWidth)
    // if (this.mapedit.isAvailableCell(this.row, this.col) === false) return
    this.x = this.col * CellWidth + CellWidth / 2
    this.y = this.row * CellWidth + CellWidth / 2

    // this.mapedit.saveLevelData()
  }
}
