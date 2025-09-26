import React from 'react';
import { useGLTF } from "@react-three/drei";
import * as THREE from 'three';
interface ModelProps extends React.ComponentProps<'mesh'> {}

interface GLTFNodes {
  [name: string]: THREE.Mesh;
  Cube001: THREE.Mesh;
}

export default function Model(props: ModelProps) {
  // Destructure 'nodes' to access individual parts of the GLB
  const { nodes } = useGLTF('/earth.glb') as unknown as { nodes: GLTFNodes };
  console.log(nodes);
  // Note: Replace 'pCube1_lambert1_0' with the actual name of your mesh.
  // See the section below on how to find your model's name.
  const earthMesh = nodes.Cube001 as THREE.Mesh;

  return (
    <mesh
      geometry={earthMesh.geometry}  // ✅ Use the specific geometry
      material={earthMesh.material}    // ✅ Use the specific material
      scale={0.002556}
      position={[0, -0.4, 0]}
      {...props} // Allows passing other props like castShadow
    />
  );
}

// Pre-loading the model for faster performance remains a good practice
useGLTF.preload('/earth.glb');

