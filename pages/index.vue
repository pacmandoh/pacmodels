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

const title = 'PacDocs: 3D Model of Engines'
const description = '3D Engines for PacDocs'
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
  const lightIntensity = selectedModel.lightIntensity ? selectedModel.lightIntensity : [0, 1, 3, 3]
  const ambientLight = track(new Three.AmbientLight(0xffffff, lightIntensity[0]))
  const directionalLightFront = track(new Three.DirectionalLight(0xffffff, lightIntensity[1]))
  const directionalLightTop = track(new Three.DirectionalLight(0xffffff, lightIntensity[2]))
  const directionalLightBottom = track(new Three.DirectionalLight(0xffffff, lightIntensity[3]))

  scene.add(ambientLight)
  scene.add(directionalLightFront)
  scene.add(directionalLightTop)
  scene.add(directionalLightBottom)

  // Base camera
  const camera = track(new Three.PerspectiveCamera(45, sWidth / sHeight, 1, 1000))
  const cameraLock = selectedModel.cameraLock || [0, 0, 1]
  camera.up.set(cameraLock[0], cameraLock[1], cameraLock[2]) // lock Z-axis toward up
  const cameraOffset = selectedModel.cameraOffset // camera height
  const cameraPositionArray = selectedModel.cameraPosition || [cameraOffset, cameraOffset, cameraOffset]
  const cameraPosition = track(new Three.Vector3(cameraPositionArray[0], cameraPositionArray[1], cameraPositionArray[2]))
  camera.position.copy(cameraPosition)
  camera.lookAt(0, 0, 0)

  if (selectedModel.rotationAxis) {
    if (selectedModel.rotationAxis === 'x') directionalLightTop.position.set(cameraOffset, 0, 0); directionalLightBottom.position.set(-cameraOffset, 0, 0)
    if (selectedModel.rotationAxis === 'y') directionalLightTop.position.set(0, cameraOffset, 0); directionalLightBottom.position.set(0, -cameraOffset, 0)
  } else {
    directionalLightTop.position.set(0, 0, cameraOffset)
    directionalLightBottom.position.set(0, 0, -cameraOffset)
  }

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
        model.castShadow = true // need object cast shadow
        model.receiveShadow = true // need object receive shadow

        // computed model center point
        const boundingBox = track(new Three.Box3().setFromObject(model))
        const center = track(new Three.Vector3())
        const size = track(new Three.Vector3())
        boundingBox.getSize(size)
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

        // Group
        // Solve the problem of rotation after the middle point of the mobile model to the origin.
        const container = track(new Three.Group())
        container.add(model)
        scene.add(container)
        container.position.set(0, 0, 0)

        // Render
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

          // get animated camera position
          const cameraPosition = camera.position.clone()
          directionalLightFront.position.copy(cameraPosition)
        }

        updateSizes = (): void => {
          renderer.setSize(width.value, height.value)
          camera.aspect = width.value / height.value
          camera.updateProjectionMatrix()
          renderer.render(scene, camera)
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
