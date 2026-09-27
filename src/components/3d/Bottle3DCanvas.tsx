import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BottleCustomization } from '../../types';
import { RotateCw, Sparkles, Droplets } from 'lucide-react';

interface Bottle3DCanvasProps {
  customization: BottleCustomization;
  interactive?: boolean;
  className?: string;
  autoRotateDefault?: boolean;
  accentColor?: string;
  secondaryAccent?: string;
  sizeFormat?: '500ml' | '1000ml';
  styleVariant?: 'MINIMAL' | 'LUXURY' | 'BOLD' | 'NATURAL' | 'CORPORATE' | 'CYBER';
  neonColor?: string;
  flavorTitle?: string;
  scrollRotationOffset?: number;
  isPastHeroFold?: boolean;
  scrollProgress?: number;
}

export const Bottle3DCanvas: React.FC<Bottle3DCanvasProps> = ({
  customization,
  interactive = true,
  className = 'w-full h-full',
  autoRotateDefault = true,
  accentColor: propAccentColor = '#BD00FF',
  secondaryAccent = '#00F0FF',
  sizeFormat = '500ml',
  styleVariant = 'BOLD',
  neonColor,
  flavorTitle,
  scrollRotationOffset = 0,
  isPastHeroFold = false,
  scrollProgress = 0,
}) => {
  const accentColor = neonColor || propAccentColor;
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const [condensationActive, setCondensationActive] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const labelMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const labelTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const cursorLightRef = useRef<THREE.PointLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const dropletsGroupRef = useRef<THREE.Group | null>(null);
  const groundRingRef = useRef<THREE.Mesh | null>(null);

  // Synchronized scroll refs for 60fps render loop without scene rebuilding
  const scrollOffsetRef = useRef<number>(scrollRotationOffset);
  const isPastHeroFoldRef = useRef<boolean>(isPastHeroFold);
  const scrollProgressRef = useRef<number>(scrollProgress);

  useEffect(() => {
    scrollOffsetRef.current = scrollRotationOffset;
  }, [scrollRotationOffset]);

  useEffect(() => {
    isPastHeroFoldRef.current = isPastHeroFold;
  }, [isPastHeroFold]);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Generate ultra-realistic dynamic label canvas
  const createLabelTexture = (
    cust: BottleCustomization,
    accent: string,
    secondary: string,
    variant: string,
    size: string
  ): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 1. Label Base Background depending on styleVariant
      if (variant === 'LUXURY') {
        // Rich Midnight Obsidian with hairline gold/platinum border
        ctx.fillStyle = '#08080C';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Micro geometric line mesh
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
        ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

        // Brand Name in Serif Monogram
        ctx.fillStyle = '#F5D77F';
        ctx.textAlign = 'center';
        ctx.font = '900 86px "Playfair Display", Georgia, serif';
        const brand = cust.brandName || 'SAYAJI RESERVE';
        ctx.fillText(brand.toUpperCase(), canvas.width / 2, 360);

        ctx.fillStyle = 'rgba(245, 215, 127, 0.6)';
        ctx.fillRect(canvas.width / 2 - 140, 390, 280, 2);

        ctx.font = '500 28px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#E2E8F0';
        ctx.fillText((cust.tagline || 'CRAFTED HOSPITALITY HYDRATION').toUpperCase(), canvas.width / 2, 440);

        ctx.font = '600 24px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#F5D77F';
        ctx.fillText(`PREMIUM ARTESIAN • ${size.toUpperCase()}`, canvas.width / 2, 540);
        ctx.fillText('CRUSH BOTTLE AFTER USE ♻', canvas.width / 2, 580);
      } else if (variant === 'MINIMAL') {
        // Ultra-clean Scandinavian Matte White / Charcoal
        ctx.fillStyle = '#FAFAFA';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#050505';
        ctx.textAlign = 'center';
        ctx.font = '900 92px "Syne", sans-serif';
        const brand = cust.brandName || 'MONOCHROME';
        ctx.fillText(brand.toUpperCase(), canvas.width / 2, 380);

        ctx.font = 'bold 24px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#64748B';
        ctx.fillText((cust.tagline || 'SPECIALTY COFFEE & ARTISAN DINING').toUpperCase(), canvas.width / 2, 430);

        ctx.fillStyle = '#050505';
        ctx.fillRect(canvas.width / 2 - 30, 480, 60, 4);

        ctx.font = '600 22px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.fillText(`PACKAGED DRINKING WATER · ${size.toUpperCase()}`, canvas.width / 2, 550);
        ctx.fillText('FSSAI LIC. NO. 11424850000312', canvas.width / 2, 585);
      } else if (variant === 'NATURAL') {
        // Deep Botanical Forest Slate with Emerald Accent
        ctx.fillStyle = '#06130B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#39FF14';
        ctx.lineWidth = 8;
        ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.font = '900 96px "Syne", sans-serif';
        const brand = cust.brandName || 'VERDANT BOTANICAL';
        ctx.fillText(brand.toUpperCase(), canvas.width / 2, 380);

        ctx.fillStyle = '#39FF14';
        ctx.font = 'bold 28px "Space Grotesk", sans-serif';
        ctx.fillText((cust.tagline || 'BALANCED NATURAL MINERALS').toUpperCase(), canvas.width / 2, 440);

        ctx.fillStyle = '#A7F3D0';
        ctx.font = '600 24px "Space Grotesk", sans-serif';
        ctx.fillText(`VIRGIN GLASS-PET SILHOUETTE · ${size.toUpperCase()}`, canvas.width / 2, 540);
      } else {
        // CYBER / BOLD STREETWEAR: High-Voltage Electric Purple + Neon Blue/Cyan
        ctx.fillStyle = '#070913';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Metallic linear gradient overlay
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, '#04060C');
        grad.addColorStop(0.3, '#10172E');
        grad.addColorStop(0.5, '#1B2344');
        grad.addColorStop(0.7, '#10172E');
        grad.addColorStop(1, '#04060C');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Neon Top & Bottom Glowing Stripes
        ctx.strokeStyle = accent || '#BD00FF';
        ctx.lineWidth = 10;
        ctx.shadowColor = accent || '#BD00FF';
        ctx.shadowBlur = 24;

        ctx.beginPath();
        ctx.moveTo(0, 100);
        ctx.lineTo(canvas.width, 100);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 920);
        ctx.lineTo(canvas.width, 920);
        ctx.stroke();

        // Subtext at top
        ctx.shadowBlur = 0;
        ctx.fillStyle = secondary || '#00F0FF';
        ctx.font = 'bold 24px "Space Grotesk", sans-serif';
        ctx.fillText('CUSTOM PACKAGING LAB // NEXT-GEN BRANDING', 70, 75);
        ctx.fillText(`CHASSIS: ${size.toUpperCase()}`, canvas.width - 240, 75);

        // Brand Name (Massive, Bold)
        ctx.shadowColor = accent || '#BD00FF';
        ctx.shadowBlur = 28;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.font = '900 130px "Syne", sans-serif';
        const brand = cust.brandName || 'YOUR BRAND';
        ctx.fillText(brand.toUpperCase(), canvas.width / 2, 380);

        // Tagline
        ctx.shadowBlur = 10;
        ctx.font = 'bold 30px "Space Grotesk", sans-serif';
        ctx.fillStyle = secondary || '#00F0FF';
        const tag = cust.tagline || 'ON EVERY TABLE.';
        ctx.fillText(tag.toUpperCase(), canvas.width / 2, 440);

        // Pill specs box
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(189, 0, 255, 0.15)';
        ctx.fillRect(canvas.width / 2 - 280, 500, 560, 64);
        ctx.strokeStyle = accent || '#BD00FF';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width / 2 - 280, 500, 560, 64);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '800 28px "Space Grotesk", sans-serif';
        ctx.fillText(`VIRGIN CLARITY PET • ${size.toUpperCase()}`, canvas.width / 2, 542);

        // Statutory & Details
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '20px "Space Grotesk", sans-serif';
        ctx.fillText('PACKAGED DRINKING WATER • 100% RECYCLABLE', canvas.width / 2, 640);
        ctx.fillText('FSSAI LIC. NO. 11424850000312 • BIS IS 14543', canvas.width / 2, 675);
        ctx.fillText('DESIGNED TO BE PHOTOGRAPHED & REMEMBERED', canvas.width / 2, 710);

        // Barcode at bottom
        ctx.fillStyle = '#FFFFFF';
        for (let b = 0; b < 44; b++) {
          const bw = (b % 4 === 0 ? 5 : b % 2 === 0 ? 2 : 4);
          ctx.fillRect(360 + b * 7, 780, bw, 50);
        }
        ctx.font = '16px monospace';
        ctx.fillText('BATCH #IND-2026-DROP', canvas.width / 2, 855);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    const cameraDist = sizeFormat === '1000ml' ? 5.8 : 5.0;
    camera.position.set(0, 0.1, cameraDist);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Warm Studio Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Cool Rim Light
    const rimLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 3.2);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Cursor Follow Point Light
    const cursorLight = new THREE.PointLight(new THREE.Color(secondaryAccent), 3.5, 12);
    cursorLight.position.set(2, 1, 3);
    scene.add(cursorLight);
    cursorLightRef.current = cursorLight;

    // Ground Neon Ring Reflector
    const groundGeo = new THREE.RingGeometry(0.8, 2.2, 40);
    const groundMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const groundRing = new THREE.Mesh(groundGeo, groundMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = sizeFormat === '1000ml' ? -1.8 : -1.55;
    scene.add(groundRing);
    groundRingRef.current = groundRing;

    // Bottle Group
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // Materials:
    // 1. Virgin Glass-PET Physical Material
    const petMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.44,
      roughness: 0.05,
      metalness: 0.08,
      transmission: 0.92,
      ior: 1.49,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      depthWrite: false,
    });

    // 2. Liquid Water Material Inside
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.32,
      roughness: 0.02,
      transmission: 0.96,
      ior: 1.333,
    });

    // 3. Cap Material
    const capColorHex = customization.capColor || accentColor || '#BD00FF';
    const capMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(capColorHex),
      metalness: 0.85,
      roughness: 0.25,
    });

    // 4. Label Material with Canvas Texture
    const initialTexture = createLabelTexture(
      customization,
      accentColor,
      secondaryAccent,
      styleVariant,
      sizeFormat
    );
    labelTextureRef.current = initialTexture;

    const labelMaterial = new THREE.MeshPhysicalMaterial({
      map: initialTexture,
      roughness: 0.18,
      metalness: 0.35,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
    });
    labelMaterialRef.current = labelMaterial;

    // Dimensions based on 500ml vs 1000ml
    const is1L = sizeFormat === '1000ml';
    const radius = is1L ? 0.76 : 0.68;
    const bodyHeight = is1L ? 2.5 : 2.1;
    const shoulderY = bodyHeight / 2 + 0.35;

    // A. Main Bottle Body
    const bodyGeo = new THREE.CylinderGeometry(radius, radius, bodyHeight, 48, 1, false);
    const bodyMesh = new THREE.Mesh(bodyGeo, petMaterial);
    bottleGroup.add(bodyMesh);

    // B. Water Inside
    const waterGeo = new THREE.CylinderGeometry(radius - 0.04, radius - 0.04, bodyHeight - 0.15, 36);
    const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
    waterMesh.position.y = -0.05;
    bottleGroup.add(waterMesh);

    // C. Label Wrap Mesh
    const labelHeight = bodyHeight * 0.62;
    const labelGeo = new THREE.CylinderGeometry(radius + 0.015, radius + 0.015, labelHeight, 48, 1, true);
    const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
    labelMesh.position.y = 0.05;
    bottleGroup.add(labelMesh);

    // D. Shoulder Taper (Cone leading to neck)
    const shoulderGeo = new THREE.CylinderGeometry(0.32, radius, 0.65, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, petMaterial);
    shoulderMesh.position.y = shoulderY;
    bottleGroup.add(shoulderMesh);

    // E. Neck
    const neckGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.4, 48);
    const neckMesh = new THREE.Mesh(neckGeo, petMaterial);
    neckMesh.position.y = shoulderY + 0.45;
    bottleGroup.add(neckMesh);

    // F. Cap
    const capGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.42, 48);
    const capMesh = new THREE.Mesh(capGeo, capMaterial);
    capMesh.position.y = shoulderY + 0.8;
    bottleGroup.add(capMesh);

    // G. Tamper-evident Ring
    const ringGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 48);
    const ringMesh = new THREE.Mesh(ringGeo, capMaterial);
    ringMesh.position.y = shoulderY + 0.52;
    bottleGroup.add(ringMesh);

    // H. Realistic Condensation Droplets (Sparkling water beads)
    const dropletsGroup = new THREE.Group();
    dropletsGroupRef.current = dropletsGroup;
    bottleGroup.add(dropletsGroup);

    const dropletGeo = new THREE.SphereGeometry(0.022, 8, 8);
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      roughness: 0.02,
      transmission: 0.9,
      ior: 1.333,
    });

    // Create 70 random beads on the upper and lower bottle surface
    for (let i = 0; i < 70; i++) {
      const drop = new THREE.Mesh(dropletGeo, dropletMat);
      const angle = Math.random() * Math.PI * 2;
      const r = radius + 0.012;
      const y = (Math.random() - 0.5) * (bodyHeight - 0.3);
      drop.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      drop.scale.set(1, 1.4, 0.8);
      dropletsGroup.add(drop);
    }

    // Floating Atmospheric Particles
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4.2;
      particlePositions[i + 1] = (Math.random() - 0.5) * 4.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4.2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(secondaryAccent),
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      // Dynamic lighting follow
      if (cursorLight && container) {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        cursorLight.position.x = normX * 3;
        cursorLight.position.y = normY * 3;
      }

      if (!isDragging || !bottleGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      bottleGroup.rotation.y += deltaX * 0.01;
      bottleGroup.rotation.x = Math.max(-0.35, Math.min(0.35, bottleGroup.rotation.x + deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mobile touch
    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !bottleGroup || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      bottleGroup.rotation.y += deltaX * 0.01;
      bottleGroup.rotation.x = Math.max(-0.35, Math.min(0.35, bottleGroup.rotation.x + deltaY * 0.005));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let smoothedScrollRotation = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Lerp smooth scroll rotation to prevent abrupt jumps
      const targetScroll = scrollOffsetRef.current;
      smoothedScrollRotation += (targetScroll - smoothedScrollRotation) * 0.08;

      if (bottleGroup) {
        if (autoRotate && !isDragging) {
          bottleGroup.rotation.y += 0.006;
        }

        // Apply scroll-linked subtle rotation
        bottleGroup.rotation.y += smoothedScrollRotation * 0.015;

        // Subtle dynamic tilt as user scrolls past fold
        if (isPastHeroFoldRef.current) {
          const tilt = Math.min(0.18, scrollProgressRef.current * 0.18);
          bottleGroup.rotation.z = Math.sin(elapsedTime * 1.8) * 0.035 - tilt * 0.25;
          bottleGroup.rotation.x = Math.max(-0.25, Math.min(0.25, bottleGroup.rotation.x + Math.sin(elapsedTime * 1.2) * 0.006));
        }

        // Subtle levitating float motion
        bottleGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.05;
      }

      // Soft pulsating neon glow on lights inside the 3D scene when past hero fold
      if (rimLightRef.current) {
        if (isPastHeroFoldRef.current) {
          // Soft rhythmic neon rim pulse
          const pulse = 3.8 + Math.sin(elapsedTime * 2.6) * 1.8;
          rimLightRef.current.intensity = pulse;
        } else {
          rimLightRef.current.intensity = 3.2;
        }
      }

      if (cursorLightRef.current) {
        if (isPastHeroFoldRef.current) {
          const pulse2 = 4.0 + Math.cos(elapsedTime * 2.6) * 1.4;
          cursorLightRef.current.intensity = pulse2;
        } else {
          cursorLightRef.current.intensity = 3.5;
        }
      }

      // Soft pulsating neon ground reflector
      if (groundRingRef.current && groundRingRef.current.material instanceof THREE.MeshBasicMaterial) {
        if (isPastHeroFoldRef.current) {
          groundRingRef.current.material.opacity = 0.22 + Math.sin(elapsedTime * 2.6) * 0.16;
          groundRingRef.current.scale.setScalar(1 + Math.sin(elapsedTime * 2.6) * 0.06);
        } else {
          groundRingRef.current.material.opacity = 0.18;
          groundRingRef.current.scale.setScalar(1);
        }
      }

      if (particles) {
        particles.rotation.y = elapsedTime * (isPastHeroFoldRef.current ? 0.08 : 0.04);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [sizeFormat]);

  // Update dynamic texture on customization / color changes
  useEffect(() => {
    if (!labelMaterialRef.current) return;

    if (labelTextureRef.current) {
      labelTextureRef.current.dispose();
    }

    const newTexture = createLabelTexture(
      customization,
      accentColor,
      secondaryAccent,
      styleVariant,
      sizeFormat
    );
    labelTextureRef.current = newTexture;
    labelMaterialRef.current.map = newTexture;
    labelMaterialRef.current.needsUpdate = true;

    if (rimLightRef.current) {
      rimLightRef.current.color = new THREE.Color(accentColor);
    }
  }, [customization, accentColor, secondaryAccent, styleVariant, sizeFormat]);

  return (
    <div className={`relative ${className} select-none group`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD Indicators */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-space text-slate-300 pointer-events-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BD00FF] animate-ping" />
          <span>DRAG 360° • LIVE REFLECTION SHADER</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl bg-[#0B0E23]/90 border border-white/10 hover:border-[#BD00FF]/40 text-slate-300 hover:text-white transition-all cursor-pointer ${
              autoRotate ? 'text-[#BD00FF]' : 'text-slate-500'
            }`}
            title="Toggle Auto Rotation"
            aria-label="Toggle Auto Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
