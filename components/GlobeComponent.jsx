import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const GlobeComponent = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // === Scene setup ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Clear any existing canvas
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    mountRef.current.appendChild(renderer.domElement);

    // === Create Globe ===
    // Earth radius in real life is 6371 km
    const globeRadius = 1;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);

    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/assets/images/earth-texture.jpg"); // Replace with your actual texture path
    const bumpMap = textureLoader.load("/assets/images/earth-bump.jpg"); // For topography
    const specularMap = textureLoader.load("/assets/images/earth-specular.jpg"); // For shininess

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specularMap: specularMap,
      specular: new THREE.Color("grey"),
      shininess: 5,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add a soft ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    // Add a directional light to simulate sunlight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vertexNormal;
        void main() {
          vertexNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vertexNormal;
        void main() {
          float intensity = pow(0.65 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.scale.set(1.1, 1.1, 1.1);
    scene.add(atmosphere);

    // === Optional: Add stars in the background ===
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // === Animation ===
    const rotationSpeed = 0.001;

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Mouse interaction for rotation
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0,
    };

    const handleMouseDown = (e) => {
      isDragging = true;
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y,
        };

        const rotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            toRadians(deltaMove.y * 0.5),
            toRadians(deltaMove.x * 0.5),
            0,
            "XYZ"
          )
        );

        globe.quaternion.multiplyQuaternions(
          rotationQuaternion,
          globe.quaternion
        );
      }

      previousMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseUp = (e) => {
      isDragging = false;
    };

    // Convert degrees to radians
    const toRadians = (angle) => {
      return angle * (Math.PI / 180);
    };

    // Add mouse event listeners
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Auto-rotate when not being dragged
      if (!isDragging) {
        globe.rotation.y += rotationSpeed;
      }

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of resources
      globeGeometry.dispose();
      globeMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="globe-container"
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

export default GlobeComponent;
