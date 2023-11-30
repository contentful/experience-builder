import { ReactElement, ReactNode } from 'react';
import { AppState } from './Config';
import { Action } from '../reducer';

export type Plugin = {
  renderRootFields?: (props: {
    children: ReactNode;
    dispatch: (action: Action) => void;
    state: AppState;
  }) => ReactElement<any>;
  renderRoot?: (props: {
    children: ReactNode;
    dispatch: (action: Action) => void;
    state: AppState;
  }) => ReactElement<any>;
  renderFields?: (props: {
    children: ReactNode;
    dispatch: (action: Action) => void;
    state: AppState;
  }) => ReactElement<any>;
};
