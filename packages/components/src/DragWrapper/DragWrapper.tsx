import { combineClasses } from '@/utils/combineClasses';
// import { wrap } from 'cypress/types/lodash';
import React, { useEffect, useMemo, useRef, useState, type HTMLAttributes } from 'react';

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
  editorMode?: boolean;
  wrapComponent?: boolean;
  Tag?: WrapperTags;
  ToolTipAndPlaceHolder?: React.ReactNode;
}

export const DragWrapper: React.FC<DragWrapperProps> = ({
  className,
  children,
  editorMode = false,
  innerRef,
  Tag = 'div',
  ToolTipAndPlaceHolder,
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

      if (!width) {
        const styleSheets = Array.from(document.styleSheets);

        for (let i = styleSheets.length - 1; i >= 0; i--) {
          const cssRules = styleSheets[i].cssRules || styleSheets[i].rules || [];

          for (let j = 0; j < cssRules.length; j++) {
            const selectorText = cssRules[j].selectorText as string;
            if (
              !selectorText ||
              selectorText.startsWith('.styles-') ||
              selectorText.startsWith('.contentful-container')
            ) {
              continue;
            }
            if (componentElement?.matches(selectorText)) {
              width = cssRules[j].style.width;
              break;
            }
          }

          if (width) {
            break;
          }
        }
      }

      if (width) {
        // wrapperRef.current.style.setProperty('all', 'initial');
        wrapperRef.current.style.setProperty('width', width);
        // wrapperRef.current.style.setProperty('height', '33px');
        // wrapperRef.current.classList.add(...classes);
      }
      // const cssRules = document.styleSheets[s].cssRules || document.styleSheets[s].rules || []; // IE support

      // for (var c = 0; c < cssRules.length; c++) {
      //   if (cssRules[c].selectorText === selectorText) return cssRules[c].style[propertyName];
      // }
      // }
      // return null;

      // // // console.log('aaa', { wrapperRef, componentElement });
      // // const computedWidth = window.getComputedStyle(componentElement!).width;
      // const width = componentElement.style.getPropertyValue('width');
      // wrapperRef.current.style.setProperty('all', 'initial');
      // wrapperRef.current.style.setProperty('width', width);
      // wrapperRef.current.style.setProperty('height', '33px');
      // wrapperRef.current.classList.add(...classes);
      // // console.log('aaa', { computedStyle });
      // const mutationObserver = new window.MutationObserver((mutationRecord) => {
      //   // console.log('aaa', { mutationRecord });
      //   const width = window.getComputedStyle(componentElement!).width;
      //   wrapperRef.current?.style.setProperty('width', width);
      // });
      // mutationObserver.observe(componentElement as Node, {
      //   attributes: true,
      //   attributeFilter: ['style', 'class'],
      // });
    }
    // }, 0);
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
        {ToolTipAndPlaceHolder}
        {children}
      </Tag>
    );
  }

  return (
    <>
      {ToolTipAndPlaceHolder}
      {children}
    </>
  );
};
