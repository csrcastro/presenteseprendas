import { Link } from '@remix-run/react';

import { useRef, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { Swiper as SwiperCore } from 'swiper/types';

import ChevronArrowLeft from '~/components/Assets/Arrows/ChevronArrowLeft';
import ChevronArrowRight from '~/components/Assets/Arrows/ChevronArrowRight';
import RichTitle from '~/components/Helpers/RichTitle';

export default function IdeiasCarouselLarge({ ideias, containerClasses, ariaId, heading }) {
  const swiperRef = useRef<SwiperCore>();

  const [[hideLeft, hideRight], setHide] = useState([true, false]);

  if (ideias.length <= 0) {
    return null;
  }

  return (
    <section aria-labelledby={ariaId}>
      <div className={containerClasses}>
        <h2 className="sr-only" id={ariaId}>
          {heading}
        </h2>
        <div className="mx-auto max-w-7xl">
          <Swiper
            className="mySwiper"
            grabCursor={true}
            modules={[Pagination]}
            pagination={{
              clickable: true,
            }}
            slidesPerView={'auto'}
            spaceBetween={20}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {ideias.map((ideia, index) => (
              <SwiperSlide key={`featured-category-slider-${ideia.uuid}`}>
                <Link
                  aria-labelledby={`large-carousel-item-${ideia.uuid}`}
                  className="flex h-full flex-col overflow-hidden rounded-sm 
                  bg-white shadow-[4px_4px_#0067ca] sm:flex-row"
                  to={`/${ideia.full_slug}`}
                >
                  <img
                    alt={ideia.content.Title}
                    className="aspect-[4/3] w-full sm:h-auto sm:w-2/5 md:w-1/3"
                    height="197"
                    loading="lazy"
                    sizes={`
                    (min-width: 1500px) 427px, 
                    (min-width: 780px) calc(30vw - 17px), 
                    (min-width: 640px) calc(40vw - 51px), 
                    (min-width: 640px) calc(100vw - 128px)`}
                    src={`${ideia?.content?.Image?.filename}/m/262x197/smart/filters:format(webp)`}
                    srcSet={`
                    ${ideia?.content?.Image?.filename}/m/427x320/smart/filters:format(webp) 427w, 
                    ${ideia?.content?.Image?.filename}/m/351x263/smart/filters:format(webp) 351w, 
                    ${ideia?.content?.Image?.filename}/m/511x383/smart/filters:format(webp) 511w, 
                    ${ideia?.content?.Image?.filename}/m/262x197/smart/filters:format(webp) 262w
                    `}
                    width="262"
                  />
                  <div className="flex items-center px-4 py-2 sm:w-3/5 md:w-2/3 lg:p-8">
                    <div>
                      <h3
                        className="leading-tighter font-serif text-lg font-light md:text-xl lg:text-4xl"
                        id={`large-carousel-item-${ideia.uuid}`}
                      >
                        <RichTitle document={ideia.content.Title} />
                      </h3>

                      <p className="mt-1 leading-snug lg:mt-4 lg:text-base">{ideia.content?.ShortDescription}</p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            {swiperRef.current?.isBeginning}
            <button
              className={`${
                hideLeft ? 'hidden ' : ''
              }transition-color absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 
              rounded-full bg-cold p-4 shadow-lg ring-cold ring-opacity-25 hover:bg-colder hover:ring`}
              onClick={() => {
                swiperRef.current?.slidePrev();
                setHide([swiperRef.current?.isBeginning || false, swiperRef.current?.isEnd || false]);
              }}
            >
              <span className="sr-only">anterior</span>
              <ChevronArrowLeft className="h-8 w-8 fill-white" />
            </button>

            <button
              className={`${
                hideRight ? 'hidden ' : ''
              }transition-color left absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 
              rounded-full bg-cold p-4 shadow-lg ring-cold ring-opacity-25 hover:bg-colder hover:ring`}
              onClick={() => {
                swiperRef.current?.slideNext();
                setHide([swiperRef.current?.isBeginning || false, swiperRef.current?.isEnd || false]);
              }}
            >
              <span className="sr-only">seguinte</span>
              <ChevronArrowRight className="h-8 w-8 fill-white" />
            </button>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
