import { ɵɵdefineInjectable, ɵɵinject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnnotationTarget } from '../decorator-api/typings';
import { connect } from './connect';

export function StoreFacade() {
  return function(constructor: AnnotationTarget) {
    constructor.ɵfac = notConstructableError;
    constructor.ɵprov = ɵɵdefineInjectable({
      token: constructor,
      providedIn: 'root',
      factory() {
        return connect(
          constructor,
          ɵɵinject(Store)
        );
      }
    });

    return constructor;
  };
}

export function notConstructableError() {
  throw new Error('ɵfac: Cannot create class directly.');
}
