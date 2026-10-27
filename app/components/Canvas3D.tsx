import { Suspense } from 'react'
import Model from './Model'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
} from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'

export default function Canvas3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas 
        camera={{ position: [0, 0.5, 5], fov: 50 }} 
        shadows
        dpr={typeof window !== 'undefined' && window.devicePixelRatio > 1 ? 1.5 : 1}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          castShadow
        />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="sunset" />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.75}
            scale={10}
            blur={1}
            far={10}
            resolution={256}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            intensity={0.6}
            mipmapBlur
          />
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
