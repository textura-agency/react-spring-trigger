# :japanese_castle: React-Three-Next starter

## Extended from: https://github.com/pmndrs/react-three-next, and preconfigured for our case

A minimalist starter for NextJS, @react-three/fiber & react-spring.

This starter allows you to navigate seamlessly between pages with dynamic dom and/or canvas content without reloading or creating a new canvas every time. 3D components are usable anywhere in the dom. The events, dom, viewport, everything is synchronized!

### How to use

Clone this repository and link to another gh

### :mount_fuji: Features

- [x] GLSL imports
- [x] Canvas is not getting unmounted while navigating between pages
- [x] Canvas components usable in any div of the page
- [x] PWA Support

- [x] Based on the **Page** directory architecture
- [x] SCSS preconfigured
- [x] Configured Store (zustand)
- [x] Some custom hooks & components, which we often use

- [x] Fonts Scale System
- [x] LVH


### :bullettrain_side: Architecture

Thanks to [tunnel-rat](https://github.com/pmndrs/tunnel-rat) the starter can portal components between separate renderers. Anything rendered inside the `<View/>` component of the starter will be rendered in the 3D Context. For better performances it uses gl.scissor to cut the viewport into segments.

```jsx
<div>
  <View orbit>
    <Dog scale={2} />
    // Some 3D components will be rendered here
  </View>
</div>
```

### :control_knobs: Available Scripts

- `yarn dev` - Next dev
- `yarn analyze` - Generate bundle-analyzer
- `yarn lint` - Audit code quality
- `yarn build` - Next build
- `yarn start` - Next start

### ⬛ Stack

- [`threejs`](https://github.com/mrdoob/three.js/) &ndash; A lightweight, 3D library with a default WebGL renderer.
- [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) &ndash; A React renderer for Threejs on the web and react-native.
- [`@react-three/drei`](https://github.com/pmndrs/drei) &ndash; useful helpers for react-three-fiber
- [`@react-three/a11y`](https://github.com/pmndrs/react-three-a11y/) &ndash; Accessibility tools for React Three Fiber
- [`r3f-perf`](https://github.com/RenaudRohlinger/r3f-perf) &ndash; Tool to easily monitor react threejs performances.
- [`react-spring`]
- [`zustand`]
- [`react-merge-refs`]