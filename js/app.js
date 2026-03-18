// 全局变量
let scene, camera, renderer, controls;
let currentCell = null;

// 初始化 Three.js
function init() {
  // 场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(3, 3, 3);

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);

  // 轨道控制器
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 坐标轴辅助
  scene.add(new THREE.AxesHelper(3));

  // 初始渲染一个晶胞（比如金刚石）
  loadCell(CellRegistry.get("diamond"));

  // 动画循环
  animate();
}

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// 清空场景（除了坐标轴和控制器）
function clearScene() {
  while (scene.children.length > 1) {
    scene.remove(scene.children[1]);
  }
}

// 绘制晶胞边框（灰色立方体线框）
function drawCellFrame() {
  const box = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(box);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x888888 });
  const frame = new THREE.LineSegments(edges, lineMat);
  scene.add(frame);
}

// 渲染晶胞
function renderCell(data) {
  clearScene();
  drawCellFrame(); // 关键：绘制边框

  // 绘制原子
  data.atoms.forEach((atom) => {
    const geo = new THREE.SphereGeometry(atom.radius, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: atom.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(atom.x, atom.y, atom.z);
    scene.add(mesh);
  });

  // 绘制化学键
  data.bonds.forEach((bond) => {
    const start = new THREE.Vector3(bond.start.x, bond.start.y, bond.start.z);
    const end = new THREE.Vector3(bond.end.x, bond.end.y, bond.end.z);
    const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineBasicMaterial({ color: 0x4488ff });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
  });

  // 重置视角
  controls.reset();
  scene.rotation.set(0, 0, 0);
}

// 加载晶胞
function loadCell(cell) {
  currentCell = cell;
  renderCell(cell.data);
}

// 窗口 resize 处理
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 启动
init();
