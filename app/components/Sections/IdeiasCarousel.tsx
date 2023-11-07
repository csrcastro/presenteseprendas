import { Link } from '@remix-run/react';

import { useRef } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { Swiper as SwiperCore } from 'swiper/types';

import ChevronArrowLeft from '~/components/Assets/Arrows/ChevronArrowLeft';
import ChevronArrowRight from '~/components/Assets/Arrows/ChevronArrowRight';
import RichTitle from '~/components/Helpers/RichTitle';

export default function IdeiasCarousel({ ideias, containerClasses, ariaId, heading }) {
  const swiperRef = useRef<SwiperCore>();

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
            {ideias.map((ideia) => (
              <SwiperSlide key={`featured-category-slider-${ideia.uuid}`}>
                <Link
                  aria-label={ideia.name}
                  className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg sm:flex-row"
                  to={`/${ideia.full_slug}`}
                >
                  <img
                    alt={ideia.content.Title}
                    className="aspect-[4/3] sm:h-auto sm:w-2/5 md:w-1/3"
                    loading="lazy"
                    src={ideia?.content?.Image?.filename}
                  />

                  <div className="flex items-center px-4 py-2 sm:w-3/5 md:w-2/3 lg:p-8">
                    <div>
                      <h3 className="text-lg font-bold leading-tight text-colder md:text-xl lg:text-4xl">
                        {ideia.content.Title}
                      </h3>

                      <p className="mt-1 leading-snug lg:mt-4 lg:text-xl">{ideia.content?.ShortDescription}</p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            <button
              className="transition-color group absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cold p-4 shadow-lg ring-cold ring-opacity-25 hover:bg-colder hover:ring"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <span className="sr-only">anterior</span>
              <ChevronArrowLeft className="h-8 w-8 fill-colder transition group-hover:fill-cold" />
            </button>
            <button
              className="transition-color left group absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-cold p-4 shadow-lg ring-cold ring-opacity-25 hover:bg-colder hover:ring"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <span className="sr-only">seguinte</span>
              <ChevronArrowRight className="h-8 w-8 fill-colder transition group-hover:fill-cold" />
            </button>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
