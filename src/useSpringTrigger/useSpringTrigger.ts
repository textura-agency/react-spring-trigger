import { MutableRefObject, useRef } from 'react'
import { each, useIsomorphicLayoutEffect } from '@react-spring/shared'
import { useSpring, SpringValues, SpringProps } from '@react-spring/web'

export type TriggerPos = 'top top' | 'center top' | 'bottom top' | 'top center' | 'center center' | 'bottom center' | 'top bottom' | 'center bottom' | 'bottom bottom'

export interface UseScrollOptions extends SpringProps {
    trigger?: MutableRefObject<HTMLElement>,
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
    length: number
}
export interface ScrollValues {
    [x: number]: string
}

/**
 * A small utility abstraction around our signature useSpring hook. It's a great way to create
 * a scroll-linked animation. With either the raw value of distance or a 0-1 progress value.
 * You can either use the scroll values of the whole document, or just a specific element.
 *
 * 
 ```jsx
    import { useScroll, animated } from '@react-spring/web'

    function MyComponent() {
      const { scrollYProgress } = useScroll()

      return (
        <animated.div style={{ opacity: scrollYProgress }}>
          Hello World
        </animated.div>
      )
    }
  ```
 * 
 * @param {UseScrollOptions} useScrollOptions options for the useScroll hook.
 * @param {MutableRefObject<HTMLElement>} useScrollOptions.trigger the container to listen to scroll events on, defaults to the window.
 * @returns {SpringValues<{progress: number;}>} SpringValues the collection of values returned from the inner hook
 */
export const useTriggerScroll = ({
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
            progress: 0,
            length: 0,
            scrollStart: 0,
            scrollEnd: 0,
            onChange
        }),
        []
    )

    useIsomorphicLayoutEffect(() => {
        const cleanupScroll = onScroll(
            // @ts-expect-error
            ( state: ScrollState , values: ScrollValues ) => {
                if (savers.current?.progress !== state?.progress) {
                    savers.current = { ...savers.current, progress: state.progress }
                    if (typeof state.progress !== 'number') { return console.error('[useTriggerScroll]: Invalid <start> or <end> provided') }
                    api.start({ ...values })
                    stateApi.start({ ...state })
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
        const values = calcValues(from, to, state.progress, scrub, toggleAction)
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
    const progress = 1 - clamp(0, 1, (scrollStart + length) / length)


    return {
        scrollStart,
        scrollEnd,
        progress,
        length
    }
}

function calcValues(from: any = {}, to: any = {}, progress: number, scrub: boolean, toggleAction: any) {
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
            values[value] = getToggledValue(start, end, progress, toggleAction) + unit
        }
    })
    return values
}

// TODO: Complete this
// Now by default it works like 'play reset play reset'
function getToggledValue(start: number, end: number, progress: number, toggleAction: any = "play reset play reset") {
    // const actions = toggleAction.split(" ");
    // const lastAction = actions[actions.length - 1];

    // if (lastAction === "play") {
    //     return progress >= 1 ? end : start;
    // } else if (lastAction === "pause") {
    //     return progress >= 1 ? end : start;
    // } else if (lastAction === "resume") {
    //     return progress >= 1 ? end : start;
    // } else if (lastAction === "reset") {
    //     return progress >= 1 ? start : end;
    // } else {
    //     return progress >= 1 ? end : start;
    // }

    if (progress > 0 && progress < 1) {
        return end
    }
    return start
}