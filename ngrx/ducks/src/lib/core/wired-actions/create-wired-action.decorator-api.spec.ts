import { WiredActions } from '../types';
import { throwIf } from '../validation';
import {
  validActionType,
  WithEmptyActionType,
  WithNullActionType,
  WithProperty,
  WithUndefinedActionType,
  WithValidActionType
} from './mocks/duck-candidates';

export function createDuck<T extends new () => InstanceType<T>>(
  classToken: T
): WiredActions<InstanceType<T>> {
  const origin = new classToken();
  const target = { ...origin };

  methodsFrom<T>(classToken).forEach(
    method => (target[method] = wireUpAction(origin, method))
  );

  return target;
}

describe('@Action', () => {
  describe('When a single action type is provided', () => {
    it('should create a single wired action', () => {
      const duck = createDuck(WithValidActionType);
      expect(duck.increase(1)).toEqual({
        type: validActionType,
        payload: 1
      });
    });
  });

  describe('When no action type is given', () => {
    it.each([
      [WithUndefinedActionType],
      [WithNullActionType],
      [WithEmptyActionType]
    ])('should raise an error', classToken => {
      expect(() => createDuck(classToken)).toThrowError(
        `${
          classToken.name
        }: Passing null, undefined or '' to @Action is not allowed.`
      );
    });
  });

  describe('When the class contains properties', () => {
    it('should ignore those', () => {
      const withProperty = new WithProperty();
      const duck = createDuck(WithProperty);

      expect(duck.name).toBe(withProperty.name);
    });
  });
});

function methodsFrom<T extends new () => InstanceType<T>>(classToken: T) {
  return Object.getOwnPropertyNames(classToken.prototype).filter(
    omitConstructor
  );
}

function missingActionTypeError(className: string) {
  return `${className}: Passing null, undefined or '' to @Action is not allowed.`;
}

function wireUpAction<T>(instance: T, method: string) {
  throwIf(
    !instance[method].wiredAction.type,
    missingActionTypeError(instance.constructor.name)
  );

  const wiredAction: any = (payload: any) => ({
    type: instance[method].wiredAction.type,
    payload
  });

  wiredAction.type = instance[method].wiredAction.type;
  wiredAction.caseReducer = instance[method].wiredAction.caseReducer;

  return wiredAction;
}

function omitConstructor(member: string): boolean {
  return member !== 'constructor';
}
