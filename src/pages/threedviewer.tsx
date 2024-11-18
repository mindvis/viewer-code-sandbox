
// project-imports
import { Grid, Stack, Typography, Box } from "@mui/material";
// import AuthWrapper from 'sections/auth/AuthWrapper';
import { useParams } from "react-router";
import axios from "axios";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";



let mixer;
const clock = new THREE.Clock();
let currentAnimation = null;

/*let mediaRecorder;
let recordedChunks = [];
let isCapturing = false;

let captureFrames = [];
let captureStartTime;*/

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.near = 0.1; // Tightened near plane (if applicable based on your scene scale)
camera.far = 100; // Adjusted far plane

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setPixelRatio(window.devicePixelRatio); // Ensures clarity on high DPI devices
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Enable soft shadows
document.body.appendChild(renderer.domElement);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.update();

// Ground plane setup
let ground;

function setupGroundPlane() {
  const groundGeometry = new THREE.PlaneGeometry(200, 200); // Adjust size as needed
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 }); // Shadow material for receiving shadows

  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  ground.receiveShadow = true;

  // Adjust position based on the loaded model
  //  if (scene.children.length > 0) {
  //    const model = scene.children.find(obj => obj instanceof THREE.Mesh); // Assuming first child is the model
  //  if (model) {
  //    const box = new THREE.Box3().setFromObject(model);
  //  const center = box.getCenter(new THREE.Vector3());
  //ground.position.copy(center);
  //}
  //}

  scene.add(ground);
}

setupGroundPlane();

function adjustGroundPlane(model) {
  const box = new THREE.Box3().setFromObject(model);
  const minY = box.min.y;
  if (ground) {
    ground.position.y = minY; // Adjust ground plane just below the model's lowest point
  }
}

// Configure shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow map for smoother shadows

// Enable shadows for all relevant objects
scene.traverse((obj) => {
  if (obj instanceof THREE.Mesh) {
    obj.castShadow = true;
    obj.receiveShadow = true;
  }
});

// Set up shadow properties for the light
const light = new THREE.DirectionalLight(0xffffff, 0);
light.position.set(0, 10, 0);
light.castShadow = true;
scene.add(light);

light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;
light.shadow.camera.left = -100; // Adjust these values based on your scene
light.shadow.camera.right = 100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
light.shadow.camera.updateProjectionMatrix();

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

light.shadow.bias = -0.001;

// Ensure ground plane receives shadows
if (ground) {
  ground.receiveShadow = true;
}

// HDR Environment setup
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
let envMapIntensity = 1; // Default intensity
new RGBELoader().setPath('../assets/').load('environment.hdr', function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();

    // Apply environment map intensity to all relevant materials in the scene
    scene.traverse((obj) => {
        if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial) {
            obj.material.envMap = envMap;
            obj.material.envMapIntensity = envMapIntensity;
            obj.material.needsUpdate = true;
        }
    });
    // Ensure ground plane also uses the environment map
    if (ground && ground.material instanceof THREE.ShadowMaterial) {
    ground.material.envMap = envMap;
    ground.material.envMapIntensity = envMapIntensity;
    ground.material.needsUpdate = true;
    }
});

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Enhanced Antialiasing and Texture Filtering (within model loading functions)
/*function enhanceMaterial(material) {
  if (material.map) {
    material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }
}*/

// Enhanced Antialiasing and Texture Filtering (within model loading functions)
function enhanceMaterial(material) {
  if (material.map) {
      material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      if (isMobileDevice()) {
          material.map.minFilter = THREE.LinearMipmapLinearFilter;
          material.map.generateMipmaps = true;
      }
  }
  if (material.normalMap && isMobileDevice()) {
      material.normalMap.minFilter = THREE.LinearMipmapLinearFilter;
      material.normalMap.generateMipmaps = true;
  }
  // Apply to other texture types as needed
}

controls.autoRotate = false;
controls.autoRotateSpeed = 1;

// Dropzone and file input setup
// const dropzone = document.getElementById("dropzone")!;
// const fileInput = document.getElementById("file-input") as HTMLInputElement;

// dropzone.addEventListener(
//   "dragover",
//   (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//   },
//   false
// );

// dropzone.addEventListener(
//   "drop",
//   (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     handleFile(event.dataTransfer!.files[0]);
//   },
//   false
// );

// dropzone.addEventListener("click", () => fileInput.click());

// fileInput.addEventListener("change", () => {
//   if (fileInput.files!.length > 0) {
//     handleFile(fileInput.files![0]);
//   }
// });

// Update this function in your existing loaders (GLB, FBX, STL)
function applyMaterialOptimizations(object) {
  object.traverse((child) => {
      if (child.isMesh) {
          enhanceMaterial(child.material);
      }
  });
}

function optimizeTexture(texture, maxSize = 1024) {
  if (!isMobileDevice()) return; // Skip optimization for non-mobile devices

  if (texture.image && (texture.image.width > maxSize || texture.image.height > maxSize)) {
      const scale = maxSize / Math.max(texture.image.width, texture.image.height);
      const newWidth = Math.floor(texture.image.width * scale);
      const newHeight = Math.floor(texture.image.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(texture.image, 0, 0, newWidth, newHeight);

      texture.image = canvas;
      texture.needsUpdate = true;
  }
}

function optimizeModelTextures(object, maxTextureSize = 1024) {
  if (!isMobileDevice()) return; // Skip optimization for non-mobile devices

  object.traverse((child) => {
      if (child.isMesh) {
          if (child.material.map) optimizeTexture(child.material.map, maxTextureSize);
          if (child.material.normalMap) optimizeTexture(child.material.normalMap, maxTextureSize);
          // Apply to other texture types as needed
      }
  });
}


function handleFile(file) {
  const fileType = file.name.split('.').pop().toLowerCase();
  document.getElementById('loading-indicator').style.display = 'block';
  //hideDropzone();

  if (fileType === 'glb' || fileType === 'gltf') {
      loadGLBFile(file);
  } else if (fileType === 'fbx') {
      loadFBXFile(file);
  } else if (fileType === 'stl') {
      loadSTLFile(file);
  } else {
      alert('Unsupported file format. Please select GLB, GLTF, FBX, or STL files.');
      document.getElementById('loading-indicator').style.display = 'none';
  }
  setTimeout(showModelDimensions, 100000);
}

function loadFBXFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
      const loader = new FBXLoader();
      loader.load(
          URL.createObjectURL(file),
          (fbx) => {
              fbx.traverse(function (child) {
                  if (child.isMesh) {
                      const material = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.7, metalness: 0.3 });
                      enhanceMaterial(material);
                      child.material = material;
                      child.castShadow = true;
                      //fbx.scale.multiplyScalar(0.01);
                  }
              });
              scene.add(fbx);
              centerAndScaleModel(fbx); // Ensure model is scaled and centered
              addBoundingBox(fbx); // Apply bounding box
              adjustGroundPlane(fbx);
              document.getElementById('loading-indicator').style.display = 'none'; // Hide loading indicator
          },
          (xhr) => {
              // Update the loading progress
              const percentComplete = (xhr.loaded / xhr.total) * 100;
              document.getElementById('loading-progress').style.width = percentComplete + '%';
          },
          (error) => {
              console.error('Error loading FBX file:', error);
              document.getElementById('loading-indicator').style.display = 'none'; // Hide loading indicator
          }
      );
  };
  reader.readAsArrayBuffer(file);
}

function loadGLBFile(file) {
  const reader = new FileReader();
  reader.onload = async (event) => {
      //hideDropzone();
      const loader = new GLTFLoader();

// Initialize DRACOLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); // Use the CDN path
dracoLoader.setDecoderConfig({ type: 'js' }); // Use JavaScript decoder
loader.setDRACOLoader(dracoLoader);

      loader.load(
          URL.createObjectURL(file),
          (gltf) => {
              applyMaterialOptimizations(gltf.scene);
              optimizeModelTextures(gltf.scene, 1024);
              gltf.scene.traverse(function(node){
                  if (node.isMesh){
                      node.castShadow = true;
                      enhanceMaterial(node.material);
                  }
              });
              scene.add(gltf.scene);
              centerAndScaleModel(gltf.scene); // Ensure model is scaled and centered before calculating the bounding box
              addBoundingBox(gltf.scene); // Now the bounding box will accurately reflect the model size
              adjustGroundPlane(gltf.scene);
              document.getElementById('loading-indicator').style.display = 'none';
              // Handle animations
              if (gltf.animations && gltf.animations.length) {
                  mixer = new THREE.AnimationMixer(gltf.scene);
                  setupAnimationGUI(gltf.animations);
                  console.log(`Loaded ${gltf.animations.length} animations`);
              } else {
                  console.log('No animations found in the GLTF file');
              }           
          },
          (xhr) => {
              const percentComplete = (xhr.loaded / xhr.total) * 100;
              document.getElementById('loading-progress').style.width = percentComplete + '%';
          },
          (error) => {
              console.error('Error loading GLB file:', error);
              document.getElementById('loading-indicator').style.display = 'none';
          }
      );
  };
  reader.readAsArrayBuffer(file);
}

function loadSTLFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
      const loader = new STLLoader();
      loader.load(
          URL.createObjectURL(file),
          (geometry) => {
              const material = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.7, metalness: 0.3 });
              enhanceMaterial(material);               
              const mesh = new THREE.Mesh(geometry, material);
              mesh.castShadow = true;
              scene.add(mesh);
              centerAndScaleModel(mesh); // Ensure model is scaled and centered
              addBoundingBox(mesh); // Apply bounding box
              adjustGroundPlane(mesh);
              document.getElementById('loading-indicator').style.display = 'none'; // Hide loading indicator
          },
          (xhr) => {
              // Update the loading progress
              const percentComplete = (xhr.loaded / xhr.total) * 100;
              document.getElementById('loading-progress').style.width = percentComplete + '%';
          },
          (error) => {
              console.error('Error loading STL file:', error);
              document.getElementById('loading-indicator').style.display = 'none'; // Hide loading indicator
          }
      );
  };
  reader.readAsArrayBuffer(file);
}

// New function to load Draco compressed files
function loadDracoCompressedFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/path/to/draco/'); // Set path to Draco decoder
      loader.setDRACOLoader(dracoLoader);

      loader.load(
          URL.createObjectURL(file),
          (gltf) => {
              applyMaterialOptimizations(gltf.scene);
              optimizeModelTextures(gltf.scene, 1024);
              gltf.scene.traverse(function(node) {
                  if (node.isMesh) {
                      node.castShadow = true;
                      enhanceMaterial(node.material);
                  }
              });
              scene.add(gltf.scene);
              centerAndScaleModel(gltf.scene);
              addBoundingBox(gltf.scene);
              adjustGroundPlane(gltf.scene);
              document.getElementById('loading-indicator').style.display = 'none';
              // Handle animations
              if (gltf.animations && gltf.animations.length) {
                  mixer = new THREE.AnimationMixer(gltf.scene);
                  setupAnimationGUI(gltf.animations);
                  console.log(`Loaded ${gltf.animations.length} animations`);
              } else {
                  console.log('No animations found in the GLTF file');
              }
          },
          (xhr) => {
              const percentComplete = (xhr.loaded / xhr.total) * 100;
              document.getElementById('loading-progress').style.width = percentComplete + '%';
          },
          (error) => {
              console.error('Error loading Draco compressed file:', error);
              document.getElementById('loading-indicator').style.display = 'none';
          }
      );
  };
  reader.readAsArrayBuffer(file);
}

function setupAnimationGUI(animations) {
  if (gui.__folders['Animations']) {
      gui.removeFolder(gui.__folders['Animations']);
  }
  const animationFolder = gui.addFolder('Animations');
  animationFolder.open();

  const animationControls = {
      play: false,
      currentAnimation: 0,
  };

  animationFolder.add(animationControls, 'play').name('Play/Pause').onChange((value) => {
      if (value) {
          if (mixer) {
              currentAnimation = mixer.clipAction(animations[animationControls.currentAnimation]);
              currentAnimation.reset().play();
              console.log('Animation started');
          }
      } else {
          if (currentAnimation) {
              currentAnimation.stop();
              console.log('Animation stopped');
          }
      }
  });

  if (animations.length > 1) {
      animationFolder.add(animationControls, 'currentAnimation', 0, animations.length - 1, 1)
          .name('Animation')
          .onChange((value) => {
              if (currentAnimation) {
                  currentAnimation.stop();
              }
              currentAnimation = mixer.clipAction(animations[value]);
              if (animationControls.play) {
                  currentAnimation.reset().play();
                  console.log(`Switched to animation ${value}`);
              }
          });
  }
}

let boundingBoxHelper; // Reference to the bounding box helper
let boundingBoxDimensions; // Store dimensions here

let originalModelSize;
let modelScaleFactor;

function addBoundingBox(object) {
    const box = new THREE.Box3().setFromObject(object);
    if (boundingBoxHelper) scene.remove(boundingBoxHelper);
    boundingBoxHelper = new THREE.BoxHelper(object, 0x8B0000);
    scene.add(boundingBoxHelper);

    // Calculate and store dimensions in meters
    const size = box.getSize(new THREE.Vector3());
    boundingBoxDimensions = {
        x: Number((originalModelSize.x).toFixed(1)),
        y: Number((originalModelSize.y).toFixed(1)),
        z: Number((originalModelSize.z).toFixed(1)),
        units: "cm"
    };
    boundingBoxHelper.visible = false;
    fitCameraToObject(object);
    updateDimensionsDisplay();
}

function updateDimensionsDisplay() {
    const dimensionsDiv = document.getElementById('model-dimensions');
    if (dimensionsDiv) {
        dimensionsDiv.innerHTML = `
            <h3>Model Dimensions</h3>
            <p>Width: ${boundingBoxDimensions.x} ${boundingBoxDimensions.units}</p>
            <p>Height: ${boundingBoxDimensions.y} ${boundingBoxDimensions.units}</p>
            <p>Depth: ${boundingBoxDimensions.z} ${boundingBoxDimensions.units}</p>
        `;
    }
}

function showModelDimensions() {
  if (boundingBoxDimensions) {
      const { x, y, z, units } = boundingBoxDimensions;
      console.log(`Model Dimensions:`);
      console.log(`Width: ${x} ${units}`);
      console.log(`Height: ${y} ${units}`);
      console.log(`Depth: ${z} ${units}`);
      
      // Create or update a div to display dimensions on the page
      let dimensionsDiv = document.getElementById('model-dimensions');
      if (!dimensionsDiv) {
          dimensionsDiv = document.createElement('div');
          dimensionsDiv.id = 'model-dimensions';
          document.body.appendChild(dimensionsDiv);
      }
      dimensionsDiv.innerHTML = `
          <h3>Model Dimensions</h3>
          <p>Width: ${x} ${units}</p>
          <p>Height: ${y} ${units}</p>
          <p>Depth: ${z} ${units}</p>
      `;
      dimensionsDiv.style.position = 'absolute';
      dimensionsDiv.style.top = '10px';
      dimensionsDiv.style.left = '10px';
      dimensionsDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
      dimensionsDiv.style.padding = '10px';
      dimensionsDiv.style.borderRadius = '5px';
  } else {
      console.log("No model dimensions available.");
  }
}

function fitCameraToObject(object) {
  const boundingBox = new THREE.Box3().setFromObject(object);

  const size = boundingBox.getSize(new THREE.Vector3()); // Get bounding box size
  const center = boundingBox.getCenter(new THREE.Vector3()); // Get bounding box center

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = Math.max(fitHeightDistance, fitWidthDistance);

  const direction = new THREE.Vector3().subVectors(camera.position, center).normalize();

  // Move the camera to a position distance away from the center, maintaining its direction
  camera.position.copy(direction.multiplyScalar(distance).add(center));

  // Set the near and far planes of the camera
  camera.near = distance / 10; // This could be adjusted to be more dynamic
  camera.far = distance * 10; // Depending on the application's needs

  camera.updateProjectionMatrix();

  // Update the camera to look at the center of the object
  camera.lookAt(center);

  // Update the orbit controls target to rotate around the center of the object
  controls.target.copy(center);
  controls.update();
}


// After model is loaded and added to the scene
function centerAndScaleModel(model) {
  const boundingBox = new THREE.Box3().setFromObject(model);
  const size = boundingBox.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);
  const desiredMaxSize = 2; // Adjust based on desired viewport coverage
  const scaleRatio = desiredMaxSize / maxSize;

  originalModelSize = {
      x: size.x * 100,
      y: size.y * 100,
      z: size.z * 100
  };

  model.scale.set(scaleRatio, scaleRatio, scaleRatio);

  addBoundingBox(model);
  showModelDimensions();

  controls.minDistance = 4; // Minimum zoom level
  controls.maxDistance = 10; // Maximum zoom level

  updateAxesHelperPosition(model);
  adjustCameraView(model);

  autoRotateControls.enabled = false;
  controls.autoRotate = false;
  for (let i in gui.__controllers) {
      gui.__controllers[i].updateDisplay();
  }
}

function adjustCameraView(model: THREE.Object3D) {
  const boundingBox = new THREE.Box3().setFromObject(model);
  const center = boundingBox.getCenter(new THREE.Vector3());

  // Desired initial distance from the model
  const initialDistance = 6;

  // Adjust camera position for initial view
  const direction = new THREE.Vector3().subVectors(camera.position, center).normalize();
  camera.position.copy(direction.multiplyScalar(initialDistance).add(center));

  // Update controls and camera
  controls.target.copy(center);
  controls.update();

  // Update camera projection matrix
  camera.updateProjectionMatrix();
}

// function hideDropzone() {
//   dropzone.style.display = "none";
// }

// Window resize event listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const gui = new dat.GUI();
gui.close(); // This will start with the GUI panel closed

const shadowControls = {
  shadowsEnabled: true,
  toggleShadows: function () {
    const enableShadows = shadowControls.shadowsEnabled;
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = enableShadows;
        obj.receiveShadow = enableShadows;
      }
    });
    if (ground) {
      ground.visible = enableShadows; // Toggle ground visibility based on shadows toggle
    }
  },
};

gui
  .add(shadowControls, "shadowsEnabled")
  .name("Shadows")
  .onChange(shadowControls.toggleShadows);

// Add environment map intensity control
const envMapControls = {
  envMapIntensity: 1, // Default intensity
};

// Add the environment map intensity slider to the GUI
gui
  .add(envMapControls, "envMapIntensity", 0, 2, 0.01)
  .name("Env Map Intensity")
  .onChange((value) => {
    // Update envMapIntensity for all relevant materials
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial) {
        obj.material.envMapIntensity = value;
        obj.material.needsUpdate = true;
      }
    });
  });

  const toneMappingOptions = {
    'Linear': 
              THREE.LinearToneMapping,
    'ACESFilmic': THREE.ACESFilmicToneMapping
};

// Object to hold the current tone mapping setting
const toneMappingControl = {
    toneMapping: 'Linear', // Set Neutral as default
    exposure: 1.0
};

// Initialize renderer with correct settings for Neutral tone mapping
renderer.toneMapping =  
                        THREE.LinearToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace; // Ensure correct color space
renderer.toneMappingExposure = 1.0;

// Add tone mapping control
gui.add(toneMappingControl, 'toneMapping', Object.keys(toneMappingOptions))
    .name('Tone Mapping')
    .onChange((value) => {
      
        renderer.toneMapping = toneMappingOptions[value];
        
        // Update exposure and color handling based on tone mapping mode
        if (value === 'Linear') {
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMappingExposure = 1.0;
            // Update exposure control range
            exposureController.min(0.5).max(1.5).step(0.01);
            exposureController.updateDisplay();
        } else { // ACESFilmic
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMappingExposure = 1.0;
            // Update exposure control range
            exposureController.min(0).max(2).step(0.01);
            exposureController.updateDisplay();
        }
        
        // Update materials
        scene.traverse((obj) => {
            if (obj.material) {
                obj.material.needsUpdate = true;
            }
        });
    });

// Add separate exposure control with appropriate ranges
const exposureController = gui.add(toneMappingControl, 'exposure')
    .name('Exposure')
    .min(0.5)
    .max(1.5)
    .step(0.01)
    .onChange((value) => {
        renderer.toneMappingExposure = value;
    });

const outputEncodingOptions = {
  sRGB: THREE.sRGBEncoding,
  Linear: THREE.LinearEncoding,
};

// Object to hold the current outputEncoding setting
const outputEncodingControl = {
  outputEncoding: "sRGB", // Default output encoding
};

// Add output encoding control
gui
  .add(
    outputEncodingControl,
    "outputEncoding",
    Object.keys(outputEncodingOptions)
  )
  .name("Output Encoding")
  .onChange((value) => {
    renderer.outputEncoding = outputEncodingOptions[value];
  });

// Object to hold the current exposure setting, starting with a default value
const exposureControl = {
  exposure: 1, // Default exposure
};

// Add exposure control
gui
  .add(exposureControl, "exposure", 0, 2, 0.01)
  .name("Scene Exposure")
  .onChange((value) => {
    renderer.toneMappingExposure = value;
  });

  const autoRotateControls = {
    enabled: false,
    speed: 1
};

gui.add(autoRotateControls, 'enabled').name('Auto Rotate').onChange(value => {
    controls.autoRotate = value;
});
gui.add(autoRotateControls, 'speed', 0.1, 5).name('Rotation Speed').onChange(value => {
    controls.autoRotateSpeed = value;
});

// Add double tap/click detection
let lastTap = 0;
let lastRightClick = 0;
const DOUBLE_CLICK_DELAY = 300; // ms between clicks/taps

// Add event listener for right double click
renderer.domElement.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Prevent default right-click menu
    
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastRightClick;
    
    if (tapLength < DOUBLE_CLICK_DELAY && tapLength > 0) {
        resetAndStartAutoRotate(); // Call existing reset function
    }
    lastRightClick = currentTime;
});

// Track touch points
let touchCount = 0;

// Add touch start listener to track number of touches
renderer.domElement.addEventListener('touchstart', (event) => {
    touchCount = event.touches.length;
});

// Add event listener for double tap on mobile
renderer.domElement.addEventListener('touchend', (event) => {
    // Only process if it was a single touch point
    if (touchCount === 1) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < DOUBLE_CLICK_DELAY && tapLength > 0) {
            event.preventDefault(); // Prevent default touch behavior
            resetAndStartAutoRotate(); // Call existing reset function
        }
        lastTap = currentTime;
    }
    touchCount = 0; // Reset touch count
});

function resetAndStartAutoRotate() {
  // Get the bounding box of the loaded model
  const boundingBox = new THREE.Box3().setFromObject(scene);
  const center = boundingBox.getCenter(new THREE.Vector3());
  
  // Calculate the size of the bounding box
  const size = boundingBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  
  // Set camera position based on the bounding box
  const distance = maxDim * 2; // Adjust this multiplier as needed
  camera.position.set(center.x, center.y, center.z + distance);
  camera.lookAt(center);
  
  // Reset controls target to the center of the model
  controls.target.copy(center);
  
  // Enable auto-rotation
  autoRotateControls.enabled = false;
  controls.autoRotate = false;
  
  // Update camera and controls
  camera.updateProjectionMatrix();
  controls.update();
  
  // Update GUI
  for (let i in gui.__controllers) {
      gui.__controllers[i].updateDisplay();
  }
}

// The existing GUI button setup remains the same
gui.add({ resetAndRotate: resetAndStartAutoRotate }, 'resetAndRotate').name('Reset & Auto-Rotate');

const settings = {
  backgroundColor: "#ffffff", // Default white background
  backgroundIntensity: 1, // Default intensity (range 0-1)
  transparentBackground: false, // Transparency off by default
  envMapIntensity: 1, // Default environment map intensity
};

// Add the consolidated background color and intensity slider to the GUI
gui
  .addColor(settings, "backgroundColor")
  .name("Background Color")
  .onChange(updateBackgroundColorIntensity);
gui
  .add(settings, "backgroundIntensity", 0, 1, 0.01)
  .name("Background Intensity")
  .onChange(updateBackgroundColorIntensity);

function updateBackgroundColorIntensity() {
  // Ensure the function reacts to both color and intensity adjustments
  const baseColor = new THREE.Color(settings.backgroundColor);

  // Create a new color based on intensity
  // This approach blends the selected color with white or black based on the intensity
  let intensityColor = baseColor.clone();
  if (settings.backgroundIntensity <= 0.5) {
    // Blend towards black for lower intensities
    intensityColor.lerp(
      new THREE.Color(0x000000),
      1 - settings.backgroundIntensity * 2
    );
  } else {
    // Blend towards white for higher intensities
    intensityColor = baseColor
      .clone()
      .lerp(
        new THREE.Color(0xffffff),
        (settings.backgroundIntensity - 0.5) * 2
      );
  }

  if (!settings.transparentBackground) {
    scene.background = intensityColor;
  } else {
    // If the background is set to be transparent, this adjustment is not applied
    // However, it's important to have this logic ready for when the transparency is toggled off
    scene.background = intensityColor;
  }
}

// Ensure the function is called initially to set the initial background color and any time the settings change
updateBackgroundColorIntensity();

// Transparency toggle
gui.add(settings, "transparentBackground").name("Transparent BG");

// Export button
gui
  .add({ exportScene: () => exportSceneAsPNG() }, "exportScene")
  .name("Export PNG");

function exportSceneAsPNG() {
  // Save current renderer size
  const currentRendererSize = new THREE.Vector2();
  renderer.getSize(currentRendererSize);

  // Save current aspect ratio
  const currentAspectRatio = camera.aspect;

  // Temporary adjust renderer and camera for snapshot
  renderer.setSize(1200, 800, false); // Set output image size. The third parameter `false` ensures pixel ratio is not applied.
  camera.aspect = 1200 / 800;
  camera.updateProjectionMatrix();

  // Set scene background and renderer clear color based on transparency setting
  const originalBackground = scene.background;
  if (settings.transparentBackground) {
    renderer.setClearColor(0x000000, 0);
    scene.background = null;
  } else {
    renderer.setClearColor(settings.backgroundColor, 1);
    scene.background = new THREE.Color(settings.backgroundColor);
  }

  // Render the scene for snapshot
  renderer.render(scene, camera);

  // Export the canvas as PNG
  const dataURL = renderer.domElement.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "scene-snapshot.png";
  link.href = dataURL;
  link.click();

  // Restore original renderer size, camera aspect ratio, and background
  renderer.setSize(currentRendererSize.x, currentRendererSize.y, true); // Restore original size and apply pixel ratio
  camera.aspect = currentAspectRatio;
  camera.updateProjectionMatrix();
  scene.background = originalBackground; // Restore the original background
  renderer.setClearColor(0x000000, 1); // Reset clear color if it was changed for transparent background

  // Re-render the scene with restored settings
  renderer.render(scene, camera);
}

// Update the export dimensions function
/*gui
  .add(
    {
      exportDimensions: function () {
        if (
          boundingBoxDimensions &&
          Object.keys(boundingBoxDimensions).length > 0
        ) {
          const filename = "boundingBoxDimensions.json";
          const json = JSON.stringify(boundingBoxDimensions, null, 2); // Pretty print JSON
          const blob = new Blob([json], { type: "application/json" });
          const href = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = href;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log("Exported dimensions:", boundingBoxDimensions);
        } else {
          console.warn("No bounding box dimensions available.");
        }
      },
    },
    "exportDimensions"
  )
  .name("Export Dimensions");*/


// Add button in dat.GUI to toggle bounding box visibility
gui.add({ toggleDimensions: function() {
    const dimensionsDiv = document.getElementById('model-dimensions');
    if (dimensionsDiv) {
        dimensionsDiv.style.display = dimensionsDiv.style.display === 'none' ? 'block' : 'none';
    } else {
        showModelDimensions();
    }
}}, 'toggleDimensions').name('Toggle Dimensions');

// Add button in dat.GUI to toggle bounding box visibility
gui.add({toggleBoundingBox: function() {
    if (boundingBoxHelper) boundingBoxHelper.visible = !boundingBoxHelper.visible;
}}, 'toggleBoundingBox').name('Toggle Bounding Box');

const guiControls = {
    toggleBoundingBox: function() {
        if (boundingBoxHelper) boundingBoxHelper.visible = !boundingBoxHelper.visible;
    },
    
};

// Function to get current scene settings
function getSceneSettings() {
  return {
      shadowsEnabled: shadowControls.shadowsEnabled,
      envMapIntensity: envMapControls.envMapIntensity,
      toneMapping: toneMappingControl.toneMapping,
      toneMappingExposure: toneMappingControl.exposure, // Add the specific tone mapping exposure
      outputEncoding: outputEncodingControl.outputEncoding,
      exposure: exposureControl.exposure,
      backgroundColor: settings.backgroundColor,
      backgroundIntensity: settings.backgroundIntensity,
      transparentBackground: settings.transparentBackground,
      autoRotateEnabled: autoRotateControls.enabled,
      autoRotateSpeed: autoRotateControls.speed,
      dimensionsVisible: document.getElementById('model-dimensions')?.style.display !== 'none',
      worldAxesVisible: customWorldAxesHelper.visible
  };
}

// Function to export scene settings
function exportSceneSettings() {
    const sceneSettings = getSceneSettings();
    const blob = new Blob([JSON.stringify(sceneSettings, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'scene_settings.json';
    link.click();
}

// Function to import scene settings
function importSceneSettings(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const settings = JSON.parse(e.target.result);
        applySceneSettings(settings);
    };
    reader.readAsText(file);
}

// Function to apply imported settings
function applySceneSettings(loadedSettings) {
  // Apply previous settings...
  shadowControls.shadowsEnabled = loadedSettings.shadowsEnabled;
  shadowControls.toggleShadows();
  
  envMapControls.envMapIntensity = loadedSettings.envMapIntensity;
  scene.traverse((obj) => {
      if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial) {
          obj.material.envMapIntensity = loadedSettings.envMapIntensity;
          obj.material.needsUpdate = true;
      }
  });

  toneMappingControl.toneMapping = loadedSettings.toneMapping;
  toneMappingControl.exposure = loadedSettings.toneMappingExposure;
  renderer.toneMapping = toneMappingOptions[loadedSettings.toneMapping];
  renderer.toneMappingExposure = loadedSettings.toneMappingExposure;

  outputEncodingControl.outputEncoding = loadedSettings.outputEncoding;
  renderer.outputEncoding = outputEncodingOptions[loadedSettings.outputEncoding];

  exposureControl.exposure = loadedSettings.exposure;

  // Update the settings object directly
  settings.backgroundColor = loadedSettings.backgroundColor;
  settings.backgroundIntensity = loadedSettings.backgroundIntensity;
  settings.transparentBackground = loadedSettings.transparentBackground;

  // Apply background changes
  scene.background = new THREE.Color(settings.backgroundColor);
  updateBackgroundColorIntensity();

  autoRotateControls.enabled = loadedSettings.autoRotateEnabled;
  autoRotateControls.speed = loadedSettings.autoRotateSpeed;
  controls.autoRotate = loadedSettings.autoRotateEnabled;
  controls.autoRotateSpeed = loadedSettings.autoRotateSpeed;

 // Apply dimension visibility
 const dimensionsDiv = document.getElementById('model-dimensions');
 if (dimensionsDiv) {
     dimensionsDiv.style.display = loadedSettings.dimensionsVisible ? 'block' : 'none';
 }

 // Apply world axes visibility
 if (customWorldAxesHelper) {
     customWorldAxesHelper.visible = loadedSettings.worldAxesVisible;
 }

  // Update GUI controllers
  for (let i in gui.__controllers) {
      gui.__controllers[i].updateDisplay();
  }
}

// Add new GUI controls for exporting and importing settings
gui.add({ exportSettings: exportSceneSettings }, 'exportSettings').name('Export Settings');

// Create a hidden file input for importing
const importInput = document.createElement('input');
importInput.type = 'file';
importInput.style.display = 'none';
importInput.accept = '.json';
document.body.appendChild(importInput);

importInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        importSceneSettings(file);
    }
});

gui.add({ importSettings: () => importInput.click() }, 'importSettings').name('Import Settings');

function handleContextLost() {
    console.warn('WebGL context lost. Attempting to restore...');
    renderer.setAnimationLoop(null);
    
    // Attempt to restore the context
    const canvas = renderer.domElement;
    canvas.addEventListener('webglcontextrestored', handleContextRestored, { once: true });
}

// Add this function to handle WebGL context restoration
function handleContextRestored() {
    console.log('WebGL context restored.');
    renderer.setAnimationLoop(animate);
}

// Add event listener for context lost
renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

// Create a function to generate the world axes helper
function createCustomWorldAxesHelper(size = 1) {
  const axesGroup = new THREE.Group();

  // Create axes lines
  const axes = new THREE.AxesHelper(size);
  axesGroup.add(axes);

  // Create labels
  const labelSize = 0.05; // Significantly reduced label size
  const labels = ['X', 'Y', 'Z'];
  const colors = [0xff0000, 0x00ff00, 0x0000ff];

  labels.forEach((label, index) => {
      const spriteMaterial = new THREE.SpriteMaterial({
          map: createTextTexture(label, colors[index]),
          sizeAttenuation: true // Enable size attenuation
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.setComponent(index, size + 0.05); // Position just beyond the end of each axis
      sprite.scale.set(labelSize, labelSize, labelSize);
      axesGroup.add(sprite);
  });

  return axesGroup;
}


// Helper function to create text texture for labels
function createTextTexture(text, color) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 64;
  canvas.height = 64;

  context.font = 'Bold 48px Arial';
  context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// Create the custom axes helper
const customWorldAxesHelper = createCustomWorldAxesHelper(0.5); // Adjust size as needed
scene.add(customWorldAxesHelper);

// Function to update the position of the axes helper to the model's pivot point
function updateAxesHelperPosition(model) {
  if (model && customWorldAxesHelper) {
      const boundingBox = new THREE.Box3().setFromObject(model);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      
      customWorldAxesHelper.position.set(center.x, boundingBox.min.y, center.z);
      customWorldAxesHelper.scale.setScalar(maxDimension * 0.5); // Adjust scale factor as needed
  }
}

// Add GUI control to toggle axes visibility
gui.add({ 
  toggleAxes: function() {
      customWorldAxesHelper.visible = !customWorldAxesHelper.visible;
  }
}, 'toggleAxes').name('Toggle World Axes');

//gui.hide();

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  if (mixer) {
      mixer.update(delta);
  }
  
  controls.autoRotate = autoRotateControls.enabled;
  controls.autoRotateSpeed = autoRotateControls.speed;
  
  controls.update();
  
  try {
      renderer.render(scene, camera);
      if (isCapturing) {
          // Check if we've completed a full rotation
          if (scene.rotation.y >= Math.PI * 2) {
              stopVideoCapture();
          }
      }
  } catch (error) {
      console.error('Render error:', error);
      renderer.resetState();
  }
}
animate();

// handle the API response
const handleAPIResponse = () => {
  const fileUrl = "/BO2.glb";
  const fileType = fileUrl?.split(".")?.pop()?.toLowerCase();
  console.log(fileUrl);
  fetch(fileUrl)
    .then((response) => response.blob())
    .then((file) => {
      if (fileType === "glb") {
        loadGLBFile(file);
      } else if (fileType === "fbx") {
        loadFBXFile(file);
      } else if (fileType === "stl") {
        loadSTLFile(file);
      }
    })
    .catch((error) => {
      console.error("Error fetching the file:", error);
    });
};

/*
const fileUrl = process.env.REACT_APP_API_URL+'/uploads/cycle.glb';
const fileType = fileUrl?.split('.')?.pop()?.toLowerCase();

fetch(fileUrl)
 .then(response => response.blob())
 .then(file => {
    if (fileType === 'glb') {
        loadGLBFile(file);
    } else if (fileType === 'fbx') {
        loadFBXFile(file);
    } else if (fileType === 'stl') {
        loadSTLFile(file);
     }
  })
 .catch(error => {
    console.error('Error fetching the file:', error);
});*/

// ==============================|| SAMPLE PAGE ||============================== //

const ThreeDViewer = () => {
  handleAPIResponse();
  return (
    <>
      <Grid container spacing={3}>
        <Box
          id="loading-indicator"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "block",
            width: "500px",
            height: "15px",
            backgroundColor: "#ddd",
          }}
        >
          <Box
            id="loading-progress"
            style={{ height: "100%", width: "0%", backgroundColor: "#4caf50" }}
          ></Box>
        </Box>
      </Grid>
    </>
  );
};

export default ThreeDViewer;
