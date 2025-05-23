import React, { useMemo } from 'react';
import type {
  Breakpoint,
  ComponentTreeNode,
  PrimitiveValue,
} from '@contentful/experiences-core/types';
import { sanitizeNodeProps } from '@contentful/experiences-core';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useInjectStylesheet } from '../../hooks/useInjectStylesheet';
import classNames from 'classnames';

type PreviewUnboundImageProps = {
  breakpoints: Breakpoint[];
  node: ComponentTreeNode;
  nodeProps: Record<PropertyKey, PrimitiveValue>;
  component: React.ElementType;
  patternRootNodeIdsChain: string;
};

/**
 * This component is used to render a placeholder Image component in the preview
 * when the image is unbound. It applies the Image size styles to a wrapping div.
 */
const PreviewUnboundImage: React.FC<PreviewUnboundImageProps> = ({
  breakpoints,
  node,
  nodeProps,
  component,
  patternRootNodeIdsChain,
}) => {
  const { wrapperStyle, imageStyle } = useMemo(() => {
    const imageStyle: Record<string, any> = {};
    const wrapperStyle: Record<string, any> = {};

    if (nodeProps.cfImageOptions && typeof nodeProps.cfImageOptions === 'object') {
      for (const [breakpointId, styles] of Object.entries(nodeProps.cfImageOptions)) {
        imageStyle[breakpointId] = {
          cfImageOptions: {
            ...styles,
            height: '100%',
            width: '100%',
          },
        };

        wrapperStyle[breakpointId] = {
          cfHeight: styles.height,
          cfWidth: styles.width,
        };
      }
    }

    return { imageStyle, wrapperStyle };
  }, [nodeProps.cfImageOptions]);

  const wrapperMedia = useMediaQuery({
    designPropertiesByBreakpoint: wrapperStyle,
    node,
    breakpoints,
    patternRootNodeIdsChain,
  });

  const imageMedia = useMediaQuery({
    designPropertiesByBreakpoint: imageStyle,
    node,
    breakpoints,
    patternRootNodeIdsChain,
  });

  useInjectStylesheet(wrapperMedia.css);
  useInjectStylesheet(imageMedia.css);

  return (
    <div className={classNames('cf-preview-unbound-image', wrapperMedia.className)}>
      {React.createElement(component, {
        ...sanitizeNodeProps(nodeProps),
        className: classNames(nodeProps.className, imageMedia.className),
      })}
    </div>
  );
};

export default PreviewUnboundImage;
