# 晶胞模块开发与生成规范

## 一、颜色与分组对应规则
所有晶胞统一使用以下分组与颜色：

- 🔴 红色（0xff4444）→ corners  顶角原子
- 🟡 黄色（0xffff44）→ faces    面心原子
- 🟢 绿色（0x44dd44）→ inner    体内原子
- 🔗 蓝色线条        → bonds    共价键/化学键

---

## 二、简易版（AI 自动生成）
不会代码也可以快速扩展晶胞。
将下面指令复制给 AI，替换【晶胞名称】即可自动生成完整可用的 JS 晶胞文件。

### AI 生成指令模板
请按照【高中化学3D晶胞模块化格式】生成【晶胞名称】晶胞，
坐标范围在 -1 到 1 之间，结构严格正确，
生成可直接使用的 js 晶胞文件。
 
要求：
 
1.顶角原子：红色 corners
2.面心原子：黄色 faces
3.体内原子：绿色 inner
4.键使用 bonds 线段
5.输出格式为：CellRegistry.register(...)
6.文件名：【晶胞标识】.js

### 使用示例（生成 NaCl）
请按照【高中化学3D晶胞模块化格式】生成【NaCl】晶胞，
坐标范围在 -1 到 1 之间，结构严格正确，
生成可直接使用的 js 晶胞文件。
 
要求：
 
1.顶角原子：红色 corners
2.面心原子：黄色 faces
3.体内原子：绿色 inner
4.键使用 bonds 线段
5.输出格式为：CellRegistry.register(...)
6.文件名：nacl.js


---

## 三、标准版格式（开发者使用）
晶胞文件统一使用如下结构：

```javascript
CellRegistry.register({
  id: "唯一英文标识",
  name: "晶胞中文名称",
  data: {
    corners: [
      [x, y, z], [x, y, z], ...
    ],
    faces: [
      [x, y, z], [x, y, z], ...
    ],
    inner: [
      [x, y, z], [x, y, z], ...
    ],
    bonds: [
      [[x1,y1,z1], [x2,y2,z2]],
      [[x1,y1,z1], [x2,y2,z2]],
      ...
    ]
  }
})
-id：英文唯一标识（如 nacl、cscl、zns）

- name：界面显示的中文名称

- corners：顶角原子坐标

- faces：面心原子坐标

- inner：内部原子坐标

- bonds：化学键（两点连线）
