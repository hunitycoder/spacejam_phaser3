// Electron/NodeJS has 'global' but browser has 'window'
let globalObj
try {
  globalObj = window // Browser
} catch (e) {
  globalObj = global // Node/Electron
}

(function (global) {
  global.appConfig = {
    appId: 'spacejam-gamedesigner',
    appName: 'Spacejam GameDesigner',
    analyticsId: 'TBD',
    game: {
      world: {
        width: 2800,
        height: 2800,
      },
      canvas: {
        width: 826,
        height: 826,
      },
    },
    dev: {
      debugPhysics: false,
      showTools: false,
      hideCursor: false,
      specialKeys: false, // Special keys for developer testing
      notifyPhaserEvents: false,
      notifyStepChanges: false,
    },
  }
})(globalObj)
