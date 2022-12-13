import Phaser from 'phaser'
import { TRAIL_COLORS } from '../../../../constants/params'

const TRAIL_DECAY_RATE = {
  min: 0.1,
  max: 0.95,
}

export default class BallTrailer extends Phaser.GameObjects.Sprite {
  constructor(scene, ball, colorIndex, trailLength) {
    super(scene)

    scene.add.existing(this)
    this.ball = ball
    this.particles = scene.add.particles('pack1', 'ball-trail-' + colorIndex + '.png')

    this.color = Phaser.Display.Color.HexStringToColor(TRAIL_COLORS[colorIndex]).color

    /** {Phaser.GameObjects.Graphics} */
    this.trail = scene.add.graphics()
    this.trailHead = { x: 0, y: 0 }
    this.points = []

    var self = this
    this.trailLength = trailLength

    this.emitter = this.particles.createEmitter({

      speed: 100,
      lifespan: {
        onEmit: function (particle, key, t, value) {
          return Phaser.Math.Percent(50, 0, 300) * 3000 * self.trailLength
        },
      },
      alpha: {
        onEmit: function (particle, key, t, value) {
          return Phaser.Math.Percent(self.ball.body.speed, 0, 300)
        },
      },
      angle: {
        onEmit: function (particle, key, t, value) {
          var v = Phaser.Math.Between(-10, 10)
          return (self.ball.angle) + v
        },
      },
      scale: { start: 1.7, end: 0 },
      blendMode: 'ADD',
    })
    this.emitter.startFollow(self.ball)


    this.powerball = scene.add.particles('powerball')

    this.speedballEmitter = this.powerball.createEmitter({
      frame: 'red',
      radial: false,
      x: 100,
      y: { start: 0, end: 560, steps: 256 },
      lifespan: 2000,
      speedX: { min: 200, max: 400 },
      quantity: 4,
      gravityY: -50,
      scale: { start: 0.8, end: 0, ease: 'Power3' },
      blendMode: 'ADD',
    })
    this.magnetballEmitter = this.powerball.createEmitter({
      frame: 'green',
      radial: false,
      x: 100,
      y: { start: 0, end: 560, steps: 256 },
      lifespan: 2000,
      speedX: { min: 200, max: 400 },
      quantity: 4,
      gravityY: -50,
      scale: { start: 0.8, end: 0, ease: 'Power3' },
      blendMode: 'ADD',
    })
    this.tntballEmitter = this.powerball.createEmitter({
      frame: 'yellow',
      radial: false,
      x: 100,
      y: { start: 0, end: 560, steps: 256 },
      lifespan: 2000,
      speedX: { min: 200, max: 400 },
      quantity: 4,
      gravityY: -50,
      scale: { start: 0.8, end: 0, ease: 'Power3' },
      blendMode: 'ADD',
    })

    this.speedballEmitter.startFollow(self.ball)
    this.magnetballEmitter.startFollow(self.ball)
    this.tntballEmitter.startFollow(self.ball)
    this.speedballEmitter.stop()
    this.magnetballEmitter.stop()
    this.tntballEmitter.stop()
  }

  updateLine() {
    this.trailHead.x = this.ball.x
    this.trailHead.y = this.ball.y
    this.points.push(new TrailPoint(this.trailHead.x, this.trailHead.y, 4))
    this.trail.clear()


    // The points are backwards, so we're working toward the head of the trail.
    this.trail.beginPath()
    this.trail.lineStyle(0, this.color, 1.0)
    this.trail.moveTo(this.points[0].x, this.points[0].y)
    for (let index = 1; index < this.points.length; ++index) {
      let point = this.points[index]
      this.trail.lineStyle(
        Phaser.Math.Linear(index / (this.points.length), 0, 10) * 8,
        this.color,
        1,
      )
      this.trail.lineTo(point.x, point.y)
    }
    this.trail.strokePath()
    this.trail.closePath()

    // Drawing some circles to fill in visible gaps/segments in the
    // line that Phaser is rendering when the path curves.
    if (this.ball.thrown) {
      this.trail.fillStyle(this.color)
      for (let index = 0; index < this.points.length; ++index) {
        let point = this.points[index]
        this.trail.fillCircle(point.x, point.y, 7 * point.time)
      }
    }

    const timeDecay = Phaser.Math.Linear(TRAIL_DECAY_RATE.max, TRAIL_DECAY_RATE.min, this.trailLength)

    for (let index = 0; index < this.points.length; ++index) {
      let point = this.points[index]

      point.time -= timeDecay
      if (point.time <= 0) {
        this.points.splice(index, 1)
        index -= 1
      }
    }
  }

  stop() {
    this.emitter.stop()
  }
}

class TrailPoint {
  constructor(x, y, time) {
    this.x = x
    this.y = y
    this.time = time
  }
}
