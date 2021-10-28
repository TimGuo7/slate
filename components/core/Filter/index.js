import * as React from "react";
import * as System from "~/components/system";

import { Navbar, NavbarPortal } from "~/components/core/Filter/Navbar";
import { Provider } from "~/components/core/Filter/Provider";
import { Sidebar, SidebarTrigger } from "~/components/core/Filter/Sidebar";
import { Popup, PopupTrigger } from "~/components/core/Filter/Popup";
import { Content } from "~/components/core/Filter/Content";
import { useFilterContext } from "~/components/core/Filter/Provider";

/* -------------------------------------------------------------------------------------------------
 *  Title
 * -----------------------------------------------------------------------------------------------*/

function Title() {
  const [{ filterState }] = useFilterContext();
  return (
    <System.H5 as="p" color="textBlack">
      {filterState.title}
    </System.H5>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Actions
 * -----------------------------------------------------------------------------------------------*/
function Actions() {
  return <div />;
}

export {
  Title,
  Actions,
  Sidebar,
  SidebarTrigger,
  Popup,
  PopupTrigger,
  Provider,
  Navbar,
  Content,
  NavbarPortal,
};
