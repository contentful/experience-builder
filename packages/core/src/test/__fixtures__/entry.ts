import { Entry } from 'contentful';

export const entry = {
  metadata: {
    tags: [],
  },
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'unknown',
      },
    },
    id: '7J3DNGSAIWlcxrOfC25KlX',
    type: 'Entry',
    locale: 'en-US',
    createdAt: '2023-01-25T16:22:13.627Z',
    updatedAt: '2023-06-28T07:05:22.644Z',
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    publishedVersion: 18,
    publishedAt: '2023-06-28T07:04:23.492Z',
    firstPublishedAt: '2023-01-25T16:22:23.271Z',
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: 'unknown',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: 'unknown',
      },
    },
    publishedCounter: 2,
    version: 20,
    publishedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: 'unknown',
      },
    },
    automationTags: [],
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'topicProductFeature',
      },
    },
    revision: 1,
  },
  fields: {
    internalName: 'Travel insurance - Premium feature -2',
    name: 'Travel insurance',
    shortDescription: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Medical, flight, and luggage delay insurance coverage tst',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
    longDescription: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [
                {
                  type: 'bold',
                },
              ],
              value: 'Medical emergency coverage',
              nodeType: 'text',
            },
          ],
          nodeType: 'heading-5',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'If you are injured or become sick during a trip requiring a medical service, you can be covered for eligible medical services and transportation home.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [
                {
                  type: 'bold',
                },
              ],
              value: 'Lost luggage reimbursement',
              nodeType: 'text',
            },
          ],
          nodeType: 'heading-5',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'Lost or damaged carry-on bags and checked-in luggage are covered up to €2,100 per passenger.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [
                {
                  type: 'bold',
                },
              ],
              value: 'Baggage delay insurance',
              nodeType: 'text',
            },
          ],
          nodeType: 'heading-5',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'When the baggage is delayed over 5 hours, your essential purchases like toiletries and clothing are reimbursed. The maximum reimbursement amount is up to €80 per passenger per day, for up to 3 days.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
      ],
      nodeType: 'document',
    },
  },
} as Entry;
