const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.minDistance = 2.5
controls.maxDistance = 12

const light = new THREE.DirectionalLight(0xffffff, 1.4)
light.position.set(5, 5, 5)
scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

let atoms = { corner: [], face: [], inner: [] }
let bonds = []
let autoRotate = true
let visible = { corner: true, face: true, inner: true, bond: true }

function clearAll() {
  Object.values(atoms).flat().forEach(o => scene.remove(o))
  bonds.forEach(o => scene.remove(o))
  atoms = { corner: [], face: [], inner: [] }
  bonds = []
}

function drawSphere(group, x, y, z, color) {
  const g = new THREE.SphereGeometry(0.16, 32, 32)
  const m = new THREE.MeshPhongMaterial({ color })
  const mesh = new THREE.Mesh(g, m)
  mesh.position.set(x, y, z)
  scene.add(mesh)
  atoms[group].push(mesh)
}

function drawBond(p1, p2) {
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...p1),
      new THREE.Vector3(...p2)
    ]),
    new THREE.LineBasicMaterial({ color: 0x4488ff })
  )
  scene.add(line)
  bonds.push(line)
}

function drawFrame() {
  const box = new THREE.BoxGeometry(2, 2, 2)
  const edges = new THREE.EdgesGeometry(box)
  const frame = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xaaaaaa }))
  scene.add(frame)
}
drawFrame()

function loadCell(id) {
  const cell = CellRegistry.get(id)
  if (!cell) return
  clearAll()
  const d = cell.data
  d.corners.forEach(p => drawSphere('corner', p[0], p[1], p[2], 0xff4444))
  d.faces.forEach(p => drawSphere('face', p[0], p[1], p[2], 0xffff44))
  d.inner.forEach(p => drawSphere('inner', p[0], p[1], p[2], 0x44dd44))
  d.bonds.forEach(([a, b]) => drawBond(a, b))
  updateVisibility()
}

function updateVisibility() {
  atoms.corner.forEach(o => o.visible = visible.corner)
  atoms.face.forEach(o => o.visible = visible.face)
  atoms.inner.forEach(o => o.visible = visible.inner)
  bonds.forEach(o => o.visible = visible.bond)
}

function resetView() { camera.position.set(5, 4, 5); controls.target.set(0, 0, 0) }
function viewFront() { camera.position.set(0, 0, 5); controls.target.set(0, 0, 0) }
function viewTop() { camera.position.set(0, 5, 0); controls.target.set(0, 0, 0) }
function viewLeft() { camera.position.set(5, 0, 0); controls.target.set(0, 0, 0) }

function toggleRotate() {
  autoRotate = !autoRotate
  document.querySelector('.rotate-btn').textContent = autoRotate ? '旋转 ⟳' : '旋转 ▶'
}

function toggleGroup(key) {
  visible[key] = !visible[key]
  updateVisibility()
  const btn = [...document.querySelectorAll('.ctrl-btn')].find(b => b.dataset.key === key)
  btn.classList.toggle('active', visible[key])
}

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

function loop() {
  requestAnimationFrame(loop)
  if (autoRotate && !controls.isDragging) scene.rotation.y += 0.002
  controls.update()
  renderer.render(scene, camera)
}

const drawerMask = document.getElementById('drawer-mask')
const openBtn = document.getElementById('open-panel')
const drawerContent = document.getElementById('drawer-content')

openBtn.onclick = () => {
  drawerMask.style.display = 'block'
  openBtn.style.display = 'none'
}
drawerMask.onclick = (e) => {
  if (e.target === drawerMask) {
    drawerMask.style.display = 'none'
    openBtn.style.display = 'block'
  }
}

document.querySelectorAll('.view-btn')[0].onclick = resetView
document.querySelectorAll('.view-btn')[1].onclick = viewFront
document.querySelectorAll('.view-btn')[2].onclick = viewTop
document.querySelectorAll('.view-btn')[3].onclick = viewLeft
document.querySelectorAll('.view-btn')[4].onclick = toggleRotate

document.querySelectorAll('.ctrl-btn').forEach(btn => {
  const key = btn.dataset.key
  btn.onclick = () => toggleGroup(key)
  btn.classList.add('active')
})

const cells = CellRegistry.getAll()
for (const id in cells) {
  const el = document.createElement('div')
  el.className = 'cell-item'
  el.textContent = cells[id].name
  el.onclick = () => {
    loadCell(id)
    drawerMask.style.display = 'none'
    openBtn.style.display = 'block'
  }
  drawerContent.appendChild(el)
}

loadCell('diamond')
resetView()
loop()
