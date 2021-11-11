import * as React from "react";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";
import * as Constants from "~/common/constants";

import { ModalPortal } from "~/components/core/ModalPortal";
import { css } from "@emotion/react";
import {
  AnimateSharedLayout,
  AnimatePresence as FramerAnimatePresence,
  motion,
} from "framer-motion";
import { useEscapeKey } from "~/common/hooks";
import { Show } from "~/components/utility/Show";

import ObjectBoxPreview from "~/components/core/ObjectBoxPreview";

/* -------------------------------------------------------------------------------------------------
 *  Root
 * -----------------------------------------------------------------------------------------------*/

const JUMPER_WIDTH = 640;
const JUMPER_HEIGHT = 400;

const STYLES_JUMPER_ROOT = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: fixed;
  top: calc(50% - ${JUMPER_HEIGHT / 2}px);
  left: calc(50% - ${JUMPER_WIDTH / 2}px);
  width: ${JUMPER_WIDTH}px;
  min-height: ${JUMPER_HEIGHT}px;
  z-index: ${theme.zindex.jumper};
  border-radius: 16px;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  overflow: hidden;
  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }
`;

const STYLES_JUMPER_OVERLAY = (theme) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${theme.zindex.jumper};
  background-color: ${theme.semantic.bgBlurDark};
`;

const JumperContext = React.createContext({});
const useJumperContext = () => React.useContext(JumperContext);

function AnimatePresence({ children, ...props }) {
  return <FramerAnimatePresence {...props}>{children}</FramerAnimatePresence>;
}

function Root({ children, onClose, withOverlay = true, withDismissButton = true, ...props }) {
  useEscapeKey(onClose);
  return (
    <ModalPortal>
      <div>
        {withOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            css={STYLES_JUMPER_OVERLAY}
            onClick={onClose}
          />
        )}
        <System.Boundary enabled={true} onOutsideRectEvent={onClose}>
          <JumperContext.Provider value={{ onClose, withDismissButton }}>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              css={STYLES_JUMPER_ROOT}
              {...props}
            >
              {children}
            </motion.div>
          </JumperContext.Provider>
        </System.Boundary>
      </div>
    </ModalPortal>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Header
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_HEADER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  justify-content: space-between;
  padding: 17px 20px 15px;
`;

function Header({ children, style, ...props }) {
  const { onClose, withDismissButton } = useJumperContext();
  return (
    <div css={STYLES_JUMPER_HEADER} style={style}>
      <div style={{ width: "100%" }} {...props}>
        {children}
      </div>
      {withDismissButton && (
        <button
          css={Styles.BUTTON_RESET}
          style={{ width: 24, height: 24, marginLeft: 12 }}
          onClick={onClose}
        >
          <SVG.Dismiss width={20} height={20} style={{ display: "block" }} />
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Item
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_ITEM = css`
  padding: 13px 20px 12px;
`;

function Item({ children, ...props }) {
  return (
    <div css={[STYLES_JUMPER_ITEM, css]} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Divider
 * -----------------------------------------------------------------------------------------------*/
function Divider({ children, ...props }) {
  return (
    <System.Divider height={1} color="borderGrayLight4" {...props}>
      {children}
    </System.Divider>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  ObjectPreview
 * -----------------------------------------------------------------------------------------------*/

function ObjectPreview({ file }) {
  return (
    <div
      css={Styles.HORIZONTAL_CONTAINER_CENTERED}
      style={{ color: Constants.system.green, width: "100%" }}
    >
      <div>
        <SVG.CheckCircle />
      </div>
      <div style={{ marginLeft: 12, marginRight: 12 }}>
        <AnimateSharedLayout>
          <motion.div layoutId={`${file.id}-title`} key={`${file.id}-title`}>
            <System.H5 nbrOflines={1} as="h1" style={{ wordBreak: "break-all" }} color="textBlack">
              {file?.name || file?.filename}
            </System.H5>
          </motion.div>
        </AnimateSharedLayout>
        <Show when={file?.source}>
          <System.P3 nbrOflines={1} color="textBlack" style={{ marginTop: 3 }}>
            {file?.source}
          </System.P3>
        </Show>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <ObjectBoxPreview file={file} placeholderRatio={2} style={{ width: 28, height: 39 }} />
      </div>
    </div>
  );
}

export { AnimatePresence, Root, Header, Item, Divider, ObjectPreview };
