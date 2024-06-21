import {
	ISbStoriesParams,
	getStoryblokApi,
	type ISbResult,
} from '@storyblok/react'
import { Suspense, lazy, useState } from 'react'

import config from '../../config'
import AsteriskDividerShadow from '../Assets/Dividers/AsteriskDividerShadow'

const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))

const {
	sb: { listParams },
} = config

export default function GuiasDinamicList({
	guiasInitialState,
	title = 'Guias mais recentes',
	subtitle,
	filterQuery,
}: {
	guiasInitialState: ISbResult
	title?: string
	subtitle?: string
	filterQuery?: any
}) {
	const SbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
		cv: ENV.CV,
		...listParams,
		starts_with: 'guias-de-presentes',
	}

	if (filterQuery) {
		SbParams.filter_query = filterQuery
	}

	const [guias, setGuias] = useState({
		page: 1,
		slices: [guiasInitialState.data.stories],
		total: guiasInitialState.total,
	})

	if (guiasInitialState.data.stories.length < 1) {
		return null
	}

	const loadMore = async (page: number) => {
		const { data } = await getStoryblokApi().get(`cdn/stories`, {
			...SbParams,
			page,
		})

		setGuias({
			page,
			slices: [...guias.slices, data.stories],
			total: guias.total,
		})
	}

	return (
		<section className="mx-auto my-16 max-w-7xl px-8 text-center">
			<h3 className="heading-large">{title}</h3>

			{subtitle ? <p className="mb-16 px-10 text-black">{subtitle}</p> : null}

			{guias.slices.map((slice, index) => {
				return (
					<div key={`promocoes-grid-${index}`}>
						{index > 0 ? (
							<AsteriskDividerShadow className="mx-auto my-16 h-8 fill-warm" />
						) : null}
						<Suspense
							fallback={
								<p className="pb-20">{'A carregar Guias de Presentes'}</p>
							}
						>
							<PresentesGrid ideias={slice} />
						</Suspense>
					</div>
				)
			})}

			{guias.total / listParams.per_page > guias.page ? (
				<button
					className="btn-large btn-vermais mt-16 bg-warm text-white hover:bg-warmer"
					onClick={() => {
						loadMore(guias.page + 1)
					}}
				>
					{'ver mais'}
				</button>
			) : null}
		</section>
	)
}
