import * as THREE from 'three'
import { renderer, scene } from './core/renderer'
import { fpsGraph } from './core/gui'
import camera from './core/camera'
import background from './core/background'
import { controls } from './core/orbit-control'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// Shaders
// import vertexShader from './shaders/vertex.glsl'
// import fragmentShader from './shaders/fragment.glsl'

// Lights
const ambientLight = new THREE.AmbientLight('0xffffff', 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('0xffffff', 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, 2.25)
scene.add(directionalLight)

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath('/draco/')

loader.setDRACOLoader(dracoLoader)
loader.setResourcePath('/lambo/')
loader.load(
  '/lambo/lambo.gltf',
  function (gltf) {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material.name === 'body') {
          child.material = new THREE.MeshStandardMaterial({ color: 0x99ff })
          child.castShadow = true
          child.receiveShadow = true
        }
        console.log(child.material.name)
        if (child.material.name === 'material_46.001') {
          child.material = new THREE.MeshStandardMaterial({ color: 0xffffaa })
          child.castShadow = true
          child.receiveShadow = true
        }
        if (child.material.name === 'windo.001') {
          child.material = new THREE.MeshStandardMaterial({ color: 0xffafff, opacity: 0.5, transparent: true })
          child.castShadow = true
          child.receiveShadow = true
        }
        //doorline.002
        if (child.material.name === 'doorline.002') {
          child.material = new THREE.MeshStandardMaterial({ color: 0x00aa00 })
          child.castShadow = true
          child.receiveShadow = true
        }
        //black_plastic.002
        if (child.material.name === 'black_plastic.002') {
          child.material = new THREE.MeshStandardMaterial({ color: 0x0000aa })
          child.castShadow = true
          child.receiveShadow = true
        }
        //tire.002 and tire_side.002
        if (child.material.name === 'tire.002' || child.material.name === 'tire_side.002') {
          child.material = new THREE.MeshStandardMaterial({ color: 0xa00000 })
          child.castShadow = true
          child.receiveShadow = true
        }
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    gltf.scene.castShadow = true
    gltf.scene.receiveShadow = true
    gltf.scene.scale.set(1, 1, 1)
    scene.add(gltf.scene)
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  function (error) {
    console.log('An error happened', error)
  }
)

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
scene.add(background)

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
