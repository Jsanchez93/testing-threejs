import * as THREE from 'three'
import get from 'lodash/fp/get'
import isEmpty from 'lodash/fp/isEmpty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { gsap, Power2 } from 'gsap'
import { Modal } from 'bootstrap'

import { Ilist } from '../types'
import { mobileAndTabletCheck } from '../common/functions'

import list from './example.json'

// global
let ref: HTMLDivElement
let modal: Modal
const timeline = gsap.timeline({
  defaults: {
    duration: 2,
    ease: Power2.easeOut,
  },
})

// camera and scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.z = 110
camera.position.x = -50
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
controls.target = new THREE.Vector3(0, 0, 0)
controls.enableDamping = true
controls.maxPolarAngle = 1.1
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
const SL = new THREE.SpotLight(0xffffff, 20, 20, Math.PI / 12)
SL.position.set(0, 20, 0)

// Modal content
export const renderInfo = (info: Ilist) => {
  const nameModal = document.getElementById('info-modal-name') as HTMLElement
  const dateModal = document.getElementById('info-modal-date') as HTMLElement
  const modelModal = document.getElementById('info-modal-model') as HTMLElement

  nameModal.innerText = info.name
  dateModal.innerText = info.date
  modelModal.innerText = info.model

  focusTree(info)
  modal.show()
}

// Raycaster
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2(-100, -100)
let count = 0
let interval: NodeJS.Timeout
const handlePointerDown = () => {
  interval = setInterval(() => count += 100, 100)
}
const handlePointerUp = (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
  if (count < 200 && get('target.tagName', event) === 'CANVAS') {
    raycaster.setFromCamera( pointer, camera )
    const intersects = raycaster.intersectObjects( scene.children, true )
    if(intersects.length > 0) {
      const userData = intersects[0].object.parent?.userData
      if (!isEmpty(userData) && userData.name !== 'Ground_Base') {
        renderInfo(userData as Ilist)
      }
    }

  }
  window.clearInterval(interval)
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

if (!mobileAndTabletCheck()) {
  window.addEventListener('pointerdown', handlePointerDown)
  window.addEventListener('pointerup', handlePointerUp)
  window.addEventListener('pointermove', handleMove)
}

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
  const aux = quantity >= 18 ? 1.2 : 5
  DL.shadow.camera.left = -(aux * quantity)
  DL.shadow.camera.right = aux * quantity
  DL.shadow.camera.top = aux * quantity
  DL.shadow.camera.bottom = -(aux * quantity)
  DL.shadow.mapSize.x = quantity < 96 ? 1024 : 2048
  DL.shadow.mapSize.y = quantity < 96 ? 1024 : 2048

  scene.add(DL)
  scene.add(AO)
  scene.add(SL)
}

const addTrees = (gltf: GLTF, quantity: number) => {
  const baseSize = 6.5
  let radius = 3
  let limit = 7 // first iteration
  let currentWall = 'top'
  let auxLimit = -3
  const trees = new THREE.Group()
  const model = gltf.scene

  let sum = 1
  let count = 1
  for (let i = 0; i < quantity; i += 1) {
    const newTree = model.clone()
    newTree.name = `Tree-${list[i].id}`
    newTree.userData = list[i]

    if (auxLimit === radius) {
      sum = -1
    } else if (auxLimit === -radius) {
      sum = 1
    }

    if (currentWall === 'top') {
      newTree.position.set(baseSize * auxLimit, 0, baseSize * -radius)
      if (count === limit) {
        currentWall = 'bottom'
        count = 0
      }
    }
    if (currentWall === 'bottom') {
      newTree.position.set(baseSize * auxLimit, 0, baseSize * radius)
      if (count === limit - 1) {
        currentWall = 'right'
        count = 0
      }
    }
    if (currentWall === 'right') {
      newTree.position.set(baseSize * radius, 0, baseSize * auxLimit)
      if (count === limit - 1) {
        currentWall = 'left'
        count = 0
      }
    }
    if (currentWall === 'left') {
      newTree.position.set(baseSize * -radius, 0, baseSize * auxLimit)
      if (count === limit - 2) {
        currentWall = 'top'
        count = 0
        radius += 1
        limit += 2
        auxLimit += sum
        
      }
    }

    auxLimit += sum
    count += 1
    trees.add(newTree)
  }  
  scene.add(trees)

  // center cube
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(32.5, 2, 32.5),
    new THREE.MeshBasicMaterial({ color: 0x007ba9 })
  )
  cube.position.y = -1
  scene.add(cube)
  
  castAndReceiveShadows()
  addLights(quantity)
}

// Loader
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  './assets/TreeSample_GLTF/Tree_Sample.gltf',
  gltf => {
    addTrees(gltf, list.length)
  },
)


export const initForest = (cont: HTMLDivElement) => {
  ref = cont
  resize()
  cont.appendChild(renderer.domElement)

  const modalElement = document.getElementById('tree-info-modal')
  const closeModal = document.getElementById('close-modal')
  if (modalElement && closeModal) {
    modal = new Modal(modalElement, {})
    closeModal.addEventListener('click', () => modal.hide())
  }
}

export const cleanup = (cont: HTMLDivElement) => {
  renderer.dispose()
  scene.clear()
  cont.removeChild(renderer.domElement)
}

export const focusTree = (item: Ilist) => {
  scene.traverse( obj => {
    const { type, name } = obj    
    if (type === 'Group' && name === `Tree-${item.id}`) {
      timeline.to(camera.position, {
        x: obj.position.x,
        z: obj.position.z,
        y: -40,
      })

      SL.position.set(
        obj.position.x,
        20,
        obj.position.z,
      )
      SL.target = obj
    }
  })
}
