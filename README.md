# :japanese_castle: React Spring Trigger - like gsap trigger but for the react-spring

### How to use

*Will be added to npm soon*

### Important!

All already implemented features work the same as in gsap. Just read their documentation

### :mount_fuji: Available Parameteres

- trigger: HTMLElement
- scrub: boolean
- from: Object<T>
- to: Object<T>

- enable: boolean // Reactive state, True by default

### Example

```
    const triggerRef = useRef<HTMLElement | null>(null)
    const [pageLoaded, setPageLoaded] = useState(false)

    const [values, states] = useSpringTrigger({
      trigger: triggerRef,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      from: {
        x: '100%'
      },
      to: {
        x: '0%'
      },
      enable: pageLoaded,
      onChange: (state) => {
        console.log(state)
      }
    })
```

```
    <div ref={triggerRef}>
        <animated.div style={values}>
            {children}
        </animated.div>
    </div>
```

### In Development

- toggleActions: string


