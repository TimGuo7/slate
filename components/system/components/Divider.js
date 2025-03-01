import * as React from "react";

import * as Constants from "~/common/constants";

export const Divider = ({
  width = "100%",
  height = "0.5px",
  color = Constants.system.grayLight4,
  ...props
}) => {
  return (
    <div
      css={(theme) => ({
        height,
        width,
        minHeight: height,
        backgroundColor: theme.system?.[color] || theme.semantic?.[color] || color,
      })}
      {...props}
    />
  );
};
