import { Link } from '@remix-run/react';
import { storyblokEditable } from '@storyblok/react';

import DynamicExpression from '../Assets/Expressions/DynamicExpression';

import RichParagraphsOnly from '../Helpers/RichParagraphsOnly';
import RichText from '../Helpers/RichText';

import Share from '../Share';

import Autor from '~/components/Autor';
import Breadcrumbs from '~/components/Breadcrumbs';
import Loja from '~/components/Loja';

// import { Autor, Loja } from '~/types/promocao';
import type { Promocao } from '~/types/promocao';

export default function PromocaoBlok({ blok }: { blok: Promocao }) {
  const discount = Math.floor(100 - (blok.price / blok.oldprice) * 100);

  return (
    <article {...storyblokEditable(blok)} key={blok._uid}>
      <div className="grid w-full grid-cols-1 items-center gap-x-8 sm:grid-cols-12">
        <figure
          className="aspect-square mx-auto max-w-sm overflow-hidden rounded-lg shadow 
        sm:col-span-4 sm:max-w-none lg:col-span-5"
        >
          <Link rel="noreferrer" target="_blank" to={blok?.Link?.url}>
            <img
              alt={blok.Title}
              className="aspect-1 w-full object-cover object-center"
              height="285"
              loading="lazy"
              sizes={`
              (min-width: 1360px) 285px, 
              (min-width: 1040px) calc(20vw + 17px), 
              (min-width: 640px) calc(33.42vw - 38px), 
              (min-width: 500px) calc(66.67vw - 32px), 
              (min-width: 460px) calc(-480vw + 2592px), 
              calc(94.29vw - 31px)
              `}
              src={`${blok.Image.filename}/m/285x285/smart/filters:format(webp)`}
              srcSet={`
                  ${blok.Image.filename}/m/285x285/smart/filters:format(webp) 285w, 
                  ${blok.Image.filename}/m/304x304/smart/filters:format(webp) 304w, 
                  ${blok.Image.filename}/m/384x384/smart/filters:format(webp) 384w, 
                  `}
              width="285"
            />
          </Link>
        </figure>
        <div className="sm:col-span-8 lg:col-span-7">
          <Link rel="noreferrer" target="_blank" to={blok?.Link?.url}>
            <h1 className="mb-2 mt-8 font-serif text-2xl font-light transition-colors hover:text-contrast sm:mt-0">
              {blok.Title}
            </h1>
          </Link>
          <p className="mb-4 text-sm">{blok.blurb}</p>
          <p>
            <span className="font-serif text-2xl">{blok.price}€</span>
            <span className="font-serif text-2xl text-warmer">{` (-${discount}%)`}</span>
            <span className="block text-sm font-light text-text-light">{`Preço anterior: ${blok.oldprice}€`}</span>
          </p>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 items-center gap-x-8 py-8 sm:grid-cols-12">
        <div className="mb-6 sm:col-span-4 sm:mb-0 lg:col-span-5">
          <Share image={blok.Image.filename} />
        </div>
        <div className="sm:col-span-8 lg:col-span-7">
          <Link
            className={`duration-318 block h-12 w-full rounded-sm bg-warm text-center font-serif text-lg leading-[3rem] 
        text-white hover:bg-warmer`}
            rel="noreferrer"
            target="_blank"
            to={blok?.Link?.url}
            type="button"
          >
            Ver promoção {`${blok.Loja?.content ? `na ${blok.Loja.content.Title}` : ''}`}
          </Link>
        </div>
      </div>
      <div className="relative mb-12 rounded-sm bg-white p-8 shadow">
        <div className="absolute -bottom-6 -right-1 z-10 lg:-right-8">
          <DynamicExpression className="h-16 w-auto fill-warm drop-shadow " />
        </div>
        <h2 className="mb-8 font-serif text-3xl font-light">Acerca desta promoção:</h2>
        <RichText document={blok.copy} />
        <Loja blok={blok.Loja} />

        <Autor blok={blok.Autor} />
      </div>

      <div className="mb-12 rounded-sm bg-white p-8 shadow">
        <h2 className="mb-8 font-serif text-3xl font-light">Avaliação:</h2>
        <RichParagraphsOnly className={''} document={blok.Review} />

        <Link target="_blank" to={blok.ReviewLink}>
          {blok.ReviewName}
        </Link>
      </div>

      <div className="mb-12 rounded-sm bg-white p-8 shadow">
        <h2 className="mb-8 font-serif text-3xl font-light">Informação de envio:</h2>
        <RichText document={blok.Loja?.content.ShippingInfo} />
      </div>
    </article>
  );
}
