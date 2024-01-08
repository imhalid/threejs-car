import { PerspectiveCamera } from 'three'
import { scene, sizes } from './renderer'
import { gui } from './gui';

const VERTICAL_FIELD_OF_VIEW = 45 // degrees 45 is the normal
const ASPECT_RATIO = sizes.width / sizes.height
export const camera = new PerspectiveCamera(VERTICAL_FIELD_OF_VIEW, ASPECT_RATIO, 0.1, 50)

camera.position.set(4, 2, 9)

gui.addBinding(camera, 'zoom', { min: 0, max: 10 })

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
})

scene.add(camera)

export default camera
