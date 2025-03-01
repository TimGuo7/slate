import * as React from "react";
import * as Constants from "~/common/constants";
import * as Filter from "~/components/core/Filter";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";

import ScenePage from "~/components/core/ScenePage";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

const STYLES_SCENE_PAGE = css`
  padding: 0px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 0px;
  }
`;

const STYLES_FILTER_TITLE_WRAPPER = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function SceneFilesFolder({ viewer, page, onAction, isMobile }) {
  const [index, setIndex] = React.useState(-1);

  let objects = viewer.library;
  // const tab = page.params?.tab || "grid";

  return (
    <WebsitePrototypeWrapper
      title={`${page.pageTitle} • Slate`}
      url={`${Constants.hostname}${page.pathname}`}
    >
      <ScenePage css={STYLES_SCENE_PAGE}>
        <GlobalCarousel
          carouselType="DATA"
          viewer={viewer}
          objects={objects}
          onAction={onAction}
          isMobile={isMobile}
          params={page.params}
          isOwner={true}
          index={index}
          onChange={(index) => setIndex(index)}
        />
        <Filter.Provider viewer={viewer}>
          <Filter.NavbarPortal>
            <div css={Styles.CONTAINER_CENTERED}>
              <Filter.SidebarTrigger />
              <Filter.Breadcrumb style={{ marginLeft: 16 }} />
            </div>
            <div css={STYLES_FILTER_TITLE_WRAPPER}>
              <Filter.Title />
            </div>
            <Filter.Actions />
          </Filter.NavbarPortal>

          <div css={Styles.HORIZONTAL_CONTAINER}>
            <Filter.Sidebar />
            <Filter.Content onAction={onAction} viewer={viewer} page={page} />
          </div>
        </Filter.Provider>
      </ScenePage>
    </WebsitePrototypeWrapper>
  );
}
