import Phaser from 'phaser'
import PackJson from '../../../media/spritesheet.json'
import PackData from '../../../media/spritesheet.png'
import Cell from './Elements/DragnDrop/Cell'
import Hoop from './Elements/Hoop'
import ButtonCell from '../BoardEditButton/ButtonCell'
import LEVELS, { BLANK_LEVEL } from '../../../constants/levels'
import GameBg from '../../../media/game-bg.png'
import { CAMERA_ZOOM_NORMAL, WORLD_HEIGHT, WORLD_WIDTH } from './Main'
import PlatformTriangleLarge from './Elements/Platforms/PlatformTriangleLarge'

const BlockType = {
  Point: 'Point',
  PowerUp: 'Powerup',
  Obstacle: 'Obstacle',
  Platform: 'Platform',
}

const CellType = {
  Square: { key: 'Square', filename: 'platform-square.png', ctype: BlockType.Platform },
  Triangle: { key: 'Triangle', filename: 'platform-corner-sm.png', ctype: BlockType.Platform },
  J: { key: 'J', filename: 'points-J.png', ctype: BlockType.Point },
  A: { key: 'A', filename: 'points-A.png', ctype: BlockType.Point },
  M: { key: 'M', filename: 'points-M.png', ctype: BlockType.Point },
  Gravity: { key: 'Gravity', filename: 'power-up-gravity.png', ctype: BlockType.PowerUp },
  Magnet: { key: 'Magnet', filename: 'power-up-magnet.png', ctype: BlockType.PowerUp },
  Speed: { key: 'Speed', filename: 'power-up-speed.png', ctype: BlockType.PowerUp },
  Obstacle: { key: 'Obstacle', filename: 'obstacle-for-development.png', ctype: BlockType.Obstacle },
  // Goop: { key: 'Goop', filename: 'obstacle-goop.png', ctype: BlockType.Obstacle },
  // Mace: { key: 'Mace', filename: 'obstacle-mace.png', ctype: BlockType.Obstacle },
  // Tnt: { key: 'Tnt', filename: 'obstacle-tnt.png', ctype: BlockType.Obstacle },
}

const availableCellTypes = [
  CellType.Square,
  CellType.Triangle,
  CellType.J,
  CellType.A,
  CellType.M,
  CellType.Gravity,
  CellType.Magnet,
  CellType.Speed,
  CellType.Obstacle,
  // CellType.Goop,
  // CellType.Mace,
  // CellType.Tnt,
]

export default class MapEdit extends Phaser.Scene {
  constructor(config) {
    config = Object.assign({}, { key: 'mapedit' }, config)
    super(config)

  }

  init(data) {
    console.log('init', data)
    this.cells = []
    this.currentCell = undefined
  }

  preload() {
    this.load.atlas('pack1', PackData, PackJson)
    this.load.image('game-bg', GameBg)
  }

  create() {

    //localStorage.clear()
    // this.loadLevel()
    this.loadLevelData()

    this.bg = this.add.sprite(1400, 1400, 'game-bg')
    // this.cannonBody = this.add.sprite(1400, 2800, 'pack1', 'launcher-base.png').setDepth(1)
    // this.cannonBody.setOrigin(0.5, 0.3)
    // this.cannonHead = this.add.sprite(1400, 2885, 'pack1', 'launcher-tip-1.png').setDepth(2)
    // this.cannonHead.setOrigin(0.5, 1.35)
    // this.cannonHead.setTexture('pack1', 'launcher-tip-2.png')

    this.hoop = new Hoop(this, 1400, 1400)

    this.input.on('drag', (pointer, cell, dragX, dragY) => {
      cell.snapGrid(dragX, dragY)

    })

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setZoom(CAMERA_ZOOM_NORMAL)

    new PlatformTriangleLarge(this, 200, 200, 0)
    new PlatformTriangleLarge(this, WORLD_WIDTH - 200, 200, 1)

    this.btnTest = this.add.text(2500, 50, 'Test').setScale(5).setDepth(2)
    this.btnSave = this.add.text(2500, 200, 'Save').setScale(5).setDepth(2)
    this.btnSave.setInteractive()
    this.btnSave.on('pointerdown', () => {
      this.saveLevelData()
    }, this)

    this.btnTest.setInteractive()
    this.btnTest.on('pointerdown', () => {
      this.saveLevelData()
      this.scene.start('main')
    }, this)


    // this.jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)
    // this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    // this.MKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)

    // this.cursors = this.input.keyboard.createCursorKeys()

    // var spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    // var leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    // var rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

    // this.input.keyboard.on('keydown-SPACE', (event) => {
    //   event.stopPropagation()
    //   this.cells.push(new Cell(this, 200, 200, availableCellTypes[idxCellType]))
    // })
    // this.input.keyboard.on('keydown-LEFT', (event) => {
    //   event.stopPropagation()
    //   idxCellType--
    //   if (idxCellType < 0) idxCellType = availableCellTypes.length - 1
    // })
    // this.input.keyboard.on('keydown-RIGHT', (event) => {
    //   event.stopPropagation()
    //   idxCellType++
    //   if (idxCellType > availableCellTypes.length - 1) idxCellType = 0
    // })

    // this.add.text(320, 50, 'Left Arrow Click: select previous obstacle')
    // this.add.text(320, 100, 'Right Arrow Click: select next obstacle')
    // this.add.text(320, 150, 'SpaceBar Click: add obstacle')

    this.createLockedArea()
    this.createButtons()

    this.DeleteKey = this.input.keyboard.addKey('DELETE')
    this.DeleteKey.on('down', () => {
      console.log('delete key down')
      if (this.currentCell !== undefined) {
        this.removeCell(this.currentCell)
      }
    })

    this.game.events.on('save', () => {
      this.saveLevelData()
    })
  }


  createLockedArea() {
    this.lockedCells = []
    this.lockedCells.push(
      { row: 5, col: 5 }, { row: 5, col: 6 }, { row: 5, col: 7 }, { row: 5, col: 8 },
      { row: 6, col: 5 }, { row: 6, col: 6 }, { row: 6, col: 7 }, { row: 6, col: 8 },
      { row: 7, col: 5 }, { row: 7, col: 6 }, { row: 7, col: 7 }, { row: 7, col: 8 },
      { row: 8, col: 5 }, { row: 8, col: 6 }, { row: 8, col: 7 }, { row: 8, col: 8 },
      { row: 13, col: 5 }, { row: 13, col: 6 }, { row: 13, col: 7 }, { row: 13, col: 8 },
    )
  }

  isLockedCell(row, col) {
    for (let lc = 0; lc < this.lockedCells.length; lc++) {
      if (this.lockedCells[lc].col === col && this.lockedCells[lc].row === row) {
        return true
      }
    }
    return false
  }
  isAccupiedCell(row, col) {
    for (let lc = 0; lc < this.cells.length; lc++) {
      if (this.cells[lc].col === col && this.cells[lc].row === row) {
        return true
      }
    }
    return false
  }

  isAvailableCell(row, col) {
    if (this.isAccupiedCell(row, col) === true) return false
    if (this.isLockedCell(row, col) === true) return false
    return true
  }

  loadLevel() {
    let cache = this.cache.json
    this.initLevelData = cache.get('leveldata')
  }

  createButtons() {

    // button.on('pointerdown', this.onPressed, this)
    for (let i = 0; i < availableCellTypes.length; i++) {
      var button = new ButtonCell({
        'scene': this,
        'filename': availableCellTypes[i].filename,
        'up': 0,
        'over': 1,
        'down': 2,
        'x': 1500 - (availableCellTypes.length / 2 - i) * 120,
        'y': 2750,
        'key': i,
      })
      button.setScale(0.5)
    }
  }
  onPressed() {
    console.log('I am pressed!')
  }

  removeCell(cell) {
    for (let cidx = 0; cidx < this.cells.length; cidx++) {
      if (this.cells[cidx] === cell) {
        this.cells.splice(cidx, 1)
        cell.destroy()
        break
      }
    }
  }

  addCell(key, x, y) {

    this.cells.push(new Cell(this, x, y, 0, availableCellTypes[key]))
    // this.saveLevelData()
  }

  update() {
    // if (this.cursors.left.isDown) {
    //   this.cells.push(new Cell(this, 200, 200, availableCellTypes[idxCellType]))
    // }
    // if (this.cursors.right.isDown) {
    //   idxCellType++
    //   console.log(idxCellType)
    //   if (idxCellType > availableCellTypes.length - 1) idxCellType = 0

    // }
  }

  findBlankCell() {
    for (let row = 0; row < 14; row++) {
      for (let col = 0; col < 14; col++) {
        if (this.isLockedCell(row, col)) continue
        if (this.isAccupiedCell(row, col)) continue
        return { row: row, col: col }
      }
    }
    return null
  }

  saveLevelData() {
    localStorage.clear()
    this.leveldata = BLANK_LEVEL
    for (let lc = 0; lc < this.leveldata.levelstates.cells.length; lc++) {
      this.leveldata.levelstates.cells[lc].positions = []
    }

    this.cells.forEach(cell => {
      if (cell !== null && cell !== undefined) {
        this._addCellToLevelData(cell)
      }
    })

    console.log('2', this.leveldata)

    localStorage.setItem('level', JSON.stringify(this.leveldata))
  }

  _addCellToLevelData(cell) {
    for (let lc = 0; lc < this.leveldata.levelstates.cells.length; lc++) {
      const ele = this.leveldata.levelstates.cells[lc]
      if (ele.type === cell.key) {
        this.leveldata.levelstates.cells[lc].positions.push({ x: cell.x, y: cell.y, orientation: cell.orientation })
        return
      }
    }
  }

  loadLevelData() {
    this.cells = []
    this.leveldata = JSON.parse(localStorage.getItem('level'))
    if (!this.leveldata) {
      console.log('loading from JSON')
      this.leveldata = LEVELS['1']
    }
    console.log(this.leveldata)
    this.leveldata.levelstates.cells.forEach(cell => {
      let _keyIdx = 0
      for (_keyIdx = 0; _keyIdx < availableCellTypes.length; _keyIdx++) {
        if (availableCellTypes[_keyIdx].key === cell.type) {
          break
        }
      }

      for (let _idx = 0; _idx < cell.positions.length; _idx++) {
        this.cells.push(new Cell(this, cell.positions[_idx].x, cell.positions[_idx].y, cell.positions[_idx].orientation, availableCellTypes[_keyIdx]))
      }
    })

  }

}
