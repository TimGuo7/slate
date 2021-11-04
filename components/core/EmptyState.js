import * as React from "react";

import { css } from "@emotion/react";

const STYLES_EMPTY_STATE = (theme) => css`
  position: relative;
  width: 100%;
  height: 328px;
  background-color: ${theme.semantic.bgLight};
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin-top: 48px;
`;

const STYLES_EMPTY_FRAME = (theme) => css`
  position: absolute;
  height: 14px;
  width: 14px;
  border-left: 2px solid;
  border-top: 2px solid;
  border-color: ${theme.semantic.borderGrayLight4};
`;

export default function EmptyState({ children, css, ...props }) {
  return (
    <div css={[STYLES_EMPTY_STATE, css]} {...props}>
      <div css={STYLES_EMPTY_FRAME} style={{ top: 12, left: 12 }} />
      <div css={STYLES_EMPTY_FRAME} style={{ top: 12, right: 12, transform: "rotate(90deg)" }} />
      <div css={STYLES_EMPTY_FRAME} style={{ bottom: 12, left: 12, transform: "rotate(270deg)" }} />
      <div
        css={STYLES_EMPTY_FRAME}
        style={{ bottom: 12, right: 12, transform: "rotate(180deg)" }}
      />
      {children}
    </div>
  );
}
