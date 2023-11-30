import React, { useEffect, useMemo } from 'react';
import './styles.css';
import { ComponentConfig } from '../../../core';
import { Section } from '../Section';
import { DropZone } from '@/core/components/DropZone';
import { CONTENTFUL_CONTAINER_ID } from '@contentful/experience-builder';
import classNames from 'classnames';
import { CompositionComponentNode } from '@/types';
import { generateId } from '@/core/lib/generate-id';
import { onComponentUpdate } from '@/communication/onComponentUpdate';

export type ColumnsProps = {
  columns: string;
};

const createChildren = (columns: number[], nodes: CompositionComponentNode[]) => {
  return columns.map((_, i) => {
    if (nodes[i]) {
      return nodes[i];
    }

    return null;
  });
};

export const Columns: React.FC<any> = ({ columns, editorMode, className, ...rest }) => {
  const colsArray = Array.from(Array(Number(columns)).keys());

  const { node, ...dropZoneEditorProps } = rest;

  useEffect(() => {
    if (node) {
      colsArray.forEach((_, i) => {
        if (node.children[i]) {
          return;
        }

        const emptyComponentData: CompositionComponentNode = {
          type: 'block',
          parentId: node.data.id,
          children: [],
          data: {
            blockId: CONTENTFUL_CONTAINER_ID,
            id: generateId(CONTENTFUL_CONTAINER_ID),
            breakpoints: [],
            dataSource: {},
            props: {},
            unboundValues: {},
          },
        };

        onComponentUpdate({
          node: emptyComponentData,
          index: i,
          parentType: node.type,
          parentBlockId: node.data.blockId,
        });
      });
    }
  }, [node, colsArray.length]);

  // if (editorMode === false) {
  //   return (
  //     <Section>
  //       <div
  //         className={classNames(className, 'Columns')}
  //         style={{
  //           gridTemplateColumns: `repeat(${colsArray.length}, 1fr)`,
  //         }}>
  //         {colsArray.map((idx) => (
  //           <div key={idx}>
  //             <DropZone zone={`column-${idx}`} />
  //           </div>
  //         ))}
  //       </div>
  //     </Section>
  //   );
  // }

  // const childDropzones = useMemo(() => {

  // }, )

  const childNodes = createChildren(colsArray, node?.children || []);

  return (
    <Section>
      <div
        data-test-id="columns"
        data-cf-node-id={node.data.id}
        data-cf-node-block-id={node.data.blockId}
        data-cf-node-block-type={node.type}
        className={classNames(className, 'Columns')}
        style={{
          gridTemplateColumns: `repeat(${colsArray.length}, 1fr)`,
        }}>
        {childNodes.map((childNode) => {
          if (!childNode) {
            return null;
          }
          return (
            <DropZone // id="ContentfulContainer"
              node={childNode}
              key={childNode.data.id}
              {...dropZoneEditorProps}
              zone={childNode.data.id}
            />
          );
        })}
      </div>
    </Section>
  );
};

export const ColumnsDefinition: ComponentConfig<ColumnsProps> = {
  id: 'columns',
  render: (props) => <Columns {...props} />,
};
