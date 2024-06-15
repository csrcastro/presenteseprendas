import config from "../../../config";
const {
  svg: { defaults },
} = config;
export default function Casa({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" {...defaults}>
      <path
        d={`M2.75 5.862V4.25c0-.825.675-1.5 1.5-1.5h7.5c.825 0 1.5.675 1.5 1.5v1.62a2.24 2.24 0 00-1.5 
        2.107V9.5h-7.5V7.97c0-.967-.63-1.8-1.5-2.107zM14 6.5c-.825 0-1.5.675-1.5 1.5v2.25h-9V8a1.5 1.5 0 10-3 
        0v3.75c0 .825.675 1.5 1.5 1.5v1.5h1.5v-1.5h9v1.5H14v-1.5c.825 0 1.5-.675 1.5-1.5V8c0-.825-.675-1.5-1.5-1.5z`}
        fill="currentColor"
      />
    </svg>
  );
}
