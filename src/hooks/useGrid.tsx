// This hook lineary scale fonts

import { useCallback, useEffect } from "react";
import { useResizeLoop } from "./useResizeLoop";

export const interpolateFontSize = (baseFontSize: number, baseWidth: number, windowWidth: number, coef: number = 0.5) => {
    const widthPercentageReduction = (baseWidth - windowWidth) / baseWidth * 100;
    const fontSizePercentageReduction = widthPercentageReduction * coef;
    const interpolatedFontSize = baseFontSize - (baseFontSize * fontSizePercentageReduction / 100);
  
    return interpolatedFontSize;
}

interface Props {
    baseWidth: number,
    coef?: number
}
export const useGrid = ({ baseWidth, coef }: Props) => {
    const baseFontSize = 16
    const calculate = useCallback(() => {
        if (!window) { return }
        const dom = document.documentElement
        if (!dom) { return }
        const size = interpolateFontSize(baseFontSize, baseWidth, window.innerWidth, coef || 0.6666)
        if (size>baseFontSize) {
            dom.style.setProperty('font-size', `${size}px`)
        } else {
            dom.style.removeProperty('font-size')
        }
    }, [baseWidth, coef])
    useEffect(() => void calculate(), [])
    return [calculate]
}

export const AdaptiveGrid = ({ baseWidth, coef }: Props) => {
    const [calculate] = useGrid({ baseWidth, coef })
    useResizeLoop(() => calculate())
    return null
}