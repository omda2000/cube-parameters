import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

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
  const transformControlsRef = useRef<TransformControls | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const [isSelected, setIsSelected] = useState(false);

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

    // Label renderer setup
    const labelRenderer = new CSS2DRenderer();
    labelRendererRef.current = labelRenderer;
    labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;

    // Transform Controls setup
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControlsRef.current = transformControls;
    transformControls.visible = false;
    scene.add(transformControls);

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

    // Name label
    const nameDiv = document.createElement('div');
    nameDiv.className = 'label';
    nameDiv.textContent = objectName;
    nameDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    nameDiv.style.color = 'white';
    nameDiv.style.padding = '2px 5px';
    nameDiv.style.borderRadius = '3px';
    nameDiv.style.visibility = 'hidden';
    const nameLabel = new CSS2DObject(nameDiv);
    nameLabel.position.set(0, 1, 0);
    box.add(nameLabel);

    // Edges setup
    const edges = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lineSegments = new THREE.LineSegments(edges, edgesMaterial);
    edgesRef.current = lineSegments;
    lineSegments.visible = showEdges;
    scene.add(lineSegments);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(box);

      if (intersects.length > 0) {
        nameDiv.style.visibility = 'visible';
      } else {
        nameDiv.style.visibility = 'hidden';
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(box);

      if (intersects.length > 0) {
        setIsSelected(!isSelected);
        transformControls.attach(box);
        transformControls.visible = !isSelected;
        controls.enabled = isSelected;
      } else {
        setIsSelected(false);
        transformControls.detach();
        transformControls.visible = false;
        controls.enabled = true;
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.removeChild(labelRenderer.domElement);
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
      if (!mountRef.current || !cameraRef.current || !rendererRef.current || !labelRendererRef.current) return;

      cameraRef.current.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      labelRendererRef.current.setSize(
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