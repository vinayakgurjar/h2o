import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BottleCustomization } from '../../types';
import { Bottle3DCanvas } from './Bottle3DCanvas';
import {
  RotateCw,
  Play,
  Pause,
  Layers,
  Sparkles,
  Droplets,
  Zap,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface BottleSequenceViewerProps {
  customization: BottleCustomization;
  accentColor?: string;
  secondaryAccent?: string;
  sizeFormat?: '500ml' | '1000ml';
  styleVariant?: 'MINIMAL' | 'LUXURY' | 'BOLD' | 'NATURAL' | 'CORPORATE' | 'CYBER';
  scrollProgress?: number;
  scrollRotationOffset?: number;
  isPastHeroFold?: boolean;
  className?: string;
}

const TOTAL_FRAMES = 60; // 60 frames across 360 degrees (6° per frame)

export const BottleSequenceViewer: React.FC<BottleSequenceViewerProps> = ({
  customization,
  accentColor: propAccentColor = '#BD00FF',
  secondaryAccent = '#00F0FF',
  sizeFormat = '500ml',
  styleVariant = 'BOLD',
  scrollProgress = 0,
  scrollRotationOffset = 0,
  isPastHeroFold = false,
  className = 'w-full h-full',
}) => {
  const accentColor = customization.capColor || propAccentColor;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewer modes: 'sequence' (instant 60fps frame scrubber) vs 'webgl' (full 3D orbit)
  const [viewMode, setViewMode] = useState<'sequence' | 'webgl'>('sequence');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [bufferedCount, setBufferedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasCondensation, setHasCondensation] = useState(true);
  const [scrubSource, setScrubSource] = useState<'scroll' | 'drag' | 'auto' | 'idle'>('idle');

  // Internal frame memory cache: Array of HTMLCanvasElement
  const framesCacheRef = useRef<HTMLCanvasElement[]>([]);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(0);
  const playAnimationRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef(-1);

  // 1. Draw a specific frame onto the visible canvas
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const normalizedIdx = ((frameIdx % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
    const frameCanvas = framesCacheRef.current[normalizedIdx];

    if (frameCanvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(frameCanvas, 0, 0, canvas.width, canvas.height);
      lastDrawnFrameRef.current = normalizedIdx;
    } else {
      // Fallback: draw quick procedural frame 0 if cache is still building
      drawInstantProceduralFrame(ctx, canvas.width, canvas.height, normalizedIdx);
    }
  }, []);

  // Quick synchronous procedural renderer for frame 0 (renders in < 2ms, zero blank screen)
  const drawInstantProceduralFrame = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    frame: number
  ) => {
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 + 10;
    const bottleW = w * 0.38;
    const bottleH = h * 0.72;
    const is1L = sizeFormat === '1000ml';

    // Caustic Ground Shadow & Neon Glow
    const shadowGrad = ctx.createRadialGradient(cx, cy + bottleH * 0.46, 10, cx, cy + bottleH * 0.46, bottleW * 1.2);
    shadowGrad.addColorStop(0, `${accentColor}44`);
    shadowGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.15)');
    shadowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + bottleH * 0.46, bottleW * 0.9, bottleW * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bottle Body (Virgin PET Glass Silhouette)
    const glassGrad = ctx.createLinearGradient(cx - bottleW / 2, 0, cx + bottleW / 2, 0);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    glassGrad.addColorStop(0.15, 'rgba(224, 242, 254, 0.35)');
    glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
    glassGrad.addColorStop(0.85, 'rgba(224, 242, 254, 0.35)');
    glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.18)');

    ctx.save();
    // Rounded body
    ctx.fillStyle = glassGrad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;

    const bodyY = cy - bottleH * 0.18;
    const bodyHeight = bottleH * 0.62;
    const rad = 18;

    ctx.beginPath();
    ctx.roundRect(cx - bottleW / 2, bodyY, bottleW, bodyHeight, rad);
    ctx.fill();
    ctx.stroke();

    // Label on Bottle
    const labelHeight = bodyHeight * 0.64;
    const labelY = bodyY + (bodyHeight - labelHeight) / 2;
    const labelGrad = ctx.createLinearGradient(cx - bottleW / 2, 0, cx + bottleW / 2, 0);
    labelGrad.addColorStop(0, '#060814');
    labelGrad.addColorStop(0.5, '#12182E');
    labelGrad.addColorStop(1, '#060814');

    ctx.fillStyle = labelGrad;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - bottleW / 2 + 2, labelY, bottleW - 4, labelHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Label Text (Dynamic Brand Name)
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '900 24px "Syne", sans-serif';
    ctx.fillText((customization.brandName || 'YOUR BRAND').toUpperCase(), cx, labelY + labelHeight * 0.38);

    ctx.fillStyle = secondaryAccent;
    ctx.font = 'bold 10px "Space Grotesk", sans-serif';
    ctx.fillText((customization.tagline || 'ON EVERY TABLE.').toUpperCase(), cx, labelY + labelHeight * 0.52);

    ctx.fillStyle = accentColor;
    ctx.font = '800 10px "Space Grotesk", sans-serif';
    ctx.fillText(`VIRGIN CLARITY PET • ${sizeFormat.toUpperCase()}`, cx, labelY + labelHeight * 0.72);

    // Shoulder Taper
    ctx.beginPath();
    ctx.moveTo(cx - bottleW / 2, bodyY);
    ctx.lineTo(cx - bottleW * 0.22, bodyY - bottleH * 0.16);
    ctx.lineTo(cx + bottleW * 0.22, bodyY - bottleH * 0.16);
    ctx.lineTo(cx + bottleW / 2, bodyY);
    ctx.closePath();
    ctx.fillStyle = glassGrad;
    ctx.fill();
    ctx.stroke();

    // Neck
    const neckY = bodyY - bottleH * 0.25;
    const neckW = bottleW * 0.42;
    ctx.beginPath();
    ctx.roundRect(cx - neckW / 2, neckY, neckW, bottleH * 0.1, 4);
    ctx.fillStyle = glassGrad;
    ctx.fill();
    ctx.stroke();

    // Cap (Custom Color)
    const capY = neckY - bottleH * 0.12;
    const capW = bottleW * 0.46;
    const capGrad = ctx.createLinearGradient(cx - capW / 2, 0, cx + capW / 2, 0);
    capGrad.addColorStop(0, '#000000');
    capGrad.addColorStop(0.3, accentColor);
    capGrad.addColorStop(0.7, '#FFFFFF');
    capGrad.addColorStop(1, '#000000');

    ctx.beginPath();
    ctx.roundRect(cx - capW / 2, capY, capW, bottleH * 0.12, 6);
    ctx.fillStyle = capGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.stroke();

    // Subtle condensation specks
    if (hasCondensation) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      for (let i = 0; i < 28; i++) {
        const dx = cx - bottleW * 0.4 + ((i * 37) % (bottleW * 0.8));
        const dy = bodyY + 15 + ((i * 49) % (bodyHeight - 30));
        ctx.beginPath();
        ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  };

  // Helper to generate dynamic label canvas texture for Three.js
  const createLabelCanvas = (
    cust: BottleCustomization,
    accent: string,
    secondary: string,
    variant: string,
    size: string
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    if (variant === 'LUXURY') {
      ctx.fillStyle = '#08080C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

      ctx.fillStyle = '#F5D77F';
      ctx.textAlign = 'center';
      ctx.font = '900 84px "Playfair Display", Georgia, serif';
      ctx.fillText((cust.brandName || 'SAYAJI RESERVE').toUpperCase(), canvas.width / 2, 360);

      ctx.font = '500 28px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText((cust.tagline || 'CRAFTED HOSPITALITY HYDRATION').toUpperCase(), canvas.width / 2, 440);

      ctx.font = '600 24px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#F5D77F';
      ctx.fillText(`PREMIUM ARTESIAN • ${size.toUpperCase()}`, canvas.width / 2, 540);
    } else if (variant === 'MINIMAL') {
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#050505';
      ctx.textAlign = 'center';
      ctx.font = '900 90px "Syne", sans-serif';
      ctx.fillText((cust.brandName || 'MONOCHROME').toUpperCase(), canvas.width / 2, 380);

      ctx.font = 'bold 24px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText((cust.tagline || 'SPECIALTY COFFEE & ARTISAN DINING').toUpperCase(), canvas.width / 2, 430);

      ctx.font = '600 22px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(`PACKAGED DRINKING WATER · ${size.toUpperCase()}`, canvas.width / 2, 550);
    } else {
      // Cyber / Streetwear Bold
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, '#04060C');
      grad.addColorStop(0.3, '#10172E');
      grad.addColorStop(0.5, '#1B2344');
      grad.addColorStop(0.7, '#10172E');
      grad.addColorStop(1, '#04060C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      ctx.shadowBlur = 0;
      ctx.fillStyle = secondary || '#00F0FF';
      ctx.font = 'bold 24px "Space Grotesk", sans-serif';
      ctx.fillText('CUSTOM PACKAGING LAB // 360° SEQUENCE', 70, 75);
      ctx.fillText(`CHASSIS: ${size.toUpperCase()}`, canvas.width - 240, 75);

      ctx.shadowColor = accent || '#BD00FF';
      ctx.shadowBlur = 28;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = '900 130px "Syne", sans-serif';
      ctx.fillText((cust.brandName || 'YOUR BRAND').toUpperCase(), canvas.width / 2, 380);

      ctx.shadowBlur = 10;
      ctx.font = 'bold 30px "Space Grotesk", sans-serif';
      ctx.fillStyle = secondary || '#00F0FF';
      ctx.fillText((cust.tagline || 'ON EVERY TABLE.').toUpperCase(), canvas.width / 2, 440);

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(189, 0, 255, 0.15)';
      ctx.fillRect(canvas.width / 2 - 280, 500, 560, 64);
      ctx.strokeStyle = accent || '#BD00FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width / 2 - 280, 500, 560, 64);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 28px "Space Grotesk", sans-serif';
      ctx.fillText(`VIRGIN CLARITY PET • ${size.toUpperCase()}`, canvas.width / 2, 542);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '20px "Space Grotesk", sans-serif';
      ctx.fillText('PACKAGED DRINKING WATER • 100% RECYCLABLE', canvas.width / 2, 640);
      ctx.fillText('DESIGNED TO BE PHOTOGRAPHED & REMEMBERED', canvas.width / 2, 675);

      // Barcode
      ctx.fillStyle = '#FFFFFF';
      for (let b = 0; b < 44; b++) {
        const bw = b % 4 === 0 ? 5 : b % 2 === 0 ? 2 : 4;
        ctx.fillRect(360 + b * 7, 750, bw, 50);
      }
    }

    return canvas;
  };

  // 2. Offscreen Frame Pre-rendering Engine:
  // Pre-computes 60 high-definition frames of the 3D bottle in memory using Three.js offscreen renderer
  useEffect(() => {
    let isCancelled = false;
    setIsBuffering(true);
    setBufferedCount(0);

    const renderWidth = 700;
    const renderHeight = 850;

    // Create offscreen canvas and renderer
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = renderWidth;
    offscreenCanvas.height = renderHeight;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: offscreenCanvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('[BottleSequenceViewer] Offscreen WebGL context unavailable, using procedural fallback', e);
    }

    if (!renderer) {
      // Procedural fallback: fill all 60 frames immediately using 2D canvas
      const generatedFrames: HTMLCanvasElement[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const fc = document.createElement('canvas');
        fc.width = renderWidth;
        fc.height = renderHeight;
        const fctx = fc.getContext('2d');
        if (fctx) drawInstantProceduralFrame(fctx, renderWidth, renderHeight, i);
        generatedFrames.push(fc);
      }
      framesCacheRef.current = generatedFrames;
      setIsBuffering(false);
      setBufferedCount(TOTAL_FRAMES);
      drawFrame(currentFrame);
      return;
    }

    renderer.setSize(renderWidth, renderHeight);
    renderer.setPixelRatio(1.5);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Setup 3D Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, renderWidth / renderHeight, 0.1, 100);
    const cameraDist = sizeFormat === '1000ml' ? 5.8 : 5.0;
    camera.position.set(0, 0.1, cameraDist);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 3.4);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const cursorLight = new THREE.PointLight(new THREE.Color(secondaryAccent), 3.5, 12);
    cursorLight.position.set(2, 1, 3);
    scene.add(cursorLight);

    // Ground Ring
    const groundGeo = new THREE.RingGeometry(0.8, 2.2, 36);
    const groundMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const groundRing = new THREE.Mesh(groundGeo, groundMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = sizeFormat === '1000ml' ? -1.8 : -1.55;
    scene.add(groundRing);

    // Bottle Group
    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);

    // Bottle Materials
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

    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.32,
      roughness: 0.02,
      transmission: 0.96,
      ior: 1.333,
    });

    const capMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      metalness: 0.85,
      roughness: 0.25,
    });

    const labelCanvas = createLabelCanvas(customization, accentColor, secondaryAccent, styleVariant, sizeFormat);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.MeshPhysicalMaterial({
      map: labelTexture,
      roughness: 0.18,
      metalness: 0.35,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
    });

    const is1L = sizeFormat === '1000ml';
    const radius = is1L ? 0.76 : 0.68;
    const bodyHeight = is1L ? 2.5 : 2.1;
    const shoulderY = bodyHeight / 2 + 0.35;

    // Body
    const bodyGeo = new THREE.CylinderGeometry(radius, radius, bodyHeight, 48, 1, false);
    bottleGroup.add(new THREE.Mesh(bodyGeo, petMaterial));

    // Water
    const waterGeo = new THREE.CylinderGeometry(radius - 0.04, radius - 0.04, bodyHeight - 0.15, 36);
    const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
    waterMesh.position.y = -0.05;
    bottleGroup.add(waterMesh);

    // Label Wrap
    const labelHeight = bodyHeight * 0.62;
    const labelGeo = new THREE.CylinderGeometry(radius + 0.015, radius + 0.015, labelHeight, 48, 1, true);
    const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
    labelMesh.position.y = 0.05;
    bottleGroup.add(labelMesh);

    // Shoulder & Neck & Cap
    const shoulderGeo = new THREE.CylinderGeometry(0.32, radius, 0.65, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, petMaterial);
    shoulderMesh.position.y = shoulderY;
    bottleGroup.add(shoulderMesh);

    const neckGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.4, 48);
    const neckMesh = new THREE.Mesh(neckGeo, petMaterial);
    neckMesh.position.y = shoulderY + 0.45;
    bottleGroup.add(neckMesh);

    const capGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.42, 48);
    const capMesh = new THREE.Mesh(capGeo, capMaterial);
    capMesh.position.y = shoulderY + 0.8;
    bottleGroup.add(capMesh);

    // Condensation beads
    if (hasCondensation) {
      const dropGeo = new THREE.SphereGeometry(0.022, 6, 6);
      const dropMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        transmission: 0.9,
      });
      const dropsGroup = new THREE.Group();
      bottleGroup.add(dropsGroup);
      for (let i = 0; i < 55; i++) {
        const drop = new THREE.Mesh(dropGeo, dropMat);
        const angle = (i * 0.42) % (Math.PI * 2);
        const r = radius + 0.012;
        const y = (Math.sin(i * 1.7) * 0.5) * (bodyHeight - 0.4);
        drop.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
        drop.scale.set(1, 1.4, 0.8);
        dropsGroup.add(drop);
      }
    }

    // Step-by-step non-blocking batch rendering of all 60 frames
    const generatedFrames: HTMLCanvasElement[] = [];
    let frameIndex = 0;

    const renderNextBatch = () => {
      if (isCancelled) {
        renderer?.dispose();
        return;
      }

      // Render 6 frames per tick to keep main UI thread running at 60fps
      const batchEnd = Math.min(frameIndex + 8, TOTAL_FRAMES);

      for (; frameIndex < batchEnd; frameIndex++) {
        const angle = (frameIndex / TOTAL_FRAMES) * Math.PI * 2;
        bottleGroup.rotation.y = angle;

        renderer!.render(scene, camera);

        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = renderWidth;
        frameCanvas.height = renderHeight;
        const fctx = frameCanvas.getContext('2d');
        if (fctx) {
          fctx.drawImage(offscreenCanvas, 0, 0, renderWidth, renderHeight);
        }
        generatedFrames[frameIndex] = frameCanvas;
      }

      setBufferedCount(frameIndex);

      // Render Frame 0 immediately onto the screen as soon as it's ready!
      if (frameIndex >= 1 && framesCacheRef.current.length === 0) {
        framesCacheRef.current = generatedFrames;
        drawFrame(currentFrame);
      }

      if (frameIndex < TOTAL_FRAMES) {
        requestAnimationFrame(renderNextBatch);
      } else {
        // Complete!
        framesCacheRef.current = generatedFrames;
        setIsBuffering(false);
        drawFrame(currentFrame);
        renderer?.dispose();
      }
    };

    renderNextBatch();

    return () => {
      isCancelled = true;
      renderer?.dispose();
    };
  }, [
    customization.brandName,
    customization.tagline,
    customization.capColor,
    accentColor,
    secondaryAccent,
    sizeFormat,
    styleVariant,
    hasCondensation,
    drawFrame,
  ]);

  // 3. Resize handling for the visible canvas
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      drawFrame(currentFrame);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame, drawFrame]);

  // 4. Frame-Accurate Scroll Scrubbing Effect!
  // Maps page scroll progress directly to the 360 sequence frames
  useEffect(() => {
    if (isDragging || isPlaying) return;

    // Calculate frame offset: scroll progress covers 2 full 360 spins across the section
    const scrollFactor = 2.4;
    const continuousFrame = (scrollProgress * TOTAL_FRAMES * scrollFactor) + (scrollRotationOffset * 10);
    const targetFrame = Math.floor(continuousFrame) % TOTAL_FRAMES;
    const normalizedFrame = ((targetFrame % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;

    if (normalizedFrame !== currentFrame) {
      setCurrentFrame(normalizedFrame);
      setScrubSource('scroll');
      drawFrame(normalizedFrame);
    }
  }, [scrollProgress, scrollRotationOffset, isDragging, isPlaying, currentFrame, drawFrame]);

  // 5. Interactive Drag / Touch Scrubbing on Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setIsPlaying(false);
    setScrubSource('drag');
    dragStartXRef.current = e.clientX;
    dragStartFrameRef.current = currentFrame;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // 5 pixels of drag per frame gives a precise, high-end scrub feel
    const frameDelta = Math.floor(deltaX / 6);
    const nextFrame = ((dragStartFrameRef.current + frameDelta) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;

    if (nextFrame !== currentFrame) {
      setCurrentFrame(nextFrame);
      drawFrame(nextFrame);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // 6. Turntable Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      if (playAnimationRef.current) cancelAnimationFrame(playAnimationRef.current);
      return;
    }

    let lastTime = performance.now();
    const fps = 30;
    const frameInterval = 1000 / fps;

    const loop = (now: number) => {
      if (now - lastTime >= frameInterval) {
        lastTime = now;
        setCurrentFrame((prev) => {
          const next = (prev + 1) % TOTAL_FRAMES;
          drawFrame(next);
          return next;
        });
        setScrubSource('auto');
      }
      playAnimationRef.current = requestAnimationFrame(loop);
    };

    playAnimationRef.current = requestAnimationFrame(loop);
    return () => {
      if (playAnimationRef.current) cancelAnimationFrame(playAnimationRef.current);
    };
  }, [isPlaying, drawFrame]);

  // Direct timeline scrub slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentFrame(val);
    setScrubSource('drag');
    drawFrame(val);
  };

  const stepFrame = (delta: number) => {
    const next = ((currentFrame + delta) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
    setCurrentFrame(next);
    setScrubSource('drag');
    drawFrame(next);
  };

  const currentAngleDeg = Math.round((currentFrame / TOTAL_FRAMES) * 360);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      
      {/* 3D WebGL Studio Mode Switcher Fallback */}
      {viewMode === 'webgl' ? (
        <div className="w-full h-full relative">
          <Bottle3DCanvas
            customization={customization}
            accentColor={accentColor}
            secondaryAccent={secondaryAccent}
            sizeFormat={sizeFormat}
            styleVariant={styleVariant}
            interactive={true}
            autoRotateDefault={true}
            scrollRotationOffset={scrollRotationOffset}
            isPastHeroFold={isPastHeroFold}
            scrollProgress={scrollProgress}
            className="w-full h-full"
          />

          {/* Mode Switcher Return Button */}
          <div className="absolute top-4 left-4 z-30">
            <button
              type="button"
              onClick={() => setViewMode('sequence')}
              className="py-1.5 px-3 rounded-xl bg-[#050505]/90 hover:bg-[#0E1322] border border-[#00F0FF]/50 text-[#00F0FF] text-[10px] font-space font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Switch to Instant Sequence Scrubber (60 FPS)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Instant Image Sequence Scrubber Canvas */
        <div ref={containerRef} className="w-full h-full relative flex flex-col items-center justify-center">
          
          {/* Main Scrub Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full object-contain cursor-ew-resize touch-none"
            aria-label="360 Image Sequence Product Viewer. Drag left or right to scrub frames."
          />

          {/* Top HUD Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
            {/* Status & Mode Indicator */}
            <div className="pointer-events-auto flex items-center gap-2">
              <div className="bg-[#050505]/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isBuffering ? 'bg-[#BD00FF] animate-ping' : 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]'
                  }`}
                />
                <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-200">
                  {isBuffering
                    ? `BUFFERING SEQUENCE ${bufferedCount}/${TOTAL_FRAMES}`
                    : 'INSTANT 360° SEQUENCE · 60 FPS'}
                </span>
                <span className="text-white/20 text-xs">/</span>
                <span className="text-[10px] font-space font-black text-[#00F0FF]">
                  FRAME {String(currentFrame + 1).padStart(2, '0')}/{TOTAL_FRAMES}
                </span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-[10px] font-space text-slate-400">
                  {currentAngleDeg}°
                </span>
              </div>
            </div>

            {/* Switch to WebGL 3D Orbit Studio */}
            <button
              type="button"
              onClick={() => setViewMode('webgl')}
              className="pointer-events-auto hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#050505]/85 hover:bg-[#0E1322] border border-white/15 hover:border-[#BD00FF]/50 text-slate-300 hover:text-white text-[10px] font-space font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#BD00FF]" />
              <span>3D Orbit Mode</span>
            </button>
          </div>

          {/* Scrub Guide Floating Tag */}
          <div className="absolute top-16 left-4 pointer-events-none z-10 hidden sm:block">
            <div className="text-[9px] font-space font-medium text-slate-400 bg-[#050505]/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#00F0FF]" />
              <span>SCROLL PAGE OR DRAG HORIZONTALLY TO SCRUB 360°</span>
            </div>
          </div>

          {/* Bottom Interactive HUD: Scrubber Rail, Frame Steppers & Turntable Control */}
          <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-auto">
            <div className="bg-[#050505]/90 backdrop-blur-xl border border-white/15 p-2.5 rounded-2xl shadow-2xl flex flex-col gap-2">
              
              {/* Timeline Track with Draggable Thumb */}
              <div className="flex items-center gap-3">
                
                {/* Play / Pause Turntable Button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Pause 360 rotation' : 'Play 360 rotation'}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#BD00FF] text-white shadow-[0_0_12px_rgba(189,0,255,0.5)]'
                      : 'bg-[#0E1322] hover:bg-[#1A223B] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                {/* Step Back Frame */}
                <button
                  type="button"
                  onClick={() => stepFrame(-1)}
                  title="Previous frame (-6°)"
                  className="p-1.5 rounded-lg bg-[#0E1322] hover:bg-[#1A223B] text-slate-400 hover:text-white border border-white/10 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Scrubber Range Slider */}
                <div className="flex-1 relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={TOTAL_FRAMES - 1}
                    value={currentFrame}
                    onChange={handleSliderChange}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-[#BD00FF] focus:outline-none"
                    aria-label="Frame sequence scrubber position"
                  />
                  {/* Neon position marker ticks */}
                  <div
                    className="absolute h-3 w-1 bg-[#00F0FF] rounded-full pointer-events-none shadow-[0_0_8px_#00F0FF] -translate-x-1/2"
                    style={{ left: `${(currentFrame / (TOTAL_FRAMES - 1)) * 100}%` }}
                  />
                </div>

                {/* Step Forward Frame */}
                <button
                  type="button"
                  onClick={() => stepFrame(1)}
                  title="Next frame (+6°)"
                  className="p-1.5 rounded-lg bg-[#0E1322] hover:bg-[#1A223B] text-slate-400 hover:text-white border border-white/10 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Condensation Toggle */}
                <button
                  type="button"
                  onClick={() => setHasCondensation(!hasCondensation)}
                  title="Toggle Ice-Cold Condensation Sheen"
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    hasCondensation
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'bg-[#0E1322] text-slate-500 border border-white/10'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                </button>

              </div>

              {/* Lower HUD Status Line */}
              <div className="flex items-center justify-between text-[9px] font-space text-slate-400 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">DRIVE:</span>
                  <span className="text-[#00F0FF] uppercase">{scrubSource} SCRUB</span>
                  <span className="text-white/20">·</span>
                  <span>{TOTAL_FRAMES} ULTRA-HD FRAMES</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline">ZERO LATENCY PRELOAD</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
