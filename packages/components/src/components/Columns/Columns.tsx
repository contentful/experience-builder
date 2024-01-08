/* eslint-disable */
import React, { useEffect } from 'react';
import './Columns.css';
// import { CONTENTFUL_CONTAINER_ID } from '@contentful/experience-builder';
import { combineClasses } from '../../utils/combineClasses';
// import { generateId } from '@/shared/utils/generate-id';
// import { onComponentUpdate } from '@/communication/onComponentUpdate';
// import { CompositionComponentNode } from '@contentful/experience-builder-core';
// import { Dropzone } from '@components/Dropzone/DropzoneContainer';
// import { ComponentConfig } from '@/types/Config';

export type ColumnsProps = {
  columns: string;
};

const createChildren = (columns: number[], nodes: any[]) => {
  return columns.map((_, i) => {
    if (nodes[i]) {
      return nodes[i];
    }

    return null;
  });
};

export const Columns: React.FC<any> = ({ columns, editorMode, className, ...rest }) => {
  const colsArray = Array.from(Array(Number(columns)).keys());

  const { node, ...dropzoneEditorProps } = rest;

  // useEffect(() => {
  //   if (node) {
  //     colsArray.forEach((_, i) => {
  //       if (node.children[i]) {
  //         return;
  //       }

  //       const emptyComponentData: CompositionComponentNode = {
  //         type: 'block',
  //         parentId: node.data.id,
  //         children: [],
  //         data: {
  //           blockId: CONTENTFUL_CONTAINER_ID,
  //           id: generateId(CONTENTFUL_CONTAINER_ID),
  //           breakpoints: [],
  //           dataSource: {},
  //           props: {},
  //           unboundValues: {},
  //         },
  //       };

  //       onComponentUpdate({
  //         node: emptyComponentData,
  //         index: i,
  //         parentType: node.type,
  //         parentBlockId: node.data.blockId,
  //       });
  //     });
  //   }
  // }, [node, colsArray.length]);

  // if (editorMode === false) {
  //   return (
  //     <Section>
  //       <div
  //         className={combineClasses(className, 'Columns')}
  //         style={{
  //           gridTemplateColumns: `repeat(${colsArray.length}, 1fr)`,
  //         }}>
  //         {colsArray.map((idx) => (
  //           <div key={idx}>
  //             <Dropzone zone={`column-${idx}`} />
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
    <div
      data-test-id="columns"
      data-cf-node-id={node.data.id}
      data-cf-node-block-id={node.data.blockId}
      data-cf-node-block-type={node.type}
      className={combineClasses(className, 'Columns')}
      style={{
        gridTemplateColumns: `repeat(${colsArray.length}, 1fr)`,
      }}>
      {childNodes.map((childNode) => {
        if (!childNode) {
          return null;
        }
        return;
        // return (
        //   <Dropzone // id="ContentfulContainer"
        //     node={childNode}
        //     key={childNode.data.id}
        //     {...dropzoneEditorProps}
        //     zone={childNode.data.id}
        //   />
        // );
      })}
    </div>
  );
};
