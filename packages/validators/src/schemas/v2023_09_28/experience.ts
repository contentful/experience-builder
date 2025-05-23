import { z } from 'zod';
import {
  BindingSourceTypeEnumSchema,
  BoundValueSchema,
  BreakpointSchema,
  breakpointsRefinement,
  ComponentTreeSchema,
  ComponentValueSchema,
  DataSourceSchema,
  DesignValueSchema,
  HyperlinkValueSchema,
  localeWrapper,
  NoValueSchema,
  PatternPropertySchema,
  PrimitiveValueSchema,
  UnboundValueSchema,
  UnboundValuesSchema,
  UsedComponentsSchema,
  ValuesByBreakpointSchema,
} from './common';

export const ExperienceFieldsCMAShapeSchema = z.object({
  componentTree: localeWrapper(ComponentTreeSchema),
  dataSource: localeWrapper(DataSourceSchema),
  unboundValues: localeWrapper(UnboundValuesSchema),
  usedComponents: localeWrapper(UsedComponentsSchema).optional(),
});

export type ExperienceFields = z.infer<typeof ExperienceFieldsCMAShapeSchema>;
export type ExperienceDataSource = z.infer<typeof DataSourceSchema>;
export type ExperienceUnboundValues = z.infer<typeof UnboundValuesSchema>;
export type ExperienceUsedComponents = z.infer<typeof UsedComponentsSchema>;
export type ExperienceComponentTree = z.infer<typeof ComponentTreeSchema>;
export type ValuesByBreakpoint = z.infer<typeof ValuesByBreakpointSchema>;
export type Breakpoint = z.infer<typeof BreakpointSchema>;
export type PrimitiveValue = z.infer<typeof PrimitiveValueSchema>;
export type DesignValue = z.infer<typeof DesignValueSchema>;
export type BoundValue = z.infer<typeof BoundValueSchema>;
export type NoValue = z.infer<typeof NoValueSchema>;
export type UnboundValue = z.infer<typeof UnboundValueSchema>;
export type HyperlinkValue = z.infer<typeof HyperlinkValueSchema>;
export type ComponentValue = z.infer<typeof ComponentValueSchema>;
export type BindingSourceTypeEnum = z.infer<typeof BindingSourceTypeEnumSchema>;
export type PatternProperty = z.infer<typeof PatternPropertySchema>;
export { breakpointsRefinement };

// Re-exports for compatibility. Remove when no longer needed
export { PATTERN_THUMBNAIL_IDS } from './pattern'; // re-export for compatibility
export type {
  VariableMapping,
  PatternComponentSettings as ExperienceComponentSettings,
} from './pattern';
