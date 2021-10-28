import * as React from "react";
import * as System from "~/components/system";

import { Navbar, NavbarPortal } from "~/components/core/Filter/Navbar";
import { Provider } from "~/components/core/Filter/Provider";
import { Sidebar, SidebarTrigger } from "~/components/core/Filter/Sidebar";
import { Content } from "~/components/core/Filter/Content";

/* -------------------------------------------------------------------------------------------------
 *  Title
 * -----------------------------------------------------------------------------------------------*/

function Title() {
  return <System.H5 color="textBlack">All</System.H5>;
}

/* -------------------------------------------------------------------------------------------------
 *  Actions
 * -----------------------------------------------------------------------------------------------*/
function Actions() {
  return <div />;
}

export { Title, Actions, Sidebar, SidebarTrigger, Provider, Navbar, Content, NavbarPortal };
