'use client';

import React, { useState } from 'react';
import { Entry } from 'contentful';

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

export const AccordionSection = ({
  entries,
  openIndexOverride = 0,
  isInExpEditorMode = false,
}: {
  entries: Entry[];
  openIndexOverride: number;
  isInExpEditorMode: boolean;
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  console.log('entries', entries);
  const isOpen = (index: number) => {
    if (isInExpEditorMode) {
      return openIndexOverride.toString() === index.toString();
    } else {
      return openIndex === index;
    }
  };

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
            onClick={() => setOpenIndex(index === openIndex ? null : index)}
          />
        ))}
      </div>

      <div className="flex-1 flex justify-center items-center">
        <img
          src={accordionData[openIndex ?? 0]?.imageUrl}
          className="w-full max-w-md rounded-xl shadow-md"
        />
      </div>
    </div>
  );
};
