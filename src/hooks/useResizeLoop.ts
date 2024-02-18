import { useRef } from "react"
import { useLoop } from "./useLoop"
import type { LoopProps } from "./useLoop"

export const useResizeLoop = (onResize: (time: number) => void, props?: LoopProps) => {
    const width = useRef(0)
    useLoop((time: number) => {
        if (width.current !== window.innerWidth) {
            onResize && onResize(time)
            width.current = window.innerWidth
        }
    }, props)
}