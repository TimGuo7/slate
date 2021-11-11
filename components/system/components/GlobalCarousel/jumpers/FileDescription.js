import * as React from "react";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as Jumper from "~/components/system/components/fragments/Jumper";

import { Show } from "~/components/utility/Show";

import LinkIcon from "~/components/core/LinkIcon";

export function FileDescription({ file, isOpen, onClose }) {
  return (
    <Jumper.AnimatePresence>
      {isOpen ? (
        <Jumper.Root onClose={onClose}>
          <Jumper.Header>
            <System.H3 as="h1" nbrOflines={1} title={file.name || file.filename}>
              {file.name || file.filename}
            </System.H3>
            <Show when={file.isLink}>
              <div style={{ marginTop: 5 }} css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
                <LinkIcon file={file} width={12} height={12} />
                <System.P2
                  as="p"
                  nbrOflines={1}
                  href={file.url}
                  css={Styles.LINK}
                  style={{ marginLeft: 5 }}
                >
                  {file.url}
                </System.P2>
              </div>
            </Show>
          </Jumper.Header>
          <Jumper.Divider />
          <Jumper.Item>
            <System.P2>{file.body}</System.P2>
          </Jumper.Item>
        </Jumper.Root>
      ) : null}
    </Jumper.AnimatePresence>
  );
}
