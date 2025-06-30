import type { Asset, Entry, UnresolvedLink } from 'contentful';
import { isExperienceEntry } from '@/utils';
import type {
  ExperienceFields,
  ExperienceUnboundValues,
  ExperienceEntry,
  ExperienceComponentSettings,
} from '@/types';
import { EntityStoreBase } from './EntityStoreBase';
import { get } from '@/utils/get';
import { transformAssetFileToUrl } from './value-transformers';
import { isLink } from '@/utils/isLink';
import { resolveDeepUsedComponents } from '@/fetchers/resolveDeepUsedComponents';
type EntityStoreArgs = {
  experienceEntry: ExperienceEntry | Entry;
  entities: Array<Entry | Asset>;
  locale: string;
};

type PatternPropertyDefinitions = NonNullable<
  ExperienceComponentSettings['patternPropertyDefinitions']
>;
type VariableMappings = NonNullable<ExperienceComponentSettings['variableMappings']>;

export class EntityStore extends EntityStoreBase {
  /* serialized */ private _experienceEntryFields: ExperienceFields | undefined;
  /* serialized */ private _experienceEntryId: string | undefined;
  /* serialized */ private _unboundValues: ExperienceUnboundValues | undefined;
  /* derived    */ private _usedComponentsWithDeepReferences: ExperienceEntry[];
  /* derived    */ private _patternPropertyDefinitions: PatternPropertyDefinitions;
  /* derived    */ private _variableMappings: VariableMappings;

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
      this._patternPropertyDefinitions = {};
      this._variableMappings = {};
      // TODO: need to figure how to register prebinding presets from the PARENT PATTERN and NESTED PATTERNS

      this._experienceEntryFields = serializedAttributes._experienceEntryFields;
      this._experienceEntryId = serializedAttributes._experienceEntryId;
      this._unboundValues = serializedAttributes._unboundValues;
    } else {
      const { experienceEntry, entities, locale } = options;
      if (!isExperienceEntry(experienceEntry)) {
        throw new Error('Provided entry is not an experience entry');
      }

      super({ entities, locale });
      this._patternPropertyDefinitions = {};
      this._variableMappings = {};
      this._experienceEntryFields = (experienceEntry as ExperienceEntry).fields;
      this._experienceEntryId = (experienceEntry as ExperienceEntry).sys.id;
      this._unboundValues = (experienceEntry as ExperienceEntry).fields.unboundValues;

      // Register prebinding presets from the PARENT PATTERN
      this._patternPropertyDefinitions = Object.assign(
        this._patternPropertyDefinitions,
        (experienceEntry as ExperienceEntry).fields.componentSettings?.patternPropertyDefinitions ||
          {},
      );
      this._variableMappings = Object.assign(
        this._variableMappings,
        (experienceEntry as ExperienceEntry).fields.componentSettings?.variableMappings || {},
      );
      // Register prebinding presets from the N1 NESTED PATTERNS
      const usedComponentLinks = (experienceEntry as ExperienceEntry).fields?.usedComponents ?? [];
      const usedComponents: ExperienceEntry[] = usedComponentLinks
        .map((component) => (isLink(component) ? this.getEntityFromLink(component) : component))
        .filter((component): component is ExperienceEntry => component !== undefined); // TODO: do we need to filter stuff out here? (what if the component is not found?)

      usedComponents.forEach((patternEntry) => {
        this._patternPropertyDefinitions = {
          ...this._patternPropertyDefinitions,
          ...patternEntry.fields.componentSettings?.patternPropertyDefinitions,
        };
        this._variableMappings = {
          ...this._variableMappings,
          ...patternEntry.fields.componentSettings?.variableMappings,
        };
      });
    }

    this._usedComponentsWithDeepReferences = resolveDeepUsedComponents({
      experienceEntryFields: this._experienceEntryFields,
      parentComponents: new Set([this._experienceEntryId!]),
    });
  }

  public getCurrentLocale() {
    return this.locale;
  }

  public get variableMappings() {
    return this._variableMappings;
  }

  public get patternPropertyDefinitions() {
    return this._patternPropertyDefinitions;
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
