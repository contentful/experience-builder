'use client';

import React, { CSSProperties, ReactNode, useEffect } from 'react';
import { Entry } from 'contentful';
import { BoundEntriesProvider, useBoundEntries } from '@/contexts/useBoundEntries';

const style: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
};

type AccordionItemProps = {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
  isInExpEditorMode?: boolean;
};

const AccordionItem = ({ title, content, isOpen, onClick }: AccordionItemProps) => (
  <div className="border-b">
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full py-4 text-left font-semibold text-lg">
      {title}
      <span className="text-xl">{isOpen ? '▲' : '▼'}</span>
    </button>
    {isOpen && <p className="text-gray-600 pb-4">{content}</p>}
  </div>
);

export const ContextualAccordion: React.FC<{
  entries: Entry[];
  openIndexOverride: number;
  isInExpEditorMode: boolean;
  imageSlot: ReactNode;
}> = ({ entries, ...props }) => {
  return (
    <BoundEntriesProvider entries={entries}>
      <AccordionSection {...props} />
    </BoundEntriesProvider>
  );
};
const AccordionSection: React.FC<{
  openIndexOverride: number;
  isInExpEditorMode: boolean;
  imageSlot: ReactNode;
}> = ({ imageSlot, openIndexOverride = 0, isInExpEditorMode = false, ...props }) => {
  const { entries, selectedIndex, setSelectedIndex } = useBoundEntries();

  useEffect(() => {
    if (isInExpEditorMode) {
      setSelectedIndex(openIndexOverride);
    }
  }, [isInExpEditorMode, openIndexOverride]);

  const isOpen = (index: number) => selectedIndex.toString() === index.toString();

  const accordionData =
    entries?.map((item: any) => ({
      title: item.fields.title,
      content: item.fields.content,
      imageUrl: item.fields.image?.fields?.file.url,
    })) || [];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start p-8 gap-8 bg-white">
      {/* Left Column: Accordion */}
      <div className="flex-1 max-w-xl">
        {accordionData.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            content={item.content}
            isOpen={isOpen(index)}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      <div className="flex-1 flex justify-center items-center">
        <div {...props}>{imageSlot as React.ReactNode}</div>
      </div>
    </div>
  );
};
