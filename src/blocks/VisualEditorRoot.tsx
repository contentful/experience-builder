import { css } from "@emotion/css";
import React from "react";
import { BindingMapByBlockId, BoundData } from "../types";
import { VisualEditorBlock } from "./VisualEditorBlock";

const rootStyles = css({
  height: "100%",
});

type VisualEditorRootProps = {
  visualEditorData?: Record<string, any>;
  binding: BindingMapByBlockId;
  boundData: BoundData;
};

export const VisualEditorRoot = ({
  visualEditorData = {},
  binding,
  boundData,
}: VisualEditorRootProps) => {
  if (!visualEditorData.root) {
    return null;
  }

  return React.createElement(
    "div",
    {},
    visualEditorData.root.children.map((node: any) => (
      <VisualEditorBlock
        key={node.data.id}
        node={node}
        binding={binding}
        boundData={boundData}
      />
    ))
  );
};
