import { type SVGProps } from "react";
import config from "../../../config";
const {
  svg: { defaults },
} = config;
import categorias from "../../../sprites/sprite.svg";
function Tecnologia({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 960 960" {...defaults} xmlnsXlink="http://www.w3.org/1999/xlink">
      <use xlinkHref={`${categorias}#tecnologia`}></use>
    </svg>
  );
}

export default Tecnologia;
