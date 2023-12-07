<template>
  <ClientOnly>
    <div v-if="!ready" class="sk-cube-grid">
      <div class="sk-cube sk-cube-1"></div>
      <div class="sk-cube sk-cube-2"></div>
      <div class="sk-cube sk-cube-3"></div>
      <div class="sk-cube sk-cube-4"></div>
      <div class="sk-cube sk-cube-5"></div>
      <div class="sk-cube sk-cube-6"></div>
      <div class="sk-cube sk-cube-7"></div>
      <div class="sk-cube sk-cube-8"></div>
      <div class="sk-cube sk-cube-9"></div>
      <div class="text-gray-400 font-bold text-lg">模型加载中...</div>
    </div>
    <div ref="" class="overflow-hidden h-full w-full bg-transparent">
      <canvas id="pacdocs-engine" :style="{ display: ready ? 'block' : 'none' }" />
    </div>
  </ClientOnly>
</template>
  
<script setup lang="ts">

const title = 'PacDocs: 3D Model of Audi S8 TFSI Engine'
const description = '3D Audi S8 V8 TFSI Engine for PacDocs'
useSeoMeta({
  title,
  ogTitle: title,
  description: description,
  ogDescription: description,
})

import * as Three from 'three'
// interaction module
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// glb or gltf files loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// draco loader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// MesOpt zip
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

// ResourceTracker
import ResourceTracker from '../composables/useTrack'

const BASE = 'https://imgbucket-1318471229.cos.ap-beijing.myqcloud.com/model/'
const MODEL = 'audiS8-draco.glb'

const resTracker = new ResourceTracker()
const track = resTracker.track.bind(resTracker)

const { width, height } = useWindowSize()
const sizes = computed(() => {
  return { width: width.value, height: height.value }
})

const ready = ref(false)

let clearScene: () => void
let updateSizes: () => void

const renderModel = async (): Promise<void> => {
  // sizes
  const { width: sWidth, height: sHeight } = sizes.value

  // Canvas
  const canvas = document.querySelector<HTMLCanvasElement>('canvas#pacdocs-engine')!

  // Scene
  const scene = track(new Three.Scene())
  const loader = track(new GLTFLoader())

  const dracoLoader = track(new DRACOLoader())
  dracoLoader.setDecoderPath('./draco/')
  loader.setDRACOLoader(dracoLoader)

  // MeshOpt // FIX can not clear memory correct
  // loader.setMeshoptDecoder(MeshoptDecoder)

  // Lights
  const ambientLight = track(new Three.AmbientLight(
    0xffffff,
    4
  ))

  const directionalLightFront = track(new Three.DirectionalLight(0xffffff, 4))
  const directionalLightTop = track(new Three.DirectionalLight(0xffffff, 4))

  scene.add(directionalLightTop)
  scene.add(directionalLightFront)
  scene.add(ambientLight)

  // Base camera
  const camera = track(new Three.PerspectiveCamera(45, sWidth / sHeight, 1, 1000))
  camera.up.set(0, 0, 1) // lock Z-axis toward up
  const cameraOffset = 90 // camera height
  const cameraPosition = track(new Three.Vector3(cameraOffset, cameraOffset, cameraOffset))
  camera.position.copy(cameraPosition)
  camera.lookAt(0, 0, 0)

  directionalLightTop.position.set(0, 0, cameraOffset)

  // Base Controls
  const controls = track(new OrbitControls(camera, canvas))
  controls.enableZoom = false
  controls.enableDamping = true
  controls.enablePan = false
  // Lock Y Axis
  // controls.minPolarAngle = Math.PI / 2
  // controls.maxPolarAngle = Math.PI / 2

  // Render
  const renderer = track(new Three.WebGLRenderer({
    alpha: false,
    antialias: true,
    canvas
  }))
  // render background
  renderer.setClearColor(0x000000, 0)
  renderer.shadowMap.enabled = true // enable shadow
  renderer.shadowMap.type = Three.PCFSoftShadowMap
  renderer.setSize(sWidth, sHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // clock timer
  const clock = track(new Three.Clock())

  // render Model
  await Promise.all([
    new Promise<void>((reslove) =>
      loader.load(BASE + MODEL, (gltf: { scene: Three.Object3D }) => {
        const model = gltf.scene
        track(gltf.scene)
        //@ts-ignore
        model.traverse((child: Three.Mesh) => {
          if (child.isMesh) {
            const material = track(new Three.MeshPhysicalMaterial({
              color: (child.material as Three.MeshBasicMaterial).color,
              metalness: 1,
              roughness: 0.5,
              displacementScale: 0.9,
              emissiveIntensity: 0.4,
              reflectivity: 1
            }))
            child.material = material
            material.dispose()
          }
        })
        model.castShadow = true // need object cast shadow
        model.receiveShadow = true // need object receive shadow

        // computed model center point
        const boundingBox = track(new Three.Box3().setFromObject(model))
        const center = track(new Three.Vector3())
        boundingBox.getCenter(center)

        // offset model center to origin point
        const moveVector = track(new Three.Vector3(0, 0, 0).sub(center))
        model.position.add(moveVector)

        // add model to scene
        if (!scene.getObjectByName('modelName')) {
          scene.add(model)
        }

        // helper
        // const axisHelper = new Three.AxesHelper(1000)
        // scene.add(axisHelper)

        // Animations
        const tick = (): void => {
          const elapsedTime = clock.getElapsedTime()
          model.rotation.z = 0.5 * elapsedTime
          // Update controls
          controls.update()
          // Render
          renderer.render(scene, camera)
          // Call tick again on the next frame
          window.requestAnimationFrame(tick)

          // get animated camera position
          const cameraPosition = camera.position.clone()
          directionalLightFront.position.copy(cameraPosition);
        }

        updateSizes = (): void => {
          renderer.setSize(width.value, height.value)
          camera.aspect = width.value / height.value
          camera.updateProjectionMatrix()
          renderer.render(scene, camera)
        }

        tick()
        reslove()
      })
    )
  ])

  clearScene = () => {
    resTracker && resTracker.dispose()
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.content = null
    controls.dispose()
    const gl = renderer.domElement.getContext('webgl')
    gl && gl.getExtension('WEBGL_lose_context').loseContext()
    if (typeof window !== 'undefined' && typeof window.gc === 'function') {
      window.gc()
    }
  }
  ready.value = true
}

onMounted(() =>
  Promise.all([]).then(() => {
    void renderModel()
    watch(sizes, () => updateSizes())
  })
)

onBeforeUnmount(() => {
  clearScene()
})
</script>
  
<style lang="postcss" scoped>
.sk-cube-grid {
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 7em;
  height: 7em;
  margin: auto; 
}
.sk-cube {
  width: 33%;
  height: 33%;
  float: left;
  animation: sk-cube-grid-scale-delay 1.3s infinite ease-in-out;
  @apply bg-gray-400
}
.sk-cube-1 {
  animation-delay: 0.2s;
}
.sk-cube-2 {
  animation-delay: 0.3s;
}
.sk-cube-3 {
  animation-delay: 0.4s;
}
.sk-cube-4 {
  animation-delay: 0.1s;
}
.sk-cube-5 {
  animation-delay: 0.2s;
}
.sk-cube-6 {
  animation-delay: 0.3s;
}
.sk-cube-7 {
  animation-delay: 0s;
}
.sk-cube-8 {
  animation-delay: 0.1s;
}
.sk-cube-9 {
  animation-delay: 0.2s;
}
@keyframes sk-cube-grid-scale-delay {
  0%, 70%, 100% {
    transform: scale3D(1,1,1);
  }
  35%           {
    transform: scale3D(0,0,1);
  }
}
</style>
  