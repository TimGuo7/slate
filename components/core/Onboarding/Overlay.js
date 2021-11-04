import * as React from "react";
import { css } from "@emotion/react";

const STYLES_ONBOARDING_OVERLAY = (theme) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: ${theme.semantic.bgBlurDark};
`;

export default function Overlay({ children, css, ...props }) {
  return (
    <div css={[STYLES_ONBOARDING_OVERLAY, css]} {...props}>
      {children}
    </div>
  );
}
