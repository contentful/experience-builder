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
    entityLink: UnresolvedLink<'Entry' | 'Asset'>,
    path: string[]
  ): string | undefined {
    const entity =
      entityLink.sys.linkType === 'Entry'
        ? this.entryMap.get(entityLink.sys.id)
        : this.assetMap.get(entityLink.sys.id);

    if (!entity || entity.sys.type !== entityLink.sys.linkType) {
      console.warn(`Experience references unresolved entity: ${JSON.stringify(entityLink)}`);
      return;
    }

    const fieldValue = super.getValue(entityLink, path);

    // walk around to render asset files
    return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
      ? (fieldValue as AssetFile).url
      : fieldValue;
  }
}
