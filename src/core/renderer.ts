import { WebGLRenderer, Scene, SRGBColorSpace, PCFShadowMap, ACESFilmicToneMapping } from 'three'
import { gui } from './gui'

export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Scene
export const scene = new Scene()
// scene.background = new Color('#333')

const canvas: HTMLElement = document.querySelector('#webgl') as HTMLElement

// Renderer
export const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})

// More realistic shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFShadowMap
renderer.outputColorSpace = SRGBColorSpace
renderer.toneMapping = ACESFilmicToneMapping
renderer.toneMappingExposure = 1

function updateRenderer() {
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // To avoid performance problems on devices with higher pixel ratio
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  updateRenderer()
})

updateRenderer()

export default {
  renderer,
  gui,
}
