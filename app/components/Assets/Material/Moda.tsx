function Animais({ className }: { className: string }) {
  return (
    <svg
      className={className}
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 -960 960 960"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M120-160q-29 0-38-27.5T96-232l344-258v-70q0-17 11-28.5t28-11.5q26 1 43.5-16.5T540-660q0-25-17.5-42.5T480-720q-25 0-42.5 17.5T420-660h-80q0-58 41-99t99-41q58 0 99 40t41 98q0 47-27.5 84.5T520-526v36l344 258q23 17 14 44.5T840-160H120Zm120-80h480L480-420 240-240Z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default Animais;
