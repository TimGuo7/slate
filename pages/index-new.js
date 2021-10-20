import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVGLogo from "~/common/logo";
import * as System from "~/components/system";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsiteHeader from "~/components/core/WebsiteHeader";
import WebsiteFooter from "~/components/core/WebsiteFooter";
import Field from "~/components/core/Field";

import { css } from "@emotion/react";
import { useForm, useField } from "~/common/hooks";

const WEB3 = [
  {
    title: "Textile",
    text:
      "Textile is a set of open-source tools to help developers use the Filecoin network. That includes high-throughput storage APIs, permissionless storage bridges to Layer 1 blockchains, and more.",
    link: "https://www.textile.io/",
    action: "Learn more",
  },
  {
    title: "Filecoin + IPFS",
    text:
      "Filecoin and IPFS are complementary protocols for storing and sharing data in the distributed web. Both systems are free, open-source, and share many building blocks, including data representation formats (IPLD) and network communication protocols (libp2p).",
    link: "https://docs.filecoin.io/about-filecoin/ipfs-and-filecoin/",
    action: "Learn more",
  },
  {
    title: "Estuary",
    text:
      "Estuary is a decentralized data storage service built on key d-web protocols that allow you to Store and retrieve content quickly using IPFS. It allows you to Store content on Filecoin with proposition and succesful deal receipts.",
    link: "https://estuary.tech/",
    action: "Learn more",
  },
];

const FAQ = [
  {
    title: "How is Slate different from a file storage service or bookmarking tool?",
    text:
      "Are.na + Dropbox <br /> Slate is your personal, all in one database optimized for search and recall",
  },
  {
    title: "How is Slate different from a file storage service or bookmarking tool?",
    text:
      "Are.na + Dropbox <br /> Slate is your personal, all in one database optimized for search and recall",
  },
  {
    title: "How is Slate different from a file storage service or bookmarking tool?",
    text:
      "Are.na + Dropbox <br /> Slate is your personal, all in one database optimized for search and recall",
  },
];

const BANNER = [
  {
    link:
      "https://slate.host/tara/neon-genesis-evangelion?cid=bafybeib2zzeknjmih25wivzogzupd7atrdbaxpvmsxfgutrqymlyfc2dvi",
    name: "@tara",
    img:
      "https://slate.textile.io/ipfs/bafybeib2zzeknjmih25wivzogzupd7atrdbaxpvmsxfgutrqymlyfc2dvi",
  },
  {
    link:
      "https://slate.host/biodivlibrary/the-mushroom-book?cid=bafybeigph7tfup3wb3truahl7sycaywx3unwa365jk4assrjjlzv6d7x3a",
    name: "@biodivlibrary",
    img:
      "https://slate.textile.io/ipfs/bafybeigph7tfup3wb3truahl7sycaywx3unwa365jk4assrjjlzv6d7x3a",
  },
  {
    link:
      "https://slate.host/jin/cryptovoxels-history?cid=bafybeiafrj3erh3rfqux4zqc7u2px3veqdppbtizq26p443utxunrkgonu",
    name: "@jin",
    img:
      "https://slate.textile.io/ipfs/bafybeiafrj3erh3rfqux4zqc7u2px3veqdppbtizq26p443utxunrkgonu",
  },
  {
    link:
      "https://slate.host/ng/numero?cid=bafybeibhhfgc4amvymoblaxcoe6glyyvaxhylzisl4ib2itcbhn3mrviou",
    name: "@ng",
    img:
      "https://slate.textile.io/ipfs/bafybeibhhfgc4amvymoblaxcoe6glyyvaxhylzisl4ib2itcbhn3mrviou",
  },
  {
    link:
      "https://slate.host/thesimpsons/clips?cid=bafybeigce5klzr3vgzmlathvepuzhzhmwjc6bbvmsmcvu5eyisy6mnkx34",
    name: "@thesimpsons",
    img:
      "https://slate.textile.io/ipfs/bafybeigce5klzr3vgzmlathvepuzhzhmwjc6bbvmsmcvu5eyisy6mnkx34",
  },

  {
    link:
      "https://slate.host/bitgraves/september?cid=bafybeiclkru6hwzw2ghvsyrbnaf67taxxhq2hbpcia2oqj5ufdggwhcbti",
    name: "@bitgraves",
    img:
      "https://slate.textile.io/ipfs/bafybeiclkru6hwzw2ghvsyrbnaf67taxxhq2hbpcia2oqj5ufdggwhcbti",
  },
  {
    link:
      "https://slate.host/nypl/japan-kimbei-kusakabe?cid=bafkreidqz6imwffq5hpkacmxnrffagzxx5usybpitt42yuzthe6uf4idlm",
    name: "@nypl",
    img:
      "https://slate.textile.io/ipfs/bafkreidqz6imwffq5hpkacmxnrffagzxx5usybpitt42yuzthe6uf4idlm",
  },
  {
    link:
      "https://slate.host/atlas/cartography?cid=bafybeid2n55qb4thosrxlszhzi3nwiorswv7xi2d5ykbudp3ph5hc54baa",
    name: "@atlas",
    img:
      "https://slate.textile.io/ipfs/bafybeid2n55qb4thosrxlszhzi3nwiorswv7xi2d5ykbudp3ph5hc54baa",
  },
  {
    link:
      "https://slate.host/museosabiertos/palais-de-glace-fotografia?cid=bafybeigrznzuqymmfligf6mhc7adh6r7iw5gotbrzstcqeyyybaklfguki",
    name: "@museosabiertos",
    img:
      "https://slate.textile.io/ipfs/bafybeigrznzuqymmfligf6mhc7adh6r7iw5gotbrzstcqeyyybaklfguki",
  },
  {
    link:
      "https://slate.host/gndclouds/animation?cid=bafybeigh44l3uzsgv4hslpruxrr5s43olpj5llptmsafkemxbwlu4fbdc4",
    name: "@gndclouds",
    img:
      "https://slate.textile.io/ipfs/bafybeigh44l3uzsgv4hslpruxrr5s43olpj5llptmsafkemxbwlu4fbdc4",
  },

  {
    link:
      "https://slate.host/cindy/sw-sans?cid=bafkreihazsjq7hlho6ab6k7tise6ufv2ccat5gv5f3fz7yy4cluz3e356e",
    name: "@cindy",
    img:
      "https://slate.textile.io/ipfs/bafkreihazsjq7hlho6ab6k7tise6ufv2ccat5gv5f3fz7yy4cluz3e356e",
  },
  {
    link:
      "https://slate.host/haris/archive?cid=bafkreigcdnhxnh4fp7g2xy2gp43umhjrqyzz2a2t3ovnmcabepwusx5ldi",
    name: "@haris",
    img:
      "https://slate.textile.io/ipfs/bafkreigcdnhxnh4fp7g2xy2gp43umhjrqyzz2a2t3ovnmcabepwusx5ldi",
  },
  {
    link:
      "https://slate.host/guji/%E5%8C%97%E4%BA%AC%E7%9A%87%E5%9F%8E%E5%BB%BA%E7%AD%91%E8%A3%85%E9%A5%B0?cid=bafybeiceh32ka3l6nlxniziefaxqs44ib4i47pohdftjzvlbsoem3qk6ly",
    name: "@guji",
    img:
      "https://slate.textile.io/ipfs/bafybeiceh32ka3l6nlxniziefaxqs44ib4i47pohdftjzvlbsoem3qk6ly",
  },
  {
    link:
      "https://slate.host/martina/reaction-gifs?cid=bafybeif344hukksxizwk2dhmp6xjybnbw6x62r23m6wju2btxpsk4yluki",
    name: "@martina",
    img:
      "https://slate.textile.io/ipfs/bafybeif344hukksxizwk2dhmp6xjybnbw6x62r23m6wju2btxpsk4yluki",
  },
];

const STYLES_ROOT = css`
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-height: 100vh;
  background-color: ${Constants.semantic.bgLight};
  color: ${Constants.semantic.textGrayDark};
`;

const STYLES_CONTAINER = css`
  max-width: 1080px;
  margin: 0 auto;
  padding: 160px 0;
`;

const STYLES_CONTAINER_FLEX = css`
  ${STYLES_CONTAINER};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HERO_TEXT = css`
  display: flex;
  align-items: center;
  margin-bottom: 80px;
`;

const STYLES_TEXT = css`
  min-width: calc(50% - 24px);
  max-width: 50%;
  margin-bottom: 43px;
`;

const STYLES_HEADING = css`
  font-family: ${Constants.font.semiBold};
  flex-shrink: 0;
  color: ${Constants.semantic.textBlack};
  flex-shrink: 0;
  min-width: 50%;
`;

const STYLES_HEADING1 = css`
  ${STYLES_HEADING};
  font-size: 84px;
  line-height: 88px;
  letter-spacing: -0.04em;
  display: flex;
  align-items: baseline;
`;

const STYLES_HEADING2 = css`
  ${STYLES_HEADING};
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.025em;
  margin-bottom: 30px;
`;

const STYLES_HEADING3 = css`
  ${STYLES_HEADING};
  font-size: 20px;
  line-height: 24px;
  letter-spacing: -0.025em;
  margin-bottom: 16px;
`;

const STYLES_BODY1 = css`
  font-family: ${Constants.font.text};
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.02em;
  margin-top: 15px;
`;

const STYLES_BODY2 = css`
  font-family: ${Constants.font.text};
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.008em;
`;

const STYLES_BODY3 = css`
  font-family: ${Constants.font.medium};
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.006px;
`;

const STYLES_IMG = css`
  width: 100%;
  overflow: hidden;
  box-shadow: 0px 10.8725px 57.9866px rgba(174, 176, 178, 0.3);
  min-width: 50%;
`;

const STYLES_BUTTON = css`
  cursor: poitner;
  display: inline-flex;
  flex-grow: 0;
  justify-content: center;
  align-items: center;
  box-shadow: ${Constants.shadow.lightSmall};
  text-decoration: none;
  font-family: ${Constants.font.medium};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.006px;
  cursor: pointer;
`;

const STYLES_BUTTON_PRIMARY = css`
  ${STYLES_BUTTON};
  color: ${Constants.semantic.textWhite};
  background-color: ${Constants.system.blue};
`;

const STYLES_BUTTON_PRIMARY_BIG = css`
  ${STYLES_BUTTON_PRIMARY};
  padding: 9px 24px 11px 24px;
  border-radius: 12px;
`;

const STYLES_BUTTON_SECONDARY = css`
  ${STYLES_BUTTON};
  color: ${Constants.semantic.textBlack};
  background-color: ${Constants.semantic.bgGrayLight};
`;

const STYLES_BUTTON_SECONDARY_SMALL = css`
  ${STYLES_BUTTON_SECONDARY};
  padding: 1px 12px 3px;
  border-radius: 8px;
`;

const STYLES_DATA_METER = css`
  border: 1px solid ${Constants.semantic.borderGrayLight4};
  border-radius: 8px;
  background-color: ${Constants.semantic.bgGrayLight};
  width: 100%;
  height: 24px;
`;

const STYLES_DATA_USED = css`
  background-color: ${Constants.system.green};
  width: 2%;
  height: 100%;
  border-radius: 8px 0 0 8px;
`;

const STYLES_CARD_GROUP = css`
  display: flex;
  justify-content: space-between;
`;

const STYLES_CARD = css`
  background-color: ${Constants.semantic.bgWhite};
  border-radius: 24px;
  padding: 25px 24px 24px;
  width: calc(33.3% - 16px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const STYLES_CURSOR_BLINK = css`
  background-color: ${Constants.semantic.textGrayLight};
  width: 37px;
  height: 61px;
  margin-left: 6px;
  overflow: hidden;
  animation: blink-animation 1s steps(5, start) infinite;
  -webkit-animation: blink-animation 1s steps(5, start) infinite;
  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
  @-webkit-keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
`;

const STYLES_ROTATING_BANNER = css`
  background-color: ${Constants.semantic.bgDark};
  width: 100%;
  overflow: hidden;
  padding: 48px 0 36px 0;
`;

const STYLES_BANNER_ANIMATION = css`
  display: flex;
  position: relative;
  align-items: center;
  animation: moving 240s linear infinite;
  -webkit-animation: moving 240s linear infinite;
  @keyframes moving {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(-90%);
    }
  }
  @-webkit-keyframes moving {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(-90%);
    }
  }
`;

const STYLES_BANNER_GROUP = css`
  display: flex;
  align-items: center;
`;

const STYLES_BANNER_IMG = css`
  max-width: 200px;
  max-height: 200px;
  box-shadow: ${Constants.shadow.lightMedium};
`;

const STYLES_BANNER_ITEM = css`
  text-decoration: none;
  color: ${Constants.semantic.textGrayLight};
  margin-left: 88px;
  cursor: pointer;
`;

const STYLES_AUTH_MODAL = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 36px 32px;
  background: linear-gradient(180deg, #ffffff 0%, #f7f8f9 100%);
  border-radius: 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const STYLES_DIVIDER = css`
  height: 1px;
  width: 64px;
  background-color: ${Constants.semantic.textGray};
  margin: 32px auto;
`;

const Card = (props) => {
  return (
    <div css={STYLES_CARD} style={props.style}>
      <div styles={{ height: "100%" }}>
        <div css={STYLES_HEADING3}>{props.title}</div>
        <div css={STYLES_BODY2}>{props.text}</div>
      </div>
      {props.action && (
        <a
          css={STYLES_BUTTON_SECONDARY_SMALL}
          style={{ marginTop: 24 }}
          href={props.link}
          target="_blank"
        >
          {props.action}
        </a>
      )}
    </div>
  );
};

const Banner = (props) => {
  return (
    <a css={STYLES_BANNER_ITEM} href={props.link}>
      <img css={STYLES_BANNER_IMG} src={props.img} />
      <div css={STYLES_BODY3}>{props.name}</div>
    </a>
  );
};

export default class IndexPage extends React.Component {
  render() {
    const title = `Slate`;
    const description = "Your personal search engine";
    const url = "https://slate.host/index-new";
    const image =
      "https://slate.textile.io/ipfs/bafkreiddhzzwu5l6i7cikmydvumgnqwoml4rsurzftkopcvgcnwhndo7fa";

    return (
      <WebsitePrototypeWrapper title={title} description={description} url={url} image={image}>
        <WebsiteHeader />
        <div css={STYLES_ROOT}>
          <div css={STYLES_CONTAINER}>
            <div css={STYLES_HEADING1}>your personal</div>
            <div css={STYLES_HEADING1} style={{ color: Constants.semantic.textGray }}>
              search
              <div css={STYLES_CURSOR_BLINK} />
            </div>
            <div css={STYLES_HERO_TEXT}>
              <div css={STYLES_HEADING1}>engine</div>
              <div css={STYLES_BODY1}>
                Slate is a search tool for saving all of your files, bookmarks, and links on the
                web.
              </div>
            </div>
            <img
              css={STYLES_IMG}
              src="https://static3.srcdn.com/wordpress/wp-content/uploads/2020/09/The-monolith-in-2001-A-Space-Odyssey.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5"
            />
          </div>

          <div css={STYLES_CONTAINER_FLEX}>
            <div css={STYLES_TEXT} style={{ marginRight: 24 }}>
              <div css={STYLES_HEADING2}>
                All of your stuff <br />
                in one place
              </div>
              <div css={STYLES_BODY2}>
                Slate gives you the power to save your bookmarks, files, and data all in one place.
                It provides you with powerful tools to organize and share your stuff however you
                please.
              </div>
            </div>
            <img
              css={STYLES_IMG}
              src="https://static3.srcdn.com/wordpress/wp-content/uploads/2020/09/The-monolith-in-2001-A-Space-Odyssey.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5"
            />
          </div>

          <div css={STYLES_CONTAINER_FLEX}>
            <img
              css={STYLES_IMG}
              style={{ marginRight: 24 }}
              src="https://static3.srcdn.com/wordpress/wp-content/uploads/2020/09/The-monolith-in-2001-A-Space-Odyssey.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5"
            />
            <div css={STYLES_TEXT}>
              <div css={STYLES_HEADING2}>
                All of your stuff <br />
                in one place
              </div>
              <div css={STYLES_BODY2}>
                Slate gives you the power to save your bookmarks, files, and data all in one place.
                It provides you with powerful tools to organize and share your stuff however you
                please.
              </div>
            </div>
          </div>

          <div css={STYLES_CONTAINER_FLEX}>
            <div css={STYLES_TEXT} style={{ marginRight: 24 }}>
              <div css={STYLES_HEADING2}>
                All of your stuff <br />
                in one place
              </div>
              <div css={STYLES_BODY2}>
                Slate gives you the power to save your bookmarks, files, and data all in one place.
                It provides you with powerful tools to organize and share your stuff however you
                please.
              </div>
            </div>
            <img
              css={STYLES_IMG}
              src="https://static3.srcdn.com/wordpress/wp-content/uploads/2020/09/The-monolith-in-2001-A-Space-Odyssey.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5"
            />
          </div>

          <div css={STYLES_CONTAINER_FLEX}>
            <img
              css={STYLES_IMG}
              style={{ marginRight: 24 }}
              src="https://static3.srcdn.com/wordpress/wp-content/uploads/2020/09/The-monolith-in-2001-A-Space-Odyssey.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5"
            />
            <div css={STYLES_TEXT}>
              <div css={STYLES_HEADING2}>
                All of your stuff <br />
                in one place
              </div>
              <div css={STYLES_BODY2}>
                Slate gives you the power to save your bookmarks, files, and data all in one place.
                It provides you with powerful tools to organize and share your stuff however you
                please.
              </div>
            </div>
          </div>

          <div css={STYLES_CONTAINER}>
            <div css={STYLES_TEXT}>
              <div css={STYLES_HEADING2}>
                Affordable storage <br />
                for everyone
              </div>
              <div css={STYLES_BODY2}>
                With Slate, you never have to worry about storage space again. Every account comes
                with 30GB of storage for free with a paid data plan coming soon.
              </div>
            </div>
            <div css={STYLES_DATA_METER}>
              <div css={STYLES_DATA_USED} />
            </div>
            <a css={STYLES_BUTTON_PRIMARY_BIG} style={{ marginTop: 24 }}>
              Join waitlist for storage upgrade
            </a>
          </div>

          <div css={STYLES_CONTAINER}>
            <div css={STYLES_TEXT}>
              <div css={STYLES_HEADING2}>Powered by web3</div>
              <div css={STYLES_BODY2}>
                All of Slate is built on lasting new technologies where data storage is designed to
                ensure the privacy, security, and portability of your data.
              </div>
            </div>
            <div css={STYLES_CARD_GROUP}>
              {WEB3.map((each) => (
                <Card title={each.title} text={each.text} link={each.link} action={each.action} />
              ))}
            </div>
          </div>
          <div css={STYLES_CONTAINER}>
            <div css={STYLES_TEXT}>
              <div css={STYLES_HEADING2}>FAQs</div>
            </div>
            <div css={STYLES_CARD_GROUP}>
              {FAQ.map((each) => (
                <Card title={each.title} text={each.text} />
              ))}
            </div>
          </div>

          <div css={STYLES_CONTAINER} style={{ paddingBottom: 24 }}>
            <div css={STYLES_TEXT}>
              <div css={STYLES_HEADING2}>Community</div>
              <div css={STYLES_BODY2}>Join our discord channel for questions, discussions.</div>
              <a
                css={STYLES_BUTTON_PRIMARY_BIG}
                style={{ backgroundColor: "#7289d9", marginTop: 24 }}
              >
                <SVGLogo.Discord height="14px" style={{ marginRight: "8px" }} />
                Join Discord channel
              </a>
            </div>
          </div>
          <div css={STYLES_ROTATING_BANNER}>
            <div css={STYLES_BANNER_GROUP}>
              <div css={STYLES_BANNER_ANIMATION}>
                {BANNER.map((each) => (
                  <Banner link={each.link} name={each.name} img={each.img} />
                ))}
                {BANNER.map((each) => (
                  <Banner link={each.link} name={each.name} img={each.img} />
                ))}
                {BANNER.map((each) => (
                  <Banner link={each.link} name={each.name} img={each.img} />
                ))}
                {BANNER.map((each) => (
                  <Banner link={each.link} name={each.name} img={each.img} />
                ))}
              </div>
            </div>
          </div>
          <div css={STYLES_CONTAINER}>
            <div css={STYLES_TEXT} style={{ margin: "auto" }}>
              <div css={STYLES_HEADING2} style={{ textAlign: "center" }}>
                Try Slate <br />
                get 30GB for free
              </div>
            </div>
            <div css={STYLES_AUTH_MODAL}>
              <a
                css={STYLES_BUTTON_PRIMARY_BIG}
                style={{ backgroundColor: "#1DA1F2", width: "100%" }}
              >
                <SVGLogo.Twitter height="14px" style={{ marginRight: "8px" }} />
                Continue with Twitter
              </a>
              <div css={STYLES_DIVIDER} />
              <form style={{ width: "100%" }}>
                <Field
                  label="Sign up with email"
                  placeholder="Email"
                  type="email"
                  name="email"
                  full
                  style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
                  containerStyle={{ marginTop: "4px" }}
                />

                <System.ButtonPrimary full type="submit" style={{ marginTop: "16px" }}>
                  Create account
                </System.ButtonPrimary>
              </form>
            </div>
          </div>
        </div>
        <WebsiteFooter />
      </WebsitePrototypeWrapper>
    );
  }
}
