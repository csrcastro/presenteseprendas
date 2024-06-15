import config from "../../../config";
const {
  svg: { defaults },
} = config;
function ChevronArrowLeft({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 19 22" {...defaults}>
      <path
        d="M0 11.664c0 2.784 6.672 10.32 9.6 10.32 1.104 0 2.208-.432 2.784-1.392.96.96 1.872 1.344 3.216 1.344 1.536 0 3.264-.432 3.264-2.304 0-2.88-3.552-6.192-5.184-8.4 1.824-1.872 5.232-5.616 5.232-8.304 0-1.584-1.2-2.928-2.784-2.928-1.632 0-2.736.432-3.744 1.728C11.952.624 11.136.096 9.984.096 6.48.096 0 8.496 0 11.664Z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default ChevronArrowLeft;
