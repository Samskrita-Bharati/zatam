import { useEffect, useRef } from "react";
import * as THREE from "three";
const DarkBackground = () => {
    const canvasRef = useRef();
      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Stars
        const starCount = 6000;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
          const x = (Math.random() - 0.5) * 2000;
          const y = (Math.random() - 0.5) * 2000;
          const z = (Math.random() - 0.5) * 2000;
          positions.set([x, y, z], i * 3);
        }

        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );

        const starMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.75,
          sizeAttenuation: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);

        // Animation loop
        const animate = () => {
          starField.rotation.x += 0.0005;
          starField.rotation.y += 0.0007;
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };

        // Defer animation to next frame (to avoid invalid uniforms)
        requestAnimationFrame(animate);

        // Cleanup
        return () => {
          starGeometry.dispose();
          starMaterial.dispose();
          scene.remove(starField);
          renderer.dispose();
        };
      }, []);

  return (
    <div className="fixed inset-0 z-[-5]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default DarkBackground;
