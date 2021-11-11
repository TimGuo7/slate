import * as React from "react";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Jumper from "~/components/system/components/fragments/Jumper";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { ModalPortal } from "~/components/core/ModalPortal";
import { useIsomorphicLayoutEffect } from "~/common/hooks";

import ProfilePhoto from "~/components/core/ProfilePhoto";
import OnboardingPopup from "~/components/core/Onboarding/Popup";
import OnboardingOverlay from "~/components/core/Onboarding/Overlay";

/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/

const UploadOnboardingContext = React.createContext();
export const useUploadOnboardingContext = () => React.useContext(UploadOnboardingContext);

const steps = {
  welcome: "welcome",
  triggerWalkthrough: "triggerWalkthrough",
  jumperWalkthrough: "jumperWalkthrough",
  finish: "finish",
};

function Provider({ children, viewer, onAction, ...props }) {
  const [currentStep, setCurrentStep] = React.useState(
    viewer?.onboarding?.upload ? steps.finish : steps.welcome
  );

  const goToNextStep = React.useCallback(() => {
    if (currentStep === steps.finish) return;

    const nextStep = {
      welcome: "triggerWalkthrough",
      triggerWalkthrough: "jumperWalkthrough",
      jumperWalkthrough: "finish",
    };
    setCurrentStep((prev) => nextStep[prev]);
  }, [currentStep]);

  useIsomorphicLayoutEffect(() => {
    if (currentStep === steps.finish) {
      onAction({
        type: "UPDATE_VIEWER",
        viewer: { onboarding: { ...viewer.onboarding, upload: true } },
      });
    }
  }, [currentStep]);

  return (
    <UploadOnboardingContext.Provider value={{ currentStep, steps, goToNextStep }} {...props}>
      {children}
    </UploadOnboardingContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Welcome
 * -----------------------------------------------------------------------------------------------*/

const STYLES_WELCOME_WRAPPER = (theme) => css`
  ${Styles.CONTAINER_CENTERED};
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  z-index: ${theme.zindex.cta};

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteTRN};
  }
`;

function Welcome({ viewer }) {
  const { goToNextStep, currentStep, steps } = useUploadOnboardingContext();

  if (currentStep !== steps.welcome) return null;

  return (
    <ModalPortal>
      <div css={STYLES_WELCOME_WRAPPER}>
        <div css={Styles.VERTICAL_CONTAINER_CENTERED}>
          <ProfilePhoto user={viewer} style={{ borderRadius: "12px" }} size={64} />
          <System.H2 style={{ marginTop: 25 }} as="h1">
            Welcome to Slate, {viewer.username}
          </System.H2>
          <System.P1 style={{ marginTop: 5, textAlign: "center" }}>
            Slate is your personal search engine for the web. <br /> Use Slate for moodboards,
            research, personal storage etc.
          </System.P1>
          <System.ButtonSecondary
            onClick={goToNextStep}
            style={{ marginTop: 38, boxShadow: "none" }}
          >
            Get Started
          </System.ButtonSecondary>
        </div>
      </div>
    </ModalPortal>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  UploadWalkthrough
 * -----------------------------------------------------------------------------------------------*/
const STYLES_OVERLAY_ZINDEX = css`
  z-index: 1;
`;

const STYLES_JUMPER_FOOTER = (theme) => css`
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurLight};
  }
`;

const PROTO_SCHOOL_CID = "https://proto.school/anatomy-of-a-cid/01";

function UploadWalkthrough() {
  const { currentStep, steps } = useUploadOnboardingContext();

  if (currentStep !== steps.triggerWalkthrough && currentStep !== steps.jumperWalkthrough)
    return null;

  return (
    <div>
      {currentStep === steps.triggerWalkthrough && (
        <Jumper.Root withOverlay={false} withDismissButton={false}>
          <Jumper.Header>
            <System.H5 color="textBlack">Upload to the content addressable network</System.H5>
          </Jumper.Header>
          <Jumper.Divider />
          <Jumper.Item>
            <System.H2 color="textBlack" style={{ marginTop: 60 }}>
              Your data is portable by default.
            </System.H2>
            <Jumper.Divider style={{ marginTop: 16 }} />
            <System.P2 color="textBlack" style={{ marginTop: 16 }}>
              Files (not including links) you save to Slate will be stored on IPFS. You will get a
              CID link when you save with Slate. Anyone can access your files on IPFS with a CID
              link.
              <br />
              Example:
              <br />
              <a
                css={Styles.LINK}
                style={{ color: Constants.semantic.textBlack }}
                href="https://ipfs.io/bafkreiabty76ayakifavlpzwvxjha255aajcii2dwl7pdfmcuubswx7qja"
                target="_blank"
                rel="noreferrer"
              >
                https://ipfs.io/bafkreiabty76ayakifavlpzwvxjha255aajcii2dwl7pdfmcuubswx7qja{" "}
              </a>
            </System.P2>
          </Jumper.Item>
          <Jumper.Item
            css={STYLES_JUMPER_FOOTER}
            style={{
              marginTop: "auto",
            }}
          >
            <System.ButtonSecondary
              type="link"
              href={PROTO_SCHOOL_CID}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto", minHeight: "24px" }}
            >
              Learn More
            </System.ButtonSecondary>
          </Jumper.Item>
        </Jumper.Root>
      )}
      <OnboardingOverlay css={currentStep === steps.jumperWalkthrough && STYLES_OVERLAY_ZINDEX} />
      <OnboardingPopup
        header={
          currentStep === steps.triggerWalkthrough
            ? "Click the + button to start uploading"
            : "Save something you find interesting"
        }
      >
        {currentStep === steps.triggerWalkthrough ? (
          <>
            <System.P2>
              You can save links and files to Slate. <br />
              Just click on the
              <span
                style={{
                  padding: "2px",
                  marginLeft: 10,
                  marginRight: 10,
                  position: "relative",
                  top: 3,
                }}
              >
                <SVG.Plus height="16px" />
              </span>
              button on top right.
            </System.P2>
            <System.P2 color="textGray" style={{ marginTop: 14 }}>
              1/2
            </System.P2>
          </>
        ) : (
          <>
            <System.P2 style={{}}>
              Use the web app or Chrome extension to save stuff to Slate.
            </System.P2>
            <System.P2 color="textGray" style={{ marginTop: 14 }}>
              2/2
            </System.P2>
          </>
        )}
      </OnboardingPopup>
    </div>
  );
}

export function UploadOnboarding({ viewer, onAction, children }) {
  return (
    <Provider viewer={viewer} onAction={onAction}>
      <Welcome viewer={viewer} />
      <UploadWalkthrough />
      {children}
    </Provider>
  );
}
