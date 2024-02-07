import { z } from 'zod';

const schemaVersion = '2023-09-28' as const;

const variableKeySchema = z.string().regex(/^[a-zA-Z0-9-_.]{1,64}$/);

const CompositionDataSourceSchema = z.record(
  variableKeySchema,
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

export const ComponentDefinitionVariableTypeSchema = z.enum([
  'Text',
  'RichText',
  'Number',
  'Date',
  'Boolean',
  'Location',
  'Media',
  'Object',
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
  variableKeySchema,
  z.object({
    value: CompositionVariableValueTypeSchema,
  })
);

const baseCompositionNodeSchema = z.object({
  definitionId: z.string(),
  variables: z.record(variableKeySchema, CompositionComponentPropValueSchema),
});

type CompositionNode = z.infer<typeof baseCompositionNodeSchema> & {
  children: CompositionNode[];
};

const CompositionNodeSchema: z.ZodType<CompositionNode> = baseCompositionNodeSchema.extend({
  children: z.lazy(() => CompositionNodeSchema.array()),
});

const ExperienceComponentSettingsSchema = z.object({
  variableDefinitions: z.record(
    z.object({
      displayName: z.string(),
      type: ComponentDefinitionVariableTypeSchema,
      defaultValue: CompositionComponentPropValueSchema,
      description: z.string().optional(),
      group: z.string().optional(),
      validations: z.record(z.string()).optional(),
    })
  ),
});

const localeWrapper = (fieldSchema: any) => z.record(z.string(), fieldSchema);

export const ExperienceFieldsSchema = z.object({
  componentTree: localeWrapper(
    z.object({
      breakpoints: z.array(Breakpoint).min(1, { message: 'At least one breakpoint is required' }),
      children: z.array(CompositionNodeSchema),
      schemaVersion: z.literal(schemaVersion),
    })
  ),
  dataSource: localeWrapper(CompositionDataSourceSchema),
  unboundValues: localeWrapper(CompositionUnboundValuesSchema),
  usedComponents: localeWrapper(
    z.array(
      z.object({
        sys: z.object({
          type: z.literal('Link'),
          id: z.string(),
          linkType: z.literal('Entry'),
        }),
      })
    )
  ).optional(),
  componentSettings: localeWrapper(ExperienceComponentSettingsSchema).optional(),
});
//.superRefine(
//   (
//     { componentSettings, usedComponents },
//     refinementContext
//   ) => {
//     const localeKey = Object.keys(componentSettings ?? {})[0];
//     console.log("componentSettings", componentSettings)
//     if (!componentSettings || !usedComponents) {
//       return;
//     }
//     if (componentSettings[localeKey] !== undefined && usedComponents[localeKey] === undefined) {
//       refinementContext.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: `'usedComponents' should be empty if 'componentSettings' is not empty`,
//         path: ['fields', 'usedComponents', localeKey],
//       });
//     }
//   }
// );;

export type CompositionZod = z.infer<typeof ExperienceFieldsSchema>;
