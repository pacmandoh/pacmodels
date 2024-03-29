// types
import type { Models } from '../types'

export const useSelectModel = () => {
  const route = useRoute()

  const models: Models = {
    Engine: {
      Duramax: {
        cosModelName: 'duramaxDieselV8t-draco.glb',
        cameraOffset: 300
      },
      AudiS8: {
        cosModelName: 'audiS8-draco.glb',
        cameraOffset: 90
      },
      CarEngine1: {
        cosModelName: 'carEngine1-draco.glb',
        cameraOffset: 270
      },
      CarEngine2: {
        cosModelName: 'carEngine2-draco.glb',
        cameraOffset: 300
      },
      CarEngine3: {
        cosModelName: 'carEngine3-draco.glb',
        cameraOffset: 80,
        lightIntensity: {
          ambient: 0,
          dirFront: 3,
          spotFront: 0,
          dirTop: 3,
          dirBottom: 3
        }
      },
      BugattiW16: {
        cosModelName: 'bugattiW16-draco.glb',
        cameraOffset: 1.3,
        cameraLock: { x: 0, y: 1, z: 0 },
        rotationAxis: 'y',
        lightIntensity: {
          ambient: 0,
          dirFront: 0,
          spotFront: 1,
          dirTop: 1,
          dirBottom: 1
        }
      },
      ChevroletCorvetteV8: {
        cosModelName: 'chevroletCorvetteV8-draco.glb',
        cameraOffset: 120
      },
      CumminsX15Truck: {
        cosModelName: 'cumminsX15Truck-draco.glb',
        cameraOffset: 380
      },
      DodgeChallengerV8: {
        cosModelName: 'dodgeChallengerV8-draco.glb',
        cameraOffset: 410
      },
      FordMotorEngine: {
        cosModelName: 'fordMotorEngine-draco.glb',
        cameraOffset: 20,
        cameraLock: { x: 0, y: 1, z: 0 },
        lightIntensity: {
          ambient: 0,
          dirFront: 0,
          spotFront: 0,
          dirTop: 2,
          dirBottom: 2
        },
        rotationAxis: 'y'
      },
      IndustrialDiesel: {
        cosModelName: 'industrialDiesel-draco.glb',
        cameraOffset: 250
      },
      NissanAltimaHybrid4Cylinder: {
        cosModelName: 'nissanAltimaHybrid4Cylinder-draco.glb',
        cameraOffset: 90
      },
      V12CarEngine: {
        cosModelName: 'v12CarEngine-draco.glb',
        cameraOffset: 120
      },
      V8CarEngine: {
        cosModelName: 'v8CarEngine-draco.glb',
        cameraOffset: 60
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

  const selectedGroup = models[getGroupName(route.query.model?.toString() as string)] || models.Engine
  const selectedModel = selectedGroup[route.query.model?.toString() as string] || selectedGroup.Duramax
  const needNavigation = route.query.navigation ? (route.query.navigation?.toString().toLowerCase() === 'true') : true
  const needBottomButton = route.query.button ? (route.query.button?.toString().toLowerCase() === 'true') : true

  return { selectedGroup, selectedModel, models, needNavigation, needBottomButton }
}
