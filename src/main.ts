import * as THREE from 'three'
import { renderer, scene } from './core/renderer'
import { fpsGraph, gui } from './core/gui'
import camera from './core/camera'
import background from './core/background'
import { controls } from './core/orbit-control'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
// Shaders
// import vertexShader from './shaders/vertex.glsl'
// import fragmentShader from './shaders/fragment.glsl'

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(2, 2, 2.25)
scene.add(directionalLight)

const rgbeLoader = new RGBELoader()

// const envMap = rgbeLoader.load('/hdr/studio.hdr', (texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping
// })
// scene.environment = envMap

const obj = {
  metalness: 1,
  roughness: 0,
  color: 0xe86e34,
}

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
const textureLoader = new THREE.TextureLoader()

dracoLoader.setDecoderPath('/draco/')
// texture.mapping = THREE.EquirectangularReflectionMapping
loader.setDRACOLoader(dracoLoader)
const bakedTexture = textureLoader.load('/area/bakinglast32denoise.jpg')
bakedTexture.flipY = false

const bakedMaterial= new THREE.MeshStandardMaterial({map: bakedTexture})
loader.load('/area/area1.glb', (gltf) => {

  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = bakedMaterial
    }
  })
  // gltf.scene.scale.set(0.5, 0.5, 0.5)
  scene.add(gltf.scene)
})


loader.setResourcePath('/lambo/')
loader.load(
  '/lambo/lambo.gltf',
  function (gltf) {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // child.material.envMap = envMap
        if (child.material.name === 'body') {
          gui.addBinding(obj, 'color', { min: 0, max: 0xffffff, step: 1, view: 'color' }).on('change', (e) => {
            child.material.color.setHex(e.value)
          })
          child.material.color.setHex(obj.color)

          child.castShadow = true
          child.receiveShadow = true
        }
        if (child.material.name === 'windo.001' || child.material.name === 'headlight_glass.002') {
          child.material = new THREE.MeshStandardMaterial({ color: 0x000000, opacity: 0.7, transparent: true })
          child.castShadow = true
          child.receiveShadow = true
        }
        //black_plastic.002
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    gltf.scene.castShadow = true
    gltf.scene.receiveShadow = true
    gltf.scene.scale.set(1, 1, 1)
    // updateAllMaterials()
    // scene.add(gltf.scene)
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  function (error) {
    console.log('An error happened', error)
  }
)

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMapIntensity = 3
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}


// Objects
// const shaderMaterial = new THREE.ShaderMaterial({
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
//   uniforms: {
//     uTime: { value: 0 },
//     uColor: { value: new THREE.Color('orange') },
//     uFrequency: { value: new THREE.Vector2(10, 5) },
//   },
// })

const geometry = new THREE.CylinderGeometry(1, 1, 0.5, 32)
geometry.scale(5, 1, 5)
const material = new THREE.MeshStandardMaterial({ color: 0x999999 })
const cube = new THREE.Mesh(geometry, material)
cube.receiveShadow = true
cube.castShadow = true
cube.position.y = -0.25
scene.add(cube)

camera.position.z = 5

// const clock = new THREE.Clock()
// scene.add(background)

const animate = () => {
  // const elapsedTime = clock.getElapsedTime()
  // cube.rotation.y = elapsedTime
  // cube.rotation.x = elapsedTime

  // Update shader uniforms
  // shaderMaterial.uniforms.uTime.value = elapsedTime

  fpsGraph.begin()

  controls.update()
  renderer.render(scene, camera)

  fpsGraph.end()
  requestAnimationFrame(animate)
}

animate()
