import DefaultLevel from '../media/levels/level.json'

export const BLANK_LEVEL = {
  ID: 'Level1',
  levelstates: {
    cells: [
      { type: 'A', positions: [] },
      { type: 'J', positions: [] },
      { type: 'M', positions: [] },
      { type: 'Gravity', positions: [] },
      { type: 'Magnet', positions: [] },
      { type: 'Speed', positions: [] },
      { type: 'Goop', positions: [] },
      { type: 'Mace', positions: [] },
      { type: 'Tnt', positions: [] },
      { type: 'Obstacle', positions: [] },
      { type: 'Square', positions: [] },
      { type: 'Triangle', positions: [] },
    ],
  },
}
Object.freeze(BLANK_LEVEL)


const LEVELS = {
  1: DefaultLevel,
  2: DefaultLevel,
  3: DefaultLevel,
}
Object.freeze(LEVELS)

export default LEVELS
