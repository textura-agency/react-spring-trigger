import Head from 'next/head'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Logo = dynamic(() => import('@/layouts/CanvasLayout/components/Examples').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/layouts/CanvasLayout/components/Examples').then((mod) => mod.Dog), { ssr: false })
const View = dynamic(() => import('@/layouts/CanvasLayout/components/View').then((mod) => mod.View), {
    ssr: false,
    loading: () => (<div>Loading...</div>),
})
const PageView = dynamic(() => import('@/layouts/CanvasLayout/components/PageView').then((mod) => mod.PageView), {
    ssr: false,
    loading: () => (<div>Loading Page Scene...</div>),
})
const Common = dynamic(() => import('@/layouts/CanvasLayout/components/Common').then((mod) => mod.Common), { ssr: false })
const Three = dynamic(() => import('@/layouts/CanvasLayout/components/Three').then((mod) => mod.Three), {
    ssr: false,
    loading: () => (<div>Loading Page Scene...</div>),
})

export default function Home() {
    return (
        <>
            <Head>
                <title key="title">Home Page</title>
            </Head>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <PageView>
                    <Suspense fallback={null}>
                        <Logo route='/another-page' scale={0.6} position={[0, 0, 0]} />
                        <Common />
                    </Suspense>
                </PageView>
                <div style={{ marginTop: '30vh', zIndex: 1, fontFamily: 'sans-serif', fontWeight: 300 }}>
                    <h2>Next Starter</h2>
                </div>
                <View orbit style={{ width: '300px', height: '300px' }}>
                    <Suspense fallback={null}>
                        <Dog scale={2} position={[0, -1.6, 0]} rotation={[0.0, -0.3, 0]} />
                        <Common color={'lightpink'} />
                    </Suspense>
                </View>
            </div>
        </>
    )
}
