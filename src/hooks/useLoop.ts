import { useEffect } from "react"

export interface LoopProps {
    onMount?: () => void
    onUnMount?: () => void
    framerate?: number
}
export const useLoop = (onRender: (time: number) => void, props: LoopProps = {}) => {
    useEffect(() => {
        let rq: any
        let startTime = performance.now()
        props.onMount && props.onMount()
        render(0)
        function render( time: number ) {
            if (time - startTime > (props.framerate || 100)) {
                onRender(time)
                startTime = performance.now()
            }
            rq = requestAnimationFrame(render)
        }
        return () =>  { cancelAnimationFrame(rq); props.onUnMount && props.onUnMount() }
    }, [])
}