import { type SVGProps } from "react";
import config from "../../../config";
const {
  svg: { defaults },
} = config;
export default function Facebook({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 64 64" {...defaults}>
      <path
        d="M34.1,47V33.3h4.6l0.7-5.3h-5.3v-3.4c0-1.5,0.4-2.6,2.6-2.6l2.8,0v-4.8c-0.5-0.1-2.2-0.2-4.1-0.2 c-4.1,0-6.9,2.5-6.9,7V28H24v5.3h4.6V47H34.1z"
        fillRule="nonzero"
      />
    </svg>
  );
}
