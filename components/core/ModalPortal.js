import * as React from "react";
import * as ReactDOM from "react-dom";

export const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted
    ? ReactDOM.createPortal(
        <div onClick={(e) => e.stopPropagation()}>{children}</div>,
        document.getElementById("modals_portal")
      )
    : null;
};
