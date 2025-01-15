// import type { EntityStore } from '@/entity/EntityStore';

export interface Experience<T = unknown> {
  hyperlinkPattern?: string;
  entityStore?: T;
}
