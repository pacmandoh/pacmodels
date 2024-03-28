export interface Model {
  cosModelName: string,
  cameraOffset: number,
  cameraPosition?: [number, number, number],
  cameraLock?: [number, number, number],
  lightIntensity?: [number, number, number, number],
  rotationAxis?: string
}

export interface Models {
  [key: string]: Model;
}
