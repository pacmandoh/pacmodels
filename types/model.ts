import type { Vector3 } from 'three'

export interface Model {
  cosModelName: string,
  cameraOffset: number,
  cameraPosition?: [number, number, number],
  cameraLock?: [number, number, number],
  lightIntensity?: [number, number, number, number]
}

export interface Models {
  [key: string]: Model;
}
