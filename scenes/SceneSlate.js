import * as React from "react";
import * as System from "~/components/system";
import * as Actions from "~/common/actions";
import * as Validations from "~/common/validations";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";
import * as Utilities from "~/common/utilities";
import * as UserBehaviors from "~/common/user-behaviors";
import * as Events from "~/common/custom-events";
import * as Styles from "~/common/styles";
import * as Upload from "~/components/core/Upload";

import { Link } from "~/components/core/Link";
import { LoaderSpinner } from "~/components/system/components/Loaders";
import { css } from "@emotion/react";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";
import { ButtonPrimary, ButtonSecondary } from "~/components/system/components/Buttons";
import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import ProcessedText from "~/components/core/ProcessedText";
import ScenePage from "~/components/core/ScenePage";
import ScenePageHeader from "~/components/core/ScenePageHeader";
import SquareButtonGray from "~/components/core/SquareButtonGray";
import EmptyState from "~/components/core/EmptyState";
import DataView from "~/components/core/DataView";

const STYLES_LOADER = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100%;
`;

const STYLES_COPY_INPUT = css`
  pointer-events: none;
  position: absolute;
  opacity: 0;
`;

const STYLES_USERNAME = css`
  cursor: pointer;

  :hover {
    color: ${Constants.system.blue};
  }
`;

const STYLES_MOBILE_HIDDEN = css`
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_MOBILE_ONLY = css`
  @media (min-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_SECURITY_LOCK_WRAPPER = (theme) => css`
  background-color: ${theme.semantic.bgDark};
  border-radius: 4px;
  padding: 8px;
  color: ${theme.semantic.textGrayLight};
`;

export default class SceneSlate extends React.Component {
  state = {
    loading: true,
    notFound: false,
    accessDenied: false,
  };

  // componentDidMount = async () => {
  //   if (this.props.data) {
  //     this.openCarouselToItem();
  //   }
  // };

  // componentDidUpdate = async (prevProps) => {
  //   // if (!this.props.data?.objects && !this.state.notFound) {
  //   //   await this.fetchSlate();
  //   // } else
  //   if (this.props.data !== prevProps.data || this.props.page.params !== prevProps.page.params) {
  //     this.openCarouselToItem();
  //   }
  // };

  // fetchSlate = async () => {
  //   const { username, slatename, slateId } = this.props.page;

  //   if (!this.props.data && (!username || !slatename)) {
  //     this.setState({ notFound: true });
  //     return;
  //   }

  //   let id = slateId || this.props.data?.id;

  //   //NOTE(martina): look for the slate in the user's slates
  //   let slate;
  //   if (this.props.viewer) {
  //     if (id) {
  //       for (let s of this.props.viewer.slates) {
  //         if (id && id === s.id) {
  //           slate = s;
  //           break;
  //         }
  //       }
  //     } else if (slatename && username === this.props.viewer.username) {
  //       for (let s of this.props.viewer.slates) {
  //         if (username && slatename === s.slatename) {
  //           slate = s;
  //           break;
  //         }
  //       }
  //       if (!slate) {
  //         Events.dispatchMessage({
  //           message: "We're having trouble fetching that slate right now.",
  //         });
  //         this.setState({ notFound: true });
  //         return;
  //       }
  //     }

  //     if (slate) {
  //       window.history.replaceState(
  //         { ...window.history.state, data: slate },
  //         "Slate",
  //         `/${this.props.viewer.username}/${slate.slatename}`
  //       );
  //     }
  //   }

  //   if (!slate) {
  //     let query;
  //     if (username && slatename) {
  //       query = { username, slatename };
  //     } else if (id) {
  //       query = { id };
  //     }
  //     let response;
  //     if (query) {
  //       response = await Actions.getSerializedSlate(query);
  //     }
  //     if (response?.decorator == "SLATE_PRIVATE_ACCESS_DENIED") {
  //       this.setState({ accessDenied: true, loading: false });
  //       return;
  //     }
  //     if (Events.hasError(response)) {
  //       this.setState({ notFound: true, loading: false });
  //       return;
  //     }
  //     slate = response.slate;
  //     window.history.replaceState(
  //       { ...window.history.state, data: slate },
  //       "Slate",
  //       `/${slate.user.username}/${slate.slatename}`
  //     );
  //   }
  //   this.props.onUpdateData(slate, () => {
  //     this.setState({ loading: false });
  //     this.openCarouselToItem();
  //   });
  // };

  // openCarouselToItem = () => {
  //   if (!this.props.data?.objects?.length || !this.props.page?.params) {
  //     return;
  //   }
  //   let objects = this.props.data.objects;

  //   const { cid, fileId, index } = this.props.page.params;

  //   if (Strings.isEmpty(cid) && Strings.isEmpty(fileId) && typeof index === "undefined") {
  //     return;
  //   }

  //   let foundIndex = -1;
  //   if (index) {
  //     foundIndex = index;
  //   } else if (cid) {
  //     foundIndex = objects.findIndex((object) => object.cid === cid);
  //   } else if (fileId) {
  //     foundIndex = objects.findIndex((object) => object.id === fileId);
  //   }

  //   if (typeof foundIndex !== "undefined" && foundIndex !== -1) {
  //     Events.dispatchCustomEvent({
  //       name: "slate-global-open-carousel",
  //       detail: { index: foundIndex },
  //     });
  //   }
  // };

  render() {
    const slate = this.props.data;
    if (!slate) {
      return (
        <WebsitePrototypeWrapper
          title={`${this.props.page.pageTitle} • Slate`}
          url={`${Constants.hostname}${this.props.page.pathname}`}
        >
          <ScenePage>
            <EmptyState>
              <SVG.Layers height="24px" style={{ marginBottom: 24 }} />
              <div>We were unable to locate that collection</div>
            </EmptyState>
          </ScenePage>
        </WebsitePrototypeWrapper>
      );
    } else {
      let title, description, file, image;
      let name = slate.name;
      if (this.props.page.params?.cid) {
        file = slate.objects.find((file) => file.cid === this.props.page.params.cid);
      }
      if (file) {
        title = `${file.name || file.filename}`;
        description = file.body
          ? file.body
          : `View ${title}, a file in the collection ${name} on Slate`;
        image = Utilities.getImageUrlIfExists(file, Constants.linkPreviewSizeLimit);
      } else {
        if (slate.body) {
          description = `${name}. ${slate.body}`;
        } else {
          description = `View the collection ${name} on Slate`;
        }
        title = `${name} • Slate`;
        image = slate.preview;
        const objects = slate.objects;
        if (!image && objects) {
          for (let i = 0; i < objects.length; i++) {
            if (
              objects[i].type &&
              Validations.isPreviewableImage(objects[i].type) &&
              objects[i].size &&
              objects[i].size < Constants.linkPreviewSizeLimit
            ) {
              image = Strings.getURLfromCID(objects[i].cid);
              break;
            }
          }
        }
      }

      return (
        <WebsitePrototypeWrapper
          description={description}
          title={title}
          url={`${Constants.hostname}${this.props.page.pathname}`}
          image={image}
        >
          <SlatePage {...this.props} key={slate.id} data={slate} />
        </WebsitePrototypeWrapper>
      );
    }
  }
}

class SlatePage extends React.Component {
  _copy = null;
  _timeout = null;
  _remoteLock = false;

  state = {
    ...(this.props.data, this.props.viewer),
    editing: false,
    isSubscribed: this.props.viewer
      ? this.props.viewer.subscriptions.some((subscription) => {
          return subscription.id === this.props.data.id;
        })
      : false,
    index: -1,
  };

  componentDidMount() {
    const {
      page: { cid },
    } = this.props;

    /* NOTE(daniel): If user was redirected to this page, the cid of the slate object will exist in the page props.
    We'll use the cid to open the global carousel */
    if (Strings.isEmpty(cid)) {
      return;
    }

    const index = this.props.data.objects.findIndex((object) => object.cid === cid);
    // if (index !== -1) {
    //   Events.dispatchCustomEvent({
    //     name: "slate-global-open-carousel",
    //     detail: { index },
    //   });
    // }
    if (index === -1) {
      Events.dispatchCustomEvent({
        name: "create-alert",
        detail: {
          alert: {
            message:
              "The requested file could not be found. It may have been removed from the slate or deleted",
          },
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.viewer && this.props.viewer.subscriptions !== prevProps.viewer.subscriptions) {
      this.setState({
        isSubscribed: this.props.viewer.subscriptions.some((subscription) => {
          return subscription.id === this.props.data.id;
        }),
      });
    }
  }

  _handleSubscribe = () => {
    if (!this.props.viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    this.setState({ isSubscribed: !this.state.isSubscribed }, () => {
      Actions.createSubscription({
        slateId: this.props.data.id,
      });
    });
  };

  _handleSavePreview = async (preview) => {
    if (!this.props.viewer) {
      return;
    }
    let updateObject = { id: this.props.data.id, data: { preview } };

    let slates = this.props.viewer.slates;
    let slateId = this.props.data.id;
    for (let slate of slates) {
      if (slate.id === slateId) {
        slate.preview = preview;
        break;
      }
    }
    this.props.onAction({ type: "UPDATE_VIEWER", viewer: { slates } });

    const response = await Actions.updateSlate(updateObject);

    Events.hasError(response);
  };

  // _handleSelect = (index) =>
  //   Events.dispatchCustomEvent({
  //     name: "slate-global-open-carousel",
  //     detail: { index },
  //   });

  _handleShowSettings = () => {
    return this.props.onAction({
      type: "SIDEBAR",
      value: "SIDEBAR_SINGLE_SLATE_SETTINGS",
      data: this.props.data,
    });
  };

  _handleCopy = (e, value) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ copyValue: value, copying: true }, () => {
      this._copy.select();
      document.execCommand("copy");
    });
    setTimeout(() => {
      this.setState({ copying: false });
    }, 1000);
  };

  _handleDownload = () => {
    if (!this.props.viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    const slateName = this.props.data.slatename;
    const slateFiles = this.props.data.objects;
    UserBehaviors.compressAndDownloadFiles({
      files: slateFiles,
      name: `${slateName}.zip`,
    });
  };

  render() {
    const { user, name, objects, body, isPublic, ownerId } = this.props.data;
    const isOwner = this.props.viewer ? ownerId === this.props.viewer.id : false;

    let actions = isOwner ? (
      <span css={Styles.HORIZONTAL_CONTAINER}>
        <SquareButtonGray onClick={this._handleDownload} style={{ marginRight: 16 }}>
          <SVG.Download height="16px" />
        </SquareButtonGray>
        <Upload.Trigger viewer={this.props.viewer} style={{ marginRight: 16 }}>
          <SquareButtonGray>
            <SVG.Plus height="16px" />
          </SquareButtonGray>
        </Upload.Trigger>
        <SquareButtonGray onClick={this._handleShowSettings}>
          <SVG.Settings height="16px" />
        </SquareButtonGray>
      </span>
    ) : (
      <div style={{ display: `flex` }}>
        <SquareButtonGray onClick={this._handleDownload} style={{ marginRight: 16 }}>
          <SVG.Download height="16px" />
        </SquareButtonGray>
        <div onClick={this._handleSubscribe}>
          {this.state.isSubscribed ? (
            <ButtonSecondary>Unsubscribe</ButtonSecondary>
          ) : (
            <ButtonPrimary>Subscribe</ButtonPrimary>
          )}
        </div>
      </div>
    );
    return (
      <ScenePage>
        <ScenePageHeader
          wide
          title={
            user && !isOwner ? (
              <span>
                <Link href={`/$/user/${user.id}`} onAction={this.props.onAction}>
                  <span
                    // onClick={() =>
                    //   this.props.onAction({
                    //     type: "NAVIGATE",
                    //     value: "NAV_PROFILE",
                    //     shallow: true,
                    //     data: user,
                    //   })
                    // }
                    css={STYLES_USERNAME}
                  >
                    {user.username}
                  </span>{" "}
                </Link>
                / {name}
              </span>
            ) : (
              <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
                <span>{name}</span>
                {isOwner && !isPublic && (
                  <div css={STYLES_SECURITY_LOCK_WRAPPER} style={{ marginLeft: 16 }}>
                    <SVG.SecurityLock height="16px" style={{ display: "block" }} />
                  </div>
                )}
              </div>
            )
          }
          actions={<span css={STYLES_MOBILE_HIDDEN}>{actions}</span>}
        >
          {body}
        </ScenePageHeader>
        <span css={STYLES_MOBILE_ONLY}>{actions}</span>
        {objects && objects.length ? (
          <>
            <GlobalCarousel
              carouselType="SLATE"
              viewer={this.props.viewer}
              objects={objects}
              data={this.props.data}
              onAction={this.props.onAction}
              isMobile={this.props.isMobile}
              params={this.props.page.params}
              isOwner={isOwner}
              external={this.props.external}
              index={this.state.index}
              onChange={(index) => this.setState({ index })}
            />
            <div style={{ marginTop: 40 }}>
              <DataView
                key="scene-files-folder"
                type="collection"
                collection={this.props.data}
                onAction={this.props.onAction}
                viewer={this.props.viewer}
                items={objects}
                view={"grid"}
                isOwner={isOwner}
                page={this.props.page}
              />
            </div>
          </>
        ) : isOwner ? (
          <div>
            <EmptyState>
              <FileTypeGroup />
              <div style={{ marginTop: 24 }}>
                Drag and drop files to add them to this collection
              </div>
            </EmptyState>
          </div>
        ) : (
          <div>
            <EmptyState>There's nothing here :)</EmptyState>
          </div>
        )}
        <input
          ref={(c) => {
            this._copy = c;
          }}
          readOnly
          value={this.state.copyValue}
          css={STYLES_COPY_INPUT}
        />
      </ScenePage>
    );
  }
}
