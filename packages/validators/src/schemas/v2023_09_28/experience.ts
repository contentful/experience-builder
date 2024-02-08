import { z } from 'zod';
import { SchemaVersions } from '../schemaVersions';

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

const PrimitiveValueSchema = z
  .union([z.string(), z.boolean(), z.number(), z.record(z.any())])
  .optional();

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

const ValuesByBreakpointSchema = z.record(z.lazy(() => PrimitiveValueSchema));

const ComponentPropertyValueSchema = z.union([
  z.object({
    type: z.literal('DesignValue'),
    valuesByBreakpoint: ValuesByBreakpointSchema,
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

export type ComponentPropertyValue = z.infer<typeof ComponentPropertyValueSchema>;

const BreakpointSchema = z.object({
  id: z.string(),
  query: z.string(),
  previewSize: z.string(),
  displayName: z.string(),
});

const UnboundValuesSchema = z.record(
  propertyKeySchema,
  z.object({
    value: PrimitiveValueSchema,
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
    propertyKeySchema,
    z.object({
      displayName: z.string(),
      type: ComponentDefinitionPropertyTypeSchema,
      defaultValue: ComponentPropertyValueSchema.optional(),
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

const ComponentTreeSchema = z.object({
  breakpoints: z.array(BreakpointSchema),
  children: z.array(ComponentTreeNodeSchema),
  schemaVersion: SchemaVersions,
});

const localeWrapper = (fieldSchema: any) => z.record(z.string(), fieldSchema);

export const ExperienceFieldsCMAShapeSchema = z.object({
  componentTree: localeWrapper(ComponentTreeSchema),
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

export type ExperienceFields = z.infer<typeof ExperienceFieldsCMAShapeSchema>;
export type DataSource = z.infer<typeof DataSourceSchema>;
export type UnboundValues = z.infer<typeof UnboundValuesSchema>;
export type UsedComponents = z.infer<typeof UsedComponentsSchema>;
export type ComponentSettings = z.infer<typeof ComponentSettingsSchema>;
export type ValuesByBreakpoint = z.infer<typeof ValuesByBreakpointSchema>;
export type Breakpoint = z.infer<typeof BreakpointSchema>;
export type PrimitiveValue = z.infer<typeof PrimitiveValueSchema>;
export type ComponentTree = z.infer<typeof ComponentTreeSchema>;
