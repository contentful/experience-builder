// import { wrap } from 'cypress/types/lodash';
import React, { useEffect, useRef, type HTMLAttributes } from 'react';

interface DraggableProvidedDraggableProps {
  'data-rfd-draggable-context-id'?: string;
  'data-rfd-draggable-id'?: string;
}

interface DraggableProvidedDragHandleProps {
  'data-rfd-drag-handle-draggable-id'?: string;
  'data-rfd-drag-handle-context-id'?: string;
}

export type WrapperTags = keyof Pick<
  JSX.IntrinsicElements,
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'aside'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'header'
  | 'footer'
  | 'nav'
  | 'main'
>;

export interface DragWrapperProps
  extends DraggableProvidedDragHandleProps,
    DraggableProvidedDraggableProps,
    HTMLAttributes<HTMLElement>,
    React.PropsWithChildren {
  'data-cf-node-id'?: string;
  'data-ctfl-draggable-id'?: string;
  'data-test-id'?: string;
  'data-cf-node-block-id'?: string;
  'data-cf-node-block-type'?: string;
  innerRef?: (refNode: HTMLElement) => void;
  wrapComponent?: boolean;
  Tag?: WrapperTags;
  ToolTipAndPlaceholder?: React.ReactNode;
}

export const DragWrapper: React.FC<DragWrapperProps> = ({
  className,
  children,
  innerRef,
  Tag = 'div',
  ToolTipAndPlaceholder,
  wrapComponent,
  ...props
}) => {
  const wrapperRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (wrapComponent && wrapperRef.current) {
      const componentElement = wrapperRef.current.querySelector(
        ':not([data-tooltip])',
      ) as HTMLElement;

      if (!componentElement) {
        return;
      }

      let width = componentElement.style.getPropertyValue('width');
      let maxWidth = componentElement.style.getPropertyValue('max-width');

      if (!width || !maxWidth) {
        const styleSheets = Array.from(document.styleSheets);
        for (let i = styleSheets.length - 1; i >= 0; i--) {
          const cssRules = Array.from(styleSheets[i].cssRules || styleSheets[i].rules || []);
          cssRules.some((cssRule) => {
            if (cssRule instanceof CSSStyleRule) {
              const selectorText = cssRule.selectorText as string;
              if (
                !selectorText ||
                selectorText.startsWith('.styles-') ||
                selectorText.startsWith('.contentful-container')
              ) {
                return;
              }
              if (componentElement?.matches(selectorText)) {
                width = width || cssRule.style.width;
                maxWidth = maxWidth || cssRule.style.maxWidth;
                return !!width && !!maxWidth;
              }
            }
          });

          if (width && maxWidth) {
            break;
          }
        }
      }

      if (width || maxWidth) {
        // wrapperRef.current.style.setProperty('display', 'inline-block');
        wrapperRef.current.style.setProperty('width', width);
        wrapperRef.current.style.setProperty('max-width', maxWidth);
        // wrapperRef.current.style.setProperty('height', '33px');
        // wrapperRef.current.classList.add(...classes);
      } else {
        wrapperRef.current.style.setProperty('width', 'max-content');
      }
    }
  }, [wrapComponent]);

  if (wrapComponent) {
    return (
      <Tag
        className={className}
        ref={(refNode: HTMLElement | null) => {
          if (innerRef && refNode) innerRef(refNode);
          wrapperRef.current = refNode;
        }}
        {...props}>
        {ToolTipAndPlaceholder}
        {children}
      </Tag>
    );
  }

  return children;
};
