'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Blur-rise reveal used across every section. Runs once on scroll-in so the
 * page never re-animates while the reader scrolls back up.
 */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', bounce: 0.22, duration: 1.05 },
  },
}

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: riseVariants.hidden,
        visible: {
          ...(riseVariants.visible as object),
          transition: { type: 'spring', bounce: 0.22, duration: 1.05, delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealGroup({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerVariants}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={riseVariants}>
      {children}
    </motion.div>
  )
}
