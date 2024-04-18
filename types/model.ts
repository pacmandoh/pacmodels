export interface Model {
  cosModelName: string
  cameraOffset?: number
  cameraPosition?: { x?: number, y?: number, z?: number }
  cameraLock?: string
  lightIntensity?: {
    ambient?: number
    dirFront?: number
    spotFront?: number
    dirTop?: number
    dirBottom?: number
    spotShadow?: number
  }
  rotationAxis?: string
  icon?: string
  badge?: string
  shadow?: boolean
}

export interface Models {
  [key: string]: {
    [key: string]: Model
  }
}
