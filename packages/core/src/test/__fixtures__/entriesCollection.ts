import { assets, entries } from './entities';

export const entriesCollection = {
  sys: {
    type: 'Array',
  },
  total: 3,
  skip: 0,
  limit: 100,
  items: entries,
  includes: {
    Entry: [],
    Asset: [assets],
  },
};
