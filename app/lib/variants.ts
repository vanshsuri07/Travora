/**
 * Defines variants for Framer Motion animations.
 * @param direction - The direction from which the element should enter.
 * @param delay - The delay in seconds before the animation starts.
 * @returns A variants object for Framer Motion.
 */
export const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  delay: number
) => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween" as const, // Asserting the type for TypeScript
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};
