import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
//import * as dat from 'dat.gui'

// global
let ref: HTMLDivElement
//const gui = new dat.GUI()

// camera and scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.z = 70
camera.position.x = -20
scene.add(camera)
scene.background = new THREE.Color(0x6ee46e)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.setPixelRatio(2)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(13, 2, 13)
controls.enableDamping = true
controls.maxPolarAngle = 1.2
controls.minDistance = 30
controls.maxDistance = 120
controls.update()

// resize
const resize = () => {
  const { clientHeight, clientWidth } = ref
  renderer.setSize(clientWidth, clientHeight)
  camera.aspect = clientWidth / clientHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)

// lights
const DL = new THREE.DirectionalLight(0xffffff, 2.5)
DL.castShadow = true
const AO = new THREE.AmbientLight(0xffffff, 1.0)

// Raycaster
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2(-100, -100)
let count = 0
let interval: NodeJS.Timeout
const handlePointerDown = (event: globalThis.MouseEvent) => {
  event.preventDefault()  
  interval = setInterval(() => count += 100, 100)
}
const handlePointerUp = (event: globalThis.MouseEvent) => {
  event.preventDefault()
  if (count < 500) {
    raycaster.setFromCamera( pointer, camera )
    const intersects = raycaster.intersectObjects( scene.children, true )
    if(intersects.length > 0) {
      const current = intersects[0].object.parent
      alert(`${current?.name}: ${JSON.stringify(current?.userData)}`)
    }

  }
  clearInterval(interval)
  count = 0
}
const handleMove = (event: globalThis.MouseEvent) => {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1

  raycaster.setFromCamera( pointer, camera )
  const intersects = raycaster.intersectObjects( scene.children, true )
  if(intersects.length > 0) {
    document.body.style.cursor = 'pointer'
  } else {
    document.body.style.cursor = 'initial'
  }
}

// render scene
const animate = () => { 
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
window.addEventListener('pointerdown', handlePointerDown)
window.addEventListener('pointerup', handlePointerUp)
window.addEventListener('pointermove', handleMove)

// cast and receive shadows
const castAndReceiveShadows = () => {
  scene.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

const addLights = (quantity: number) => {
  DL.position.set(0, 30, 0)
  const aux = 1.5
  DL.shadow.camera.left = -(aux * quantity)
  DL.shadow.camera.right = aux * quantity
  DL.shadow.camera.top = aux * quantity
  DL.shadow.camera.bottom = -(aux * quantity)
  DL.shadow.mapSize.x = 1024
  DL.shadow.mapSize.y = 1024

  scene.add(DL)
  // scene.add(new THREE.CameraHelper(DL.shadow.camera))
  scene.add(AO) 
}

const addTrees = (gltf: GLTF, quantity: number) => {
  const trees = new THREE.Group()
  const model = gltf.scene

  for (let i = 0; i < quantity; i+=1) {
    const newTree = model.clone()
    newTree.name = `ARBOL NUMERO ${i + 1}`
    newTree.userData = {
      name: 'Juan Sanchez',
      model: 'Tesla',
      date: '15/02/2022',
    }

    if (i >= 0 && i <= 4) {
      newTree.position.set(i * 6.5, 0, 0)
    } else if (i >= 5 && i <= 9) {
      newTree.position.set((i-5) * 6.5, 0, 6.5)
    } else if (i >= 10 && i <= 14) {
      newTree.position.set((i-10) * 6.5, 0, 13)
    } else if (i >= 15 && i <= 19) {
      newTree.position.set((i-15) * 6.5, 0, 19.5)
    } else if (i >= 20 && i <= 24) {
      newTree.position.set((i-20) * 6.5, 0, 26)
    }
    
    trees.add(newTree)
  }  
  scene.add(trees)

  /*
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  cube.position.y = 23
  scene.add(cube)
  gui
    .add(cube.position, 'x')
    .min(0)
    .max(50)
    .step(0.5)
  gui
    .add(cube.position, 'y')
    .min(0)
    .max(50)
    .step(0.5)
  gui
    .add(cube.position, 'z')
    .min(0)
    .max(50)
    .step(0.5)
  */

  castAndReceiveShadows()
  addLights(quantity)
}

// Loader
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  './assets/TreeSample_GLTF/Tree_Sample.gltf',
  gltf => {
    addTrees(gltf, 25)
  },
)

export const initForest = (cont: HTMLDivElement) => {
  ref = cont
  resize()
  cont.appendChild(renderer.domElement)
}

export const cleanup = (cont: HTMLDivElement) => {
  renderer.dispose()
  scene.clear()
  cont.removeChild(renderer.domElement)
}
