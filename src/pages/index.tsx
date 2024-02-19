import { useSpringTrigger } from "@/useSpringTrigger/useSpringTrigger"
import { useRef } from "react"
import { animated } from "@react-spring/web"

const styles: any = {
    container: {
        background: 'rgba(255, 0, 0, .5)',
        width: '300px',
        height: '2000px',
        margin: '1500px 0'
    },
    div: {
        top: '50%',
        left: 'calc(50% - 150px)',
        width: '300px',
        height: '5px',
        background: 'black',
        position: 'fixed',
    },
    placeholder: {
        top: '50%',
        left: 'calc(50% - 150px)',
        width: '300px',
        height: '5px',
        background: 'red',
        opacity: '.2',
        position: 'fixed',
    }
}

export default function Home() {
    const triggerRef = useRef<HTMLDivElement | null>(null)
    const { values } = useSpringTrigger({
        trigger: triggerRef,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: false,
        from: {
          x: '100%'
        },
        to: {
          x: '0%'
        },
        onChange: (state) => {
          console.log(state)
        }
    })
    return (
        <>
            <div ref={triggerRef} style={styles.container}>
                <div style={styles.placeholder}></div>
                <animated.div style={{...values, ...styles.div}}></animated.div>
            </div>
        </>
    )
}
