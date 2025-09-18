import React, { useRef, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Fallback Earth component if GLTF fails
function FallbackEarth() {
  const earthRef = useRef<any>(null)
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={earthRef}>
      {/* Main Earth sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Continents */}
      <mesh>
        <sphereGeometry args={[1.51, 32, 32]} />
        <meshStandardMaterial
          color="#16a34a"
          transparent
          opacity={0.8}
          roughness={0.8}
        />
      </mesh>
    </group>
  )
}

function GLTFEarth(props: any) {
  const { nodes, materials } = useGLTF('/assets/models/earth.glb') as any
  const modelRef = useRef<any>(null)
  
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005
    }
  })

  // Find the first mesh in the GLTF scene
  const firstMesh = Object.values(nodes).find((node: any) => node.isMesh) as THREE.Mesh;

  if (!firstMesh) {
    console.warn('No mesh found in GLTF model, rendering fallback.')
    return <FallbackEarth />
  }

  // Use the material that came with the mesh, or a fallback
  const earthMaterial = firstMesh.material || new THREE.MeshStandardMaterial({
    color: '#4a90e2',
    roughness: 0.7,
    metalness: 0.1
  });

  return (
    <group {...props} ref={modelRef} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={firstMesh.geometry}
        material={earthMaterial}
        scale={[2, 2, 2]}
        position={[0, 0, 0]}
      />
    </group>
  )
}

export function Model(props: any) {
  return (
    <Suspense fallback={<FallbackEarth />}>
      <GLTFEarth {...props} />
    </Suspense>
  )
}

useGLTF.preload('/assets/models/earth.glb')