import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { connectSelectorsToStore } from '../bind-selectors';

export function StoreFacade() {
  return function(Token: new () => InstanceType<any>) {
    return Injectable({
      providedIn: 'root',
      useFactory: (store: Store<unknown>) => connectFacadeToStore(Token, store),
      deps: [Store]
    })(Token);
  };
}

function connectFacadeToStore(
  Token: new () => InstanceType<any>,
  store: Store<unknown>
) {
  const instance = new Token();

  Object.keys(instance).forEach(property => {
    connectDispatchers(instance, property, store);
    connectSelectors(instance, property, store);
  });

  return instance;
}

function connectDispatchers(
  instance: any,
  property: string,
  store: Store<unknown>
): void {
  const { type, dispatch } = instance[property];
  if (!dispatch) {
    return;
  }

  instance[property].dispatch = (payload?: any) =>
    !payload ? store.dispatch({ type }) : store.dispatch({ type, payload });
}

function connectSelectors(
  instance: any,
  property: string,
  store: Store<unknown>
): void {
  if (!instance[property].__ngrx_ducks__selectors_original) {
    return;
  }

  connectSelectorsToStore(instance[property], store);
}
