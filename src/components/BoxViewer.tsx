import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface BoxViewerProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

const BoxViewer = ({ dimensions }: BoxViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const boxRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const activeCamera = useRef<'perspective' | 'ortho'>('perspective');

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(5, 5, 5);

    // Ortho camera setup
    const frustumSize = 10;
    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    const orthoCamera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    orthoCameraRef.current = orthoCamera;
    orthoCamera.position.set(5, 5, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;

    // Grid setup
    const grid = new THREE.GridHelper(10, 10);
    gridRef.current = grid;
    scene.add(grid);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Box setup
    const geometry = new THREE.BoxGeometry(
      dimensions.length,
      dimensions.height,
      dimensions.width
    );
    const material = new THREE.MeshPhongMaterial({
      color: 0x319795,
      flatShading: true,
    });
    const box = new THREE.Mesh(geometry, material);
    box.castShadow = true;
    box.position.y = dimensions.height / 2;
    boxRef.current = box;
    scene.add(box);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(
          sceneRef.current,
          activeCamera.current === 'perspective' ? camera : orthoCamera
        );
      }
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (boxRef.current?.geometry) {
        boxRef.current.geometry.dispose();
      }
      if (boxRef.current?.material) {
        (boxRef.current.material as THREE.Material).dispose();
      }
    };
  }, []);

  // Update box dimensions
  useEffect(() => {
    if (!boxRef.current) return;
    
    const geometry = new THREE.BoxGeometry(
      dimensions.length,
      dimensions.height,
      dimensions.width
    );
    boxRef.current.geometry.dispose();
    boxRef.current.geometry = geometry;
    boxRef.current.position.y = dimensions.height / 2;
  }, [dimensions]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current || !orthoCameraRef.current) return;

      const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      
      // Update perspective camera
      cameraRef.current.aspect = aspect;
      cameraRef.current.updateProjectionMatrix();
      
      // Update ortho camera
      const frustumSize = 10;
      orthoCameraRef.current.left = -frustumSize * aspect / 2;
      orthoCameraRef.current.right = frustumSize * aspect / 2;
      orthoCameraRef.current.top = frustumSize / 2;
      orthoCameraRef.current.bottom = -frustumSize / 2;
      orthoCameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCamera = () => {
    activeCamera.current = activeCamera.current === 'perspective' ? 'ortho' : 'perspective';
  };

  const setTopView = () => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
    controlsRef.current.object.position.set(0, 10, 0);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const setIsometricView = () => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
    controlsRef.current.object.position.set(5, 5, 5);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={toggleCamera}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Toggle Camera
        </button>
        <button
          onClick={setTopView}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Top View
        </button>
        <button
          onClick={setIsometricView}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Isometric View
        </button>
      </div>
    </div>
  );
};

export default BoxViewer;