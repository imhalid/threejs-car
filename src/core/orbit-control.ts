import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { camera } from './camera'
import { renderer } from './renderer'

export const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.maxPolarAngle = Math.PI / 2 - 0.1
controls.enableDamping = true
controls.maxDistance = 9
controls.minDistance = 5
