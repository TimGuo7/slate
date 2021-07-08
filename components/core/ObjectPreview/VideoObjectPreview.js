import "isomorphic-fetch";

import * as React from "react";
import * as Styles from "~/common/styles";

import { P } from "~/components/system";
import { css } from "@emotion/react";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";
import VideoPlaceholder from "./placeholders/Video";

const STYLES_CONTAINER = css`
  height: 100%;
`;

const STYLES_TAG = (theme) => css`
  position: absolute;
  text-transform: uppercase;
  background-color: ${theme.system.bgLight};
  bottom: 31.5%;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 4px;
`;

export default function VideoObjectPreview({ file, ...props }) {
  const { type } = file.data;
  const tag = type.split("/")[1];
  return (
    <ObjectPreviewPremitive file={file} {...props}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_CONTAINER]}>
        <VideoPlaceholder />
        <div css={STYLES_TAG}>
          <P variant="para-03">{tag}</P>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
