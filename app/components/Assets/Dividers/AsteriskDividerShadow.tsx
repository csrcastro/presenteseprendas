import config from "../../../config";
import sprite from "../../../sprites/sprite.svg";

const {
  svg: { defaults },
} = config;

export default function AsteriskDividerShadow({
  className,
  count = 8,
}: {
  className: string;
  color?: string;
  count?: number;
}) {
  return (
    <div className={`${className}`} style={{ width: `${count * 32}px` }}>
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          {...defaults}
          viewBox="0 0 32 32"
          className={`inline h-full w-auto`}
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <use xlinkHref={`${sprite}#divider-shadow`} />
        </svg>
      ))}
    </div>
  );
}
