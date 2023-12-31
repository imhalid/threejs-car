import { Vector2, Vector3, Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import bgFragment from '../shaders/bg-fragment.glsl'
import bgVertex from '../shaders/bg-vertex.glsl'
//Sun
//Height over horizon in range [0, PI/2.0]
const elevation = 0.2
//Rotation around Y axis in range [0, 2*PI]
const azimuth = 0.4

const fogFade = 0.009
const FOV = 45

//************** Sky **************
//https://discourse.threejs.org/t/how-do-i-use-my-own-custom-shader-as-a-scene-background/13598/2
const backgroundMaterial = new ShaderMaterial({
  uniforms: {
    sunDirection: { value: new Vector3(Math.sin(azimuth), Math.sin(elevation), -Math.cos(azimuth)) },
    resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    fogFade: { value: fogFade },
    fov: { value: FOV },
  },
  vertexShader: bgVertex,
  fragmentShader: bgFragment,
})

backgroundMaterial.depthWrite = false
var backgroundGeometry = new PlaneGeometry(2, 2, 1, 1)
var background = new Mesh(backgroundGeometry, backgroundMaterial)
export default background
