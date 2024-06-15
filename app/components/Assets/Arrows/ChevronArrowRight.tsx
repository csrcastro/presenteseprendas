import config from "../../../config";
const {
  svg: { defaults },
} = config;
function ChevronArrowRight({ className }: { className: string }) {
  return (
    <svg {...defaults} viewBox="0 0 19 22" className={className}>
      <path
        fillRule="nonzero"
        d="M8.928.096c-1.152 0-1.968.528-2.4 1.632C5.52.432 4.416 0 2.784 0 1.2 0 0 1.344 0 2.928c0 2.688 3.408 6.432 5.232 8.304C3.6 13.44.048 16.752.048 19.632c0 1.872 1.728 2.304 3.264 2.304 1.344 0 2.256-.384 3.216-1.344.576.96 1.68 1.392 2.784 1.392 2.928 0 9.6-7.536 9.6-10.32 0-3.168-6.48-11.568-9.984-11.568Z"
      />
    </svg>
  );
}

export default ChevronArrowRight;
