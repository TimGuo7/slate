import * as React from "react";
import * as System from "~/components/system";
import * as Actions from "~/common/actions";

import { ModalPortal } from "~/components/core/ModalPortal";
import { useIsomorphicLayoutEffect } from "~/common/hooks";

import OnboardingPopup from "~/components/core/Onboarding/Popup";

/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/

const TagsOnboardingContext = React.createContext();
export const useTagsOnboardingContext = () => React.useContext(TagsOnboardingContext);

const steps = {
  tagsTrigger: "tagsTrigger",
  tagsJumper: "tagsJumper",
  finish: "finish",
};

function Provider({ children, onAction, viewer, ...props }) {
  const [currentStep, setCurrentStep] = React.useState(
    viewer?.onboarding?.tags ? steps.finish : steps.tagsTrigger
  );

  useIsomorphicLayoutEffect(() => {
    if (currentStep === steps.finish) {
      onAction({
        type: "UPDATE_VIEWER",
        viewer: { onboarding: { ...viewer.onboarding, tags: true } },
      });
      Actions.updateOnboarding({ tags: true });
    }
  }, [currentStep]);

  const contextValue = React.useMemo(
    () => ({
      currentStep,
      steps,
      goToNextStep() {
        if (currentStep === steps.finish) return;

        const nextStep = { tagsTrigger: "tagsJumper", tagsJumper: "finish" };
        setCurrentStep((prev) => nextStep[prev]);
      },
    }),
    [currentStep]
  );

  return (
    <TagsOnboardingContext.Provider value={contextValue} {...props}>
      {children}
    </TagsOnboardingContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * TagsWalkthrought
 * -----------------------------------------------------------------------------------------------*/

function TagsWalkthrought() {
  const [isOrganizeTagsPopupVisible, setOrganizeTagsPopupVisiblity] = React.useState(true);
  const hideOrganizeTagsPopup = () => setOrganizeTagsPopupVisiblity(false);

  const [isTagsPrivacyPopupVisible, setTagsPrivacyPopupVisibility] = React.useState(true);
  const hideTagsPrivacyPopup = () => setTagsPrivacyPopupVisibility(false);

  const { currentStep, steps } = useTagsOnboardingContext();

  if (currentStep === steps.tagsTrigger)
    return isOrganizeTagsPopupVisible ? (
      <ModalPortal>
        <OnboardingPopup
          header={"Organize with tags"}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, ease: "easeInOut" }}
        >
          <System.P2 color="textBlack">
            Hover over the object and click on “#” button to apply tags to it.
          </System.P2>
          <System.ButtonPrimary
            style={{ marginLeft: "auto", marginTop: 34, minHeight: "24px" }}
            onClick={hideOrganizeTagsPopup}
          >
            Got it
          </System.ButtonPrimary>
        </OnboardingPopup>
      </ModalPortal>
    ) : null;

  if (currentStep === steps.tagsJumper) {
    return (
      <ModalPortal>
        {isTagsPrivacyPopupVisible ? (
          <OnboardingPopup header="Tag privacy">
            <System.P2 color="textBlack">
              All your objects are link-access only by default. If you apply public tags on them,
              they will show up on your profile.
            </System.P2>
            <System.ButtonPrimary
              style={{ marginLeft: "auto", marginTop: 14, minHeight: "24px" }}
              onClick={hideTagsPrivacyPopup}
            >
              Got it
            </System.ButtonPrimary>
          </OnboardingPopup>
        ) : null}
      </ModalPortal>
    );
  }

  return null;
}

export function TagsOnboarding({ isActive, onAction, viewer, children }) {
  return (
    <Provider viewer={viewer} onAction={onAction}>
      {isActive ? <TagsWalkthrought /> : null}
      {children}
    </Provider>
  );
}
