import * as React from "react";
import * as System from "~/components/system";

import { css } from "@emotion/react";
import { ModalPortal } from "../ModalPortal";

const STYLES_ONBOARDING_POPUP = (theme) => css`
  position: fixed;
  right: 25px;
  bottom: 44px;
  width: 320px;
  border-radius: 16px;
  box-shadow: ${theme.shadow.lightLarge};
  border: 1px solid ${theme.semantic.borderGrayLight};
  z-index: ${theme.zindex.tooltip};

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOp};
  }
`;

const STYLES_POPUP_HEADER = css`
  padding: 13px 16px 8px;
`;

const STYLES_POPUP_CONTENT = css`
  padding: 16px;
`;

export default function Popup({ children, header, css, ...props }) {
  return (
    <ModalPortal {...props}>
      <div css={[STYLES_ONBOARDING_POPUP, css]}>
        <System.H5 as="h1" color="textBlack" css={STYLES_POPUP_HEADER}>
          {header}
        </System.H5>
        <System.Divider color="borderGrayLight" />
        <div css={STYLES_POPUP_CONTENT}>{children}</div>
      </div>
    </ModalPortal>
  );
}
