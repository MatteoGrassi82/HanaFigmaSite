import { motion, type Variants } from "motion/react";
import { type ElementType, type ReactNode, type RefObject } from "react";

interface TimelineContentProps {
  children: ReactNode;
  /** Element/component to render. Defaults to a div. */
  as?: ElementType;
  /** Index used to stagger this item's reveal. */
  animationNum: number;
  /** Ref of the scroll container that triggers the reveal when in view. */
  timelineRef: RefObject<HTMLElement | null>;
  /** Framer Motion variants. Receives `animationNum` as the custom index. */
  customVariants: Variants;
  className?: string;
}

/**
 * Scroll-reveal wrapper used by the testimonial grid. Each item blurs/slides
 * in, staggered by `animationNum`, once the parent (`timelineRef`) scrolls
 * into view. Adapted from the shadcn "timeline-animation" component for our
 * Vite + react-router stack (uses `motion/react`, no Next.js).
 */
export function TimelineContent({
  children,
  as,
  animationNum,
  timelineRef,
  customVariants,
  className,
}: TimelineContentProps) {
  const MotionComponent = motion(as ?? "div");

  return (
    <MotionComponent
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{ root: timelineRef, once: true, amount: 0.3 }}
      variants={customVariants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
