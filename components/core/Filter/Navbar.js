import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Styles from "~/common/styles";

import { usePortals } from "~/components/core/PortalsProvider";
import { css } from "@emotion/react";
import { Divider } from "~/components/system";

/* -------------------------------------------------------------------------------------------------
 *  Navbar Portal
 * -----------------------------------------------------------------------------------------------*/

export function NavbarPortal({ children }) {
  const { filterNavbar } = usePortals();
  const [filterNavbarElement] = filterNavbar;

  return filterNavbarElement
    ? ReactDOM.createPortal(
        <>
          <Divider height="0.5px" color="borderGrayLight" css={Styles.MOBILE_HIDDEN} />
          <div css={STYLES_NAVBAR}>{children}</div>
          <Divider height="0.5px" color="borderGrayLight" css={Styles.MOBILE_ONLY} />
        </>,
        filterNavbarElement
      )
    : null;
}

/* -------------------------------------------------------------------------------------------------
 *  Navbar
 * -----------------------------------------------------------------------------------------------*/

const STYLES_NAVBAR = (theme) => css`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 24px 11px;
  box-shadow: ${theme.shadow.lightSmall};

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 9px 16px 11px;
  }
`;

const STYLES_NAVBAR_BACKGROUND = (theme) => css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: -1;

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhite};
  }
`;

export function Navbar({ children }) {
  const { filterNavbar } = usePortals();
  const [, setFilterElement] = filterNavbar;
  return (
    <div ref={setFilterElement}>
      {children}
      <div css={STYLES_NAVBAR_BACKGROUND} />
    </div>
  );
}
