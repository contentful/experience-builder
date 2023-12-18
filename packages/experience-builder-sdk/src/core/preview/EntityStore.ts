import type { Asset, Entry, UnresolvedLink, AssetFile } from 'contentful';
import { EntityStore as VisualSdkEntityStore } from '@contentful/visual-sdk';
import { isExperienceEntry } from '@contentful/experience-builder-core';
import type {
  Composition,
  CompositionUnboundValues,
  ExperienceEntry,
} from '@contentful/experience-builder-core/types';

type EntityStoreArgs = {
  experienceEntry: ExperienceEntry | Entry;
  entities: Array<Entry | Asset>;
  locale: string;
};

export class EntityStore extends VisualSdkEntityStore {
  private _experienceEntry: Composition | undefined;
  private _unboundValues: CompositionUnboundValues | undefined;

  constructor({ experienceEntry, entities, locale }: EntityStoreArgs) {
    super({ entities, locale });

    if (isExperienceEntry(experienceEntry)) {
      this._experienceEntry = (experienceEntry as ExperienceEntry).fields;
      this._unboundValues = (experienceEntry as ExperienceEntry).fields.unboundValues;
    } else {
      throw new Error('Provided entry is not experience entry');
    }
  }

  public getCurrentLocale() {
    return this.locale;
  }

  public get experienceEntryFields() {
    return this._experienceEntry;
  }

  public get schemaVersion() {
    return this._experienceEntry?.componentTree.schemaVersion;
  }

  public get breakpoints() {
    return this._experienceEntry?.componentTree.breakpoints ?? [];
  }

  public get dataSource() {
    return this._experienceEntry?.dataSource ?? {};
  }

  public get unboundValues() {
    return this._unboundValues ?? {};
  }

  public get usedComponents() {
    return this._experienceEntry?.usedComponents ?? [];
  }

  public updateUnboundValues(unboundValues: CompositionUnboundValues) {
    this._unboundValues = { ...(this._unboundValues ?? {}), ...unboundValues };
  }

  public getValue(
    entityLinkOrEntity: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset,
    path: string[]
  ): string | undefined {
    const isLink = (
      entity: typeof entityLinkOrEntity
    ): entity is UnresolvedLink<'Entry' | 'Asset'> => entityLinkOrEntity.sys.type === 'Link';

    let entity: Entry | Asset;
    if (isLink(entityLinkOrEntity)) {
      const resolvedEntity =
        entityLinkOrEntity.sys.linkType === 'Entry'
          ? this.entryMap.get(entityLinkOrEntity.sys.id)
          : this.assetMap.get(entityLinkOrEntity.sys.id);

      if (!resolvedEntity || resolvedEntity.sys.type !== entityLinkOrEntity.sys.linkType) {
        console.warn(
          `Experience references unresolved entity: ${JSON.stringify(entityLinkOrEntity)}`
        );
        return;
      }
      entity = resolvedEntity;
    } else {
      // We already have the complete entity in preview & delivery (resolved by the CMA client)
      entity = entityLinkOrEntity;
    }

    const fieldValue = get<string>(entity, path);

    // walk around to render asset files
    return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
      ? (fieldValue as AssetFile).url
      : fieldValue;
  }
}

// Taken from visual-sdk. We need this when we already have the full entity instead of the link (preview & delivery)
function get<T>(obj: Record<string, any>, path: string[]): T | undefined {
  if (!path.length) {
    return obj as T;
  }

  try {
    const [currentPath, ...nextPath] = path;
    return get(obj[currentPath], nextPath);
  } catch (err) {
    return undefined;
  }
}
