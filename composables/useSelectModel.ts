// types
import type { Models } from '../types/index'

export const useSelectModel = () => {
  const route = useRoute()

  const models: Models = {
    duramax: {
      cosModelName: 'duramaxDieselV8t-draco.glb',
      cameraOffset: 300
    },
    audiS8: {
      cosModelName: 'audiS8-draco.glb',
      cameraOffset: 90
    },
    carEngine1: {
      cosModelName: 'carEngine1-draco.glb',
      cameraOffset: 270
    },
    carEngine2: {
      cosModelName: 'carEngine2-draco.glb',
      cameraOffset: 300
    },
    carEngine3: {
      cosModelName: 'carEngine3-draco.glb',
      cameraOffset: 80,
      lightIntensity: [0, 3, 3, 3]
    },
    bugattiW16: {
      cosModelName: 'bugattiW16-draco.glb',
      cameraOffset: 2,
      cameraLock: [0, 1, 0],
      rotationAxis: 'y'
    },
    chevroletCorvetteV8: {
      cosModelName: 'chevroletCorvetteV8-draco.glb',
      cameraOffset: 120
    },
    cumminsX15Truck: {
      cosModelName: 'cumminsX15Truck-draco.glb',
      cameraOffset: 380
    },
    dodgeChallengerV8: {
      cosModelName: 'dodgeChallengerV8-draco.glb',
      cameraOffset: 410
    },
    fordMotorEngine: {
      cosModelName: 'fordMotorEngine-draco.glb',
      cameraOffset: 20,
      cameraLock: [0, 1, 0],
      lightIntensity: [0, 0, 2, 2],
      rotationAxis: 'y'
    },
    industrialDiesel: {
      cosModelName: 'industrialDiesel-draco.glb',
      cameraOffset: 250
    },
    nissanAltimaHybrid4Cylinder: {
      cosModelName: 'nissanAltimaHybrid4Cylinder-draco.glb',
      cameraOffset: 90
    },
    v12CarEngine: {
      cosModelName: 'v12CarEngine-draco.glb',
      cameraOffset: 120
    },
    v8CarEngine: {
      cosModelName: 'v8CarEngine-draco.glb',
      cameraOffset: 60
    }
  }
  const selectedModel = models[route.query.model as string] || models.duramax
  const needDropdown = route.query.needDropdown ? (route.query.needDropdown === 'true') : true
  const needBottomButton = route.query.needBottomButton ? (route.query.needBottomButton === 'true') : true

  return { selectedModel, models, needDropdown, needBottomButton }
}
