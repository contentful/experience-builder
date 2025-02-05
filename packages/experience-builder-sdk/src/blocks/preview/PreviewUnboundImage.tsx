import React, { useMemo } from 'react';
import type {
  Breakpoint,
  ComponentTreeNode,
  PrimitiveValue,
} from '@contentful/experiences-core/types';
import { sanitizeNodeProps } from '@contentful/experiences-core';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useInjectStylesheet } from '../../hooks/useClassName';
import classNames from 'classnames';

interface PreviewUnboundImageProps {
  breakpoints: Breakpoint[];
  node: ComponentTreeNode;
  nodeProps: Record<PropertyKey, PrimitiveValue>;
  component: React.ElementType;
}

/**
 * This component is used to render a placeholder Image component in the preview
 * when the image is unbound. It applies the Image size styles to a wrapping div.
 */
const PreviewUnboundImage: React.FC<PreviewUnboundImageProps> = ({
  breakpoints,
  node,
  nodeProps,
  component,
}) => {
  const { wrapperStyle, imageStyle } = useMemo(() => {
    let imageStyle: Record<string, any> = {};
    let wrapperStyle: Record<string, any> = {};
    if (nodeProps.cfImageOptions && typeof nodeProps.cfImageOptions === 'object') {
      imageStyle = {
        ...nodeProps.cfImageOptions,
        height: '100%',
        width: '100%',
      };

      for (const [breakpointId, styles] of Object.entries(nodeProps.cfImageOptions)) {
        imageStyle[breakpointId] = {
          ...styles,
          height: '100%',
          width: '100%',
        };

        wrapperStyle[breakpointId] = {
          height: styles.height,
          width: styles.width,
        };
      }
    }

    return { imageStyle, wrapperStyle };
  }, [nodeProps.cfImageOptions]);

  const wrapperCss = useMediaQuery({
    designPropsByBreakpointId: wrapperStyle,
    node,
    breakpoints,
  });

  const imageCss = useMediaQuery({
    designPropsByBreakpointId: imageStyle,
    node,
    breakpoints,
  });

  useInjectStylesheet(wrapperCss.styleSheet);
  useInjectStylesheet(imageCss.styleSheet);

  return (
    <div className={classNames('cf-preview-unbound-image', wrapperCss.className)}>
      {React.createElement(component, {
        ...sanitizeNodeProps(nodeProps),
        className: classNames(nodeProps.className, imageCss.className),
      })}
    </div>
  );
};

export default PreviewUnboundImage;
