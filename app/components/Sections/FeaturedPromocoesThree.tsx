import { TruckIcon } from '@heroicons/react/24/solid'
import { Link } from '@remix-run/react'
import { type ISbStoryData } from '@storyblok/react'
import dayjs from 'dayjs'
import {
	type SVGProps,
	type ReactElement,
	type JSXElementConstructor,
} from 'react'
import config from '../../config'

import Omg from '../Assets/Expressions/Omg'
import Top from '../Assets/Expressions/Top'
import Uau from '../Assets/Expressions/Uau'

const {
	img: { format },
} = config

const expressions = [Uau, Top, Omg]

export default function FeaturedPromocoesThree({
	promocoes,
}: {
	promocoes: ISbStoryData[]
}) {
	if (promocoes.length < 1) {
		return null
	}

	return (
		<section aria-labelledby="featured-promotions-heading">
			<div className="relative z-30 pb-16">
				<h2
					className="heading-large pb-8 pt-0"
					id="featured-promotions-heading"
				>
					Promoções em Destaque
				</h2>
				<div className="f-p-3">
					{promocoes.map((promocao, index) => {
						const discount = Math.floor(
							100 - (promocao.content.price / promocao.content.oldprice) * 100,
						)

						const fl = promocao?.content?.Image?.filename
						const Expression:
							| (({
									className,
							  }: SVGProps<SVGSVGElement>) => ReactElement<
									any,
									string | JSXElementConstructor<any>
							  >)
							| undefined = expressions[index]
						return (
							<figure key={promocao.uuid} className="f-p-3-a">
								<figcaption className="f-p-3-a-d1">
									<Link
										to={`${ENV.BASE_URL}/${promocao.full_slug.replace(/\/$/, '')}`}
										className="grow font-bold uppercase"
									>
										<span aria-hidden="true" className="absi-0 z-10" />
										{promocao.content.Title}
									</Link>
									<time
										className="mt-1 grow-0 text-xs text-text-light"
										dateTime={dayjs(promocao.published_at).toISOString()}
									>
										Publicado a{' '}
										{dayjs(promocao.published_at).format('DD.MM.YYYY')}
									</time>
								</figcaption>

								<div className="relative">
									<img
										alt={promocao.content.Title}
										className="h-48 w-full grow-0 object-cover"
										height="137"
										loading="lazy"
										sizes="(min-width: 1340px) 384px, (min-width: 640px) calc(29.85vw - 10px), (min-width: 480px) 416px, 92.5vw"
										src={`${fl}/m/183x137${format}`}
										srcSet={`${fl}/m/183x137${format} 183w, ${fl}/m/338x254${format} 338w, ${fl}/m/222x166${format} 222w`}
										width="183"
									/>
									<div className="absolute -right-4 -top-4 z-10">
										{Expression ? (
											<Expression className="f-p-3-a-d2-e" />
										) : null}
									</div>
								</div>

								<div className="f-p-3-a-d3">
									<div className="flex">{`até -${discount}% de desconto`}</div>
									<div className="">
										{promocao.content.ShippingCost ? (
											<div className="flex">
												<TruckIcon aria-hidden="true" className="h-6 w-6" />
												<span className="ml-2">
													{promocao.content.ShippingCost}
												</span>
											</div>
										) : null}
									</div>
								</div>
							</figure>
						)
					})}
				</div>
			</div>
		</section>
	)
}
