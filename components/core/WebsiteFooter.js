import * as React from "react";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";

const STYLES_ROOT = css`
  width: 100%;
  margin: 0 auto;
  background-color: ${Constants.semantic.bgGrayLight};
`;

const STYLES_CONTAINER = css`
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  font-family: ${Constants.font.medium};
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.01px;
  padding: 96px 24px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    max-width: 480px;
    padding: 40px 16px;
  }
`;

const STYLES_LINK = css`
  text-decoration: none;
  font-family: ${Constants.font.text};
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.01px;
  margin: 4px 0 0 0;
  color: ${Constants.semantic.textGrayDark};
`;

const STYLES_FLEX = css`
  display: flex;
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: block;
  }
`;

const STYLES_CONTENT_BLOCK = css`
  width: 25%;
  margin-bottom: 24px;
  @media (max-width: ${Constants.sizes.tablet}px) {
    width: 50%;
  }
`;

const STYLES_HR = css`
  background-color: ${Constants.semantic.borderGrayLight4};
  width: 100%;
  height: 1px;
  margin: 12px 0;
`;

const styleFlexFull = {
  justifyContent: `space-between`,
};

export const WebsiteFooter = (props) => {
  return (
    <div css={STYLES_ROOT}>
      <div css={STYLES_CONTAINER} style={props.style}>
        <div>Slate your personal search engine</div>
        <div css={STYLES_HR} />
        <div css={STYLES_FLEX}>
          <div css={STYLES_CONTENT_BLOCK}>
            <div>Resources</div>
            <a css={STYLES_LINK} href="/slate-for-chrome">
              Slate for Chrome
            </a>
            <br />
            <a
              css={STYLES_LINK}
              href="https://github.com/filecoin-project/slate/issues/126"
              target="_blank"
            >
              Github
            </a>
          </div>
          <div css={STYLES_CONTENT_BLOCK}>
            <div>Contact & Support</div>
            <a css={STYLES_LINK} href="https://twitter.com/_slate" target="_blank">
              Twitter
            </a>
            <br />
            <a css={STYLES_LINK} href="https://github.com/filecoin-project/slate" target="_blank">
              Discord
            </a>
          </div>
        </div>
        <div css={STYLES_HR} />
        <div css={STYLES_FLEX} style={styleFlexFull}>
          <div>MIT License</div>
          <div>
            <a css={STYLES_LINK} style={{ marginRight: `32px` }} href="/terms">
              Terms of service
            </a>
            <a css={STYLES_LINK} href="/guidelines">
              Community guidelines
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteFooter;
