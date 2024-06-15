export default function MonetizedMobileBannerThree() {
  return (
    <div className="md:hidden mb-8">
      <span className=" block text-center text-xs text-text-light font-bold uppercase mb-4">
        Publicidade
      </span>
      <a
        rel="sponsored"
        href="https://www.awin1.com/cread.php?s=3153857&v=28903&q=438506&r=1450658"
        target="_blank"
        className="xs:hidden block max-w-[300px] mx-auto"
      >
        <img
          width={300}
          height={50}
          className="w-full"
          alt="ESD Days"
          src="https://www.awin1.com/cshow.php?s=3153857&v=28903&q=438506&r=1450658"
          loading="lazy"
        />
      </a>
      <a
        rel="sponsored"
        href="https://www.awin1.com/cread.php?s=3153857&v=28903&q=438506&r=1450658"
        target="_blank"
        className="hidden xs:block max-w-[728px] mx-auto max"
      >
        <img
          width={728}
          height={90}
          className="w-full"
          alt="ESD Days"
          src="https://www.awin1.com/cshow.php?s=3153857&v=28903&q=438506&r=1450658"
          loading="lazy"
        />
      </a>
    </div>
  );
}
