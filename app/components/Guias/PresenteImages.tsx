import { Link } from '@remix-run/react';

export default function PresenteImages({ images, url }) {
  return (
    <div className="flex flex-wrap justify-between gap-4  xs:w-8/12 md:w-10/12">
      {images.map((image, index) => {
        if (index == 0 && images.length !== 2) {
          return (
            <Link key={image.id} className="w-full" to={url}>
              <img
                alt={image.name}
                className={`aspect-[4/3] h-auto w-full  rounded-xl object-cover shadow-lg`}
                height="116"
                loading="lazy"
                sizes={`
                (min-width: 1360px) 608px, 
                (min-width: 780px) calc(43.21vw + 29px), 
                (min-width: 480px) calc(66.79vw - 33px), 
                calc(100vw - 48px)
              `}
                src={`${image.filename}/m/288x216/smart/filters:format(webp)`}
                srcSet={`
                  ${image.filename}/m/288x216/smart/filters:format(webp) 288w, 
                  ${image.filename}/m/430x323/smart/filters:format(webp) 430w, 
                  ${image.filename}/m/488x366/smart/filters:format(webp) 488w, 
                  ${image.filename}/m/609x457/smart/filters:format(webp) 609w,
                  `}
                width="155"
              />
            </Link>
          );
        }

        return (
          <Link key={image.id} className="w-[calc(50%_-_.5rem)]" to={url}>
            <img
              alt={image.name}
              className={`aspect-[4/3] h-auto w-full  rounded-xl object-cover shadow-lg`}
              height="116"
              loading="lazy"
              sizes={`
              (min-width: 1360px) 296px, 
              (min-width: 780px) 21.61vw, 
              (min-width: 480px) calc(33.21vw - 23px), 
              calc(50vw - 32px)
            `}
              src={`${image.filename}/m/207x155/smart/filters:format(webp)`}
              srcSet={`
                ${image.filename}/m/296x222/smart/filters:format(webp) 296w, 
                ${image.filename}/m/232x174/smart/filters:format(webp) 232w, 
                ${image.filename}/m/207x155/smart/filters:format(webp) 207w, 
                `}
              width="155"
            />
          </Link>
        );
      })}
    </div>
  );
}
