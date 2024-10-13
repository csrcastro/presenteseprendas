import {
	type ISbStories,
	getStoryblokApi,
	type ISbStoriesParams,
} from '@storyblok/react'
import { Suspense, lazy, useState } from 'react'

import config from '../../config'
import AsteriskDividerShadow from '../Assets/Dividers/AsteriskDividerShadow'

const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
)

const {
	sb: { listParams },
} = config

export default function PromocoesDynamicList({
	promocoesInitialState,
	title = 'Promoções mais recentes',
	subtitle,
	filterQuery,
}: {
	promocoesInitialState: ISbStories
	title?: string
	subtitle?: string
	filterQuery?: any
}) {
	const SbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
		cv: ENV.CV,
		...listParams,
		starts_with: 'promocoes',
		resolve_relations: ['Promocao.Loja'],
	}

	if (filterQuery) {
		SbParams.filter_query = filterQuery
	}

	const [promocoes, setPromocoes] = useState({
		page: 1,
		slices: [promocoesInitialState.data.stories],
		total: promocoesInitialState.total,
	})

	if (promocoesInitialState.data.stories.length < 1) {
		return null
	}

	const loadMore = async (page: number) => {
		const { data } = await getStoryblokApi().get(`cdn/stories`, {
			...SbParams,
			page,
		})
		setPromocoes({
			page,
			slices: [...promocoes.slices, data.stories],
			total: promocoes.total,
		})
	}

	return (
		<section className="mx-auto mb-16 max-w-7xl px-8 text-center">
			<h3 className="heading-large text-colder">{title}</h3>

			{subtitle ? <p className="mb-16 px-10 text-black">{subtitle}</p> : null}

			{promocoes.slices.map((list, index) => {
				return (
					<div key={`promocoes-grid-${index}`}>
						{index > 0 ? (
							<AsteriskDividerShadow className="mx-auto my-16 h-8 fill-warm" />
						) : null}
						<Suspense
							fallback={<p className="pb-20">{'A carregar Promoções'}</p>}
						>
							<PromocoesGrid promocoes={list} />
						</Suspense>
					</div>
				)
			})}

			{promocoes.total / listParams.per_page > promocoes.page ? (
				<button
					className="btn-large btn-vermais mt-16 bg-warm text-white hover:bg-warmer"
					onClick={() => {
						loadMore(promocoes.page + 1)
					}}
				>
					{'ver mais'}
				</button>
			) : null}
		</section>
	)
}
