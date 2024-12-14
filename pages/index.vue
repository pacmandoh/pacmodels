<template>
  <ClientOnly>
    <div v-if="!ready && progress !== 100" class="sk-cube-grid">
      <div class="sk-cube sk-cube-1" />
      <div class="sk-cube sk-cube-2" />
      <div class="sk-cube sk-cube-3" />
      <div class="sk-cube sk-cube-4" />
      <div class="sk-cube sk-cube-5" />
      <div class="sk-cube sk-cube-6" />
      <div class="sk-cube sk-cube-7" />
      <div class="sk-cube sk-cube-8" />
      <div class="sk-cube sk-cube-9" />
      <UMeter
        v-if="progress !== 100"
        :value="progress"
        label="模型请求中..."
        icon="i-heroicons-globe-asia-australia-solid"
        indicator
      />
    </div>
    <div v-if="!ready && progress === 100" class="absolute m-auto top-0 bottom-0 left-0 right-0 h-[9rem] w-[9rem] flex items-center">
      <UProgress
        :max="['模型解包中...']"
        animation="carousel"
        class="px-2 pt-3 pb-3"
        color="orange"
        indicator
      >
        <template #step-0="{ step }">
          <span class="text-orange-500 flex items-center justify-center gap-1">
            <UIcon name="i-ph-code-duotone" /> {{ step }}
          </span>
        </template>
      </UProgress>
    </div>
    <div class="overflow-hidden h-full w-full bg-transparent">
      <canvas id="pacdocs-engine" ref="el" :style="{ display: ready ? 'block' : 'none' }" />
    </div>
    <div v-if="!routeParams.nobutton" class="absolute bottom-2 right-2">
      <div class="flex flex-row gap-0">
        <UTooltip text="GitHub">
          <UButton
            color="gray"
            size="lg"
            icon="i-simple-icons-github"
            variant="ghost"
            to="https://github.com/pacmandoh/pacmodels"
            target="_blank"
            :ui="{ rounded: 'rounded-full' }"
          />
        </UTooltip>

        <UTooltip text="全屏">
          <UButton
            color="gray"
            size="lg"
            icon="i-ph-arrows-out-bold"
            variant="ghost"
            :ui="{ rounded: 'rounded-full' }"
            @click="toggle"
          />
        </UTooltip>

        <UTooltip :text="colorMode.preference === 'dark' ? '切换日间模式' : '切换暗色模式'">
          <UButton
            color="gray"
            size="lg"
            variant="ghost"
            :icon="colorMode.preference == 'light' ? 'i-ph-sun-duotone' : 'i-ph-moon-duotone'"
            :ui="{ rounded: 'rounded-full' }"
            @click="toggleColorMode"
          />
        </UTooltip>

        <UTooltip text="模型列表">
          <UButton
            variant="ghost"
            color="gray"
            icon="i-ph-list-bullets-duotone"
            size="lg"
            :ui="{ rounded: 'rounded-full' }"
            @click="isOpen = true"
          />
        </UTooltip>
        <USlideover
          v-model="isOpen"
          side="left"
          :ui="{ width: 'w-screen max-w-sm', base: 'relative flex-1 flex flex-col w-full focus:outline-none rounded-2xl' }"
          class="rounded-xl"
        >
          <UCard class="flex flex-col flex-1 overflow-y-auto" :ui="{ body: { base: 'flex-1 overflow-y-auto' }, ring: '', divide: 'divide-y divide-gray-200 dark:divide-gray-800' }">
            <template #header>
              <div class="flex justify-between">
                <div class="items-center justify-center flex flex-row gap-1">
                  <UIcon name="i-ph-magnet-duotone" class="bg-sky-500 dark:bg-sky-400" />
                  <h3>模型列表</h3>
                  <UBadge :label="`v${runtimeConfig.public.version}`" variant="subtle" />
                </div>
                <UButton variant="ghost" icon="i-heroicons-x-mark-20-solid" color="gray" @click="isOpen = false" />
              </div>
            </template>

            <NavigationAccordion :links="links" :default-open="false" />

            <template #footer>
              <div class="flex justify-center items-center gap-1 text-sm">
                <UIcon name="i-simple-icons-nuxtdotjs" /> Copyright <UIcon name="i-ph-copyright-duotone" /> {{ new Date().getFullYear() }} PacmanDoh
              </div>
            </template>
          </UCard>
        </USlideover>
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
import type { LightConfig, Vector3Map, RotationAxisMap } from '~/types'

const title = 'PacModels: 3D Models by three.js'
const description = '3D Models for PacDocs by three.js'
useSeoMeta({
  title,
  ogTitle: title,
  description: description,
  ogDescription: description
})

const route = useRoute()
const isOpen = ref(false)
defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [isOpen],
    handler: () => { isOpen.value = false }
  }
})
const runtimeConfig = useRuntimeConfig()
const { selectedGroup, selectedModel } = useSelectModel()
const { routeParams } = useRouteParams()
console.groupCollapsed('[route.params | 路由参数信息]:')
console.log('➜ [route.params.nobutton]: ', routeParams.nobutton)
console.log('➜ [route.params.nozoom]: ', routeParams.nozoom)
console.log('➜ [route.params.noshadow]: ', routeParams.noshadow)
console.groupEnd()
const { links } = useNavigation()
const el = ref<HTMLElement | null>(null)
const { toggle } = useFullscreen(el)
const colorMode = useColorMode()
const toggleColorMode = () => {
  colorMode.preference = colorMode.preference == 'light'
    ? 'dark'
    : 'light'
}
const BASE = 'https://assets.pacdocs.cn/model/'
const MODEL = selectedModel.cosModelName
const resTracker = new ResourceTracker()
const track = resTracker.track.bind(resTracker)
const progress = ref<number>()
const { width, height } = useWindowSize()
const sizes = computed(() => {
  return { width: width.value, height: height.value }
})
const ready = ref(false)
const modelShadow = selectedModel.shadow || true

let clearScene: () => void
let updateSizes: () => void

const renderModel = async (): Promise<void> => {
  let cameraOffset: number
  if (selectedModel.cameraOffset) cameraOffset = selectedModel.cameraOffset
  const { width: sWidth, height: sHeight } = sizes.value

  // Basic
  const canvas = document.querySelector<HTMLCanvasElement>('canvas#pacdocs-engine')!
  const scene = track(new Three.Scene())
  const loader = track(new GLTFLoader())

  // Compress Descode
  const dracoLoader = track(new DRACOLoader())
  dracoLoader.setDecoderPath('./draco/')
  loader.setDRACOLoader(dracoLoader)
  // MeshOpt
  // loader.setMeshoptDecoder(MeshoptDecoder)

  // Renderer
  const renderer = track(new Three.WebGLRenderer({
    alpha: false,
    antialias: true,
    canvas,
    logarithmicDepthBuffer: true
  }))
  renderer.setClearColor(0x000000, 0)
  if (!routeParams.noshadow && modelShadow) {
    renderer.shadowMap.enabled = !routeParams.noshadow && modelShadow
    renderer.shadowMap.type = Three.PCFSoftShadowMap
  }
  renderer.setSize(sWidth, sHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const clock = track(new Three.Clock())

  // Main
  await Promise.all([
    new Promise<void>(reslove =>
      loader.load(BASE + MODEL, (gltf: { scene: Three.Object3D }) => {
        const model = track(gltf.scene)
        model.traverse((child: Three.Mesh) => {
          if (child.material instanceof Three.MeshStandardMaterial) {
            child.material.depthTest = true
            child.material.depthWrite = true
            child.material.side = 0
            if (!routeParams.noshadow && modelShadow) child.material.shadowSide = Three.BackSide
            if (child.material.opacity !== 1) child.material.depthWrite = false
          }
          if (!routeParams.noshadow && modelShadow) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        // Computed
        const boundingBox = track(new Three.Box3().setFromObject(model))
        const center = track(new Three.Vector3())
        const size = track(new Three.Vector3())
        boundingBox.getSize(size)
        boundingBox.getCenter(center)
        // Offset model center to origin point
        const moveVector = track(new Three.Vector3(0, 0, 0).sub(center))
        model.position.add(moveVector)
        if (!cameraOffset) {
          cameraOffset = Math.max(size.x, size.y, size.z)
        }

        // Lights
        const lights: any = []
        const {
          ambient = 0,
          dirFront = !routeParams.noshadow && modelShadow ? 1 : 3,
          spotFront = 0,
          dirTop = !routeParams.noshadow && modelShadow ? 1 : 3,
          dirBottom = 1,
          spotShadow = 5
        } = selectedModel.lightIntensity || {}
        const rotationAxisMap: RotationAxisMap = {
          top: { x: track(new Three.Vector3(cameraOffset, 0, 0)), y: track(new Three.Vector3(0, cameraOffset, 0)), z: track(new Three.Vector3(0, 0, cameraOffset)) },
          bottom: { x: track(new Three.Vector3(-cameraOffset, 0, 0)), y: track(new Three.Vector3(0, -cameraOffset, 0)), z: track(new Three.Vector3(0, 0, -cameraOffset)) },
          spotShadowPosition: {
            x: track(new Three.Vector3(cameraOffset * 2, 0, cameraOffset)),
            y: track(new Three.Vector3(cameraOffset, cameraOffset * 2, 0)),
            z: track(new Three.Vector3(0, cameraOffset, cameraOffset * 2))
          }
        }
        const spotShadowLight = !routeParams.noshadow && modelShadow ? { type: 'SpotLight', intensity: spotShadow, angle: Math.PI * 0.2, decay: 0, label: 'castShadow', castShadow: true, position: rotationAxisMap.spotShadowPosition[selectedModel.rotationAxis as string || 'z'] } : undefined
        const lightConfig: LightConfig = [
          { type: 'AmbientLight', intensity: ambient },
          { type: 'DirectionalLight', intensity: dirFront, label: 'front' },
          { type: 'DirectionalLight', intensity: dirTop, position: rotationAxisMap.top[selectedModel.rotationAxis as string || 'z'] },
          { type: 'DirectionalLight', intensity: dirBottom, position: rotationAxisMap.bottom[selectedModel.rotationAxis as string || 'z'] },
          { type: 'SpotLight', intensity: spotFront, angle: Math.PI * 0.2, decay: 0, label: 'front' },
          spotShadowLight
        ]
        lightConfig.forEach((config) => {
          if (config) {
            if (config.intensity !== 0) {
              // @ts-expect-error missing types
              const light = track(new Three[config.type](0xffffff, config.intensity))
              if (config.position) {
                light.position.copy(config.position)
              }
              if (config.angle) {
                light.angle = config.angle
              }
              if (config.decay !== undefined) {
                light.decay = config.decay
              }
              if (config.label) {
                light.label = config.label
              }
              if (config.castShadow) {
                light.castShadow = true
                light.shadow.mapSize.width = 1024
                light.shadow.mapSize.height = 1024
                light.shadow.camera.bottom = -cameraOffset
                light.shadow.camera.top = cameraOffset
                light.shadow.camera.right = cameraOffset
                light.shadow.camera.left = -cameraOffset
                light.shadow.camera.far = cameraOffset * 100
                light.shadow.camera.near = cameraOffset / 100
                light.shadow.camera.castShadow = true
              // scene.add(new Three.CameraHelper(light.shadow.camera))
              }
              lights.push(light)
            }
          }
        })
        lights.forEach((light: any) => {
          if (!light.castShadow) scene.add(light)
        })

        // Camera
        const camera = track(new Three.PerspectiveCamera(45, sWidth / sHeight, cameraOffset / 100, cameraOffset * 100))
        const cameraLock = selectedModel.cameraLock || 'z'
        const cameraLockMap: Vector3Map = {
          x: track(new Three.Vector3(1, 0, 0)),
          y: track(new Three.Vector3(0, 1, 0)),
          z: track(new Three.Vector3(0, 0, 1))
        }
        camera.up.copy(cameraLockMap[cameraLock])
        const { x = cameraOffset, y = cameraOffset, z = cameraOffset } = selectedModel.cameraPosition || {}
        const cameraPositionClass = track(new Three.Vector3(x, y, z))
        camera.position.copy(cameraPositionClass)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()

        // Controls
        const controls = track(new OrbitControls(camera, canvas))
        controls.enableZoom = !routeParams.nozoom
        controls.enableDamping = true
        controls.enablePan = false
        // Lock Y Axis
        // controls.minPolarAngle = Math.PI / 2
        // controls.maxPolarAngle = Math.PI / 2

        // Helper
        // const axisHelper = new Three.AxesHelper(3000)
        // scene.add(axisHelper)

        // Container
        const container = track(new Three.Group())
        container.add(model)
        scene.add(container)
        container.position.set(0, 0, 0)
        let lightHolder: Three.Group
        if (!routeParams.noshadow && modelShadow) {
          lightHolder = track(new Three.Group())
          lights.forEach((light: any) => {
            if (light.castShadow) lightHolder.add(light)
          })
          scene.add(lightHolder)
        }

        // Render & Animation
        const tick = (): void => {
          const elapsedTime = clock.getElapsedTime()
          if (selectedModel.rotationAxis) {
            if (selectedModel.rotationAxis === 'x') container.rotation.x = 0.5 * elapsedTime
            if (selectedModel.rotationAxis === 'y') container.rotation.y = 0.5 * elapsedTime
          }
          else {
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
          lights.map((light: any) => {
            if (light.label === 'front') {
              light.position.copy(cameraPosition)
            }
          })
          if (lightHolder) lightHolder.quaternion.copy(camera.quaternion)
        }

        // Adapting function
        updateSizes = (): void => {
          renderer.setSize(width.value, height.value)
          camera.aspect = width.value / height.value
          camera.updateProjectionMatrix()
        }

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

        console.groupCollapsed('[model.info | 模型信息]:')
        console.log('➜ [cameraOffset]: ', cameraOffset)
        console.log('➜ [scene.light]: ', lights)
        console.log('➜ [modelShadow]: ', modelShadow)
        console.groupEnd()

        tick()
        reslove()
      }, (xhr: any) => {
        progress.value = xhr.loaded / xhr.total * 100
      })
    )
  ])
  ready.value = true
}

onMounted(() =>
  Promise.all([]).then(() => {
    void renderModel()
    watch(ready, () => {
      if (ready.value) watch(sizes, () => updateSizes())
    })
  })
)

onMounted(() => {
  // notification
  const toast = useToast()
  if (route.query.model) {
    if (!selectedGroup[route.query.model?.toString() as string]) {
      toast.add({
        id: 'error',
        title: '模型不存在!',
        description: '您通过参数来展示的模型不存在，故显示默认的模型。',
        icon: 'i-ph-seal-warning-duotone',
        color: 'red',
        timeout: 20000,
        actions: [{
          label: '查看参数 ➜',
          to: 'https://github.com/pacmandoh/pacmodels/blob/main/README.md',
          target: '_blank'
        }]
      })
    }
  }
})

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
  width: 9em;
  height: 9em;
}
.sk-cube {
  width: 33%;
  height: 33%;
  float: left;
  animation: sk-cube-grid-scale-delay 1.3s infinite ease-in-out;
  @apply bg-primary-500 dark:bg-primary-400
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
