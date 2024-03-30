export interface Model {
  cosModelName: string,
  cameraOffset: number,
  cameraPosition?: { x: number, y: number, z: number },
  cameraLock?: { x: number, y: number, z: number },
  lightIntensity?: {
    ambient: number,
    dirFront: number,
    spotFront: number,
    dirTop: number,
    dirBottom: number
  },
  rotationAxis?: string
}

export interface Models {
  [key: string]: {
    [key: string]: Model
  }
}
