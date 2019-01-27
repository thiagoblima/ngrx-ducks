import { methodsFrom } from '../class';
import { WiredActions } from '../core/types';
import { wireUpAction } from './create-duck.spec';

export function createDuck<T extends new () => InstanceType<T>>(
  classToken: T
): WiredActions<InstanceType<T>> {
  const origin = new classToken();
  return methodsFrom(classToken).reduce(
    (target, method) => ({ ...target, [method]: wireUpAction(origin, method) }),
    { ...origin } as any
  );
}
