import { z } from 'zod';

const schemaVersion = '2023-09-28' as const;

const propertyKeySchema = z.string().regex(/^[a-zA-Z0-9-_.]{1,64}$/);

const DataSourceSchema = z.record(
  propertyKeySchema,
  z.object({
    sys: z.object({
      type: z.literal('Link'),
      id: z.string(),
      linkType: z.literal('Entry').or(z.literal('Asset')),
    }),
  })
);

const PropertyValueTypeSchema = z.union([
  z.string(),
  z.boolean(),
  z.number(),
  z.record(z.unknown()),
]);

export const ComponentDefinitionPropertyTypeSchema = z.enum([
  'Text',
  'RichText',
  'Number',
  'Date',
  'Boolean',
  'Location',
  'Media',
  'Object',
]);

const ComponentPropertyValueSchema = z.union([
  z.object({
    type: z.literal('DesignValue'),
    valuesByBreakpoint: z.record(z.lazy(() => PropertyValueTypeSchema)),
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

const UnboundValuesSchema = z.record(
  propertyKeySchema,
  z.object({
    value: PropertyValueTypeSchema,
  })
);

const baseComponentTreeNodeSchema = z.object({
  definitionId: z.string(),
  variables: z.record(propertyKeySchema, ComponentPropertyValueSchema),
});

export type ComponentTreeNode = z.infer<typeof baseComponentTreeNodeSchema> & {
  children: ComponentTreeNode[];
};

const ComponentTreeNodeSchema: z.ZodType<ComponentTreeNode> = baseComponentTreeNodeSchema.extend({
  children: z.lazy(() => ComponentTreeNodeSchema.array()),
});

const ComponentSettingsSchema = z.object({
  variableDefinitions: z.record(
    z.object({
      displayName: z.string(),
      type: ComponentDefinitionPropertyTypeSchema,
      defaultValue: ComponentPropertyValueSchema,
      description: z.string().optional(),
      group: z.string().optional(),
      validations: z.record(z.string()).optional(),
    })
  ),
});

const UsedComponentsSchema = z.array(
  z.object({
    sys: z.object({
      type: z.literal('Link'),
      id: z.string(),
      linkType: z.literal('Entry'),
    }),
  })
);

const localeWrapper = (fieldSchema: any) => z.record(z.string(), fieldSchema);

export const ExperienceFieldsSchema = z.object({
  componentTree: localeWrapper(
    z.object({
      breakpoints: z.array(Breakpoint).nonempty(),
      children: z.array(ComponentTreeNodeSchema),
      schemaVersion: z.literal(schemaVersion),
    })
  ),
  dataSource: localeWrapper(DataSourceSchema),
  unboundValues: localeWrapper(UnboundValuesSchema),
  usedComponents: localeWrapper(UsedComponentsSchema).optional(),
  componentSettings: localeWrapper(ComponentSettingsSchema).optional(),
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

export type ExperienceFields = z.infer<typeof ExperienceFieldsSchema>;
export type DataSource = z.infer<typeof DataSourceSchema>;
export type UnboundValues = z.infer<typeof UnboundValuesSchema>;
export type UsedComponents = z.infer<typeof UsedComponentsSchema>;
export type ComponentSettings = z.infer<typeof ComponentSettingsSchema>;
