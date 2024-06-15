import { type SVGProps } from "react";
import config from "../../../config";
import categorias from "../../../sprites/sprite.svg";
const {
  svg: { defaults },
} = config;
function Animais({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 960 960" {...defaults} xmlnsXlink="http://www.w3.org/1999/xlink">
      <use xlinkHref={`${categorias}#familia`}></use>
    </svg>
  );
}

export default Animais;
