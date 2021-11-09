import * as React from "react";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as Jumper from "~/components/core/Jumper";
import * as SVG from "~/common/svg";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";
import * as Constants from "~/common/constants";
import * as MobileJumper from "~/components/system/components/GlobalCarousel/jumpers/MobileLayout";

import { css } from "@emotion/react";
import { useForm } from "~/common/hooks";

import Field from "~/components/core/Field";

const STYLES_EDIT_INFO_INPUT = (theme) => css`
  width: 100%;
  max-width: unset;
  box-shadow: 0 0 0 1px ${theme.semantic.borderGrayLight4} inset;
  height: 32px;
  border-radius: 12px;
  background-color: transparent;
  padding-top: 5px;
  padding-bottom: 7px;
  color: ${theme.semantic.textBlack};
`;

const STYLES_EDIT_INFO_FOOTER = (theme) => css`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: ${theme.semantic.bgWhite};
`;

const STYLES_EDIT_INFO_FORM = css`
  flex-grow: 1;
  flex-basis: 0;
  overflow-y: auto;
  padding-bottom: 40;
`;

function UpdateFileForm({ file, isMobile, onClose }) {
  const formRef = React.useRef();

  const { getFieldProps, getFormProps, isSubmitting } = useForm({
    initialValues: {
      title: file?.name || "",
      description: file?.body || "",
    },
    onSubmit: async ({ title, description }) => {
      const response = await Actions.updateFile({
        id: file.id,
        name: title,
        body: description,
      });
      Events.hasError(response);
    },
  });

  //NOTE(amine): scroll to the bottom of the form every time the description's textarea resizes
  const scrollToFormBottom = () => {
    const form = formRef.current;
    if (!form) return;
    form.scrollTop = form.scrollHeight - form.clientHeight;
  };

  const JumperItem = isMobile ? MobileJumper.Content : Jumper.Item;

  return (
    <>
      <form ref={formRef} css={STYLES_EDIT_INFO_FORM} {...getFormProps()}>
        <JumperItem>
          <div>
            <System.H6 as="label" color="textGray">
              Title
            </System.H6>
            <Field
              full
              inputCss={STYLES_EDIT_INFO_INPUT}
              style={{ marginTop: 6 }}
              {...getFieldProps("title")}
            />
          </div>
          <div>
            <System.H6 as="label" color="textGray">
              Description
            </System.H6>
            <System.Textarea
              css={STYLES_EDIT_INFO_INPUT}
              style={{ marginTop: 6 }}
              maxLength="2000"
              {...getFieldProps("description", { onChange: scrollToFormBottom })}
            />
          </div>
        </JumperItem>

        {isMobile ? (
          <MobileJumper.Footer css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
            <button
              type="button"
              css={Styles.BUTTON_RESET}
              style={{ width: 32, height: 32 }}
              onClick={onClose}
            >
              <SVG.Edit width={16} height={16} style={{ color: Constants.system.blue }} />
            </button>
            <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} style={{ marginLeft: "auto" }}>
              <System.ButtonSecondary
                type="button"
                onClick={onClose}
                style={{ marginLeft: "auto", minHeight: "32px" }}
              >
                Cancel
              </System.ButtonSecondary>
              <System.ButtonPrimary
                type="submit"
                style={{ marginLeft: "8px", minHeight: "32px" }}
                loading={isSubmitting}
              >
                Save
              </System.ButtonPrimary>
            </div>
          </MobileJumper.Footer>
        ) : (
          <>
            <Jumper.Item css={STYLES_EDIT_INFO_FOOTER}>
              <System.ButtonSecondary
                type="button"
                onClick={onClose}
                style={{ marginLeft: "auto", minHeight: "24px", padding: "1px 12px 3px" }}
              >
                Cancel
              </System.ButtonSecondary>
              <System.ButtonPrimary
                type="submit"
                style={{ marginLeft: "8px", minHeight: "24px", padding: "1px 12px 3px" }}
                loading={isSubmitting}
              >
                Save
              </System.ButtonPrimary>
            </Jumper.Item>
          </>
        )}
      </form>
      <div style={{ height: 50 }} />
    </>
  );
}

/* -----------------------------------------------------------------------------------------------*/

export function EditInfo({ file, isOpen, onClose }) {
  return (
    <Jumper.AnimatePresence>
      {isOpen ? (
        <Jumper.Root onClose={onClose}>
          <Jumper.Header>
            <System.H5 color="textBlack">Edit info</System.H5>
          </Jumper.Header>
          <Jumper.Divider />
          <Jumper.Item>
            <Jumper.ObjectPreview file={file} />
          </Jumper.Item>
          <Jumper.Divider />
          <UpdateFileForm key={file.id} file={file} isMobile={false} onClose={onClose} />
        </Jumper.Root>
      ) : null}
    </Jumper.AnimatePresence>
  );
}

export function EditInfoMobile({ file, isOpen, onClose }) {
  return isOpen ? (
    <MobileJumper.Root>
      <MobileJumper.Header>
        <System.H5 as="p" color="textBlack">
          Edit Info
        </System.H5>
      </MobileJumper.Header>
      <System.Divider height={1} color="borderGrayLight" />
      <div style={{ padding: "13px 16px 11px" }}>
        <Jumper.ObjectPreview file={file} />
      </div>
      <System.Divider height={1} color="borderGrayLight" />
      <UpdateFileForm isMobile key={file.id} file={file} onClose={onClose} />
    </MobileJumper.Root>
  ) : null;
}
