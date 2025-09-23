"use client";
import React, { useRef, useEffect } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Model(props) {
  const groupRef = useRef();
  const { nodes, materials } = useGLTF("/assets/earths.glb");
  
  // Create a procedural Earth texture as fallback
  const createEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create Earth-like texture
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e40af'); // Ocean blue
    gradient.addColorStop(0.3, '#0ea5e9'); // Light blue
    gradient.addColorStop(0.7, '#16a34a'); // Land green
    gradient.addColorStop(1, '#166534'); // Dark green
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add continents pattern
    ctx.fillStyle = '#16a34a';
    
    // North America
    ctx.beginPath();
    ctx.ellipse(300, 300, 120, 100, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // South America  
    ctx.beginPath();
    ctx.ellipse(400, 600, 60, 140, 0.2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Africa
    ctx.beginPath();
    ctx.ellipse(1000, 400, 100, 160, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.ellipse(950, 250, 50, 60, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.ellipse(1400, 300, 200, 120, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.ellipse(1600, 650, 80, 50, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add cloud patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 40 + 15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Auto rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Apply custom texture to materials
  useEffect(() => {
    const earthTexture = createEarthTexture();
    
    // Apply texture to all materials in the GLB model
    Object.values(materials).forEach((material) => {
      if (material.isMeshStandardMaterial || material.isMeshPhongMaterial) {
        material.map = earthTexture;
        material.needsUpdate = true;
      }
    });
  }, [materials]);

  // Get the main mesh from your GLB model
  const getMesh = () => {
    // Try common mesh names in GLB files
    const possibleMeshes = [
      'Sphere_Material002_0',
      'Earth',
      'Globe', 
      'Planet',
      'Sphere',
      'Object_0',
      'Mesh_0'
    ];
    
    for (const meshName of possibleMeshes) {
      if (nodes[meshName]) {
        return nodes[meshName];
      }
    }
    
    // If no specific mesh found, return the first mesh-like node
    const firstMesh = Object.values(nodes).find(node => 
      node.geometry && node.material
    );
    
    return firstMesh;
  };

  const mainMesh = getMesh();

  if (!mainMesh) {
    // Fallback: create a sphere if GLB doesn't load properly
    return (
      <group ref={groupRef} {...props} dispose={null}>
        <mesh scale={3}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            map={createEarthTexture()}
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
        
        {/* Atmosphere */}
        <mesh scale={3.2}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color="#4FC3F7"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Main GLB mesh */}
      <mesh
        castShadow
        receiveShadow
        geometry={mainMesh.geometry}
        material={mainMesh.material || materials["Material.002"]}
        rotation={[0, 0, 0]}
        scale={30000000}
      />
      
      {/* Add atmosphere glow around the GLB model */}
      <mesh scale={3.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            time: { value: 0 }
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
          `}
        />
      </mesh>
    </group>
  );
}

// Preload the GLB model
useGLTF.preload("/assets/earths.glb");