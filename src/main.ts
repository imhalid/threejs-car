import * as THREE from "three";
import { renderer, scene } from "./core/renderer";
import { fpsGraph, gui } from "./core/gui";
import camera from "./core/camera";
import { controls } from "./core/orbit-control";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPixelatedPass } from "three/examples/jsm/postprocessing/RenderPixelatedPass.js";

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);



const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

dracoLoader.setDecoderPath("/draco/");
loader.setDRACOLoader(dracoLoader);
const bakedTexture = textureLoader.load("/area/bakingreenhigh.jpg");
bakedTexture.magFilter = THREE.NearestFilter;
bakedTexture.mapping = THREE.EquirectangularReflectionMapping;
bakedTexture.minFilter = THREE.LinearFilter;
bakedTexture.flipY = false;

const environmentMapTexture = cubeTextureLoader.load([
  "/area/cube/px.png",
  "/area/cube/nx.png",
  "/area/cube/py.png",
  "/area/cube/ny.png",
  "/area/cube/pz.png",
  "/area/cube/nz.png",
]);

const bakedMaterial = new THREE.MeshStandardMaterial({ map: bakedTexture });
loader.load("/area/area2.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = bakedMaterial;
      console.log(child.material);
    }
  });
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  scene.add(gltf.scene);
});

const obj = {
  metalness: 1,
  roughness: 0,
  color: 0xe86ea4,
  doorLine: 0x000000,
};

loader.setResourcePath("/lambo/");
loader.load(
  "/lambo/lambo.gltf",
  function (gltf) {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log(child.material.name);
        child.material.envMap = environmentMapTexture;

        if (child.material.name === "body") {
          gui
            .addBinding(obj, "color", {
              min: 0,
              max: obj.color,
              step: 1,
              view: "color",
            })
            .on("change", (e) => {
              child.material.color.setHex(e.value);
            });
          child.material.color.setHex(obj.color);
        }
        // need fix doorline color not apply only blue
        if (child.material.name === "doorline.001") {
          gui
            .addBinding(obj, "doorLine", {
              min: 0,
              max: obj.doorLine,
              step: 1,
              view: "color",
            })
            .on("change", (e) => {
              child.material.color.setHex(e.value);
            });

          const doorLineMaterial = new THREE.MeshNormalMaterial();
          child.material = doorLineMaterial;
        }

        if (
          child.material.name === "windo.001" ||
          child.material.name === "headlight_glass.002"
        ) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x000000,
            opacity: 0.7,
            transparent: true,
          });
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    gltf.scene.castShadow = true;
    gltf.scene.receiveShadow = true;
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.y = 0.05;
    
    // updateAllMaterials(); // shadow
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened", error);
  }
);

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 3;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

camera.position.z = 5;

const params = {
  pixelSize: 6,
  normalEdgeStrength: 0.3,
  depthEdgeStrength: 0.4,
  pixelAlignedPanning: true,
};

const composer = new EffectComposer(renderer);
const renderPixelatedPass = new RenderPixelatedPass(4, scene, camera);
composer.addPass(renderPixelatedPass);

console.log(renderPixelatedPass);
const outputPass = new OutputPass();
composer.addPass(outputPass);

gui
  .addBinding(renderPixelatedPass, "pixelSize", { min: 1, max: 10, step: 1 })
  .on("change", (e) => {
    renderPixelatedPass.setPixelSize(e.value);
  });
let isRotating: boolean;
let initialAngle = 0;

window.addEventListener("mousedown", function () {
  isRotating = false;
});
window.addEventListener("mouseup", function () {
  isRotating = true;
  console.log(camera.position);
});
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = isRotating ? clock.getElapsedTime() : initialAngle;
  initialAngle = elapsedTime;
  const angle = elapsedTime / 5;

  // camera.position.x = Math.sin(angle) * 7;
  // camera.position.z = Math.cos(angle) * 7;
  // camera.position.y = Math.sin(angle) * 7;

  fpsGraph.begin();

  const rendererSize = renderer.getSize(new THREE.Vector2());
  const aspectRatio = rendererSize.x / rendererSize.y;
  if (params["pixelAlignedPanning"]) {
    pixelAlignFrustum(
      camera,
      aspectRatio,
      Math.floor(rendererSize.x / params["pixelSize"]),
      Math.floor(rendererSize.y / params["pixelSize"])
    );
  }

  controls.update();
  renderer.render(scene, camera);
  composer.render();
  fpsGraph.end();
  requestAnimationFrame(animate);
};

animate();

// Helper functions

function pixelTexture(texture: any) {
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function easeInOutCubic(x: any) {
  return x ** 2 * 3 - x ** 3 * 2;
}

function linearStep(x: any, edge0: any, edge1: any) {
  const w = edge1 - edge0;
  const m = 1 / w;
  const y0 = -m * edge0;
  return THREE.MathUtils.clamp(y0 + m * x, 0, 1);
}

function stopGoEased(x: any, downtime: any, period: any) {
  const cycle = (x / period) | 0;
  const tween = x - cycle * period;
  const linStep = easeInOutCubic(linearStep(tween, downtime, period));
  return cycle + linStep;
}

function pixelAlignFrustum(
  camera: any,
  aspectRatio: any,
  pixelsPerScreenWidth: any,
  pixelsPerScreenHeight: any
) {
  // 0. Get Pixel Grid Units
  const worldScreenWidth = (camera.right - camera.left) / camera.zoom;
  const worldScreenHeight = (camera.top - camera.bottom) / camera.zoom;
  const pixelWidth = worldScreenWidth / pixelsPerScreenWidth;
  const pixelHeight = worldScreenHeight / pixelsPerScreenHeight;

  // 1. Project the current camera position along its local rotation bases
  const camPos = new THREE.Vector3();
  camera.getWorldPosition(camPos);
  const camRot = new THREE.Quaternion();
  camera.getWorldQuaternion(camRot);
  const camRight = new THREE.Vector3(1.0, 0.0, 0.0).applyQuaternion(camRot);
  const camUp = new THREE.Vector3(0.0, 1.0, 0.0).applyQuaternion(camRot);
  const camPosRight = camPos.dot(camRight);
  const camPosUp = camPos.dot(camUp);

  // 2. Find how far along its position is along these bases in pixel units
  const camPosRightPx = camPosRight / pixelWidth;
  const camPosUpPx = camPosUp / pixelHeight;

  // 3. Find the fractional pixel units and convert to world units
  const fractX = camPosRightPx - Math.round(camPosRightPx);
  const fractY = camPosUpPx - Math.round(camPosUpPx);

  // 4. Add fractional world units to the left/right top/bottom to align with the pixel grid
  camera.left = -aspectRatio - fractX * pixelWidth;
  camera.right = aspectRatio - fractX * pixelWidth;
  camera.top = 1.0 - fractY * pixelHeight;
  camera.bottom = -1.0 - fractY * pixelHeight;
  camera.updateProjectionMatrix();
}
