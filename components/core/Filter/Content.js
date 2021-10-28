import * as React from "react";

import { FileTypeGroup } from "~/components/core/FileTypeIcon";
import { css } from "@emotion/react";

import DataView from "~/components/core/DataView";
import EmptyState from "~/components/core/EmptyState";
import { useFilterContext } from "~/components/core/Filter/Provider";

const STYLES_DATAVIEWER_WRAPPER = (theme) => css`
  width: 100%;
  min-height: 100vh;
  padding: calc(20px + ${theme.sizes.filterNavbar}px) 24px 44px;
  @media (max-width: ${theme.sizes.mobile}px) {
    padding: calc(31px + ${theme.sizes.filterNavbar}px) 16px 44px;
  }
`;

export function Content({ viewer, onAction, page, ...props }) {
  const [{ filterState }] = useFilterContext();
  const { objects } = filterState;

  return (
    <div css={STYLES_DATAVIEWER_WRAPPER} {...props}>
      {objects.length ? (
        <DataView
          key="scene-files-folder"
          isOwner={true}
          items={objects}
          onAction={onAction}
          viewer={viewer}
          page={page}
          view="grid"
        />
      ) : (
        <EmptyState>
          <FileTypeGroup />
          <div style={{ marginTop: 24 }}>Drag and drop files into Slate to upload</div>
        </EmptyState>
      )}
    </div>
  );
}
