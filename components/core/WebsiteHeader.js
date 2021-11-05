import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { ButtonPrimary, ButtonSecondary } from "~/components/system/components/Buttons";

const STYLES_ROOT = css`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${Constants.semantic.bgBlurWhiteOP};
  backdrop-filter: blur(75px);
  z-index: ${Constants.zindex.header};
`;

const STYLES_CONTAINER = css`
  max-width: 1080px;
  margin: 0 auto;
  font-family: ${Constants.font.medium};
  font-size: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font: ${Constants.font.medium};
  color: ${Constants.semantic.textBlack};
  font-size: 14px;
  text-decoration: none;
  line-height: 20px;
  letter-spacing: -0.01px;
  text-align: left;
  padding: 14px 24px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    max-width: 480px;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
  }
`;

const STYLES_LINK = css`
  color: ${Constants.semantic.textBlack};
  text-decoration: none;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
`;

const STYLES_RIGHT = css`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const STYLES_BUTTON = css`
  cursor: poitner;
  display: inline-flex;
  flex-grow: 0;
  justify-content: center;
  align-items: center;
  box-shadow: ${Constants.shadow.lightSmall};
  text-decoration: none;
  font-family: ${Constants.font.medium};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.006px;
  cursor: pointer;
`;

const STYLES_BUTTON_PRIMARY = css`
  ${STYLES_BUTTON};
  color: ${Constants.semantic.textWhite};
  background-color: ${Constants.system.blue};
`;

const STYLES_BUTTON_PRIMARY_SMALL = css`
  ${STYLES_BUTTON_PRIMARY};
  padding: 1px 12px 3px;
  border-radius: 8px;
`;

const STYLES_BUTTON_SECONDARY = css`
  ${STYLES_BUTTON};
  color: ${Constants.semantic.textBlack};
  background-color: ${Constants.semantic.bgGrayLight};
`;

const STYLES_BUTTON_SECONDARY_SMALL = css`
  ${STYLES_BUTTON_SECONDARY};
  padding: 1px 12px 3px;
  border-radius: 8px;
`;

const WebsiteHeader = (props) => {
  const signInURL = "/_/auth";

  return (
    <div css={STYLES_ROOT}>
      <div css={STYLES_CONTAINER} style={props.style}>
        <div css={STYLES_LEFT}>
          <a css={STYLES_LINK} href="/" style={{ marginRight: 24 }}>
            Slate
          </a>
        </div>
        <div css={STYLES_RIGHT}>
          <a css={STYLES_BUTTON_SECONDARY_SMALL} style={{ marginRight: 8 }} href="../_/auth">
            Sign in
          </a>
          <a css={STYLES_BUTTON_PRIMARY_SMALL} href="../_/auth">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default WebsiteHeader;
