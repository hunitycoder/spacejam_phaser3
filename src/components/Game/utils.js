export function calculateObstacleCounts(params, totalObstacleSpots) {
  const tntFreq = params.obstacles.tnt.freq
  const goopFreq = params.obstacles.goop.freq
  const maceFreq = params.obstacles.mace.freq

  // const speedFreq = params.obstacles.speed.freq
  // const magicFreq = params.obstacles.magic.freq
  // const gravityFreq = params.obstacles.gravity.freq

  const speedFreq = 0.1
  const magicFreq = 0.1
  const gravityFreq = 0.1

  const maximumFreq = Math.max(tntFreq, goopFreq, maceFreq)
  const totalFreq = tntFreq + goopFreq + maceFreq
  const tntRatio = tntFreq / totalFreq
  const goopRatio = goopFreq / totalFreq

  const speedRatio = speedFreq / totalFreq
  const magicRatio = magicFreq / totalFreq
  const gravityRatio = gravityFreq / totalFreq

  const adjustedObstacleSpots = Math.round(totalObstacleSpots * maximumFreq)
  const tntCount = Math.round(adjustedObstacleSpots * tntRatio)
  const goopCount = Math.round(adjustedObstacleSpots * goopRatio)
  const maceCount = adjustedObstacleSpots - tntCount - goopCount

  const speedCount = Math.round(adjustedObstacleSpots * speedRatio)
  const magicCount = Math.round(adjustedObstacleSpots * magicRatio)
  const gravityCount = Math.round(adjustedObstacleSpots * gravityRatio)

  // console.log(`for a level with ${totalObstacleSpots} obstacle spots,`)
  // console.log(`there should be ${adjustedObstacleSpots} spots filled with`)
  // console.log(`tnt: ${tntCount}, goop: ${goopCount}, mace: ${maceCount}`)

  return {
    totalCount: adjustedObstacleSpots,
    tntCount: tntCount,
    goopCount: goopCount,
    maceCount: maceCount,
    speedCount: speedCount,
    magicCount: magicCount,
    gravityCount: gravityCount,
  }
}

export function lerp(v0, v1, t) {
  return v0 + (v1 - v0) * t
}