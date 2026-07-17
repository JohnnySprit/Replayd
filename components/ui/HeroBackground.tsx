'use client'

import { motion, useReducedMotion } from 'motion/react'

export default function HeroBackground({ children }: { children: React.ReactNode }) {
    const reduceMotion = useReducedMotion()

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0c2417_0%,#16402a_60%,#1f5636_100%)]">
            <motion.div
                className="absolute -top-[20%] -left-[20%] w-[70vmax] h-[70vmax] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.3), transparent 65%)' }}
                animate={reduceMotion ? undefined : { x: ['0%', '45%'], y: ['0%', '25%'], scale: [1, 1.2] }}
                transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
            />
            <motion.div
                className="absolute -bottom-[30%] -right-[20%] w-[60vmax] h-[60vmax] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.18), transparent 65%)' }}
                animate={reduceMotion ? undefined : { x: ['0%', '-35%'], y: ['0%', '-20%'], scale: [1.15, 1] }}
                transition={{ duration: 13, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
            />
            {/* fluted-glass look */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 13px)' }}
            />
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
                {children}
            </div>
        </div>
    )
}
