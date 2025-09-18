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
  
  // Add rotation animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005
    }
  })

  console.log('GLTF nodes:', nodes)
  console.log('GLTF materials:', materials)

  // Check if the model loaded properly
  if (!nodes?.Cube001?.geometry) {
    console.warn('GLTF Cube001 not found, available nodes:', Object.keys(nodes || {}))
    return <FallbackEarth />
  }

  // Try to find the material in different locations
  let earthMaterial = materials?.["Default OBJ"] || 
                      nodes?.["Default OBJ"] ||
                      materials?.[Object.keys(materials)[0]]

  // If no material found, create a fallback
  if (!earthMaterial) {
    earthMaterial = new THREE.MeshStandardMaterial({
      color: '#4a90e2',
      roughness: 0.7,
      metalness: 0.1
    })
  }

  return (
    <group {...props} ref={modelRef} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        material={earthMaterial}
        scale={[2, 2, 2]} // Increased scale for better visibility
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