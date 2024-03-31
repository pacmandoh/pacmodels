// types
import type { Models } from '../types'

export const useSelectModel = () => {
  const route = useRoute()
  const icons = useAppConfig().ui.icons

  const models: Models = {
    Engines: {
      Duramax: {
        cosModelName: 'duramaxDieselV8t-draco.glb',
        icon: icons.gm
      },
      AudiS8: {
        cosModelName: 'audiS8-draco.glb',
        cameraOffset: 90,
        icon: icons.audi
      },
      AudiR8: {
        cosModelName: 'audiR8-draco.glb',
        cameraLock: 'y',
        rotationAxis: 'y',
        icon: icons.audi,
        badge: '新'
      },
      AstonMartinV12: {
        cosModelName: 'astonMartinV12-draco.glb',
        cameraLock: 'y',
        rotationAxis: 'y',
        icon: icons.astonmartin,
        badge: '新'
      },
      BugattiW16: {
        cosModelName: 'bugattiW16-draco.glb',
        cameraLock: 'y',
        rotationAxis: 'y',
        lightIntensity: {
          dirFront: 0,
          spotFront: 1,
          dirTop: 3
        },
        icon: icons.bugatti
      },
      ChevroletCorvetteV8: {
        cosModelName: 'chevroletCorvetteV8-draco.glb',
        icon: icons.chevrolet
      },
      CumminsX15Truck: {
        cosModelName: 'cumminsX15Truck-draco.glb'
      },
      DodgeChallengerV8: {
        cosModelName: 'dodgeChallengerV8-draco.glb',
        icon: icons.dodge
      },
      DodgeMagnumV10: {
        cosModelName: 'dodgeMagnumV10-draco.glb',
        icon: icons.dodge,
        badge: '新'
      },
      FordMotorEngine: {
        cosModelName: 'fordMotorEngine-draco.glb',
        cameraLock: 'y',
        lightIntensity: {
          dirFront: 0,
          dirTop: 2,
          dirBottom: 2
        },
        rotationAxis: 'y',
        icon: icons.ford
      },
      IndustrialDiesel: {
        cosModelName: 'industrialDiesel-draco.glb',
        icon: icons.gm
      },
      MarinePropulsion: {
        cosModelName: 'marinePropulsion-draco.glb',
        badge: '新'
      },
      NissanAltimaHybrid4Cylinder: {
        cosModelName: 'nissanAltimaHybrid4Cylinder-draco.glb',
        icon: icons.nissan
      },
      CarEngine1: {
        cosModelName: 'carEngine1-draco.glb'
      },
      CarEngine2: {
        cosModelName: 'carEngine2-draco.glb'
      },
      CarEngine3: {
        cosModelName: 'carEngine3-draco.glb',
        lightIntensity: {
          dirFront: 3,
          spotFront: 0,
          dirBottom: 3
        }
      },
      V12CarEngine: {
        cosModelName: 'v12CarEngine-draco.glb'
      },
      V8CarEngine: {
        cosModelName: 'v8CarEngine-draco.glb'
      }
    },
    Automobiles: {
      Batmobile: {
        cosModelName: 'batmobile-draco.glb',
        cameraOffset: 360,
        rotationAxis: 'y',
        cameraLock: 'y',
        icon: icons.batman,
        badge: '新'
      },
      DefenderWorksV8: {
        cosModelName: 'defenderWorksV8-draco.glb',
        rotationAxis: 'y',
        cameraLock: 'y',
        cameraOffset: 4000,
        icon: icons.landrover,
        badge: '新'
      },
      Defender90Prep: {
        cosModelName: 'defender90Prep-draco.glb',
        rotationAxis: 'y',
        cameraLock: 'y',
        cameraOffset: 4,
        cameraPosition: {
          y: 1
        },
        icon: icons.landrover,
        badge: '新'
      },
      Defender90V8: {
        cosModelName: 'defender90V8-draco.glb',
        cameraLock: 'y',
        rotationAxis: 'y',
        cameraOffset: 3800,
        icon: icons.landrover,
        badge: '新'
      },
      RangeRover: {
        cosModelName: 'rangeRoverTd6HSE-draco.glb',
        rotationAxis: 'y',
        cameraLock: 'y',
        cameraOffset: 410,
        icon: icons.landrover,
        badge: '新'
      }
    },
    Misc: {
      NASAShuttleLaunchPad: {
        cosModelName: 'NASAShuttleLaunchPad-draco.glb',
        cameraOffset: 3600,
        cameraPosition: {
          z: 0
        },
        icon: 'i-ph-rocket-launch-duotone',
        badge: '新'
      },
      PacmanArcadePocket: {
        cosModelName: 'pacmanArcadePocket-draco.glb',
        icon: 'i-ph-game-controller-duotone',
        badge: '新'
      }
    }
  }

  const getGroupName = (modelName: string): any => {
    for (const group in models) {
      if (models[group][modelName]) {
        return group
      }
    }
    return null
  }

  const selectedGroup = models[getGroupName(route.query.model?.toString() as string)] || models.Engines
  const selectedModel = selectedGroup[route.query.model?.toString() as string] || selectedGroup.Duramax
  const needBottomButton = route.query.button ? (route.query.button?.toString().toLowerCase() === 'true') : true
  const needZoom = route.query.zoom ? (route.query.zoom?.toString().toLowerCase() === 'true') : true

  return { selectedGroup, selectedModel, models, needBottomButton, needZoom }
}
