import { type SVGProps } from "react";
import config from "../../../config";
const {
  svg: { defaults },
} = config;
import categorias from "../../../sprites/sprite.svg";
function Animais({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...defaults}
      className={className}
      viewBox="0 0 960 960"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <use xlinkHref={`${categorias}#animais`}></use>
    </svg>
  );
}

export default Animais;
