import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as Events from "~/common/custom-events";

import { css } from "@emotion/react";
import { ButtonPrimary } from "~/components/system/components/Buttons";

import Profile from "~/components/core/Profile";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsitePrototypeHeader from "~/components/core/WebsitePrototypeHeader";
import WebsitePrototypeFooter from "~/components/core/WebsitePrototypeFooter";
import CTATransition from "~/components/core/CTATransition";

const DEFAULT_IMAGE =
  "https://slate.textile.io/ipfs/bafkreiaow45dlq5xaydaeqocdxvffudibrzh2c6qandpqkb6t3ahbvh6re";

export const getServerSideProps = async (context) => {
  return {
    props: { ...context.query },
  };
};

const STYLES_ROOT = css`
  display: block;
  grid-template-rows: auto 1fr auto;
  font-size: 1rem;
  min-height: 100vh;
  background-color: ${Constants.semantic.bgLight};
`;

export default class ProfilePage extends React.Component {
  state = {
    visible: false,
    page: null,
  };

  componentDidMount = () => {
    window.onpopstate = this._handleBackForward;

    if (!Strings.isEmpty(this.props.cid)) {
      let files = this.props.creator.library || [];
      let index = files.findIndex((object) => object.cid === this.props.cid);
      if (index !== -1) {
        Events.dispatchCustomEvent({
          name: "slate-global-open-carousel",
          detail: { index },
        });
      }
    }
  };

  _handleBackForward = (e) => {
    let page = window.history.state;
    this.setState({ page });
    Events.dispatchCustomEvent({ name: "slate-global-close-carousel", detail: {} });
  };

  render() {
    const title = this.props.creator
      ? this.props.creator.name
        ? `${this.props.creator.name} on Slate`
        : `@${this.props.creator.username} on Slate`
      : "404";
    const url = `https://slate.host/${title}`;
    const description = this.props.creator.body;
    const image = this.props.creator.photo;
    if (Strings.isEmpty(image)) {
      image = DEFAULT_IMAGE;
    }

    return (
      <WebsitePrototypeWrapper title={title} description={description} url={url} image={image}>
        <WebsitePrototypeHeader />
        <div css={STYLES_ROOT}>
          <Profile
            {...this.props}
            user={this.props.creator}
            page={this.state.page}
            isOwner={false}
            isAuthenticated={this.props.viewer !== null}
            external
          />
        </div>
        {this.state.visible && (
          <div>
            <CTATransition
              onClose={() => this.setState({ visible: false })}
              viewer={this.props.viewer}
              open={this.state.visible}
              redirectURL={`/_${Strings.createQueryParams({
                scene: "NAV_PROFILE",
                user: this.props.creator.username,
              })}`}
            />
          </div>
        )}
        <WebsitePrototypeFooter />
      </WebsitePrototypeWrapper>
    );
  }
}
