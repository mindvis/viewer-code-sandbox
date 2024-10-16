// @ts-nocheck
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';


// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);



// Camera setup
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
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
document.body.appendChild(renderer.domElement);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.update();

// HDR Environment setup
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
let envMapIntensity = 1; // Default intensity
new RGBELoader().setPath('assets/').load('environment.hdr', function (texture) {
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
});

// Enhanced Antialiasing and Texture Filtering (within model loading functions)
function enhanceMaterial(material) {
    if (material.map) {
        material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

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
                    }
                });
                scene.add(fbx);
                centerAndScaleModel(fbx); // Ensure model is scaled and centered
                addBoundingBox(fbx); // Apply bounding box
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
        loader.load(
            URL.createObjectURL(file),
            (gltf) => {
                gltf.scene.traverse(function(node){
                    if (node.isMesh){
                        node.castShadow = true;
                        enhanceMaterial(node.material);
                    }
                });
                scene.add(gltf.scene);
                centerAndScaleModel(gltf.scene); // Ensure model is scaled and centered before calculating the bounding box
                addBoundingBox(gltf.scene); // Now the bounding box will accurately reflect the model size
                document.getElementById('loading-indicator').style.display = 'none';
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



let boundingBoxHelper; // Reference to the bounding box helper
let boundingBoxDimensions; // Store dimensions here


function addBoundingBox(object) {
    const box = new THREE.Box3().setFromObject(object);
    if (boundingBoxHelper) scene.remove(boundingBoxHelper); // Remove previous helper if exists
    boundingBoxHelper = new THREE.BoxHelper(object, 0x8B0000); // Dark red color
    scene.add(boundingBoxHelper);

      // Display axes
    //  const axesHelper = new THREE.AxesHelper(5);
     // scene.add(axesHelper);

    // Calculate and store dimensions
    const size = box.getSize(new THREE.Vector3());
    boundingBoxDimensions = {
        x: (size.x * 100).toFixed(2),
        y: (size.y * 100).toFixed(2),
        z: (size.z * 100).toFixed(2)
    };
    boundingBoxHelper.visible = false; // Set to invisible by default
    // Adjust camera and controls to fit object
    fitCameraToObject(object);
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
    model.scale.set(scaleRatio, scaleRatio, scaleRatio);

    controls.minDistance = 3; // Minimum zoom level
    controls.maxDistance = 10; // Maximum zoom level

    adjustCameraView(model);
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

// Window resize event listener
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const gui = new dat.GUI();
gui.close(); // This will start with the GUI panel closed


// Add environment map intensity control
const envMapControls = {
    envMapIntensity: 1, // Default intensity
};

// Add the environment map intensity slider to the GUI
gui.add(envMapControls, 'envMapIntensity', 0, 2, 0.01).name('Env Map Intensity').onChange((value) => {
    // Update envMapIntensity for all relevant materials
    scene.traverse((obj) => {
        if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial) {
            obj.material.envMapIntensity = value;
            obj.material.needsUpdate = true;
        }
    });
});

const toneMappingOptions = {
    'Linear': THREE.NoToneMapping,
    'ACESFilmic': THREE.ACESFilmicToneMapping,
    'Cineon': THREE.CineonToneMapping,
    'Reinhard': THREE.ReinhardToneMapping,
};

// Object to hold the current tone mapping setting
const toneMappingControl = {
    toneMapping: 'ACESFilmic' // Default tone mapping
};

// Add tone mapping control
gui.add(toneMappingControl, 'toneMapping', Object.keys(toneMappingOptions)).name('Tone Mapping').onChange((value) => {
    renderer.toneMapping = toneMappingOptions[value];
    // Important: When changing tone mapping, materials need to be updated
    scene.traverse((obj) => {
        if (obj.material) {
            obj.material.needsUpdate = true;
        }
    });
});

const outputEncodingOptions = {
    'sRGB': THREE.sRGBEncoding,
    'Linear': THREE.LinearEncoding,
};

// Object to hold the current outputEncoding setting
const outputEncodingControl = {
    outputEncoding: 'sRGB' // Default output encoding
};

// Add output encoding control
gui.add(outputEncodingControl, 'outputEncoding', Object.keys(outputEncodingOptions)).name('Output Encoding').onChange((value) => {
    renderer.outputEncoding = outputEncodingOptions[value];
});

// Object to hold the current exposure setting, starting with a default value
const exposureControl = {
    exposure: 1, // Default exposure
};

// Add exposure control
gui.add(exposureControl, 'exposure', 0, 2, 0.01).name('Scene Exposure').onChange((value) => {
    renderer.toneMappingExposure = value;
});



const settings = {
    backgroundColor: '#ffffff', // Default white background
    backgroundIntensity: 1, // Default intensity (range 0-1)
    transparentBackground: false, // Transparency off by default
    envMapIntensity: 1, // Default environment map intensity
};

// Add the consolidated background color and intensity slider to the GUI
gui.addColor(settings, 'backgroundColor').name('Background Color').onChange(updateBackgroundColorIntensity);
gui.add(settings, 'backgroundIntensity', 0, 1, 0.01).name('Background Intensity').onChange(updateBackgroundColorIntensity);

function updateBackgroundColorIntensity() {
    // Ensure the function reacts to both color and intensity adjustments
    const baseColor = new THREE.Color(settings.backgroundColor);

    // Create a new color based on intensity
    // This approach blends the selected color with white or black based on the intensity
    let intensityColor = baseColor.clone();
    if (settings.backgroundIntensity <= 0.5) {
        // Blend towards black for lower intensities
        intensityColor.lerp(new THREE.Color(0x000000), 1 - settings.backgroundIntensity * 2);
    } else {
        // Blend towards white for higher intensities
        intensityColor = baseColor.clone().lerp(new THREE.Color(0xffffff), (settings.backgroundIntensity - 0.5) * 2);
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
gui.add(settings, 'transparentBackground').name('Transparent BG');

// Export button
gui.add({exportScene: () => exportSceneAsPNG()}, 'exportScene').name('Export PNG');

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
    const dataURL = renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'scene-snapshot.png';
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

// Add button in dat.GUI to export dimensions as JSON
gui.add({exportDimensions: function() {
    const filename = "boundingBoxDimensions.json";
    const json = JSON.stringify(boundingBoxDimensions);
    const blob = new Blob([json], {type: "application/json"});
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}}, 'exportDimensions').name('Export Dimensions');

// Add button in dat.GUI to toggle bounding box visibility
gui.add({toggleBoundingBox: function() {
    if (boundingBoxHelper) boundingBoxHelper.visible = !boundingBoxHelper.visible;
}}, 'toggleBoundingBox').name('Toggle Bounding Box');

const guiControls = {
    toggleBoundingBox: function() {
        if (boundingBoxHelper) boundingBoxHelper.visible = !boundingBoxHelper.visible;
    },
    
};

// handle the API response
const handleAPIResponse = (response) => {
    if (response.success) {
      const fileUrl = response.data.fileUrl;
      const fileType = fileUrl?.split('.')?.pop()?.toLowerCase();
  
      fetch(fileUrl)
       .then((response) => response.blob())
       .then((file) => {
          if (fileType === 'glb') {
            loadGLBFile(file);
          } else if (fileType === 'fbx') {
            loadFBXFile(file);
          } else if (fileType === 'stl') {
            loadSTLFile(file);
          }
        })
       .catch((error) => {
          console.error('Error fetching the file:', error);
        });
    } else {
      console.error('Error fetching the file:', response.message);
    }
  };
  
  
/*axios.get('http://localhost:5173/api/getFile')
   .then((response) => {
      handleAPIResponse(response.data);
})
.catch((error) => {
      console.error('Error fetching the file:', error);
});*/


const fileUrl = 'http://localhost:5173/public/assets/cycle.glb';
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
});