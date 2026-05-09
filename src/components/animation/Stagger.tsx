// Stagger helper — wraps each child in a FadeIn with index-based delay

import { Children, type ReactNode } from "react";
import { FadeIn } from "./FadeIn";

interface StaggerProps {
  children: ReactNode;
  delay?: number;
  step?: number;
  y?: number;
}

export const Stagger = ({ children, delay = 0, step = 60, y = 30 }: StaggerProps) => (
  <>
    {Children.map(children, (child, i) => (
      <FadeIn delay={delay + i * step} y={y}>
        {child}
      </FadeIn>
    ))}
  </>
);
