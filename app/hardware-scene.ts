import * as THREE from "three";

export type SceneSettings = { active: number; isolated: boolean; exploded: boolean; spinning: boolean };
export type HardwareScene = {
  update(settings: SceneSettings): void;
  rotate(direction: number): void;
  zoom(direction: number): void;
  top(): void;
  reset(): void;
  dispose(): void;
};

// Parametric explanatory assembly. These are schematic parts, not production CAD.
export function createHardwareScene(canvas: HTMLCanvasElement, select: (part: number) => void, fail: () => void): HardwareScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x04131d, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 80);
  scene.add(new THREE.HemisphereLight(0xcafaff, 0x183d4c, 3.2));
  const key = new THREE.DirectionalLight(0xffffff, 4.3);
  key.position.set(3, 7, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x4cffe0, 2.6);
  rim.position.set(-5, 3, -4);
  scene.add(rim);

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const partMaterials: THREE.MeshStandardMaterial[][] = Array.from({ length: 6 }, () => []);
  const parts = Array.from({ length: 6 }, (_, index) => {
    const group = new THREE.Group();
    group.userData.part = index;
    scene.add(group);
    return group;
  });
  const physicalHeights = [1.65, .85, .05, -.75, -1.48, -1.48];
  const mesh = (part: number, geometry: THREE.BufferGeometry, color: number, x = 0, y = 0, z = 0, opacity = 1) => {
    geometries.add(geometry);
    const material = new THREE.MeshStandardMaterial({ color, roughness: .38, metalness: color === 0x132e35 ? .15 : .65, transparent: opacity < 1, opacity, depthWrite: opacity === 1 });
    materials.add(material);
    partMaterials[part].push(material);
    const object = new THREE.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.userData.part = part;
    parts[part].add(object);
    return object;
  };
  const box = (part: number, w: number, h: number, d: number, color: number, x = 0, y = 0, z = 0) => mesh(part, new THREE.BoxGeometry(w, h, d), color, x, y, z);
  const cylinder = (part: number, radius: number, height: number, color: number, x = 0, y = 0, z = 0, opacity = 1) => mesh(part, new THREE.CylinderGeometry(radius, radius, height, 40), color, x, y, z, opacity);
  const ring = (part: number, radius: number, tube: number, color: number, y: number) => {
    const object = mesh(part, new THREE.TorusGeometry(radius, tube, 8, 48), color, 0, y);
    object.rotation.x = Math.PI / 2;
    return object;
  };
  const silver = 0x8dabb9, graphite = 0x263a46, teal = 0x3fe8cb;

  // Industrial camera body, mounting rail and concentric optical barrel.
  box(0, 1.2, .45, .85, silver, 0, .55);
  box(0, .14, .65, .18, graphite, .76, .42, -.3);
  cylinder(0, .38, .58, graphite, 0, .03);
  ring(0, .38, .035, silver, .24);
  ring(0, .38, .025, silver, -.05);
  cylinder(0, .28, .025, 0x146270, 0, -.28);
  ring(0, .29, .025, teal, -.30);

  // Ring lighting. A schematic ring represents the illumination subsystem.
  ring(1, .8, .1, graphite, 0);
  ring(1, .8, .045, teal, -.04);
  box(1, .3, .12, .25, silver, .9, 0);

  // Plate carrier with rails and a transparent sample dish; no clinical results.
  box(2, 2.7, .15, 2.15, silver);
  box(2, 3.0, .13, .10, graphite, 0, -.17, -.77);
  box(2, 3.0, .13, .10, graphite, 0, -.17, .77);
  cylinder(2, .84, .09, 0x7dbaac, 0, .14, 0, .72);
  cylinder(2, .87, .16, 0xa5f5ed, 0, .18, 0, .16);
  ring(2, .87, .02, 0xa9e7e0, .28);
  ring(2, .88, .025, silver, .08);

  // Thermal stage with frame and heat-exchange detail.
  box(3, 2.9, .18, 2.3, silver, 0, .16);
  box(3, 2.7, .35, 2.1, graphite, 0, -.13);
  box(3, 2.72, .03, .03, teal, 0, -.10, 1.06);
  for (const x of [-1.38, 1.38]) for (const z of [-1.08, 1.08]) box(3, .11, .48, .11, silver, x, -.12, z);

  // Compute and control are separate schematic boards.
  box(4, 2.1, .13, 1.9, 0x16685c, -.5);
  box(4, .93, .14, .82, graphite, -.6, .12);
  for (let i = 0; i < 9; i++) box(4, .06, .21, .8, silver, -1 + i * .1, .27);
  box(4, .28, .14, .58, 0x1a2937, -1.28, .13, -.45);
  box(4, .28, .14, .58, 0x1a2937, .18, .13, -.45);
  for (const x of [-1.25, -.78, -.31]) box(4, .28, .20, .18, silver, x, .08, .97);
  box(5, .75, .1, 1.9, 0x1b6d70, 1.18);
  box(5, .34, .12, .34, graphite, 1.18, .12, -.16);
  for (const z of [-.64, .43, .7]) box(5, .45, .17, .16, silver, 1.18, .13, z);

  const grid = new THREE.GridHelper(9, 18, 0x215766, 0x12323e);
  grid.position.y = -2;
  scene.add(grid);
  geometries.add(grid.geometry);
  (Array.isArray(grid.material) ? grid.material : [grid.material]).forEach(material => materials.add(material));

  let settings: SceneSettings = { active: 0, isolated: false, exploded: false, spinning: false };
  let disposed = false, visible = true, frame = 0, previousTime = 0, lastDraw = 0;
  let yaw = .65, elevation = .35, zoomLevel = 1, spread = 0;
  let pointer: { id: number; x: number; y: number; startX: number; startY: number; moved: boolean; type: string } | null = null;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(pointer: fine)");
  const motionAllowed = () => !reduced.matches && document.documentElement.dataset.motion !== "off";
  const ray = new THREE.Raycaster();
  const vector = new THREE.Vector2();
  const schedule = () => {
    if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(render);
  };
  function render(time: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = Math.min((time - previousTime) / 1000 || .016, .05);
    previousTime = time;
    const destination = settings.exploded && !settings.isolated ? 1 : 0;
    spread = motionAllowed() ? THREE.MathUtils.damp(spread, destination, 9, delta) : destination;
    const moving = Math.abs(spread - destination) > .001;
    if (!moving) spread = destination;
    const spinning = settings.spinning && motionAllowed() && !pointer;
    if (spinning) yaw += delta * .20;
    if (spinning && !moving && time - lastDraw < 32) { schedule(); return; }
    parts.forEach((part, index) => {
      part.visible = !settings.isolated || index === settings.active;
      part.position.y = settings.isolated ? 0 : physicalHeights[index] * (1 + spread * .55);
      // Recenter isolated electronics whose details are offset on the full board.
      part.position.x = settings.isolated ? (index === 4 ? .5 : index === 5 ? -1.18 : 0) : 0;
    });
    grid.visible = !settings.isolated;
    grid.position.y = -2 - spread * .8;
    const radius = (settings.isolated ? 5.8 : 12) * zoomLevel * Math.max(1, 1 / camera.aspect);
    camera.position.set(Math.sin(yaw) * Math.cos(elevation) * radius, Math.sin(elevation) * radius + .1, Math.cos(yaw) * Math.cos(elevation) * radius);
    camera.lookAt(0, settings.isolated ? 0 : .1, 0);
    renderer.render(scene, camera);
    lastDraw = time;
    canvas.dataset.drawCalls = String(renderer.info.render.calls);
    canvas.dataset.triangles = String(renderer.info.render.triangles);
    canvas.dataset.renderCount = String(Number(canvas.dataset.renderCount || 0) + 1);
    if (spinning || moving) schedule();
  }
  function resize() {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(devicePixelRatio || 1, fine.matches ? 1.5 : 1.25);
    const cap = Math.min(1, Math.sqrt(900000 / (width * height * dpr * dpr)));
    renderer.setSize(Math.round(width * dpr * cap), Math.round(height * dpr * cap), false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    schedule();
  }
  const update = (next: SceneSettings) => {
    settings = next;
    partMaterials.forEach((list, index) => list.forEach(material => {
      material.emissive.setHex(index === settings.active ? 0x0c5d57 : 0x000000);
      material.emissiveIntensity = .27;
    }));
    schedule();
  };
  const down = (event: PointerEvent) => {
    if (event.button !== 0 || pointer) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false, type: event.pointerType };
    canvas.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 5) pointer.moved = true;
    yaw -= dx * .008;
    if (pointer.type === "mouse") elevation = THREE.MathUtils.clamp(elevation + dy * .006, .05, 1.3);
    pointer.x = event.clientX; pointer.y = event.clientY;
    schedule();
  };
  const up = (event: PointerEvent) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    if (!pointer.moved && event.type === "pointerup") {
      const rect = canvas.getBoundingClientRect();
      vector.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      ray.setFromCamera(vector, camera);
      const hit = ray.intersectObjects(parts.filter(part => part.visible), true)[0];
      if (hit) select(hit.object.userData.part as number);
    }
    pointer = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    schedule();
  };
  const contextLost = (event: Event) => { event.preventDefault(); fail(); };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  });
  intersection.observe(canvas);
  const motionObserver = new MutationObserver(schedule);
  motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", schedule);
  fine.addEventListener("change", resize);
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("webglcontextlost", contextLost);
  resize(); update(settings);
  return {
    update,
    rotate(direction) { yaw += direction * .35; schedule(); },
    zoom(direction) { zoomLevel = THREE.MathUtils.clamp(zoomLevel + direction * .12, .7, 1.6); schedule(); },
    top() { elevation = elevation > 1 ? .35 : 1.25; schedule(); },
    reset() { yaw = .65; elevation = .35; zoomLevel = 1; schedule(); },
    dispose() {
      if (disposed) return;
      disposed = true; cancelAnimationFrame(frame);
      observer.disconnect(); intersection.disconnect(); motionObserver.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule); fine.removeEventListener("change", resize);
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("webglcontextlost", contextLost);
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
      renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
