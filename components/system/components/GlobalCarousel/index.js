import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as Jumpers from "~/components/system/components/GlobalCarousel/jumpers";
import * as Validations from "~/common/validations";

import { css } from "@emotion/react";
import { Alert } from "~/components/core/Alert";
import { motion, AnimateSharedLayout } from "framer-motion";
import {
  useDetectTextOverflow,
  useEscapeKey,
  useEventListener,
  useLockScroll,
} from "~/common/hooks";
import { Show } from "~/components/utility/Show";
import { ModalPortal } from "~/components/core/ModalPortal";
import { FullHeightLayout } from "~/components/system/components/FullHeightLayout";

import SlateMediaObject from "~/components/core/SlateMediaObject";
import LinkIcon from "~/components/core/LinkIcon";

/* -------------------------------------------------------------------------------------------------
 *  Carousel Header
 * -----------------------------------------------------------------------------------------------*/

const VisitLinkButton = ({ file }) => {
  return (
    <System.ButtonTertiary
      onClick={(e) => e.stopPropagation()}
      style={{
        color: Constants.semantic.textGrayDark,
        padding: "4px 8px 7px",
        marginLeft: 4,
        minHeight: 30,
      }}
      href={file.url}
      target="_blank"
      rel="noreferrer"
      type="link"
    >
      <LinkIcon file={file} width={16} height={16} style={{ marginRight: 4 }} />
      <span style={{ whiteSpace: "nowrap" }}>Visit site</span>
    </System.ButtonTertiary>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const useCarouselJumperControls = () => {
  const [isControlVisible, setControlVisibility] = React.useState(false);
  const showControl = () => setControlVisibility(true);
  const hideControl = () => setControlVisibility(false);
  return [isControlVisible, { showControl, hideControl }];
};

const STYLES_HEADER_WRAPPER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  position: absolute;
  width: 100%;
  min-height: 64px;
  padding: 13px 24px 10px;
  color: ${theme.semantic.textGrayDark};
  border-bottom: 1px solid ${theme.semantic.borderGrayLight};
  box-shadow: ${theme.shadow.lightSmall};
  z-index: 1;

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(15px)) or (backdrop-filter: blur(15px))) {
    background-color: ${theme.semantic.bgBlurWhiteOP};
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
  }
`;

const STYLES_ACTION_BUTTON = css`
  ${Styles.BUTTON_RESET};
  height: 32px;
  width: 32px;
`;

function CarouselHeader({
  viewer,
  data,
  external,
  isOwner,
  file,
  current,
  total,

  onClose,
  enableNextSlide,
  enablePreviousSlide,
  onNextSlide,
  onPreviousSlide,
  ...props
}) {
  // NOTE(amine): Detect if the text is overflowing to show the MORE button
  const elementRef = React.useRef();
  const isBodyOverflowing = useDetectTextOverflow({ ref: elementRef }, [file]);

  // NOTE(amine): jumpers handlers
  const [
    isFileDescriptionVisible,
    { showControl: showFileDescription, hideControl: hideFileDescription },
  ] = useCarouselJumperControls();

  const [isMoreInfoVisible, { showControl: showMoreInfo, hideControl: hideMoreInfo }] =
    useCarouselJumperControls();

  const [isEditInfoVisible, { showControl: showEditInfo, hideControl: hideEditInfo }] =
    useCarouselJumperControls();

  const [isShareFileVisible, { showControl: showShareFile, hideControl: hideShareFile }] =
    useCarouselJumperControls();

  const [isEditChannelsVisible, { showControl: showEditChannels, hideControl: hideEditChannels }] =
    useCarouselJumperControls();

  const isJumperOpen =
    isFileDescriptionVisible ||
    isMoreInfoVisible ||
    isEditInfoVisible ||
    isShareFileVisible ||
    isEditChannelsVisible;

  const [isHeaderVisible, setHeaderVisibility] = React.useState(true);
  const timeoutRef = React.useRef();

  const showHeader = () => {
    clearTimeout(timeoutRef.current);
    setHeaderVisibility(true);
  };

  const hideHeader = (ms = 1000) => {
    timeoutRef.current = setTimeout(() => {
      if (isJumperOpen) return;
      setHeaderVisibility(false);
    }, ms);
  };

  React.useEffect(() => {
    hideHeader(3000);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  React.useLayoutEffect(() => {
    if (isJumperOpen) {
      return;
    }
    hideHeader();
  }, [isJumperOpen]);

  return (
    <>
      <ModalPortal>
        {isOwner && (
          <Jumpers.EditInfo file={file} isOpen={isEditInfoVisible} onClose={hideEditInfo} />
        )}
        {isOwner && (
          <Jumpers.EditChannels
            viewer={viewer}
            file={file}
            isOpen={isEditChannelsVisible}
            onClose={hideEditChannels}
          />
        )}
        <Jumpers.FileDescription
          file={file}
          isOpen={isFileDescriptionVisible}
          onClose={hideFileDescription}
        />
        <Jumpers.MoreInfo
          viewer={viewer}
          external={external}
          isOwner={isOwner}
          file={file}
          isOpen={isMoreInfoVisible}
          onClose={hideMoreInfo}
        />
        <Jumpers.Share
          file={file}
          data={data}
          viewer={viewer}
          isOpen={isShareFileVisible}
          onClose={hideShareFile}
        />
      </ModalPortal>

      <CarouselControls
        enableNextSlide={enableNextSlide}
        enablePreviousSlide={enablePreviousSlide}
        onNextSlide={onNextSlide}
        onPreviousSlide={onPreviousSlide}
        showControls={isHeaderVisible}
        onClose={onClose}
        onMouseEnter={showHeader}
        onMouseOver={showHeader}
        onMouseLeave={() => hideHeader()}
      />

      <motion.nav
        css={STYLES_HEADER_WRAPPER}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeaderVisible ? 1 : 0 }}
        transition={{ ease: "easeInOut", duration: 0.25 }}
        onMouseEnter={showHeader}
        onMouseOver={showHeader}
        onMouseLeave={() => hideHeader()}
        {...props}
      >
        <div>
          <div css={Styles.HORIZONTAL_CONTAINER}>
            <System.H5 color="textBlack" as="h1">
              {file?.name || file?.filename}
            </System.H5>
            <System.H5 color="textGray" as="p" style={{ marginLeft: 32 }}>
              {current} / {total}
            </System.H5>
          </div>

          <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} style={{ marginRight: 150 }}>
            <System.P3
              ref={elementRef}
              style={{ marginTop: 1, wordBreak: "break-all" }}
              nbrOflines={1}
              color="textBlack"
            >
              {file.body}
            </System.P3>
            <Show when={isBodyOverflowing}>
              <System.H6
                css={Styles.BUTTON_RESET}
                color="blue"
                as="button"
                onClick={showFileDescription}
              >
                MORE
              </System.H6>
            </Show>
          </div>
        </div>
        <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} style={{ marginLeft: "auto" }}>
          <AnimateSharedLayout>
            <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
              <Show when={isOwner}>
                <motion.button
                  layoutId="jumper-desktop-edit"
                  onClick={showEditInfo}
                  css={STYLES_ACTION_BUTTON}
                >
                  <SVG.Edit style={{ pointerEvents: "none" }} />
                </motion.button>
              </Show>

              <Show when={isOwner}>
                <motion.button
                  layoutId="jumper-desktop-channels"
                  onClick={showEditChannels}
                  style={{ marginLeft: 4 }}
                  css={STYLES_ACTION_BUTTON}
                >
                  <SVG.Hash style={{ pointerEvents: "none" }} />
                </motion.button>
              </Show>

              <Show when={file.isPublic}>
                <motion.button
                  layoutId="jumper-desktop-share"
                  onClick={showShareFile}
                  style={{ marginLeft: 4 }}
                  css={STYLES_ACTION_BUTTON}
                >
                  <SVG.Share style={{ pointerEvents: "none" }} />
                </motion.button>
              </Show>

              <motion.button
                layoutId="jumper-desktop-info"
                onClick={showMoreInfo}
                style={{ marginLeft: 4 }}
                css={STYLES_ACTION_BUTTON}
              >
                <SVG.InfoCircle style={{ pointerEvents: "none" }} />
              </motion.button>

              {file.isLink ? <VisitLinkButton file={file} /> : null}
            </div>
          </AnimateSharedLayout>
          <div style={{ marginLeft: 80 }}>
            <button onClick={onClose} css={STYLES_ACTION_BUTTON}>
              <SVG.Dismiss />
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

const STYLES_CAROUSEL_MOBILE_HEADER = (theme) => css`
  position: relative;
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  padding: 7px 8px 3px;
  color: ${theme.semantic.textGrayDark};
  border-bottom: 1px solid ${theme.semantic.borderGrayLight};

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(15px)) or (backdrop-filter: blur(15px))) {
    background-color: ${theme.semantic.bgBlurWhiteOP};
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
  }
`;

const STYLES_CAROUSEL_MOBILE_FOOTER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  justify-content: space-between;
  z-index: 1;
  width: 100%;
  padding: 8px 16px;
  border-top: 1px solid ${theme.semantic.borderGrayLight};
  color: ${theme.semantic.textGrayDark};

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(15px)) or (backdrop-filter: blur(15px))) {
    background-color: ${theme.semantic.bgBlurWhite};
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
  }
`;

const STYLES_CAROUSEL_MOBILE_SLIDE_COUNT = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function CarouselHeaderMobile({
  current,
  total,
  onClose,
  enableNextSlide,
  enablePreviousSlide,
  onNextSlide,
  onPreviousSlide,
}) {
  return (
    <nav css={STYLES_CAROUSEL_MOBILE_HEADER} style={{ justifyContent: "space-between" }}>
      <div style={{ width: 76 }}>
        <button
          css={STYLES_ACTION_BUTTON}
          style={{ visibility: enablePreviousSlide ? "visible" : "hidden" }}
          onClick={onPreviousSlide}
        >
          <SVG.ChevronLeft width={16} height={16} />
        </button>

        <button
          style={{ marginLeft: 12, visibility: enableNextSlide ? "visible" : "hidden" }}
          css={STYLES_ACTION_BUTTON}
          onClick={onNextSlide}
        >
          <SVG.ChevronRight width={16} height={16} />
        </button>
      </div>

      <System.H5 color="textGray" as="p" css={STYLES_CAROUSEL_MOBILE_SLIDE_COUNT}>
        {current} / {total}
      </System.H5>

      <div style={{ textAlign: "right" }}>
        <button onClick={onClose} css={STYLES_ACTION_BUTTON}>
          <SVG.Dismiss />
        </button>
      </div>
    </nav>
  );
}

function CarouselFooterMobile({ file, onAction, external, isOwner, data, viewer }) {
  const [isEditInfoVisible, { showControl: showEditInfo, hideControl: hideEditInfo }] =
    useCarouselJumperControls();

  const [isShareFileVisible, { showControl: showShareFile, hideControl: hideShareFile }] =
    useCarouselJumperControls();

  const [isMoreInfoVisible, { showControl: showMoreInfo, hideControl: hideMoreInfo }] =
    useCarouselJumperControls();

  const [isEditChannelsVisible, { showControl: showEditChannels, hideControl: hideEditChannels }] =
    useCarouselJumperControls();
  return (
    <>
      <ModalPortal>
        {isOwner && (
          <Jumpers.EditInfoMobile file={file} isOpen={isEditInfoVisible} onClose={hideEditInfo} />
        )}
        {isOwner && (
          <Jumpers.EditChannelsMobile
            viewer={viewer}
            file={file}
            isOpen={isEditChannelsVisible}
            onClose={hideEditChannels}
          />
        )}
        <Jumpers.ShareMobile
          file={file}
          isOpen={isShareFileVisible}
          data={data}
          viewer={viewer}
          onClose={hideShareFile}
        />
        <Jumpers.MoreInfoMobile
          viewer={viewer}
          external={external}
          isOwner={isOwner}
          file={file}
          isOpen={isMoreInfoVisible}
          onClose={hideMoreInfo}
        />
      </ModalPortal>
      <AnimateSharedLayout>
        <nav css={STYLES_CAROUSEL_MOBILE_FOOTER}>
          <Show when={isOwner}>
            <motion.button
              layoutId="jumper-mobile-edit"
              css={STYLES_ACTION_BUTTON}
              onClick={showEditInfo}
            >
              <SVG.Edit />
            </motion.button>
          </Show>
          <Show when={isOwner}>
            <motion.button
              layoutId="jumper-mobile-channels"
              style={{ marginLeft: 4 }}
              css={STYLES_ACTION_BUTTON}
              onClick={showEditChannels}
            >
              <SVG.Hash />
            </motion.button>
          </Show>
          <Show when={file.isPublic}>
            <motion.button
              layoutId="jumper-mobile-share"
              style={{ marginLeft: 4 }}
              css={STYLES_ACTION_BUTTON}
              onClick={showShareFile}
            >
              <SVG.Share />
            </motion.button>
          </Show>
          <motion.button
            layoutId="jumper-mobile-info"
            style={{ marginLeft: 4 }}
            css={STYLES_ACTION_BUTTON}
            onClick={showMoreInfo}
          >
            <SVG.InfoCircle />
          </motion.button>
          {file.isLink ? <VisitLinkButton file={file} /> : null}
        </nav>
      </AnimateSharedLayout>
    </>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Carousel Controls
 * -----------------------------------------------------------------------------------------------*/

const useCarouselKeyCommands = ({ handleNext, handlePrevious, handleClose }) => {
  const handleKeyDown = (e) => {
    const inputs = document.querySelectorAll("input");
    for (let elem of inputs) {
      if (document.activeElement === elem) {
        return;
      }
    }

    const textareas = document.querySelectorAll("textarea");
    for (let elem of textareas) {
      if (document.activeElement === elem) {
        return;
      }
    }

    switch (e.key) {
      case "Right":
      case "ArrowRight":
        handleNext();
        break;
      case "Left":
      case "ArrowLeft":
        handlePrevious();
        break;
    }
  };

  useEscapeKey(handleClose);

  useEventListener({ type: "keydown", handler: handleKeyDown });
};

const STYLES_CONTROLS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  background-color: ${theme.semantic.bgGrayLight};
  border-radius: 8px;
  border: 1px solid ${theme.semantic.borderGrayLight};
  padding: 10px;
  box-shadow: ${theme.shadow.lightMedium};
  svg {
    display: block;
  }
`;

const STYLES_CONTROLS_WRAPPER = css`
  ${Styles.CONTAINER_CENTERED};
  position: absolute;
  width: 122px;
  height: 80%;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  padding-left: 24px;
  padding-right: 24px;
`;

function CarouselControls({
  enableNextSlide,
  enablePreviousSlide,
  onNextSlide,
  onPreviousSlide,
  showControls,
  onClose,

  ...props
}) {
  useCarouselKeyCommands({
    handleNext: onNextSlide,
    handlePrevious: onPreviousSlide,
    handleClose: onClose,
  });

  return (
    <>
      <div
        css={STYLES_CONTROLS_WRAPPER}
        style={{ left: 0, justifyContent: "flex-start" }}
        {...props}
      >
        {enablePreviousSlide ? (
          <motion.button
            onClick={onPreviousSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.25 }}
            css={STYLES_CONTROLS_BUTTON}
          >
            <SVG.ChevronLeft width={16} />
          </motion.button>
        ) : null}
      </div>
      <div
        css={STYLES_CONTROLS_WRAPPER}
        style={{ right: 0, justifyContent: "flex-end" }}
        {...props}
      >
        {enableNextSlide ? (
          <motion.button
            onClick={onNextSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            css={STYLES_CONTROLS_BUTTON}
          >
            <SVG.ChevronRight width={16} />
          </motion.button>
        ) : null}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Carousel Content
 * -----------------------------------------------------------------------------------------------*/

const STYLES_CONTENT = (theme) => css`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.sizes.mobile}px) {
    flex-direction: column;
    overflow-y: auto;
    justify-content: flex-start;
  }
`;

const STYLES_PREVIEW_WRAPPER = (theme) => css`
  ${Styles.CONTAINER_CENTERED};
  position: relative;
  width: 100%;
  height: 100%;

  @media (max-width: ${theme.sizes.mobile}px) {
    min-height: 75vh;
    height: 75vh;
    overflow: hidden;
  }
`;

export function CarouselContent({
  carouselType,
  objects,
  index,
  data,
  isMobile,
  viewer,
  sidebar,
  style,
  onClose,
}) {
  const file = objects?.[index];

  let isRepost = false;
  if (carouselType === "SLATE") isRepost = data?.ownerId !== file.ownerId;

  useLockScroll();

  const { linkHtml, linkIFrameAllowed } = file;
  const isNFTLink = Validations.isNFTLink(file);
  // NOTE(amine): hide the title and description when using LinkCard as SlateMediaObject
  const hideDescription = file.isLink && (!linkHtml || !linkIFrameAllowed || isNFTLink);

  return (
    <>
      <Alert
        viewer={viewer}
        noWarning
        id={isMobile ? "slate-mobile-alert" : null}
        style={
          isMobile
            ? null
            : {
                bottom: 0,
                top: "auto",
                paddingRight: sidebar ? `calc(${Constants.sizes.sidebar}px + 48px)` : "auto",
              }
        }
      />
      <div css={STYLES_CONTENT} style={style} onClick={onClose}>
        <div css={STYLES_PREVIEW_WRAPPER}>
          <SlateMediaObject file={file} isMobile={isMobile} />
        </div>

        {!hideDescription && (
          <div css={Styles.MOBILE_ONLY} style={{ padding: "13px 16px 44px", width: "100%" }}>
            <System.H5 color="textBlack" as="h1">
              {file?.name || file?.filename}
            </System.H5>
            <Show when={file?.body}>
              <System.P2 color="textBlack" style={{ marginTop: 4 }}>
                {file?.body}
              </System.P2>
            </Show>
            <Show when={file.isLink}>
              <div style={{ marginTop: 5 }} css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
                <LinkIcon file={file} width={12} height={12} />
                <System.P2 as="a" nbrOflines={1} href={file.url} style={{ marginLeft: 5 }}>
                  {file.url}
                </System.P2>
              </div>
            </Show>
          </div>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Global Carousel
 * -----------------------------------------------------------------------------------------------*/
const useCarouselViaParams = ({ index, params, objects, onChange }) => {
  const findSelectedIndex = () => {
    const cid = params?.cid;
    if (!cid) return -1;

    let index = objects.findIndex((elem) => elem.cid === cid);
    return index;
  };

  React.useEffect(() => {
    if (index !== -1) return;

    const selectedIndex = findSelectedIndex();
    if (selectedIndex !== index) onChange(index);
  }, [params?.cid]);

  React.useEffect(() => {
    if (params?.cid) {
      const index = findSelectedIndex();
      onChange(index);
    }
  }, [params]);
};

const getCarouselHandlers = ({ index, objects, params, onChange, onAction }) => {
  const handleNext = (e) => {
    if (e) e.stopPropagation();

    let nextIndex = index + 1;
    if (nextIndex >= objects.length) return;

    let { cid } = objects[nextIndex];
    onChange(nextIndex);
    onAction({ type: "UPDATE_PARAMS", params: { ...params, cid }, redirect: true });
  };

  const handlePrevious = (e) => {
    if (e) e.stopPropagation();

    let prevIndex = index - 1;
    if (prevIndex < 0) return;

    let { cid } = objects[prevIndex];
    onChange(prevIndex);
    onAction({ type: "UPDATE_PARAMS", params: { params, cid }, redirect: true });
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation(), e.preventDefault();

    let params = { ...params };
    delete params.cid;
    onAction({ type: "UPDATE_PARAMS", params, redirect: true });
    onChange(-1);
  };
  return { handleNext, handlePrevious, handleClose };
};

const STYLES_ROOT = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  color: ${Constants.system.white};
  z-index: ${Constants.zindex.modal};
  background-color: rgba(0, 0, 0, 0.8);

  // Note(Amine): we're using the blur filter to fix a weird backdrop-filter's bug in chrome

  filter: blur(0px);
  @supports ((-webkit-backdrop-filter: blur(15px)) or (backdrop-filter: blur(15px))) {
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
    background-color: ${theme.semantic.bgWhite};
  }

  @keyframes global-carousel-fade-in {
    from {
      transform: translateX(8px);
      opacity: 0;
    }
    to {
      transform: translateX(0px);
      opacity: 1;
    }
  }
  animation: global-carousel-fade-in 400ms ease;
`;

export function GlobalCarousel({
  carouselType,
  objects,
  index,
  params,
  data,
  isMobile,
  onChange,
  onAction,
  viewer,
  external,
  isOwner,
  sidebar,
  style,
}) {
  const file = objects?.[index];
  const isCarouselOpen = (carouselType || index > 0 || index <= objects.length) && !!file;

  useCarouselViaParams({ index, params, objects, onChange });

  if (!isCarouselOpen) return null;

  const { handleNext, handlePrevious, handleClose } = getCarouselHandlers({
    index,
    objects,
    params,
    onChange,
    onAction,
  });

  return (
    <FullHeightLayout css={STYLES_ROOT}>
      {isMobile ? (
        <CarouselHeaderMobile
          current={index + 1}
          total={objects.length}
          onPreviousSlide={handlePrevious}
          onNextSlide={handleNext}
          onClose={handleClose}
          enableNextSlide={index < objects.length - 1}
          enablePreviousSlide={index > 0}
        />
      ) : (
        <CarouselHeader
          viewer={viewer}
          external={external}
          isOwner={isOwner}
          data={data}
          file={file}
          current={index + 1}
          total={objects.length}
          onAction={onAction}
          enableNextSlide={index < objects.length - 1}
          enablePreviousSlide={index > 0}
          onNextSlide={handleNext}
          onPreviousSlide={handlePrevious}
          onClose={handleClose}
        />
      )}
      <CarouselContent
        carouselType={carouselType}
        objects={objects}
        index={index}
        data={data}
        isMobile={isMobile}
        viewer={viewer}
        sidebar={sidebar}
        style={style}
        onClose={handleClose}
      />

      {isMobile ? (
        <CarouselFooterMobile
          file={file}
          viewer={viewer}
          data={data}
          external={external}
          onAction={onAction}
          isOwner={isOwner}
        />
      ) : null}
    </FullHeightLayout>
  );
}
