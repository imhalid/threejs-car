import * as THREE from 'three'
import { renderer, scene } from './core/renderer'
import { fpsGraph } from './core/gui'
import camera from './core/camera'
import { controls } from './core/orbit-control'

// Shaders
// import vertexShader from './shaders/vertex.glsl'
// import fragmentShader from './shaders/fragment.glsl'

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, 2.25)

scene.add(directionalLight)

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1)

// const shaderMaterial = new THREE.ShaderMaterial({
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
//   uniforms: {
//     uTime: { value: 0 },
//     uColor: { value: new THREE.Color('orange') },
//     uFrequency: { value: new THREE.Vector2(10, 5) },
//   },
// })
const material = new THREE.MeshStandardMaterial({ color: '#00ff00' })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

// const clock = new THREE.Clock()

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
