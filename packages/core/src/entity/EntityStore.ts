import type { Asset, Entry, UnresolvedLink } from 'contentful';
import { checkIsAssemblyEntry, isExperienceEntry } from '@/utils';
import type {
  ExperienceFields,
  ExperienceUnboundValues,
  ExperienceEntry,
  VariableMapping,
  ParameterDefinition,
} from '@/types';
import { EntityStoreBase } from './EntityStoreBase';
import { get } from '@/utils/get';
import { transformAssetFileToUrl } from './value-transformers';
import { isLink } from '@/utils/isLink';
import { resolveDeepUsedComponents } from '@/entity/utils/resolveDeepUsedComponents';
type EntityStoreArgs = {
  experienceEntry: ExperienceEntry | Entry;
  entities: Array<Entry | Asset>;
  locale: string;
};

type ParameterDefinitions = NonNullable<Record<string, ParameterDefinition>>;
type VariableMappings = NonNullable<Record<string, VariableMapping>>;

export class EntityStore extends EntityStoreBase {
  private _isExperienceAPatternEntry: boolean;
  /* serialized */ private _experienceEntryFields: ExperienceFields | undefined;
  /* serialized */ private _experienceEntryId: string | undefined;
  /* serialized */ private _unboundValues: ExperienceUnboundValues | undefined;
  /* derived    */ private _usedComponentsWithDeepReferences: ExperienceEntry[];
  /* derived    */ private _hoistedParameterDefinitions: ParameterDefinitions; // Hoisted, because they contain parameter definitions also from child patterns
  /* derived    */ private _hoistedVariableMappings: VariableMappings; // Hoisted, because they contain variable mappings also from child patterns

  constructor(json: string);
  constructor({ experienceEntry, entities, locale }: EntityStoreArgs);

  constructor(options: string | EntityStoreArgs) {
    if (typeof options === 'string') {
      // For SSR/SSG, the entity store is created server-side and passed to the client as a serialised JSON.
      // So the properties in data.entityStore are equal to the attributes of this class (see `toJSON()`)
      const serializedAttributes = JSON.parse(options).entityStore;
      super({
        entities: [
          ...(Object.values(serializedAttributes.entryMap) as Entry[]),
          ...(Object.values(serializedAttributes.assetMap) as Asset[]),
        ],
        locale: serializedAttributes.locale,
      });
      this._hoistedParameterDefinitions = {};
      this._hoistedVariableMappings = {};
      this._experienceEntryFields = serializedAttributes._experienceEntryFields as ExperienceFields; // non-broken deserialization always should result in valid ExperienceFields
      this._experienceEntryId = serializedAttributes._experienceEntryId as string; // // non-broken deserialization always should result in valid experienceEntryId
      this._unboundValues = serializedAttributes._unboundValues as ExperienceUnboundValues; // non-broken deserialization always should result in valid unboundValues
    } else {
      const { experienceEntry, entities, locale } = options;
      if (!isExperienceEntry(experienceEntry)) {
        throw new Error('Provided entry is not an experience entry');
      }

      super({ entities, locale });
      this._hoistedParameterDefinitions = {};
      this._hoistedVariableMappings = {};
      this._experienceEntryFields = experienceEntry.fields;
      this._experienceEntryId = experienceEntry.sys.id;
      this._unboundValues = experienceEntry.fields.unboundValues;
    }

    this._isExperienceAPatternEntry = checkIsAssemblyEntry({
      fields: this._experienceEntryFields,
    } as unknown as Entry);

    // DERIVE ENTITY STORE INSTANCE VARIBLES
    // Register prebindings
    {
      const usedComponentLinks = this._experienceEntryFields.usedComponents ?? [];
      const usedComponents: ExperienceEntry[] = usedComponentLinks
        .map((component) => (isLink(component) ? this.getEntityFromLink(component) : component))
        .filter((component): component is ExperienceEntry => component !== undefined);

      this._hoistedParameterDefinitions = EntityStore.calculateHoistedParameterDefinitions(
        this._experienceEntryFields,
        usedComponents,
      );
      this._hoistedVariableMappings = EntityStore.calculateHoistedVariableMappings(
        this._experienceEntryFields,
        usedComponents,
      );
    }

    // Register deep references
    this._usedComponentsWithDeepReferences = resolveDeepUsedComponents({
      experienceEntryFields: this._experienceEntryFields,
      parentComponents: new Set([this._experienceEntryId!]),
    });
  }

  private static calculateHoistedParameterDefinitions(
    parentEntryFields: ExperienceFields,
    usedComponents: ExperienceEntry[],
  ): ParameterDefinitions {
    let hoistedDefinitions: ParameterDefinitions = {};

    // --------------------
    // Hoist prebinding for the L1 parent pattern aka `pA`
    // --------------------
    hoistedDefinitions = Object.assign(
      hoistedDefinitions,
      parentEntryFields.componentSettings?.prebindingDefinitions?.[0].parameterDefinitions || {},
    );

    // --------------------
    // Hoist prebinding for the L2 nested patterns, patterns aka`pB`
    // --------------------
    usedComponents.forEach((patternEntryLevel2) => {
      hoistedDefinitions = {
        ...hoistedDefinitions,
        ...patternEntryLevel2.fields.componentSettings?.prebindingDefinitions?.[0]
          .parameterDefinitions,
      };
    });

    // --------------------
    // Hoist prebinding for L3 nested patterns, patterns aka `pC`
    // --------------------
    const usedComponentsLevel3 = usedComponents.flatMap((patternEntryLevel2) => {
      const usedComponents = patternEntryLevel2.fields.usedComponents || [];
      const filteredUsedComponents = usedComponents.filter(
        (component): component is ExperienceEntry =>
          component !== undefined && isExperienceEntry(component as Entry), // here we assume that due to fetchReferencedEntities() loading with include=2 we already have those resolved to entries
      );
      return filteredUsedComponents;
    });

    usedComponentsLevel3.forEach((patternEntryLevel3) => {
      hoistedDefinitions = {
        ...hoistedDefinitions,
        ...patternEntryLevel3.fields.componentSettings?.prebindingDefinitions?.[0]
          .parameterDefinitions,
      };
    });

    return hoistedDefinitions;
  }

  private static calculateHoistedVariableMappings(
    parentEntryFields: ExperienceFields,
    usedComponents: ExperienceEntry[],
  ): VariableMappings {
    let hoistedMappings: VariableMappings = {};

    // --------------------
    // Hoist prebinding for the L1 parent pattern aka `pA`
    // --------------------
    hoistedMappings = Object.assign(
      hoistedMappings,
      parentEntryFields.componentSettings?.prebindingDefinitions?.[0].variableMappings || {},
    );

    // --------------------
    // Hoist prebinding for the L2 nested patterns, patterns aka`pB`
    // --------------------
    usedComponents.forEach((patternEntryLevel2) => {
      hoistedMappings = {
        ...hoistedMappings,
        ...patternEntryLevel2.fields.componentSettings?.prebindingDefinitions?.[0].variableMappings,
      };
    });

    // --------------------
    // Hoist prebinding for L3 nested patterns, patterns aka `pC`
    // --------------------
    const usedComponentsLevel3 = usedComponents.flatMap((patternEntryLevel2) => {
      const usedComponents = patternEntryLevel2.fields.usedComponents || [];
      const filteredUsedComponents = usedComponents.filter(
        (component): component is ExperienceEntry =>
          component !== undefined && isExperienceEntry(component as Entry), // here we assume that due to fetchReferencedEntities() loading with include=2 we already have those resolved to entries
      );
      return filteredUsedComponents;
    });

    usedComponentsLevel3.forEach((patternEntryLevel3) => {
      hoistedMappings = {
        ...hoistedMappings,
        ...patternEntryLevel3.fields.componentSettings?.prebindingDefinitions?.[0].variableMappings,
      };
    });

    return hoistedMappings;
  }

  public getCurrentLocale() {
    return this.locale;
  }

  public get isExperienceAPatternEntry() {
    return this._isExperienceAPatternEntry;
  }

  public get hoistedVariableMappings() {
    return this._hoistedVariableMappings;
  }

  public get hoistedParameterDefinitions() {
    return this._hoistedParameterDefinitions;
  }

  public get experienceEntryFields() {
    return this._experienceEntryFields;
  }

  public get experienceEntryId() {
    return this._experienceEntryId;
  }

  public get schemaVersion() {
    return this._experienceEntryFields?.componentTree.schemaVersion;
  }

  public get breakpoints() {
    return this._experienceEntryFields?.componentTree.breakpoints ?? [];
  }

  public get dataSource() {
    return this._experienceEntryFields?.dataSource ?? {};
  }

  public get unboundValues() {
    return this._unboundValues ?? {};
  }

  public get usedComponents() {
    return this._usedComponentsWithDeepReferences ?? [];
  }

  /**
   * Extend the existing set of unbound values with the ones from the assembly definition.
   * When creating a new assembly out of a container, the unbound value keys are copied and
   * thus the existing and the added ones have colliding keys. In the case of overlapping value
   * keys, the ones from the experience overrule the ones from the assembly definition as
   * the latter one is certainly just a default value while the other one is from the actual instance.
   * @param unboundValues set of unbound values defined in the assembly definition
   */
  public addAssemblyUnboundValues(unboundValues: ExperienceUnboundValues) {
    this._unboundValues = { ...unboundValues, ...(this._unboundValues ?? {}) };
  }

  public getValue(
    entityLinkOrEntity: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset,
    path: string[],
  ): string | undefined {
    const entity = isLink(entityLinkOrEntity)
      ? this.getEntityFromLink(entityLinkOrEntity)
      : (entityLinkOrEntity as Entry | Asset);
    if (entity === undefined) {
      return;
    }
    const fieldValue = get<string>(entity, path);
    return transformAssetFileToUrl(fieldValue);
  }

  public toJSON() {
    return {
      _experienceEntryFields: this._experienceEntryFields,
      _experienceEntryId: this._experienceEntryId,
      _unboundValues: this._unboundValues,
      ...super.toJSON(),
    };
  }
}
