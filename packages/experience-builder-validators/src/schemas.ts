import { Entry } from 'contentful';
import { z } from 'zod';

const SchemaVersionsSchema = z.enum(['2023-09-28', '2023-06-27', '2023-07-26', '2023-08-23']);

const CompositionDataSourceSchema = z.record(
  z.union([
    z.object({
      sys: z.object({
        type: z.literal('Link'),
        id: z.string(),
        linkType: z.literal('Entry'),
      }),
    }),
    z.object({
      sys: z.object({
        type: z.literal('Link'),
        id: z.string(),
        linkType: z.literal('Asset'),
      }),
    }),
  ])
);

const CompositionVariableValueTypeSchema = z.union([
  z.string(),
  z.boolean(),
  z.number(),
  z.record(z.unknown()),
]);

const CompositionComponentPropValueSchema = z.union([
  z.object({
    type: z.literal('DesignValue'),
    valuesByBreakpoint: z.record(z.lazy(() => CompositionVariableValueTypeSchema)),
  }),
  z.object({
    type: z.literal('BoundValue'),
    path: z.string(),
  }),
  z.object({
    type: z.literal('UnboundValue'),
    key: z.string(),
  }),
  z.object({
    type: z.literal('ComponentValue'),
    key: z.string(),
  }),
]);

const Breakpoint = z.object({
  id: z.string(),
  query: z.string(),
  previewSize: z.string(),
  displayName: z.string(),
});

const CompositionUnboundValuesSchema = z.record(
  z.object({
    value: CompositionVariableValueTypeSchema,
  })
);

const baseCompositionNodeSchema = z.object({
  definitionId: z.string(),
  variables: z.record(CompositionComponentPropValueSchema),
});

type CompositionNode = z.infer<typeof baseCompositionNodeSchema> & {
  children: CompositionNode[];
};

const CompositionNodeSchema: z.ZodType<CompositionNode> = baseCompositionNodeSchema.extend({
  children: z.lazy(() => CompositionNodeSchema.array()),
});

const CompositionComponentPropTypeSchema = z.enum([
  'BoundValue',
  'UnboundValue',
  'DesignValue',
  'ComponentValue',
]);

const ExperienceComponentSettingsSchema = z.object({
  variableDefinitions: z.record(
    z.object({
      type: CompositionComponentPropTypeSchema,
      label: z.string(),
      description: z.string().optional(),
      defaultValue: CompositionComponentPropValueSchema,
    })
  ),
});

export const ExperienceFieldsSchema = z.object({
  title: z.string(),
  slug: z.string(),
  componentTree: z.object({
    breakpoints: z.array(Breakpoint),
    children: z.array(CompositionNodeSchema),
    schemaVersion: SchemaVersionsSchema,
  }),
  dataSource: CompositionDataSourceSchema,
  unboundValues: CompositionUnboundValuesSchema,
  usedComponents: z
    .array(
      z.object({
        sys: z.object({
          type: z.literal('Link'),
          id: z.string(),
          linkType: z.literal('Entry'),
        }),
      })
    )
    .optional(),
  componentSettings: ExperienceComponentSettingsSchema.optional(),
});

export type CompositionZod = z.infer<typeof ExperienceFieldsSchema>;
