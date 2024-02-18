/**
 * @fileoverview Sets full device screen height to html tag for CSS use
 */

import { useEffect } from "react"
const maxWidth = 1080

export const useLvh = () => {
    useEffect(() => {
        let rq: any
        let startTime = performance.now()
        window.addEventListener('resize', update)
        render(0)
        function render( time: number ) {
            if (time - startTime > 100) {
                update()
                startTime = performance.now()
            }
            rq = requestAnimationFrame(render)
        }
        function update() {
            if (window.innerWidth > maxWidth) {
                if (document.documentElement.style.getPropertyValue('--vh')) {
                    document.documentElement.style.removeProperty('--vh')
                }
                return
            }
            const vh = window.outerHeight * 0.01;
            if (document.documentElement.style.getPropertyValue('--vh') !== `${vh}px`) {
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }
        }
        return () =>  { window.removeEventListener('resize', update); cancelAnimationFrame(rq) }
    }, [])
}

export const Lvh = () => {
    useLvh()
    return null
}