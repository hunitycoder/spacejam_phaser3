import tntIcon from '../media/app-ui/obstacle-tnt-lg.png'
import goopIcon from '../media/app-ui/obstacle-goop-lg.png'
import maceIcon from '../media/app-ui/obstacle-mace-lg.png'
import speedIcon from '../media/app-ui/power-up-speed-lg.png'
import magnetIcon from '../media/app-ui/power-up-magnet-lg.png'
import gravIcon from '../media/app-ui/power-up-gravity-lg.png'

import ball1Image from '../media/app-ui/ball-traditional-lg.png'
import ball2Image from '../media/app-ui/ball-oilspill-lg.png'
import ball3Image from '../media/app-ui/ball-gold-lg.png'
import ball4Image from '../media/app-ui/ball-platinum-lg.png'

import basket1Image from '../media/app-ui/basket-default.png'
import basket2Image from '../media/app-ui/basket-purple.png'
import basket3Image from '../media/app-ui/basket-black.png'
import basket4Image from '../media/app-ui/basket-orange.png'

export const BALL_COLORS = [ball1Image, ball2Image, ball3Image, ball4Image]
export const TRAIL_COLORS = ['#23C9FF', '#F78F1F', '#FD595C', '#69FF26']
export const BASKET_COLORS = [basket1Image, basket2Image, basket3Image, basket4Image]

export const OBSTACLES = {
  tnt: {
    icon: tntIcon,
    params: { freq: { label: 'Frequency' }, force: { label: 'Force', min: 20, max: 100 } },
  },
  mace: {
    icon: maceIcon,
    params: { freq: { label: 'Frequency' }, size: { label: 'Size', min: 0.7, max: 1.5 } },
  },
  goop: {
    icon: goopIcon,
    params: {
      freq: { label: 'Frequency' },
      size: { label: 'Size', min: 0.5, max: 1.5 },
      speedFraction: { min: 0.8, max: 0.2 },
    },
  },
}

export const POWERUPS = {
  speed: {
    name: 'Speed',
    icon: speedIcon,
    params: { dur: { label: 'Duration' } },
  },
  hoopMagnet: {
    name: 'Hoop Magnet',
    icon: magnetIcon,
    params: { dur: { label: 'Duration' } },
  },
  reverseGrav: {
    name: 'Gravity Switch',
    icon: gravIcon,
    params: { dur: { label: 'Duration' } },
  },
}

export const PHYSICS = {
  gravity: {
    name: 'Gravity',
    params: { magnitude: { label: null, min: 0, max: 5 } },
  },
  friction: {
    name: 'Friction',
    params: { magnitude: { label: null, min: 0.005, max: 0.02 } },
  },
  bounciness: {
    name: 'Bounciness',
    params: { magnitude: { label: null, min: 0.2, max: 0.9 } },
  },
}
