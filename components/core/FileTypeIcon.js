import * as React from "react";
import * as SVG from "~/common/svg";
import * as Validations from "~/common/validations";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";

// Note(amine): placeholders
import PdfPlaceholder from "~/components/core/ObjectPreview/placeholders/PDF";
import VideoPlaceholder from "~/components/core/ObjectPreview/placeholders/Video";
import AudioPlaceholder from "~/components/core/ObjectPreview/placeholders/Audio";
import KeynotePlaceholder from "~/components/core/ObjectPreview/placeholders/Keynote";
import CodePlaceholder from "~/components/core/ObjectPreview/placeholders/Code";
import Object3DPlaceholder from "~/components/core/ObjectPreview/placeholders/3D";
import FilePlaceholder from "~/components/core/ObjectPreview/placeholders/File";
import LinkPlaceholder from "~/components/core/ObjectPreview/placeholders/Link";

export function FileTypeIcon({ file, ...props }) {
  const type = file.type;
  const isLink = file.isLink;

  if (isLink) {
    return <SVG.Link {...props} />;
  }

  if (Validations.isImageType(type)) {
    return <SVG.Image {...props} />;
  }

  if (Validations.isVideoType(type)) {
    return <SVG.Video {...props} />;
  }

  if (Validations.isAudioType(type)) {
    return <SVG.Sound {...props} />;
  }

  if (Validations.isEpubType(type)) {
    return <SVG.Book {...props} />;
  }

  if (Validations.isPdfType(type)) {
    return <SVG.TextDocument {...props} />;
  }

  return <SVG.Document {...props} />;
}

const STYLES_FILE_TYPE_GROUP_WRAPPER = (theme) => css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 24px;

  @media (max-width: ${theme.sizes.mobile}px) {
    grid-template-columns: repeat(2, 1fr);

    & > :nth-child(n + 5) {
      display: none;
    }
  }
`;

const STYLES_FILE_TYPE_PLACEHOLDER = css`
  ${Styles.CONTAINER_CENTERED};
  height: 120px;
  width: 120px;
`;

export function FileTypeGroup(props) {
  return (
    <div css={STYLES_FILE_TYPE_GROUP_WRAPPER} {...props}>
      <div css={STYLES_FILE_TYPE_PLACEHOLDER}>
        <PdfPlaceholder ratio={2.1} />
      </div>
      <div css={STYLES_FILE_TYPE_PLACEHOLDER}>
        <AudioPlaceholder ratio={2.1} />
      </div>
      <div css={STYLES_FILE_TYPE_PLACEHOLDER}>
        <Object3DPlaceholder ratio={2.1} />
      </div>
      <div css={STYLES_FILE_TYPE_PLACEHOLDER}>
        <VideoPlaceholder ratio={2.1} />
      </div>
      <div css={STYLES_FILE_TYPE_PLACEHOLDER}>
        <LinkPlaceholder ratio={2.1} />
      </div>
      <div css={STYLES_FILE_TYPE_PLACEHOLDER}>
        <CodePlaceholder ratio={2.1} />
      </div>
      <div css={STYLES_FILE_TYPE_PLACEHOLDER}>
        <KeynotePlaceholder ratio={2.1} />
      </div>
      <div css={STYLES_FILE_TYPE_PLACEHOLDER}>
        <FilePlaceholder ratio={2.1} />
      </div>
    </div>
  );
}
