import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Filters from "~/components/core/Filter/Filters";

import { useFilterContext } from "~/components/core/Filter/Provider";
import { motion } from "framer-motion";
import { css } from "@emotion/react";

/* -------------------------------------------------------------------------------------------------
 * Popup trigger
 * -----------------------------------------------------------------------------------------------*/

export function PopupTrigger({ children, isMobile, ...props }) {
  const [{ sidebarState, popupState }, { hidePopup, togglePopup }] = useFilterContext();

  React.useEffect(() => {
    if (sidebarState.isVisible) {
      hidePopup();
    }
  }, [sidebarState.isVisible]);

  if (sidebarState.isVisible && !isMobile) return null;

  return (
    <button
      onClick={togglePopup}
      css={[Styles.BUTTON_RESET, Styles.HORIZONTAL_CONTAINER_CENTERED]}
      {...props}
    >
      {children}
      <motion.div initial={null} animate={{ rotateX: popupState.isVisible ? 180 : 0 }}>
        <SVG.ChevronUp style={{ display: "block" }} />
      </motion.div>
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Popup
 * -----------------------------------------------------------------------------------------------*/
const STYLES_SIDEBAR_FILTER_WRAPPER = (theme) => css`
  position: sticky;
  top: ${theme.sizes.header + theme.sizes.filterNavbar}px;
  width: 236px;
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 16px;
  padding: 20px 16px;
  box-shadow: ${theme.shadow.lightLarge};
  border: 1px solid ${theme.semantic.borderGrayLight};

  background-color: ${theme.semantic.bgLight};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background-color: ${theme.semantic.bgBlurWhite};
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }

  @media (max-width: ${theme.sizes.mobile}px) {
    border-radius: unset;
    width: 100%;
    max-height: 375px;
    padding: 15px 8px;
  }
`;

export function Popup({ viewer, css, ...props }) {
  const [{ popupState }] = useFilterContext();

  if (!popupState.isVisible) return null;

  return (
    <div css={[STYLES_SIDEBAR_FILTER_WRAPPER, css]} {...props}>
      <Filters.Library />
      <Filters.Tags viewer={viewer} style={{ marginTop: 12 }} />
    </div>
  );
}
