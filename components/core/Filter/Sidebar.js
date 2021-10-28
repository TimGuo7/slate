import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Filters from "~/components/core/Filter/Filters";
import * as Constants from "~/common/constants";

import { useFilterContext } from "~/components/core/Filter/Provider";
import { css } from "@emotion/react";

/* -------------------------------------------------------------------------------------------------
 * Sidebar trigger
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SIDEBAR_TRIGGER = (theme) => css`
  ${Styles.BUTTON_RESET};
  color: ${theme.semantic.textBlack};
  border-radius: 6px;
  padding: 2px;
  transition: background-color 0.3s;
  :hover {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

export function SidebarTrigger({ css }) {
  const [{ sidebarState }, { toggleSidebar }] = useFilterContext();
  return (
    <button
      onClick={toggleSidebar}
      css={[STYLES_SIDEBAR_TRIGGER, css]}
      style={{
        backgroundColor: sidebarState.isVisible ? Constants.semantic.bgGrayLight : "unset",
        color: sidebarState.isVisible ? Constants.semantic.textBlack : Constants.semantic.textGray,
      }}
    >
      <SVG.Sidebar style={{ display: "block" }} />
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Sidebar
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SIDEBAR_FILTER_WRAPPER = (theme) => css`
  position: sticky;
  top: ${theme.sizes.header + theme.sizes.filterNavbar}px;
  width: 236px;
  height: 100vh;
  max-height: calc(100vh - ${theme.sizes.header + theme.sizes.filterNavbar}px);
  padding: 20px 24px;
  background-color: ${theme.semantic.bgLight};
`;

export function Sidebar({ viewer, isMobile }) {
  const [{ sidebarState }] = useFilterContext();

  if (!sidebarState.isVisible || isMobile) return null;

  return (
    <div css={STYLES_SIDEBAR_FILTER_WRAPPER}>
      <Filters.Library />
      <Filters.Tags viewer={viewer} style={{ marginTop: 12 }} />
    </div>
  );
}
