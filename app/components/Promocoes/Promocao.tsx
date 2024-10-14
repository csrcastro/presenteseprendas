import { FireIcon } from '@heroicons/react/24/solid'
import {
	type ISbStoryData,
	type SbBlokData,
	storyblokEditable,
} from '@storyblok/react'
import { lazy, Suspense } from 'react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import config from '../../config'
import Autor from '../Autor'
import RichText from '../Helpers/RichText'
import Loja from '../Loja'
import MonetizedLink from '../Monetize/MonetizedLink'

const {
	img: { format },
} = config

const Share = lazy(() => import('../Share'))
const RichParagraphsOnly = lazy(() => import('../Helpers/RichParagraphsOnly'))
const DynamicExpression = lazy(
	() => import('../Assets/Expressions/DynamicExpression'),
)

export interface IBlok extends SbBlokData {
	Link: { url: string }
	Title: string
	price: number
	oldprice: number
	Image: { filename: string }
	blurb: string
	copy: StoryblokRichtext
	Review: StoryblokRichtext
	ReviewLink: string
	ReviewName: string
	Autor: ISbStoryData
	Loja: ISbStoryData
}

export default function PromocaoBlok({ blok }: { blok: IBlok }) {
	const discount = Math.floor(100 - (blok.price / blok.oldprice) * 100)

	return (
		<article {...storyblokEditable(blok)} key={blok._uid}>
			<div className="mt-6 w-full items-center gap-x-8 sm:flex">
				<div className="order-1 sm:w-2/3 lg:w-3/5">
					<MonetizedLink to={blok?.Link?.url} loja={blok.Loja}>
						<h1 className="mb-2 mt-8 font-serif text-2xl transition-colors hover:text-contrast sm:mt-0">
							{blok.Title}
						</h1>
					</MonetizedLink>
					<p className="mb-4 text-sm">{blok.blurb}</p>
					<p>
						<span className="font-serif text-2xl">{blok.price}€</span>
						<span className="font-serif text-2xl text-warmer">{` (-${discount}%)`}</span>
						<span className="block text-sm font-light text-text-light">{`Preço anterior: ${blok.oldprice}€`}</span>
					</p>
				</div>
				<figure className="aspect-square mx-auto mt-6 max-w-sm overflow-hidden rounded-custom shadow sm:col-span-4 sm:mt-0 sm:w-1/3 sm:max-w-none lg:col-span-5 lg:w-2/5">
					<MonetizedLink to={blok?.Link?.url} loja={blok?.Loja}>
						<img
							alt={blok.Title}
							className="aspect-1 w-full object-cover object-center"
							height="187"
							sizes="(min-width: 1040px) 294px, (min-width: 880px) 245px, (min-width: 640px) calc(26.36vw + 18px), (min-width: 460px) 384px, calc(94.29vw - 31px)"
							src={`${blok.Image.filename}/m/187x187${format}`}
							srcSet={`${blok.Image.filename}/m/294x294${format} 294w, ${blok.Image.filename}/m/245x245${format} 245w, ${blok.Image.filename}/m/187x187${format} 187w, ${blok.Image.filename}/m/384x384${format} 384w, ${blok.Image.filename}/m/342x342${format} 342w`}
							width="187"
						/>
					</MonetizedLink>
				</figure>
			</div>
			<div className="w-full items-center gap-x-8 py-8 sm:flex">
				<div className="mb-6 sm:order-1 sm:mb-0 sm:w-2/3 lg:w-3/5">
					<MonetizedLink
						className="inline-flex w-full justify-center rounded-custom bg-warm px-6 py-3 duration-300 hover:bg-warmer xs:px-8 md:px-12"
						to={blok?.Link?.url}
						loja={blok?.Loja}
					>
						<span className="inline-flex items-start text-white">
							<span className="text-lg/6 font-black">{'COMPRAR JÁ'}</span>
							<FireIcon className="ml-1 h-5 w-5" aria-hidden="true" />
						</span>
					</MonetizedLink>
				</div>
				<div className="sm:w-1/3 lg:w-2/5">
					<Suspense fallback={null}>
						<Share image={blok.Image.filename} />
					</Suspense>
				</div>
			</div>

			<div className="relative mb-12 rounded-sm bg-white p-8 shadow">
				<div className="absolute -bottom-6 -right-1 z-10 lg:-right-8">
					<Suspense fallback={null}>
						<DynamicExpression className="h-16 w-auto fill-warm drop-shadow" />
					</Suspense>
				</div>
				<h2 className="mb-8 font-serif text-3xl">{'Acerca desta promoção:'}</h2>
				<RichText document={blok.copy} />
				<Loja blok={blok.Loja} />

				<Autor blok={blok.Autor} />
			</div>

			<div className="rounded-sm bg-white p-8 shadow">
				<h2 className="mb-8 font-serif text-3xl">{'Avaliação:'}</h2>
				<Suspense fallback={null}>
					<RichParagraphsOnly className={''} document={blok.Review} />
				</Suspense>

				<MonetizedLink to={blok.ReviewLink} loja={blok?.Loja}>
					{blok.ReviewName}
				</MonetizedLink>
			</div>
			<aside className="my-8 rounded bg-warm/5 px-4 py-4 text-xs italic text-text-light">
				{
					'Esperamos que gostes desta Promoção, ela foi selecionada independentemente por um dos nossos autores. A Presentes e Prendas poderá receber uma parte das vendas e/ou outros tipos de compensação através dos links nesta página.'
				}
			</aside>

			<div className="mb-12 rounded-sm bg-white p-8 shadow">
				<h2 className="mb-8 font-serif text-3xl">{'Informação de envio:'}</h2>
				<RichText document={blok.Loja?.content.ShippingInfo} />
			</div>
		</article>
	)
}
