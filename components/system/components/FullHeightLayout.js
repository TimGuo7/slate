import * as React from "react";

import { useIsomorphicLayoutEffect } from "~/common/hooks";
import { css } from "@emotion/react";

const updateCssVarFullHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--full-height", `${window.innerHeight}px`);
};

const STYLES_FULL_HEIGHT = css`
  height: 100vh;
  height: var(--full-height);
`;

export function FullHeightLayout({ children, css, as = "div", ...props }) {
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    updateCssVarFullHeight();
    window.addEventListener("resize", updateCssVarFullHeight);
    return () => window.removeEventListener("resize", updateCssVarFullHeight);
  }, []);

  const Component = as;

  return (
    <Component css={[STYLES_FULL_HEIGHT, css]} {...props}>
      {children}
    </Component>
  );
}
