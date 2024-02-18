// https://github.com/studio-freight/lenis
// TODO refactor for app-directory
// See https://github.com/pmndrs/react-three-next/pull/123

// 1 - wrap <Component {...pageProps} /> with <Scroll /> in _app.jsx
// 2 - add <ScrollTicker /> wherever in the canvas
// 3 - enjoy
import { addEffect, useFrame } from '@react-three/fiber'
import Lenis from '@studio-freight/lenis'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useScroll } from './useScroll'

const state = {
    top: 0,
    progress: 0,
}

const { damp } = THREE.MathUtils

export function ScrollLayout({ children }: any) {
    const isEnableScroll = useScroll(state => state.isEnableScroll)
    const lenis = useRef<any>()
    useEffect(() => {
        lenis.current = new Lenis({
            // // @ts-expect-error
            // wrapper: wrapper.current,
            // // @ts-expect-error
            // content: content.current,
            lerp: 0.075,
            // duration: 1.2,
            // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            // @ts-expect-error
            direction: 'vertical', // vertical, horizontal
            gestureDirection: 'vertical', // vertical, horizontal, both
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 1,
            infinite: false,
        })

        lenis.current.on('scroll', ({ scroll, progress }: any) => {
            state.top = scroll
            state.progress = progress
        })
        const effectSub = addEffect((time) => lenis.current.raf(time))
        return () => {
            effectSub()
            lenis.current.destroy()
        }
    }, [])
    useEffect(() => {
        if (isEnableScroll) {
            lenis.current.start()
            enableNativeScroll(true)
        } else {
            lenis.current.stop()
            enableNativeScroll(false)
        }
    }, [isEnableScroll])

    return <>{children}</>
}

export const ScrollTicker = ({ smooth = 9999999 }) => {
    useFrame(({ viewport, camera }, delta) => {
        camera.position.y = damp(camera.position.y, -state.progress * viewport.height, smooth, delta)
    })

    return null
}

export const enableNativeScroll = (value: boolean) => {
    if (!document) { return }
    const html = document.querySelector('html')
    if (!html) { return }
    if (!value) {
        html.style.position = 'relative'
        html.style.overflow = 'hidden'
        html.style.height = '100%'
    } else {
        html.style.removeProperty('position')
        html.style.removeProperty('overflow')
        html.style.removeProperty('height')
    }
}
