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
    designPropsByBreakpointId: wrapperStyle,
    node,
    breakpoints,
  });

  const imageMedia = useMediaQuery({
    designPropsByBreakpointId: imageStyle,
    node,
    breakpoints,
  });

  useInjectStylesheet(wrapperMedia);
  useInjectStylesheet(imageMedia);

  return (
    <div className={classNames('cf-preview-unbound-image', wrapperMedia.className)}>
      {React.createElement(component, {
        ...sanitizeNodeProps(nodeProps),
        className: imageMedia.css ? imageMedia.className : nodeProps.className,
      })}
    </div>
  );
};

export default PreviewUnboundImage;
