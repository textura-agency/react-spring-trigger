import * as THREE from 'three'
import { useRef } from 'react'

import { r3f } from './components/Three'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { useControls, Leva } from 'leva'


// Everything defined in here will persist between route changes, only children are swapped
const CanvasLayout = ({ children }: any) => {
    const ref = useRef()
    const data = useControls('GL', {
        exposure: { value: 0, min: -5, max: 5 },
        toneMapping: {
            options: {
                'filmic': THREE.ACESFilmicToneMapping,
                'linear': THREE.LinearToneMapping,
                'notone': THREE.NoToneMapping,
                'reinhard': THREE.ReinhardToneMapping,
                'cineon': THREE.CineonToneMapping
            },
        },
        encoding: {
            options: {
                'rgb': THREE.SRGBColorSpace,
                'linear': THREE.LinearSRGBColorSpace,
            }
        },
        background: { value: '#ffd4f5' },
        enableBg: { value: false },
        hideCanvas: { value: false }
    })

    return (
        <div
            // @ts-expect-error
            ref={ref}
            style={{
                position: 'relative',
                width: ' 100%',
                height: '100%',
                minHeight: 'calc(var(--vh, 1vh) * 100)',
            }}
        >
            {children}
            <Canvas 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: 'calc(var(--vh, 1vh) * 100)',
                    pointerEvents: 'none',
                    visibility: data.hideCanvas ? 'hidden' : 'visible'
                }}
                gl={{
                    powerPreference: "high-performance",
                    alpha: true,
                    antialias: true,
                    toneMappingExposure: Math.pow(2, data.exposure),
                    toneMapping: data.toneMapping,
                    outputColorSpace: data.encoding
                }}
                // @ts-expect-error
                eventSource={ref}
                eventPrefix='client'
            >
                { data.enableBg && <color attach={'background'} args={[data.background]} /> }
                {/* @ts-ignore */}
                <r3f.Out />
                <Preload all />
            </Canvas>
            <Leva hidden={false} />
        </div>
    )
}

export { CanvasLayout }
