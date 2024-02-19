import { MutableRefObject, useRef } from 'react'
import { each, useIsomorphicLayoutEffect } from '@react-spring/shared'
import { useSpring, SpringValues, SpringProps } from '@react-spring/web'

export type TriggerPos = 'top top' | 'center top' | 'bottom top' | 'top center' | 'center center' | 'bottom center' | 'top bottom' | 'center bottom' | 'bottom bottom'

export interface UseScrollOptions extends SpringProps {
    trigger?: MutableRefObject<HTMLElement | HTMLDivElement | null>,
    start?: TriggerPos,
    end?: TriggerPos,
    from?: {[x: string]: any},
    to?: {[x: string]: any},
    scrub?: boolean,
    toggleAction?: any
}

export interface ScrollState {
    scrollStart: number,
    scrollEnd: number,
    progress: number,
    allProgress: number,
    length: number
}
export interface ScrollValues {
    [x: number]: string
}

export type ToggleActionTypes = "play" | "pause" | "resume" | "reset" | "restart" | "complete" | "reverse" | "none"

/**
 * 
 * @param {UseScrollOptions} useScrollOptions options for the useScroll hook.
 * @param {MutableRefObject<HTMLElement>} useScrollOptions.trigger the container to listen to scroll events on, defaults to the window.
 * @returns {SpringValues<{progress: number;}>} SpringValues the collection of values returned from the inner hook
 */

const defaultConfig = { mass: 1, tension: 170, friction: 26 }
const defaultToggleAction = "play none none none"

export const useSpringTrigger = ({
    trigger,
    start,
    end,
    from,
    to,
    scrub,
    toggleAction,
    onChange,
    ...springOptions
}: UseScrollOptions = {}): {values: SpringValues<ScrollValues>, state: SpringValues<ScrollState> } => {
    const savers = useRef<any>({})

    // Fix mount issue with wrong values in spring
    const mounted = useRef(false) 
    // 

    // For Values
    const [scrollValues, api] = useSpring(
        () => ({
            from: {
                ...from,
                
            },
            to,
            ...springOptions,
        }),
        []
    )
    // For State
    const [scrollStateValues, stateApi] = useSpring(
        () => ({
            from: {
                progress: 0,
                length: 0,
                scrollStart: 0,
                scrollEnd: 0,
                allProgress: 0
            },
            onChange
        }),
        []
    )

    useIsomorphicLayoutEffect(() => {
        const cleanupScroll = onScroll(
            // @ts-expect-error
            ( state: ScrollState , values: ScrollValues ) => {
                if (!mounted.current) {
                    mounted.current = true
                    savers.current = { ...savers.current, progress: state.progress }
                    if (typeof state.progress !== 'number') { return console.error('[useTriggerScroll]: Invalid <start> or <end> provided') }
                    setTimeout(() => {
                        api.start({ to: { ...values }, config: { duration: 0 } })
                        stateApi.start({ to: { ...state }, config: { duration: 0 } })
                    }, 30)
                    return
                }
                if (savers.current?.progress !== state?.progress) {
                    savers.current = { ...savers.current, progress: state.progress }
                    if (typeof state.progress !== 'number') { return console.error('[useTriggerScroll]: Invalid <start> or <end> provided') }
                    api.start({ to: { ...values }, config: springOptions?.config || defaultConfig })
                    stateApi.start({ to: { ...state }, config: springOptions?.config || defaultConfig })
                }

            },
            { trigger: trigger, start, end, from, to, scrub, toggleAction}
        )

        return () => {
            /**
             * Stop the springs on unmount.
             */
            each(Object.values(scrollValues), value => value.stop())
            cleanupScroll()
        }
    }, [toggleAction])


    return {values: scrollValues, state: scrollStateValues}
}


// On Scroll
export type OnScrollCallback = (state: ScrollState | {}, values: ScrollValues) => void
export type OnScrollOptions = { trigger?: MutableRefObject<HTMLElement>, start?: TriggerPos, end?: TriggerPos, from?: any, to?: any, scrub?: boolean, toggleAction?: any}
export const onScroll = (
    callback: OnScrollCallback,
    { trigger, start = 'bottom bottom', end = 'bottom top', from, to, scrub, toggleAction}: OnScrollOptions = {}
) => {
    let rq: any = null
    render()
    function render(time?: number) {
        const _trigger = trigger?.current || document.documentElement
        const state = calcProgress(start, end, _trigger)
        // @ts-expect-error
        const values = calcValues(from, to, state.progress, state.allProgress, scrub, toggleAction)
        callback({ ...state }, { ...values })
        rq = requestAnimationFrame(render)
    }

    return () => {
        cancelAnimationFrame(rq)
    }
}

function clamp(min: number, max: number, value: number) {
    return Math.min(max, Math.max(min, value))
}

function lerp(start: number, end: number, t: number) {
    return (1 - t) * start + t * end
}


function calcProgress(start: TriggerPos, end: TriggerPos, trigger: HTMLElement): ScrollState | {} {
    const bb = trigger.getBoundingClientRect()

    
    const clientHeight = window.innerHeight
    const poses = {
        // Screen Top
        'top_top': bb.top,
        'center_top': bb.top + bb.height / 2,
        'bottom_top': bb.bottom,
        // Screen Bottom
        'top_bottom': (bb.top) - clientHeight,
        'center_bottom': (bb.top + bb.height / 2) - clientHeight,
        'bottom_bottom': (bb.bottom) - clientHeight,
        // Screen Center
        'top_center': bb.top - clientHeight / 2,
        'center_center': (bb.top + bb.height / 2) - clientHeight / 2,
        'bottom_center': (bb.bottom) - clientHeight / 2,
    }
    // @ts-expect-error
    const scrollStart = poses[start.split(' ').join('_')]
    // @ts-expect-error
    const scrollEnd = poses[end.split(' ').join('_')]
    if (!scrollStart || !scrollEnd) { return {} }
    const length = Math.abs(scrollStart - scrollEnd)
    const allProgress = (scrollStart + length) / length
    const progress = 1 - clamp(0, 1, allProgress)

    return {
        scrollStart,
        scrollEnd,
        progress,
        allProgress,
        length
    }
}

function calcValues(from: any = {}, to: any = {}, progress: number, allProgress: number, scrub: boolean, toggleAction: any) {
    const froms = Object.keys(from)
    const toes = Object.keys(to)
    const values: any = {}


    toes.forEach((value: string) => {
        const inFroms = froms.find(key => key === value)
        const startValue = inFroms ? from[inFroms] : '0'
        const endValue = to[value]

        const startMatch = startValue.toString().match(/^([-+]?[0-9]*\.?[0-9]+)([a-z%]*)$/)
        const endMatch = endValue.toString().match(/^([-+]?[0-9]*\.?[0-9]+)([a-z%]*)$/)

        if (!startMatch || !endMatch) {
            console.error('[useScrollTrigger]: Invalid "from" or "to" value format')
            return
        }

        const start = parseFloat(startMatch[1])
        const end = parseFloat(endMatch[1])
        
        
        
        const unit = endMatch[2]
        
        
        if (scrub) {
            values[value] = lerp(start, end, progress) + unit
        } else {
            values[value] = getToggledValue(start, end, progress, allProgress, toggleAction) + unit
        }
    })
    return values
}

// TODO: Complete this
// Now by default it works like 'play reset play reset'
// onEnter, onLeave, onEnterBack, and onLeaveBack
function validateActions(_actions: Array<ToggleActionTypes>) {
    const actions = ["play", "pause", "resume", "reset", "restart", "complete", "reverse", "none"]
    return _actions.filter(item => actions.find(_ => _ === item)).length === 4
}
function getToggledValue(start: number, end: number, progress: number, allProgress: number, toggleAction: any = defaultToggleAction) {

    // onEnter, onLeave, onEnterBack, and onLeaveBack
    // "play", "pause", "resume", "reset", "restart", "complete", "reverse", and "none"
    // Only "play" & "none"
    let actions = toggleAction.split(" ");
    if (!validateActions(actions)) {
        console.warn('[useSpringTrigger]: wrong toggleActions provided')
        actions = defaultToggleAction
    }

    // onEnter
    // if (progress > 0 && progress < 1) {
    //     if (actions[0] === 'play') {
    //         return end
    //     }
    //     if (actions[0] === 'none') {
    //         return start
    //     }
    // }
    // // onLeave
    // if (progress >= 1) {
    //     if (actions[1] === 'play') {
    //         return start
    //     }
    //     if (actions[1] === 'none') {
    //         return end
    //     }
    // }
    // // onEnterBack
    // if (progress > 0 && progress < 1) {
    //     if (actions[2] === 'play') {
    //         return end
    //     }
    //     if (actions[2] === 'none') {
    //         return start
    //     }
    // }
    // // onLeaveBack
    // if (progress <= 0) {
    //     if (actions[3] === 'play') {
    //         return start
    //     }
    //     if (actions[3] === 'none') {
    //         return end
    //     }
    // }

    // console.log(allProgress )

    if (progress > 0) {
        return end
    }
    return start
}