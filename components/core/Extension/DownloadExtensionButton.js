import * as React from "react";
import * as Environment from "~/common/environment";
import * as System from "~/components/system";
import * as Constants from "~/common/constants";

const checkIfExtensionIsDownloaded = () => {
  const extensionElement = document.getElementById("browser_extension");
  if (!extensionElement) return false;
  return extensionElement.className.includes("isDownloaded");
};

const getExtensionBrowserAndLink = () => {
  const testUserAgent = (regex) => regex.test(window.navigator.userAgent);

  const isFirefox = testUserAgent(/firefox/i);
  const firefoxLink = Environment.EXTENSION_FIREFOX;
  if (isFirefox && firefoxLink) return { browser: "Firefox", link: firefoxLink };

  const isSafari = testUserAgent(/safari/i);
  const safariLink = Environment.EXTENSION_SAFARI;
  if (isSafari && safariLink) return { browser: "Safari", link: safariLink };

  return { browser: "Chrome", link: Environment.EXTENSION_CHROME };
};

export default function DownloadExtensionButton({ hideIfDownloaded = true, style, ...props }) {
  const [isExtensionDownloaded, setExtensionDownload] = React.useState(false);

  React.useEffect(() => {
    if (document && hideIfDownloaded) {
      const isExtensionDownloaded = checkIfExtensionIsDownloaded();
      setExtensionDownload(isExtensionDownloaded);
    }
  }, []);

  if (isExtensionDownloaded) return null;

  const extension = getExtensionBrowserAndLink();

  return (
    <System.ButtonPrimaryFull
      style={{
        padding: "0px 12px",
        minHeight: "30px",
        fontFamily: Constants.font.text,
        ...style,
      }}
      onClick={() => window.open(extension.link, "_blank")}
      {...props}
    >
      Install Slate for {extension.browser}
    </System.ButtonPrimaryFull>
  );
}
