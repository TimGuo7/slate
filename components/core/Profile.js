import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as SVG from "~/common/svg";
import * as Actions from "~/common/actions";

import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";
import { css } from "@emotion/react";
import { ButtonPrimary, ButtonSecondary } from "~/components/system/components/Buttons";
import { TabGroup, SecondaryTabGroup } from "~/components/core/TabGroup";
import { Boundary } from "~/components/system/components/fragments/Boundary";
import { PopoverNavigation } from "~/components/system/components/PopoverNavigation";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";

import ProcessedText from "~/components/core/ProcessedText";
import SlatePreviewBlocks from "~/components/core/SlatePreviewBlock";
import CTATransition from "~/components/core/CTATransition";
import DataView from "~/components/core/DataView";
import EmptyState from "~/components/core/EmptyState";

const STYLES_PROFILE_BACKGROUND = css`
  background-color: ${Constants.system.white};
  width: 100%;
  padding: 104px 56px 24px 56px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 80px 24px 16px 24px;
  }
`;

const STYLES_PROFILE = css`
  width: 100%;
  padding: 0px 56px 80px 56px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 0px 24px 16px 24px;
  }
`;

const STYLES_PROFILE_INFO = css`
  line-height: 1.3;
  width: 50%;
  max-width: 800px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin: 0 auto;
  @media (max-width: ${Constants.sizes.tablet}px) {
    width: 100%;
    max-width: 100%;
  }
`;

const STYLES_INFO = css`
  display: block;
  width: 100%;
  text-align: center;
  margin-bottom: 48px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const STYLES_PROFILE_IMAGE = css`
  background-color: ${Constants.system.foreground};
  background-size: cover;
  background-position: 50% 50%;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 4px;
  margin: 0 auto;
  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 64px;
    height: 64px;
  }
`;

const STYLES_NAME = css`
  font-size: ${Constants.typescale.lvl4};
  font-family: ${Constants.font.semiBold};
  max-width: 100%;
  font-weight: 400;
  margin: 16px auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.system.black};
  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-bottom: 8px;
  }
`;

const STYLES_DESCRIPTION = css`
  font-size: ${Constants.typescale.lvl0};
  color: ${Constants.system.darkGray};
  max-width: 100%;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-top: 24px;
  }
`;

const STYLES_STATS = css`
  font-size: ${Constants.typescale.lvl0};
  margin: 16px auto;
  display: flex;
  justify-content: center;
  color: ${Constants.system.grayBlack};
`;

const STYLES_STAT = css`
  margin: 0px 12px;
  ${"" /* width: 112px; */}
  flex-shrink: 0;
`;

const STYLES_EXPLORE = css`
  margin: 64px auto 64px auto;
  height: 1px;
  width: 80px;
  background-color: ${Constants.system.gray};
`;

const STYLES_BUTTON = css`
  margin-bottom: 32px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-bottom: 16px;
  }
`;

const STYLES_ITEM_BOX = css`
  position: relative;
  justify-self: end;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-right: 16px;
  color: ${Constants.system.darkGray};

  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-right: 8px;
  }
`;

const STYLES_USER_ENTRY = css`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  font-size: ${Constants.typescale.lvl1};
  cursor: pointer;
  ${"" /* border: 1px solid ${Constants.system.lightBorder}; */}
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${Constants.system.white};
`;

const STYLES_USER = css`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  margin: 16px;
  color: ${Constants.system.brand};
  font-family: ${Constants.font.medium};
  font-size: ${Constants.typescale.lvl1};

  @media (max-width: ${Constants.sizes.mobile}px) {
    margin: 12px 16px;
  }
`;

const STYLES_DIRECTORY_PROFILE_IMAGE = css`
  background-color: ${Constants.system.foreground};
  background-size: cover;
  background-position: 50% 50%;
  height: 24px;
  width: 24px;
  margin-right: 16px;
  border-radius: 4px;
`;

const STYLES_MESSAGE = css`
  color: ${Constants.system.black};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const STYLES_DIRECTORY_NAME = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const STYLES_COPY_INPUT = css`
  pointer-events: none;
  position: absolute;
  opacity: 0;
`;

function UserEntry({ user, button, onClick, message, external, url }) {
  return (
    <div key={user.username} css={STYLES_USER_ENTRY}>
      {external ? (
        <a css={STYLES_USER} style={{ textDecoration: "none" }} href={url}>
          <div
            css={STYLES_DIRECTORY_PROFILE_IMAGE}
            style={{ backgroundImage: `url(${user.data.photo})` }}
          />
          <span css={STYLES_DIRECTORY_NAME}>
            {user.data.name || `@${user.username}`}
            {message ? <span css={STYLES_MESSAGE}>{message}</span> : null}
          </span>
        </a>
      ) : (
        <div css={STYLES_USER} onClick={onClick}>
          <div
            css={STYLES_DIRECTORY_PROFILE_IMAGE}
            style={{ backgroundImage: `url(${user.data.photo})` }}
          />
          <span css={STYLES_DIRECTORY_NAME}>
            {user.data.name || `@${user.username}`}
            {message ? <span css={STYLES_MESSAGE}>{message}</span> : null}
          </span>
        </div>
      )}
      {button}
    </div>
  );
}

export default class Profile extends React.Component {
  _ref = null;
  lastLength = null;

  state = {
    tab: 1,
    view: 0,
    fileTab: 0,
    slateTab: 0,
    peerTab: 0,
    copyValue: "",
    contextMenu: null,
    publicSlates: [],
    publicFiles: [],
    pseudoPrivateFiles: [],
    isFollowing: this.props.external
      ? false
      : !!this.props.viewer.subscriptions.filter((entry) => {
          return entry.target_user_id === this.props.data.id;
        }).length,
  };

  componentDidMount = async () => {
    await this.filterByVisibility();
  };

  componentDidUpdate = async () => {
    if (
      this.lastLength != null &&
      this.props.creator?.library[0].children.length !== this.lastLength
    ) {
      this.filterByVisibility();
    }
  };

  filterByVisibility = async () => {
    let publicFiles = [];
    let pseudoPrivateFiles = [];
    let files = this.props.creator.library[0].children;
    let publicSlates =
      this.props.creator.username === this.props.viewer?.username
        ? this.props.creator.slates.filter((slate) => {
            return slate.data.public === true;
          })
        : this.props.creator.slates;

    let publicSlateFiles = publicSlates
      .reduce((acc, curr) => {
        return acc.concat(curr.data.objects);
      }, [])
      .reduce((acc, curr) => {
        return acc.concat(curr.cid);
      }, [])
      .reduce((acc, curr) => {
        if (acc.indexOf(curr) === -1) {
          acc.push(curr);
        }
        return acc;
      }, []);
    for (let file of files) {
      if (file.public === true || publicSlateFiles.indexOf(file.cid) != -1) {
        publicFiles.push(file);
      } else {
        pseudoPrivateFiles.push(file);
      }
    }
    this.setState({
      publicSlates: publicSlates,
      publicFiles: publicFiles,
      pseudoPrivateFiles: pseudoPrivateFiles,
    });
    this.lastLength = this.props.creator?.library[0].children.length;
  };

  _handleCopy = (e, value) => {
    e.stopPropagation();
    this.setState({ copyValue: value }, () => {
      this._ref.select();
      document.execCommand("copy");
      this._handleHide();
    });
  };

  _handleHide = (e) => {
    this.setState({ contextMenu: null });
  };

  _handleClick = (e, value) => {
    e.stopPropagation();
    if (this.state.contextMenu === value) {
      this._handleHide();
    } else {
      this.setState({ contextMenu: value });
    }
  };

  _handleFollow = async (e, id) => {
    this._handleHide();
    e.stopPropagation();
    await Actions.createSubscription({
      userId: id,
    });
  };

  render() {
    let isOwner = this.props.creator.username === this.props.viewer?.username;
    let data = this.props.creator ? this.props.creator : this.props.data;
    let subscriptions = this.props.creator.subscriptions || [];
    let subscribers = this.props.creator.subscribers || [];
    let dataItems = !isOwner
      ? this.state.publicFiles
      : this.state.fileTab === 0
      ? this.props.creator.library[0].children
      : this.state.fileTab === 1
      ? this.state.publicFiles
      : this.state.pseudoPrivateFiles;
    let exploreSlates = this.props.exploreSlates;

    let followingSlates = subscriptions
      .filter((relation) => {
        return !!relation.target_slate_id;
      })
      .map((relation) => relation.slate);

    let slates =
      this.state.slateTab === 0
        ? this.state.publicSlates
        : followingSlates?.length
        ? followingSlates
        : null;
    let username = this.state.slateTab === 0 ? data.username : null;

    let following = subscriptions
      .filter((relation) => {
        return !!relation.target_user_id;
      })
      .map((relation) => {
        let button = (
          <div css={STYLES_ITEM_BOX} onClick={(e) => this._handleClick(e, relation.id)}>
            <SVG.MoreHorizontal height="24px" />
            {this.state.contextMenu === relation.id ? (
              <Boundary
                captureResize={true}
                captureScroll={false}
                enabled
                onOutsideRectEvent={(e) => this._handleClick(e, relation.id)}
              >
                {relation.target_user_id === this.props.viewer?.id ? (
                  <PopoverNavigation
                    style={{
                      top: "40px",
                      right: "0px",
                    }}
                    navigation={[
                      {
                        text: "Copy profile URL",
                        onClick: (e) =>
                          this._handleCopy(e, `https://slate.host/${relation.user.username}`),
                      },
                    ]}
                  />
                ) : (
                  <PopoverNavigation
                    style={{
                      top: "40px",
                      right: "0px",
                    }}
                    navigation={[
                      {
                        text: "Copy profile URL",
                        onClick: (e) =>
                          this._handleCopy(e, `https://slate.host/${relation.user.username}`),
                      },
                      {
                        text: this.props.viewer?.subscriptions.filter((subscription) => {
                          return subscription.target_user_id === relation.target_user_id;
                        }).length
                          ? "Unfollow"
                          : "Follow",
                        onClick: this.props.viewer
                          ? (e) => this._handleFollow(e, relation.target_user_id)
                          : () => this.setState({ visible: true }),
                      },
                    ]}
                  />
                )}
              </Boundary>
            ) : null}
          </div>
        );
        return (
          <UserEntry
            key={relation.id}
            user={relation.user}
            button={button}
            onClick={() => {
              this.props.onAction({
                type: "NAVIGATE",
                value: this.props.sceneId,
                scene: "PROFILE",
                data: relation.user,
              });
            }}
            external={this.props.external}
            url={`https://slate.host/${relation.user.username}`}
          />
        );
      });

    let followers = subscribers.map((relation) => {
      let button = (
        <div css={STYLES_ITEM_BOX} onClick={(e) => this._handleClick(e, relation.id)}>
          <SVG.MoreHorizontal height="24px" />
          {this.state.contextMenu === relation.id ? (
            <Boundary
              captureResize={true}
              captureScroll={false}
              enabled
              onOutsideRectEvent={(e) => this._handleClick(e, relation.id)}
            >
              {relation.owner_user_id === this.props.viewer?.id ? (
                <PopoverNavigation
                  style={{
                    top: "40px",
                    right: "0px",
                  }}
                  navigation={[
                    {
                      text: "Copy profile URL",
                      onClick: (e) =>
                        this._handleCopy(e, `https://slate.host/${relation.owner.username}`),
                    },
                  ]}
                />
              ) : (
                <PopoverNavigation
                  style={{
                    top: "40px",
                    right: "0px",
                  }}
                  navigation={[
                    {
                      text: "Copy profile URL",
                      onClick: (e) =>
                        this._handleCopy(e, `https://slate.host/${relation.owner.username}`),
                    },
                    {
                      text: this.props.viewer?.subscriptions.filter((subscription) => {
                        return subscription.target_user_id === relation.owner_user_id;
                      }).length
                        ? "Unfollow"
                        : "Follow",
                      onClick: this.props.viewer
                        ? (e) => this._handleFollow(e, relation.owner_user_id)
                        : () => this.setState({ visible: true }),
                    },
                  ]}
                />
              )}
            </Boundary>
          ) : null}
        </div>
      );
      return (
        <UserEntry
          key={relation.id}
          user={relation.owner}
          button={button}
          onClick={() => {
            this.props.onAction({
              type: "NAVIGATE",
              value: this.props.sceneId,
              scene: "PROFILE",
              data: relation.owner,
            });
          }}
          external={this.props.external}
          url={`https://slate.host/${relation.owner.username}`}
        />
      );
    });

    let total = data.slates.reduce((total, slate) => {
      return total + slate.data?.objects?.length || 0;
    }, 0);

    return (
      <div>
        <GlobalCarousel
          carouselType="data"
          onUpdateViewer={this.props.onUpdateViewer}
          resources={this.props.resources}
          viewer={this.props.viewer}
          objects={
            this.state.fileTab === 0
              ? this.props.creator.library[0].children
              : this.state.fileTab === 1
              ? this.state.publicFiles
              : this.state.pseudoPrivateFiles
          }
          isOwner={isOwner}
          onAction={this.props.onAction}
          mobile={this.props.mobile}
          external={this.props.external}
        />
        <div css={STYLES_PROFILE_BACKGROUND}>
          <div css={STYLES_PROFILE_INFO}>
            <div
              css={STYLES_PROFILE_IMAGE}
              style={{ backgroundImage: `url('${data.data.photo}')` }}
            />
            <div css={STYLES_INFO}>
              <div css={STYLES_NAME}>{Strings.getPresentationName(data)}</div>
              {!isOwner && !this.props.external && (
                <div css={STYLES_BUTTON}>
                  {this.state.isFollowing ? (
                    <ButtonSecondary
                      onClick={(e) => {
                        this.setState({ isFollowing: false });
                        this._handleFollow(e, this.props.creator.id);
                      }}
                    >
                      Unfollow
                    </ButtonSecondary>
                  ) : (
                    <ButtonPrimary
                      onClick={(e) => {
                        this.setState({ isFollowing: true });
                        this._handleFollow(e, this.props.creator.id);
                      }}
                    >
                      Follow
                    </ButtonPrimary>
                  )}
                </div>
              )}
              {data.data.body ? (
                <div css={STYLES_DESCRIPTION}>
                  <ProcessedText text={data.data.body} />
                </div>
              ) : null}
              <div css={STYLES_STATS}>
                <div css={STYLES_STAT}>
                  <div style={{ fontFamily: `${Constants.font.text}` }}>
                    {total} <span style={{ color: `${Constants.system.darkGray}` }}>Files</span>
                  </div>
                </div>
                <div css={STYLES_STAT}>
                  <div style={{ fontFamily: `${Constants.font.text}` }}>
                    {data.slates.length}{" "}
                    <span style={{ color: `${Constants.system.darkGray}` }}>Slates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.visible && (
          <div>
            <CTATransition
              onClose={() => this.setState({ visible: false })}
              viewer={this.props.viewer}
              open={this.state.visible}
              redirectURL={`/_?scene=NAV_PROFILE&user=${data.username}`}
            />
          </div>
        )}
        <div css={STYLES_PROFILE}>
          <TabGroup
            tabs={["Files", "Slates", "Peers"]}
            value={this.state.tab}
            onChange={(value) => this.setState({ tab: value })}
            style={{ marginTop: 0, marginBottom: 32 }}
          />
          {this.state.tab === 0 ? (
            <div>
              <div style={{ display: `flex` }}>
                {isOwner && (
                  <SecondaryTabGroup
                    tabs={["All files", "Everyone can view", "Link access only"]}
                    value={this.state.fileTab}
                    onChange={(value) => this.setState({ fileTab: value })}
                    style={{ margin: "0 0 24px 0" }}
                  />
                )}
                <SecondaryTabGroup
                  tabs={[
                    <SVG.GridView height="24px" style={{ display: "block" }} />,
                    <SVG.TableView height="24px" style={{ display: "block" }} />,
                  ]}
                  value={this.state.view}
                  onChange={(value) => this.setState({ view: value })}
                  style={{ margin: "0 0 24px 0", justifyContent: "flex-end" }}
                />
              </div>
              {!!dataItems.length ? (
                <DataView
                  onAction={this.props.onAction}
                  viewer={this.props.viewer}
                  isOwner={isOwner}
                  items={dataItems}
                  onUpdateViewer={this.props.onUpdateViewer}
                  view={this.state.view}
                />
              ) : (
                <EmptyState>
                  <FileTypeGroup />
                  <div style={{ marginTop: 24 }}>
                    {isOwner
                      ? `Drag and drop files into Slate to upload`
                      : `This user does not have any public files yet`}
                  </div>
                </EmptyState>
              )}
            </div>
          ) : null}
          {this.state.tab === 1 ? (
            <div>
              <SecondaryTabGroup
                tabs={["Slates", "Following"]}
                value={this.state.slateTab}
                onChange={(value) => this.setState({ slateTab: value })}
                style={{ margin: "0 0 24px 0" }}
              />
              {slates?.length ? (
                <SlatePreviewBlocks
                  isOwner={!!isOwner ? isOwner : false}
                  external={this.props.external}
                  slates={slates}
                  username={username}
                  onAction={this.props.onAction}
                />
              ) : (
                <React.Fragment>
                  <EmptyState>
                    <SVG.Slate height="24px" style={{ marginBottom: 24 }} />
                    {this.state.slateTab === 0
                      ? `This user does not have any public slates yet`
                      : `This user is not following any slates yet`}
                  </EmptyState>
                  {this.props.external ? (
                    <React.Fragment>
                      <div css={STYLES_EXPLORE} />
                      <SlatePreviewBlocks
                        isOwner={false}
                        slates={exploreSlates}
                        username={username}
                        onAction={this.props.onAction}
                      />
                    </React.Fragment>
                  ) : null}
                </React.Fragment>
              )}
            </div>
          ) : null}
          {this.state.tab === 2 ? (
            <div>
              <SecondaryTabGroup
                tabs={["Following", "Followers"]}
                value={this.state.peerTab}
                onChange={(value) => this.setState({ peerTab: value })}
                style={{ margin: "0 0 24px 0" }}
              />
              {this.state.peerTab === 0 ? (
                <div>
                  {following?.length ? (
                    following
                  ) : (
                    <EmptyState>
                      <SVG.Users height="24px" style={{ marginBottom: 24 }} />
                      This user is not following anyone yet
                    </EmptyState>
                  )}
                </div>
              ) : null}
              {this.state.peerTab === 1 ? (
                <div>
                  {followers?.length ? (
                    followers
                  ) : (
                    <EmptyState>
                      <SVG.Users height="24px" style={{ marginBottom: 24 }} />
                      This user does not have any followers yet
                    </EmptyState>
                  )}
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
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
