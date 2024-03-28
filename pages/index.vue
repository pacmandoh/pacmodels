<template>
  <ClientOnly>
    <div v-if="!ready" class="sk-cube-grid">
      <div class="sk-cube sk-cube-1" />
      <div class="sk-cube sk-cube-2" />
      <div class="sk-cube sk-cube-3" />
      <div class="sk-cube sk-cube-4" />
      <div class="sk-cube sk-cube-5" />
      <div class="sk-cube sk-cube-6" />
      <div class="sk-cube sk-cube-7" />
      <div class="sk-cube sk-cube-8" />
      <div class="sk-cube sk-cube-9" />
      <UMeter :value="progress" label="模型加载中..." icon="i-heroicons-globe-asia-australia-solid" indicator />
    </div>
    <div v-if="needDropdown" class="absolute top-4 left-4">
      <UDropdown
        :items="dropdownItems"
        :popper="{ placement: 'right-start' }"
        :ui="{
          container: 'mt-8',
          background: 'bg-white dark:bg-gray-950',
          item: { padding: 'gap-x-2.5 py-2.5', inactive: 'dark:bg-gray-950' },
        }"
      >
        <UButton color="white" label="引擎选择" size="lg" icon="i-heroicons-chevron-down-16-solid" variant="solid" />
      </UDropdown>
    </div>
    <div class="overflow-hidden h-full w-full bg-transparent">
      <canvas id="pacdocs-engine" ref="el" :style="{ display: ready ? 'block' : 'none' }" />
    </div>
    <div v-if="needBottomButton" class="absolute bottom-4 right-4">
      <div class="flex flex-row gap-0">
        <UButton color="gray" size="lg" icon="i-ph-arrows-out-bold" variant="ghost" @click="toggle" />
        <UButton
          color="gray"
          size="lg"
          variant="ghost"
          :icon="colorMode.preference == 'light' ? 'i-ph-sun-duotone' : 'i-ph-moon-duotone'"
          @click="toggleColorMode"
        />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import ResourceTracker from '../composables/useTrack'

const title = 'PacDocs: 3D Models by three.js'
const description = '3D Models for PacDocs by three.js'
useSeoMeta({
  title,
  ogTitle: title,
  description: description,
  ogDescription: description
})

const { selectedModel, needDropdown, needBottomButton } = useSelectModel()
const { dropdownItems } = useDropdown()
const el = ref<HTMLElement | null>(null)
const { toggle } = useFullscreen(el)
const colorMode = useColorMode()
const toggleColorMode = () => {
  colorMode.preference = colorMode.preference == 'light'
    ? 'dark'
    : 'light'
}
const BASE = 'https://imgbucket-1318471229.cos.ap-beijing.myqcloud.com/model/'
const MODEL = selectedModel.cosModelName
const resTracker = new ResourceTracker()
const track = resTracker.track.bind(resTracker)
const progress = ref<number>()
const { width, height } = useWindowSize()
const sizes = computed(() => {
  return { width: width.value, height: height.value }
})
const ready = ref(false)

let clearScene: () => void
let updateSizes: () => void

const renderModel = async (): Promise<void> => {
  const cameraOffset = selectedModel.cameraOffset
  const { width: sWidth, height: sHeight } = sizes.value
  const canvas = document.querySelector<HTMLCanvasElement>('canvas#pacdocs-engine')!

  const scene = track(new Three.Scene())
  const loader = track(new GLTFLoader())

  // Compress Descode
  const dracoLoader = track(new DRACOLoader())
  dracoLoader.setDecoderPath('./draco/')
  loader.setDRACOLoader(dracoLoader)
  // MeshOpt
  // loader.setMeshoptDecoder(MeshoptDecoder)

  // Lights
  let directionalLightFront: Three.DirectionalLight, spotLightFront: Three.SpotLight
  const lightIntensity = selectedModel.lightIntensity ? selectedModel.lightIntensity : { ambient: 0, dirFront: 1, spotFront: 0, dirTop: 3, dirBottom: 1 }
  // ambient
  if (lightIntensity.ambient !== 0) {
    const ambientLight = track(new Three.AmbientLight(0xffffff, lightIntensity.ambient))
    scene.add(ambientLight)
  }
  // dirFront
  if (lightIntensity.dirFront !== 0) {
    directionalLightFront = track(new Three.DirectionalLight(0xffffff, lightIntensity.dirFront))
    scene.add(directionalLightFront)
  }
  // dirTop
  if (lightIntensity.dirTop !== 0) {
    const directionalLightTop = track(new Three.DirectionalLight(0xffffff, lightIntensity.dirTop))
    scene.add(directionalLightTop)
    if (selectedModel.rotationAxis) {
      if (selectedModel.rotationAxis === 'x') directionalLightTop.position.set(cameraOffset, 0, 0)
      if (selectedModel.rotationAxis === 'y') directionalLightTop.position.set(0, cameraOffset, 0)
    } else {
      directionalLightTop.position.set(0, 0, cameraOffset)
    }
  }
  // dirBottom
  if (lightIntensity.dirBottom !== 0) {
    const directionalLightBottom = track(new Three.DirectionalLight(0xffffff, lightIntensity.dirBottom))
    scene.add(directionalLightBottom)
    if (selectedModel.rotationAxis) {
      if (selectedModel.rotationAxis === 'x') directionalLightBottom.position.set(-cameraOffset, 0, 0)
      if (selectedModel.rotationAxis === 'y') directionalLightBottom.position.set(0, -cameraOffset, 0)
    } else {
      directionalLightBottom.position.set(0, 0, -cameraOffset)
    }
  }
  // spotFront
  if (lightIntensity.spotFront !== 0) {
    spotLightFront = track(new Three.SpotLight(0xffffff, lightIntensity.spotFront))
    spotLightFront.angle = Math.PI * 0.2
    spotLightFront.decay = 0
    scene.add(spotLightFront)
  }

  // Base camera
  const camera = track(new Three.PerspectiveCamera(45, sWidth / sHeight, 1, 1000))
  const cameraLock = selectedModel.cameraLock || { x: 0, y: 0, z: 1 }
  camera.up.set(cameraLock.x, cameraLock.y, cameraLock.z) // lock axis toward up
  const cameraPositionClass = selectedModel.cameraPosition || { x: cameraOffset, y: cameraOffset, z: cameraOffset }
  const cameraPosition = track(new Three.Vector3(cameraPositionClass.x, cameraPositionClass.y, cameraPositionClass.z))
  camera.position.copy(cameraPosition)
  camera.lookAt(0, 0, 0)

  // Base Controls
  const controls = track(new OrbitControls(camera, canvas))
  controls.enableZoom = false
  controls.enableDamping = true
  controls.enablePan = false
  // Lock Y Axis
  // controls.minPolarAngle = Math.PI / 2
  // controls.maxPolarAngle = Math.PI / 2

  // Renderer
  const renderer = track(new Three.WebGLRenderer({
    alpha: false,
    antialias: true,
    canvas
  }))
  renderer.setClearColor(0x000000, 0)
  renderer.shadowMap.enabled = true // enable shadow
  renderer.shadowMap.type = Three.PCFSoftShadowMap
  renderer.setSize(sWidth, sHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const clock = track(new Three.Clock())

  // Main
  await Promise.all([
    new Promise<void>((reslove) =>
      loader.load(BASE + MODEL, (gltf: { scene: Three.Object3D }) => {
        const model = gltf.scene
        track(gltf.scene)
        model.traverse((child: Three.Object3D) => {
          if (child instanceof Three.Mesh) {
            if (child.material instanceof Three.MeshStandardMaterial) {
              const material = track(new Three.MeshStandardMaterial({
                color: child.material.color,
                metalness: child.material.metalness,
                roughness: child.material.roughness,
                displacementScale: child.material.displacementScale,
                emissive: child.material.emissive,
                emissiveIntensity: child.material.emissiveIntensity,
                alphaTest: child.material.alphaTest
              }))
              child.material = material
              material.dispose()
            }
          }
        })
        model.castShadow = true
        model.receiveShadow = true
        // Computed model center point
        const boundingBox = track(new Three.Box3().setFromObject(model))
        const center = track(new Three.Vector3())
        const size = track(new Three.Vector3())
        boundingBox.getSize(size)
        boundingBox.getCenter(center)
        // Offset model center to origin point
        const moveVector = track(new Three.Vector3(0, 0, 0).sub(center))
        model.position.add(moveVector)
        // Add model to scene
        if (!scene.getObjectByName('modelName')) {
          scene.add(model)
        }

        // Helper
        // const axisHelper = new Three.AxesHelper(1000)
        // scene.add(axisHelper)

        // Container
        const container = track(new Three.Group())
        container.add(model)
        scene.add(container)
        container.position.set(0, 0, 0)

        // Render & Animation
        const tick = (): void => {
          const elapsedTime = clock.getElapsedTime()
          if (selectedModel.rotationAxis) {
            if (selectedModel.rotationAxis === 'x') container.rotation.x = 0.5 * elapsedTime
            if (selectedModel.rotationAxis === 'y') container.rotation.y = 0.5 * elapsedTime
          } else {
            container.rotation.z = 0.5 * elapsedTime
          }
          // Update controls
          controls.update()
          // Render
          renderer.render(scene, camera)
          // Call tick again on the next frame
          window.requestAnimationFrame(tick)
          // Get animated camera position
          const cameraPosition = camera.position.clone()
          if (lightIntensity.dirFront !== 0) directionalLightFront.position.copy(cameraPosition)
          if (lightIntensity.spotFront !== 0) spotLightFront.position.copy(cameraPosition)
        }

        // Adapting function
        updateSizes = (): void => {
          renderer.setSize(width.value, height.value)
          camera.aspect = width.value / height.value
          camera.updateProjectionMatrix()
        }

        tick()
        reslove()
      }, (xhr: any) => {
        progress.value = xhr.loaded / xhr.total * 100
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
    watch(ready, () => { if (ready.value) watch(sizes, () => updateSizes()) })
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
