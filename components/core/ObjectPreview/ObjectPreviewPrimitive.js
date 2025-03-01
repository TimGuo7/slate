import * as React from "react";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { H5, P2, P3 } from "~/components/system/components/Typography";
import { AspectRatio } from "~/components/system";

import { motion, useAnimation } from "framer-motion";
import { useMounted, useMediaQuery } from "~/common/hooks";

import ImageObjectPreview from "~/components/core/ObjectPreview/ImageObjectPreview";

const STYLES_WRAPPER = (theme) => css`
  position: relative;
  background-color: ${theme.semantic.bgLight};
  transition: box-shadow 0.2s;
  box-shadow: 0 0 0 1px ${theme.system.grayLight4}, ${theme.shadow.card};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
`;

const STYLES_DESCRIPTION = (theme) => css`
  position: relative;
  border-radius: 0px 0px 16px 16px;
  box-sizing: border-box;
  width: 100%;
  background-color: ${theme.semantic.bgLight};
  z-index: 1;
`;

const STYLES_INNER_DESCRIPTION = (theme) => css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${theme.semantic.bgLight};
  padding: 9px 16px 0px;
  border-top: 1px solid ${theme.system.grayLight4};
`;

const STYLES_TAG = css`
  position: relative;
  z-index: 1;
  display: flex;
  padding: 4px 16px 8px;
`;

const STYLES_PREVIEW = css`
  overflow: hidden;
  position: relative;
  flex-grow: 1;
`;

const STYLES_SELECTED_RING = (theme) => css`
  box-shadow: 0 0 0 2px ${theme.system.blue};
`;

// const STYLES_CONTROLS = css`
//   position: absolute;
//   z-index: 1;
//   right: 16px;
//   top: 16px;
//   & > * + * {
//     margin-top: 8px !important;
//   }
// `;

const STYLES_UPPERCASE = css`
  text-transform: uppercase;
`;

export default function ObjectPreviewPrimitive({
  children,
  tag = "FILE",
  file,
  isSelected,
  // viewer,
  owner,
  // NOTE(amine): internal prop used to display
  isImage,
  onAction,
}) {
  // const { save, isSaved, saveCount } = useSaveHandler({ file, viewer });
  // const showSaveButton = viewer?.id !== file?.ownerId;

  // const [areControlsVisible, setShowControls] = React.useState(false);
  // const showControls = () => setShowControls(true);
  // const hideControls = () => setShowControls(false);

  const description = file?.body;
  const media = useMediaQuery();
  const { isDescriptionVisible, showDescription, hideDescription } = useShowDescription({
    disabled: !description || media.mobile,
  });

  const extendedDescriptionRef = React.useRef();
  const descriptionRef = React.useRef();

  const animationController = useAnimateDescription({
    extendedDescriptionRef: extendedDescriptionRef,
    descriptionRef: descriptionRef,
    isDescriptionVisible,
  });

  const { isLink } = file;

  const title = file.name || file.filename;

  if (file?.coverImage && !isImage && !isLink) {
    return (
      <ImageObjectPreview
        file={file}
        owner={owner}
        tag={tag}
        isSelected={isSelected}
        onAction={onAction}
      />
    );
  }

  return (
    <div css={[STYLES_WRAPPER, isSelected && STYLES_SELECTED_RING]}>
      <AspectRatio ratio={248 / 248}>
        <div css={Styles.VERTICAL_CONTAINER}>
          <div
            css={STYLES_PREVIEW}
            //  onMouseEnter={showControls} onMouseLeave={hideControls}
          >
            {/* <AnimatePresence>
          {areControlsVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              css={STYLES_CONTROLS}
            >
              <LikeButton onClick={like} isLiked={isLiked} likeCount={likeCount} />
              {showSaveButton && (
                <SaveButton onSave={save} isSaved={isSaved} saveCount={saveCount} />
              )}
            </motion.div>
          )}
        </AnimatePresence> */}
            {children}
          </div>

          <motion.article css={STYLES_DESCRIPTION}>
            <div style={{ position: "relative", paddingTop: 9 }}>
              <H5 as="h2" nbrOflines={1} style={{ visibility: "hidden" }}>
                {title?.slice(0, 5)}
              </H5>

              {description && (
                <div ref={descriptionRef}>
                  <P3
                    style={{ paddingTop: 3, visibility: "hidden" }}
                    nbrOflines={1}
                    color="textGrayDark"
                  >
                    {description?.slice(0, 5)}
                  </P3>
                </div>
              )}

              <motion.div
                css={STYLES_INNER_DESCRIPTION}
                initial={false}
                animate={isDescriptionVisible ? "hovered" : "initial"}
                variants={animationController.containerVariants}
                onMouseMove={showDescription}
                onMouseLeave={hideDescription}
              >
                <H5 as="h2" nbrOflines={1} color="textBlack" title={title}>
                  {title}
                </H5>
                {!isDescriptionVisible && (
                  <P3 style={{ paddingTop: 3 }} nbrOflines={1} color="textGrayDark">
                    {description}
                  </P3>
                )}
                {description && (
                  <div ref={extendedDescriptionRef}>
                    <P2
                      as={motion.p}
                      style={{ paddingTop: 3 }}
                      nbrOflines={7}
                      initial={{ opacity: 0 }}
                      color="textGrayDark"
                      animate={animationController.descriptionControls}
                    >
                      {description}
                    </P2>
                  </div>
                )}
              </motion.div>
            </div>

            <TagComponent tag={tag} />
          </motion.article>
        </div>
      </AspectRatio>
    </div>
  );
}

const TagComponent = ({ tag }) => (
  <div css={STYLES_TAG}>
    {typeof tag === "string" ? (
      <P3 as="small" css={STYLES_UPPERCASE} color="textGray">
        {tag}
      </P3>
    ) : (
      tag
    )}
  </div>
);

const useShowDescription = ({ disabled }) => {
  const [isDescriptionVisible, setShowDescription] = React.useState(false);
  const timeoutId = React.useRef();

  const showDescription = () => {
    if (disabled) return;

    clearTimeout(timeoutId.current);
    const id = setTimeout(() => setShowDescription(true), 200);
    timeoutId.current = id;
  };
  const hideDescription = () => {
    if (disabled) return;

    clearTimeout(timeoutId.current);
    setShowDescription(false);
  };

  return { isDescriptionVisible, showDescription, hideDescription };
};

const useAnimateDescription = ({
  extendedDescriptionRef,
  descriptionRef,
  isDescriptionVisible,
}) => {
  const descriptionHeights = React.useRef({
    extended: 0,
    static: 0,
  });

  React.useEffect(() => {
    const extendedDescriptionElement = extendedDescriptionRef.current;
    const descriptionElement = descriptionRef.current;
    if (descriptionElement && extendedDescriptionElement) {
      descriptionHeights.current.static = descriptionElement.offsetHeight;
      descriptionHeights.current.extended = extendedDescriptionElement.offsetHeight;
    }
  }, []);

  const containerVariants = {
    initial: {
      borderRadius: "0px",
      y: 0,
      transition: {
        type: "spring",
        stiffness: 170,
        damping: 26,
      },
    },
    hovered: {
      borderRadius: "16px",
      y: -descriptionHeights.current.extended + descriptionHeights.current.static,
      transition: {
        type: "spring",
        stiffness: 170,
        damping: 26,
      },
    },
  };
  const descriptionControls = useAnimation();

  useMounted(() => {
    const extendedDescriptionElement = extendedDescriptionRef.current;
    if (!extendedDescriptionElement) return;

    if (isDescriptionVisible) {
      extendedDescriptionElement.style.opacity = 1;
      descriptionControls.start({ opacity: 1, transition: { delay: 0.2 } });
      return;
    }

    extendedDescriptionElement.style.opacity = 0;
  }, [isDescriptionVisible]);

  return { containerVariants, descriptionControls };
};
