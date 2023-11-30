import { UiState } from '../types/Config';
import { Action } from './actions';

export const reduceUi = (ui: UiState, action: Action) => {
  if (action.type === 'setUi') {
    if (typeof action.ui === 'object') {
      return {
        ...ui,
        ...action.ui,
      };
    }

    return {
      ...ui,
      ...action.ui(ui),
    };
  }

  return ui;
};
