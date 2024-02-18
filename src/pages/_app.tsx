import '@/assets/styles/globals.scss'
import { CanvasLayout } from '@/layouts/CanvasLayout/CanvasLayout'
import { ScrollLayout } from '@/layouts/ScrollLayout/ScrollLayout'
import { Lvh } from '@/hooks/useLvh'
import { AdaptiveGrid } from '@/hooks/useGrid'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ScrollLayout>
            <CanvasLayout>
                <Lvh/>
                <AdaptiveGrid baseWidth={1440}/>
                <Component {...pageProps} />
            </CanvasLayout>
        </ScrollLayout>
    )
}
