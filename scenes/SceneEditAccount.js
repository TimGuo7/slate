import * as React from "react";
import * as System from "~/components/system";
import * as Actions from "~/common/actions";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as Window from "~/common/window";
import * as Constants from "~/common/constants";
import * as FileUtilities from "~/common/file-utilities";
import * as UserBehaviors from "~/common/user-behaviors";
import * as Events from "~/common/custom-events";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";
import { SecondaryTabGroup } from "~/components/core/TabGroup";
import { ConfirmationModal } from "~/components/core/ConfirmationModal";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import ScenePage from "~/components/core/ScenePage";
import ScenePageHeader from "~/components/core/ScenePageHeader";
import ProfilePhoto from "~/components/core/ProfilePhoto";

const STYLES_FILE_HIDDEN = css`
  height: 1px;
  width: 1px;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -1px;
  left: -1px;
`;

const STYLES_COPY_INPUT = css`
  pointer-events: none;
  position: absolute;
  opacity: 0;
`;

const STYLES_HEADER = css`
  font-family: ${Constants.font.semiBold};
  margin-top: 32px;
  margin-bottom: 16px;
`;

export default class SceneEditAccount extends React.Component {
  state = {
    username: this.props.viewer.username,
    password: "",
    confirm: "",
    body: this.props.viewer.body,
    photo: this.props.viewer.photo,
    name: this.props.viewer.name,
    deleting: false,
    changingPassword: false,
    changingAvatar: false,
    savingNameBio: false,
    changingFilecoin: false,
    modalShow: false,
    showPassword: false,
  };

  _handleUpload = async (e) => {
    this.setState({ changingAvatar: true });
    let file = await UserBehaviors.uploadImage(e.target.files[0]);
    if (!file) {
      this.setState({ changingAvatar: false });
      return;
    }

    const cid = file.cid;
    const url = Strings.getURLfromCID(cid);
    let updateResponse = await Actions.updateViewer({
      user: {
        photo: Strings.getURLfromCID(cid),
      },
    });

    Events.hasError(updateResponse);
    this.setState({ changingAvatar: false, photo: url });
  };

  _handleSave = async (e) => {
    if (!Validations.username(this.state.username)) {
      Events.dispatchMessage({
        message: "Please include only letters and numbers in your username",
      });
      return;
    }

    this.props.onAction({
      type: "UPDATE_VIEWER",
      viewer: { username: this.state.username, name: this.state.name, body: this.state.body },
    });
    this.setState({ savingNameBio: true });

    let response = await Actions.updateViewer({
      user: {
        username: this.state.username,
        photo: this.state.photo,
        body: this.state.body,
        name: this.state.name,
      },
    });

    Events.hasError(response);
    this.setState({ savingNameBio: false });
  };

  _handleUsernameChange = (e) => {
    this.setState({ [e.target.name]: e.target.value.toLowerCase() });
  };

  _handleChangePassword = async (e) => {
    if (!Validations.password(this.state.password)) {
      Events.dispatchMessage({
        message: "Password does not meet requirements",
      });
      return;
    }

    this.setState({ changingPassword: true });

    let response = await Actions.updateViewer({
      type: "CHANGE_PASSWORD",
      user: { password: this.state.password },
    });

    if (Events.hasError(response)) {
      this.setState({ changingPassword: false });
      return;
    }

    this.setState({ changingPassword: false, password: "", confirm: "" });
  };

  _handleDelete = async (res) => {
    if (!res) {
      this.setState({ modalShow: false });
      return;
    }
    this.setState({ deleting: true });
    this.setState({ modalShow: false });

    await Window.delay(100);

    await UserBehaviors.deleteMe({ viewer: this.props.viewer });
    window.location.replace("/_/auth");
    this.setState({ deleting: false });
  };

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    let tab = this.props.page.params?.tab || "profile";
    return (
      <WebsitePrototypeWrapper
        title={`${this.props.page.pageTitle} • Slate`}
        url={`${Constants.hostname}${this.props.page.pathname}`}
      >
        <ScenePage>
          <ScenePageHeader title="Settings" />
          <SecondaryTabGroup
            tabs={[
              { title: "Profile", value: { tab: "profile" } },
              { title: "Security", value: { tab: "security" } },
              { title: "Account", value: { tab: "account" } },
            ]}
            value={tab}
            onAction={this.props.onAction}
            style={{ marginBottom: 48 }}
          />
          {tab === "profile" ? (
            <div>
              <div css={STYLES_HEADER}>Your Avatar</div>

              <ProfilePhoto user={this.props.viewer} size={256} />

              <div style={{ marginTop: 24 }}>
                <input
                  css={STYLES_FILE_HIDDEN}
                  type="file"
                  id="file"
                  onChange={this._handleUpload}
                />
                <System.ButtonPrimary
                  style={{ margin: "0 16px 16px 0", width: "200px" }}
                  type="label"
                  htmlFor="file"
                  loading={this.state.changingAvatar}
                >
                  Upload avatar
                </System.ButtonPrimary>
              </div>

              <div css={STYLES_HEADER}>Display name</div>
              <System.Input
                name="name"
                value={this.state.name}
                placeholder="Your name..."
                onChange={this._handleChange}
              />

              <div css={STYLES_HEADER}>Bio</div>
              <System.Textarea
                maxLength="2000"
                name="body"
                value={this.state.body}
                placeholder="A bit about yourself..."
                onChange={this._handleChange}
              />

              <div style={{ marginTop: 24 }}>
                <System.ButtonPrimary
                  onClick={this._handleSave}
                  loading={this.state.savingNameBio}
                  style={{ width: "200px" }}
                >
                  Save
                </System.ButtonPrimary>
              </div>
            </div>
          ) : null}
          {tab === "security" ? (
            <div>
              <div css={STYLES_HEADER}>Change password</div>
              <div>
                Passwords should be at least 8 characters long, contain a mix of upper and lowercase
                letters, and have at least 1 number and 1 symbol
              </div>

              <System.Input
                containerStyle={{ marginTop: 24 }}
                name="password"
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                placeholder="Your new password"
                onChange={this._handleChange}
                onClickIcon={() => this.setState({ showPassword: !this.state.showPassword })}
                icon={this.state.showPassword ? SVG.EyeOff : SVG.Eye}
              />

              <div style={{ marginTop: 24 }}>
                <System.ButtonPrimary
                  onClick={this._handleChangePassword}
                  loading={this.state.changingPassword}
                  style={{ width: "200px" }}
                >
                  Change password
                </System.ButtonPrimary>
              </div>
            </div>
          ) : null}
          {tab === "account" ? (
            <div>
              <div css={STYLES_HEADER}>Change username</div>
              <div style={{ maxWidth: 800 }}>
                Username must be unique. <br />
                Changing your username will make any links to your profile or slates that you
                previously shared invalid.
              </div>
              <System.Input
                containerStyle={{ marginTop: 12 }}
                name="username"
                value={this.state.username}
                placeholder="Username"
                type="text"
                onChange={this._handleUsernameChange}
              />
              <div style={{ marginTop: 24 }}>
                <System.ButtonPrimary onClick={this._handleSave} style={{ width: "200px" }}>
                  Change my username
                </System.ButtonPrimary>
              </div>

              <div css={STYLES_HEADER} style={{ marginTop: 64 }}>
                Delete your account
              </div>
              <div style={{ maxWidth: 800 }}>
                If you choose to delete your account you will lose your Textile Hub and Powergate
                key.
              </div>

              <div style={{ marginTop: 24 }}>
                <System.ButtonWarning
                  onClick={() => this.setState({ modalShow: true })}
                  loading={this.state.deleting}
                  style={{ width: "200px" }}
                >
                  Delete my account
                </System.ButtonWarning>
              </div>
            </div>
          ) : null}
          <input
            readOnly
            ref={(c) => {
              this._ref = c;
            }}
            value={this.state.copyValue}
            tabIndex="-1"
            css={STYLES_COPY_INPUT}
          />{" "}
          {this.state.modalShow && (
            <ConfirmationModal
              type={"DELETE"}
              withValidation={true}
              matchValue={this.state.username}
              callback={this._handleDelete}
              header={`Are you sure you want to delete your account @${this.state.username}?`}
              subHeader={`You will lose all your files and collections. You can’t undo this action.`}
              inputHeader={`Please type your username to confirm`}
              inputPlaceholder={`Username`}
            />
          )}
        </ScenePage>
      </WebsitePrototypeWrapper>
    );
  }
}
