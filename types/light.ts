import type { Vector3 } from 'three'

export interface Vector3Map {
  [key: string]: Vector3
}

export interface RotationAxisMap {
  [key: string]: Vector3Map
}

export interface LightConfig extends Array<{
  type: string
  intensity: number
  position?: Vector3
  angle?: number
  decay?: number
  label?: string
  castShadow?: boolean
} | undefined> {}
