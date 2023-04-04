import tokens from "@contentful/f36-tokens";
import { css } from "@emotion/css";
import React, { useMemo } from "react";
import { BindingMapByBlockId, BoundData } from "../types";
import { sendMessage } from "../sendMessage";
import { registerComponent } from "../registerComponent";
import { VisualEditorTemplate } from "./VisualEditorTemplate";

const styles = {
  hover: css({
    ":hover": {
      border: `3px solid ${tokens.blue500}`,
    },
  }),
};

type VisualEditorBlockProps = {
  node: any;
  template?: any;
  binding: BindingMapByBlockId;
  boundData: BoundData;
};

export const VisualEditorBlock = ({
  node,
  template,
  binding,
  boundData,
}: VisualEditorBlockProps) => {
  const { getRegistration } = registerComponent();

  const blockType = node.data.blockId.split(":")[0];

  const blockConfiguration = useMemo(
    () => getRegistration(blockType),
    [blockType, getRegistration]
  );

  const { nodeBinding = {}, nodeBoundProps = {} } = useMemo(() => {
    // plain node, not a child of a template
    if (!template) {
      return {
        nodeBinding: binding[node.data.blockId],
        nodeBoundProps: boundData[node.data.blockId],
      };
    }

    // child of a template, but not template root node
    if (node.type !== "template") {
      const parentTemplateBoundData = boundData[template.data.blockId];
      const parentTemplateBinding = binding[template.data.blockId];

      const parentTemplateBoundDataSourceData = parentTemplateBoundData
        ? parentTemplateBoundData[template.data.dataSource?.sys.id]
        : undefined;

      return {
        nodeBinding: parentTemplateBinding
          ? parentTemplateBinding[node.data.blockId]
          : undefined,
        nodeBoundProps: parentTemplateBoundDataSourceData
          ? parentTemplateBoundDataSourceData[node.data.blockId]
          : undefined,
      };
    }

    // template root node
    const templateBoundData = boundData[node.data.blockId];
    return {
      nodeBinding: binding[node.data.blockId],
      nodeBoundProps: templateBoundData
        ? templateBoundData[template.data.dataSource.sys.id]
        : undefined,
    };
  }, [template, binding, node, boundData]);

  const props = useMemo(() => {
    if (!blockConfiguration) {
      return {};
    }

    return blockConfiguration.variables.reduce((acc, variable) => {
      const boundValue = nodeBoundProps
        ? nodeBoundProps[variable.name]?.value
        : undefined;

      console.log('variable', variable.name, boundValue || node.data.props[variable.name] || variable.defaultValue);
      return {
        ...acc,
        [variable.name]:
          boundValue || node.data.props[variable.name] || variable.defaultValue,
      };
    }, {});
  }, [blockConfiguration, node.data.props, nodeBoundProps]);

  if (node.type === "template") {
    return (
      <VisualEditorTemplate
        key={node.data.id}
        node={node}
        binding={binding}
        boundData={boundData}
      />
    );
  }

  if (!blockConfiguration) {
    return null;
  }

  const { component, ...blockConfigurationWithoutComponent } =
    blockConfiguration;

  const children = node.children.map((childNode: any) => {
    if (childNode.type === "string") {
      return (
        nodeBoundProps[childNode.data.propKey]?.value ||
        childNode.data.props[childNode.data.propKey]
      );
    }

    return (
      <VisualEditorBlock
        node={childNode}
        key={childNode.data.id}
        template={template}
        binding={binding}
        boundData={boundData}
      />
    );
  });

  return React.createElement(
    component,
    {
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        sendMessage("componentSelected", {
          node,
          template,
        });
      },
      className: styles.hover,
      ...props,
    },
    children
  );
};
