// ========== 全局变量 ==========
let scene, camera, renderer, controls;
let isRotating = false;

// ========== 1. 初始化 Three.js 场景 ==========
function initThreeJS() {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('view-group').parentNode.appendChild(renderer.domElement);

  // 添加轨道控制器
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 2;
  controls.maxDistance = 20;

  // 添加坐标轴辅助（可选）
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // 启动动画循环
  animate();
}

// ========== 2. 动画循环 ==========
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (isRotating) {
    scene.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

// ========== 3. 统一渲染函数：根据晶胞 data 绘制 3D 模型 ==========
function renderCell(data) {
  // 清空旧场景（关键！否则新旧模型重叠）
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  // 重新添加坐标轴辅助
  scene.add(new THREE.AxesHelper(3));

  // 渲染顶角原子（红色）
  data.corners?.forEach(pos => {
    const geo = new THREE.SphereGeometry(0.2, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff4444 });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(...pos);
    scene.add(sphere);
  });

  // 渲染面心原子（黄色）
  data.faces?.forEach(pos => {
    const geo = new THREE.SphereGeometry(0.2, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(...pos);
    scene.add(sphere);
  });

  // 渲染体内原子（绿色）
  data.inner?.forEach(pos => {
    const geo = new THREE.SphereGeometry(0.2, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0x44cc44 });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(...pos);
    scene.add(sphere);
  });

  // 渲染共价键（蓝色线条）
  data.bonds?.forEach(([p1, p2]) => {
    const points = [
      new THREE.Vector3(...p1),
      new THREE.Vector3(...p2)
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0x4488ff, linewidth: 2 });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
  });
}

// ========== 4. 加载晶胞函数（点击列表项时调用） ==========
function loadCell(cell) {
  renderCell(cell.data);
  // 关闭选择抽屉
  document.getElementById('drawer-mask').classList.remove('open');
}

// ========== 5. 初始化交互与列表 ==========
function initUI() {
  // 初始化晶胞列表
  const cells = CellRegistry.getAll();
  const drawerContent = document.getElementById('drawer-content');
  drawerContent.innerHTML = '';

  cells.forEach(cell => {
    const btn = document.createElement('button');
    btn.className = 'cell-btn';
    btn.textContent = cell.name;
    btn.onclick = () => loadCell(cell);
    drawerContent.appendChild(btn);
  });

  // 默认加载第一个晶胞
  if (cells.length > 0) {
    renderCell(cells[0].data);
  }

  // 抽屉开关
  document.getElementById('open-panel').onclick = () => {
    document.getElementById('drawer-mask').classList.add('open');
  };
  document.getElementById('drawer-mask').onclick = (e) => {
    if (e.target === document.getElementById('drawer-mask')) {
      document.getElementById('drawer-mask').classList.remove('open');
    }
  };

  // 视角控制按钮
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.onclick = () => {
      const text = btn.textContent;
      if (text === '视角重置') {
        camera.position.set(5, 5, 5);
        controls.reset();
        scene.rotation.set(0, 0, 0);
      } else if (text === '主视') {
        camera.position.set(0, 0, 5);
        controls.update();
      } else if (text === '俯视') {
        camera.position.set(0, 5, 0);
        controls.update();
      } else if (text === '侧视') {
        camera.position.set(5, 0, 0);
        controls.update();
      }
    };
  });

  // 旋转按钮
  const rotateBtn = document.querySelector('.rotate-btn');
  rotateBtn.onclick = () => {
    isRotating = !isRotating;
    rotateBtn.style.backgroundColor = isRotating ? '#ff8800' : '#3498db';
  };
}

// ========== 6. 页面加载完成后启动 ==========
window.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initUI();
});

// ========== 窗口 resize 适配 ==========
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});// ========== 全局变量 ==========
let scene, camera, renderer, controls;
let isRotating = false;

// ========== 1. 初始化 Three.js 场景 ==========
function initThreeJS() {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('view-group').parentNode.appendChild(renderer.domElement);

  // 添加轨道控制器
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 2;
  controls.maxDistance = 20;

  // 添加坐标轴辅助（可选）
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // 启动动画循环
  animate();
}

// ========== 2. 动画循环 ==========
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (isRotating) {
    scene.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

// ========== 3. 统一渲染函数：根据晶胞 data 绘制 3D 模型 ==========
function renderCell(data) {
  // 清空旧场景（关键！否则新旧模型重叠）
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  // 重新添加坐标轴辅助
  scene.add(new THREE.AxesHelper(3));

  // 渲染顶角原子（红色）
  data.corners?.forEach(pos => {
    const geo = new THREE.SphereGeometry(0.2, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff4444 });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(...pos);
    scene.add(sphere);
  });

  // 渲染面心原子（黄色）
  data.faces?.forEach(pos => {
    const geo = new THREE.SphereGeometry(0.2, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(...pos);
    scene.add(sphere);
  });

  // 渲染体内原子（绿色）
  data.inner?.forEach(pos => {
    const geo = new THREE.SphereGeometry(0.2, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0x44cc44 });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(...pos);
    scene.add(sphere);
  });

  // 渲染共价键（蓝色线条）
  data.bonds?.forEach(([p1, p2]) => {
    const points = [
      new THREE.Vector3(...p1),
      new THREE.Vector3(...p2)
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0x4488ff, linewidth: 2 });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
  });
}

// ========== 4. 加载晶胞函数（点击列表项时调用） ==========
function loadCell(cell) {
  renderCell(cell.data);
  // 关闭选择抽屉
  document.getElementById('drawer-mask').classList.remove('open');
}

// ========== 5. 初始化交互与列表 ==========
function initUI() {
  // 初始化晶胞列表
  const cells = CellRegistry.getAll();
  const drawerContent = document.getElementById('drawer-content');
  drawerContent.innerHTML = '';

  cells.forEach(cell => {
    const btn = document.createElement('button');
    btn.className = 'cell-btn';
    btn.textContent = cell.name;
    btn.onclick = () => loadCell(cell);
    drawerContent.appendChild(btn);
  });

  // 默认加载第一个晶胞
  if (cells.length > 0) {
    renderCell(cells[0].data);
  }

  // 抽屉开关
  document.getElementById('open-panel').onclick = () => {
    document.getElementById('drawer-mask').classList.add('open');
  };
  document.getElementById('drawer-mask').onclick = (e) => {
    if (e.target === document.getElementById('drawer-mask')) {
      document.getElementById('drawer-mask').classList.remove('open');
    }
  };

  // 视角控制按钮
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.onclick = () => {
      const text = btn.textContent;
      if (text === '视角重置') {
        camera.position.set(5, 5, 5);
        controls.reset();
        scene.rotation.set(0, 0, 0);
      } else if (text === '主视') {
        camera.position.set(0, 0, 5);
        controls.update();
      } else if (text === '俯视') {
        camera.position.set(0, 5, 0);
        controls.update();
      } else if (text === '侧视') {
        camera.position.set(5, 0, 0);
        controls.update();
      }
    };
  });

  // 旋转按钮
  const rotateBtn = document.querySelector('.rotate-btn');
  rotateBtn.onclick = () => {
    isRotating = !isRotating;
    rotateBtn.style.backgroundColor = isRotating ? '#ff8800' : '#3498db';
  };
}

// ========== 6. 页面加载完成后启动 ==========
window.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initUI();
});

// ========== 窗口 resize 适配 ==========
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
