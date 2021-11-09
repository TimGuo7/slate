import * as React from "react";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as Jumper from "~/components/core/Jumper";
import * as SVG from "~/common/svg";
import * as Utilities from "~/common/utilities";
import * as Constants from "~/common/constants";
import * as MobileJumper from "~/components/system/components/GlobalCarousel/jumpers/MobileLayout";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";

const STYLES_SHARING_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  padding: 9px 8px 11px;
  border-radius: 12px;
  width: 100%;
  :hover,
  :active {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const getSlateURLFromViewer = ({ viewer, file }) => {
  const username = viewer?.username;
  const rootUrl = window?.location?.origin;
  const collection = viewer.slates.find(
    (item) => item.isPublic && item.objects.some((object) => object.id === file.id)
  );

  return `${rootUrl}/${username}/${collection.slatename}?cid=${file.cid}`;
};

const getSlateURLFromData = ({ data, file }) => {
  const username = data?.user?.username;
  const rootUrl = window?.location?.origin;

  return `${rootUrl}/${username}/${data.slatename}?cid=${file.cid}`;
};

function FileSharingButtons({ file, data, viewer }) {
  const fileName = file?.name || file?.filename;
  const username = data?.user?.username || viewer?.username;
  const fileLink = data
    ? getSlateURLFromData({ data, file })
    : getSlateURLFromViewer({ viewer, file });
  const [copyState, setCopyState] = React.useState({ isCidCopied: false, isLinkCopied: false });

  const handleTwitterSharing = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${fileName} by ${username} on Slate%0D&url=${fileLink}`,
      "_blank"
    );

  const handleEmailSharing = () => {
    window.open(`mailto: ?subject=${fileName} by ${username} on Slate&body=${fileLink}`, "_b");
  };

  const cidLink = Strings.getURLfromCID(file.cid);
  const handleLinkCopy = () => (
    Utilities.copyToClipboard(cidLink), setCopyState({ isLinkCopied: true })
  );
  const handleCidCopy = () => (
    Utilities.copyToClipboard(file.cid), setCopyState({ isCidCopied: true })
  );

  return (
    <>
      <button css={STYLES_SHARING_BUTTON} onClick={handleTwitterSharing}>
        <SVG.Twitter width={16} />
        <System.P2 style={{ marginLeft: 12 }}>Share Via Twitter</System.P2>
      </button>
      <button css={STYLES_SHARING_BUTTON} onClick={handleEmailSharing}>
        <SVG.Mail width={16} />
        <System.P2 style={{ marginLeft: 12 }}>Share Via Email </System.P2>
      </button>
      <button css={STYLES_SHARING_BUTTON} onClick={handleLinkCopy}>
        <SVG.Link width={16} />
        <System.P2 style={{ marginLeft: 12 }}>
          {copyState.isLinkCopied ? "Copied" : "Copy CID link"}
        </System.P2>
      </button>
      <button css={STYLES_SHARING_BUTTON} onClick={handleCidCopy}>
        <SVG.Hexagon width={16} />
        <System.P2 style={{ marginLeft: 12 }}>
          {copyState.isCidCopied ? "Copied" : "Copy CID "}
        </System.P2>
      </button>
    </>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const STYLES_SHARE_FILE_FOOTER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  color: ${theme.semantic.textGrayDark};
  background-color: ${theme.semantic.bgWhite};
`;

const PROTO_SCHOOL_CID = "https://proto.school/anatomy-of-a-cid/01";

export function Share({ file, data, viewer, isOpen, onClose }) {
  return (
    <Jumper.AnimatePresence>
      {isOpen ? (
        <Jumper.Root onClose={onClose}>
          <Jumper.Header>
            <System.H5 color="textBlack">Share</System.H5>
          </Jumper.Header>
          <Jumper.Divider />
          <Jumper.Item>
            <Jumper.ObjectPreview file={file} />
          </Jumper.Item>
          <Jumper.Divider />
          <Jumper.Item style={{ padding: 12 }}>
            <FileSharingButtons file={file} data={data} viewer={viewer} />
          </Jumper.Item>
          <Jumper.Item css={STYLES_SHARE_FILE_FOOTER}>
            <a
              css={[Styles.LINK, Styles.HORIZONTAL_CONTAINER_CENTERED]}
              style={{ marginLeft: "auto", color: Constants.semantic.textGrayDark }}
              href={PROTO_SCHOOL_CID}
              target="_blank"
              rel="noreferrer"
            >
              <SVG.InfoCircle width={16} />
              <System.P2 style={{ marginLeft: 4 }}>What is CID?</System.P2>
            </a>
          </Jumper.Item>
        </Jumper.Root>
      ) : null}
    </Jumper.AnimatePresence>
  );
}

export function ShareMobile({ file, data, viewer, isOpen, onClose }) {
  return isOpen ? (
    <MobileJumper.Root>
      <MobileJumper.Header>
        <System.H5 as="p" color="textBlack">
          Share
        </System.H5>
      </MobileJumper.Header>
      <System.Divider height={1} color="borderGrayLight" />
      <div style={{ padding: "13px 16px 11px" }}>
        <Jumper.ObjectPreview file={file} />
      </div>
      <System.Divider height={1} color="borderGrayLight" />
      <MobileJumper.Content>
        <FileSharingButtons file={file} data={data} viewer={viewer} />
      </MobileJumper.Content>
      <MobileJumper.Footer css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
        <button
          type="button"
          css={Styles.BUTTON_RESET}
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <SVG.Share width={16} height={16} style={{ color: Constants.system.blue }} />
        </button>
        <a
          css={[Styles.LINK, Styles.HORIZONTAL_CONTAINER_CENTERED]}
          style={{ marginLeft: "auto", color: Constants.semantic.textGrayDark }}
          href={PROTO_SCHOOL_CID}
          target="_blank"
          rel="noreferrer"
        >
          <SVG.InfoCircle width={16} />
          <System.P2 style={{ marginLeft: 4 }}>What is CID?</System.P2>
        </a>
      </MobileJumper.Footer>
    </MobileJumper.Root>
  ) : null;
}
