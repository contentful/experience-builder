import tokens from "@contentful/f36-tokens";
import { css } from "@emotion/css";
import React from "react";
import { BindingMapByBlockId, BoundData } from "../types";
import { sendMessage } from "../sendMessage";
import { VisualEditorBlock } from "./VisualEditorBlock";

const styles = {
  hover: css({
    ":hover": {
      border: `3px solid ${tokens.blue500}`,
    },
  }),
};

type VisualEditorTemplateProps = {
  node: any;
  binding: BindingMapByBlockId;
  boundData: BoundData;
};

export const VisualEditorTemplate = ({
  node,
  binding,
  boundData,
}: VisualEditorTemplateProps) => {
  const children = node.children.map((childNode: any) => (
    <VisualEditorBlock
      key={childNode.data.id}
      template={node}
      node={childNode}
      binding={binding}
      boundData={boundData}
    />
  ));

  return React.createElement(
    "div",
    {
      "data-template-id": node.data.blockId,
      onClick: (e: MouseEvent) => {
        e.preventDefault();
        sendMessage("componentSelected", { node, template: node });
      },
      className: styles.hover,
    },
    children
  );
};
