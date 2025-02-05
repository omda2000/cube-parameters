import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface BoxViewerProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  showShadow: boolean;
  showEdges: boolean;
  boxColor: string;
  objectName: string;
}

const BoxViewer = ({ dimensions, showShadow, showEdges, boxColor, objectName }: BoxViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const boxRef = useRef<THREE.Mesh | null>(null);
  const edgesRef = useRef<THREE.LineSegments | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const textRef = useRef<THREE.Mesh | null>(null);

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
    camera.position.z = 5;

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    planeRef.current = plane;
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Box setup
    const geometry = new THREE.BoxGeometry(
      dimensions.length,
      dimensions.height,
      dimensions.width
    );
    const material = new THREE.MeshPhongMaterial({
      color: boxColor,
      flatShading: true,
    });
    const box = new THREE.Mesh(geometry, material);
    boxRef.current = box;
    box.castShadow = true;
    scene.add(box);

    // Edges setup
    const edges = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lineSegments = new THREE.LineSegments(edges, edgesMaterial);
    edgesRef.current = lineSegments;
    lineSegments.visible = showEdges;
    scene.add(lineSegments);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      edges.dispose();
      edgesMaterial.dispose();
    };
  }, []);

  // Update box dimensions and edges
  useEffect(() => {
    if (!boxRef.current || !edgesRef.current) return;
    
    const geometry = new THREE.BoxGeometry(
      dimensions.length,
      dimensions.height,
      dimensions.width
    );
    boxRef.current.geometry.dispose();
    boxRef.current.geometry = geometry;

    const edges = new THREE.EdgesGeometry(geometry);
    edgesRef.current.geometry.dispose();
    edgesRef.current.geometry = edges;
  }, [dimensions]);

  // Update shadow visibility
  useEffect(() => {
    if (!boxRef.current || !rendererRef.current) return;
    
    rendererRef.current.shadowMap.enabled = showShadow;
    if (boxRef.current) {
      boxRef.current.castShadow = showShadow;
    }
    if (planeRef.current) {
      planeRef.current.receiveShadow = showShadow;
    }
  }, [showShadow]);

  // Update edges visibility
  useEffect(() => {
    if (!edgesRef.current) return;
    edgesRef.current.visible = showEdges;
  }, [showEdges]);

  // Update box color
  useEffect(() => {
    if (!boxRef.current) return;
    (boxRef.current.material as THREE.MeshPhongMaterial).color.set(boxColor);
  }, [boxColor]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default BoxViewer;