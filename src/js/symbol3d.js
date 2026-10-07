// Lazy-loaded 3D brand symbol. Extrudes the exact logo geometry (src/brand/logo-paths.js)
// and renders it with physically-based materials. Only loaded when the About section
// approaches the viewport, on WebGL devices without reduced-motion.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, ExtrudeGeometry, MeshPhysicalMaterial,
  PMREMGenerator, DirectionalLight, ACESFilmicToneMapping, SRGBColorSpace, Box3, Vector3, Color,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SYMBOL } from '../brand/logo-paths.js';

export function mount(host) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 9.5);

  const key = new DirectionalLight(0x9fd6ff, 2.2);
  key.position.set(-4, 5, 6);
  scene.add(key);
  const rim = new DirectionalLight(0x2ba8ff, 3);
  rim.position.set(5, -2, -4);
  scene.add(rim);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path id="s" d="${SYMBOL.solid}"/><path id="b" d="${SYMBOL.bridge}"/><path id="n" d="${SYMBOL.node}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const mats = {
    s: new MeshPhysicalMaterial({ color: new Color('#16335c'), metalness: 0.85, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.18 }),
    b: new MeshPhysicalMaterial({ color: new Color('#2ba8ff'), metalness: 0.3, roughness: 0.25, emissive: new Color('#1677c4'), emissiveIntensity: 0.9 }),
    n: new MeshPhysicalMaterial({ color: new Color('#5cbcff'), metalness: 0.3, roughness: 0.2, emissive: new Color('#2ba8ff'), emissiveIntensity: 1.1 }),
  };
  const depth = { s: 9, b: 5, n: 12 };
  const group = new Group();
  data.paths.forEach((p) => {
    const id = p.userData.node.id;
    p.toShapes(true).forEach((shape) => {
      const geo = new ExtrudeGeometry(shape, { depth: depth[id], bevelEnabled: true, bevelThickness: 0.9, bevelSize: 0.55, bevelSegments: 6, curveSegments: 48 });
      const mesh = new Mesh(geo, mats[id]);
      mesh.position.z = id === 'n' ? -1.5 : id === 'b' ? 2 : 0;
      group.add(mesh);
    });
  });
  // SVG y points down: flip, centre and scale to scene units.
  group.scale.set(0.055, -0.055, 0.055);
  const box = new Box3().setFromObject(group);
  const c = box.getCenter(new Vector3());
  group.position.sub(c);
  const pivot = new Group();
  pivot.add(group);
  scene.add(pivot);

  const size = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  size();
  new ResizeObserver(size).observe(host);

  let tx = 0, ty = 0, visible = true, raf = 0;
  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 0.9;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
  });
  host.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) loop(); }).observe(host);

  const t0 = performance.now();
  function loop() {
    cancelAnimationFrame(raf);
    if (!visible) return;
    const t = (performance.now() - t0) / 1000;
    pivot.rotation.y += (tx + Math.sin(t * 0.35) * 0.35 - pivot.rotation.y) * 0.05;
    pivot.rotation.x += (ty + Math.sin(t * 0.27) * 0.08 - pivot.rotation.x) * 0.05;
    pivot.position.y = Math.sin(t * 0.8) * 0.06;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  loop();
  host.classList.add('has-3d');
}
