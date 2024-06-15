import { Link } from '@remix-run/react'

import { type ISbStoryData } from '@storyblok/js'
import config from '../../config'

const {
	img: { format },
} = config

const PromocoesGrid = ({ promocoes }: { promocoes: ISbStoryData[] }) => {
	return (
		<div className="p-grid">
			{promocoes.map((promocao: ISbStoryData) => {
				const discount = Math.floor(
					100 - (promocao?.content?.price / promocao?.content?.oldprice) * 100,
				)
				const fl = promocao?.content?.Image?.filename
				return (
					<figure key={promocao.uuid} className="p-grid-a group items-center">
						<div className="p-grid-a-d">
							<img
								alt={promocao?.content.Title}
								className="p-grid-a-d-img group-hover:scale-125"
								height="137"
								loading="lazy"
								sizes="(min-width: 1360px) 286px, (min-width: 780px) calc(22.32vw - 13px), (min-width: 640px) calc(33.33vw - 37px), calc(50vw - 44px)"
								src={`${fl}/m/218x164${format}`}
								srcSet={`${fl}/m/286x215${format} 286w, ${fl}/m/218x164${format} 218w,${fl}/m/276x207${format} 276w`}
								width="183"
							/>
						</div>
						<figcaption className="p-grid-a-d2">
							<Link
								aria-label={`Ver promoção: ${promocao?.content.Title} `}
								title={`Ver promoção: ${promocao?.content.Title} `}
								to={`${ENV.BASE_URL}/${promocao.full_slug.replace(/\/$/, '')}`}
								className="p-grid-a-d2-h"
							>
								<span aria-hidden="true" className="absi-0" />
								{promocao?.content.Title}
							</Link>
							<div>
								<span className="p-grid-a-d2-h-s">{`até -${discount}%`}</span>
								{promocao?.content?.Loja ? (
									<aside className="p-grid-a-d2-h-a">
										na {promocao?.content?.Loja?.content?.Title}
									</aside>
								) : null}
							</div>
						</figcaption>
					</figure>
				)
			})}
		</div>
	)
}

export default PromocoesGrid
