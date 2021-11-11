import * as React from "react";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------------------------------
 *  Root
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_MOBILE_WRAPPER = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;

  z-index: ${theme.zindex.modal};

  background-color: ${theme.semantic.bgWhite};

  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background-color: ${theme.semantic.bgBlurWhiteOP};
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
`;

function Root({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      css={[STYLES_JUMPER_MOBILE_WRAPPER, css]}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Header
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_MOBILE_HEADER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  padding: 13px 16px 11px;
`;

function Header({ children, ...props }) {
  return (
    <div css={[STYLES_JUMPER_MOBILE_HEADER, css]} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Content
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_MOBILE_CONTENT = css`
  flex-grow: 1;
  overflow-y: auto;
  padding: 12px 16px;
`;

function Content({ children, ...props }) {
  return (
    <div css={[STYLES_JUMPER_MOBILE_CONTENT, css]} {...props}>
      {children}
    </div>
  );
}

const STYLES_JUMPER_MOBILE_FOOTER = (theme) => css`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px 16px;

  border-top: 1px solid ${theme.semantic.borderGrayLight4};
  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background-color: ${theme.semantic.bgBlurWhite};
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
`;

/* -------------------------------------------------------------------------------------------------
 *  Footer
 * -----------------------------------------------------------------------------------------------*/

function Footer({ children, css, ...props }) {
  return (
    <div css={[STYLES_JUMPER_MOBILE_FOOTER, css]} {...props}>
      {children}
    </div>
  );
}

export { Root, Header, Content, Footer };
