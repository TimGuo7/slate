import * as React from "react";
import * as Styles from "~/common/styles";
import * as Events from "~/common/custom-events";

import { ModalPortal } from "../ModalPortal";
import { Provider } from "~/components/core/Upload/Provider";
import { Popup } from "~/components/core/Upload/Popup";
import { UploadJumper as Jumper } from "~/components/core/Upload/Jumper";
import { useUploadOnboardingContext } from "~/components/core/Onboarding/Upload";

import DropIndicator from "~/components/core/Upload/DropIndicator";

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/
const Root = ({ children, data }) => {
  return (
    <>
      {children}
      <Jumper data={data} />
      <ModalPortal>
        <Popup />
        <DropIndicator data={data} />
      </ModalPortal>
    </>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

const Trigger = ({ viewer, css, children, ...props }) => {
  const onboardingContext = useUploadOnboardingContext();
  const showUploadModal = () => {
    if (onboardingContext) onboardingContext?.goToNextStep?.call();

    if (!viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    Events.dispatchCustomEvent({ name: "open-upload-jumper" });
  };

  return (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
      <button css={[Styles.BUTTON_RESET, css]} onClick={showUploadModal} {...props}>
        {children}
      </button>
    </div>
  );
};

export { Provider, Root, Trigger };
