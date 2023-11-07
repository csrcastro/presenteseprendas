import Omg from '~/components/Assets/Expressions/Omg';
import Top from '~/components/Assets/Expressions/Top';
import Uau from '~/components/Assets/Expressions/Uau';

import { useHydrated } from '~/hooks/useHydrated';

const components = [Uau, Top, Omg];

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function DynamicExpression({ className }: { className: string }) {
  const random = getRandomInt(0, 2);

  const Comp = components[random];

  return useHydrated() ? <Comp className={className} /> : null;
}
