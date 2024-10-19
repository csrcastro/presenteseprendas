import { getStoryblokApi, type ISbResult } from '@storyblok/react'
import { Suspense, lazy, useState } from 'react'

import config from '../../config'
import AsteriskDividerShadow from '../Assets/Dividers/AsteriskDividerShadow'

const ArtigosGrid = lazy(() => import('#app/components/Artigos/ArtigosGrid'))

const {
	sb: { listParams },
} = config

export default function Guias({
	artigosInitialState,
}: {
	artigosInitialState: ISbResult
}) {
	const [artigos, setArtigos] = useState({
		page: 1,
		slices: [artigosInitialState.data.stories],
		total: artigosInitialState.total,
	})

	const loadMoreArtigos = async (page: number) => {
		const { data: artigosData } = await getStoryblokApi().get(`cdn/stories`, {
			version: ENV.STORYBLOK_EXPLORE,
			cv: ENV.CV,
			...listParams,
			starts_with: 'pages',
			excluding_slugs: `pages/perguntas-frequentes,pages/politica-de-cookies,pages/sobre-nos`,
			page,
		})

		if (artigosData.stories.length < 1) {
			return
		}

		setArtigos({
			page,
			slices: [...artigos.slices, artigosData.stories],
			total: artigos.total,
		})
	}

	return (
		<section className="mx-auto my-16 max-w-7xl px-8 text-center">
			<h2 className="heading-large text-couve pb-8 pt-0">Artigos Recentes</h2>

			{artigos.slices.map((slice, index) => {
				return (
					<div key={`promocoes-grid-${index}`}>
						{index > 0 ? (
							<AsteriskDividerShadow className="mx-auto my-16 h-8 fill-warm" />
						) : null}
						<Suspense
							fallback={
								<p className="pb-20 text-center">{'A carregar conteúdos'}</p>
							}
						>
							<ArtigosGrid artigos={slice} />
						</Suspense>
					</div>
				)
			})}

			{artigos.total / listParams.per_page > artigos.page ? (
				<button
					className="btn-large btn-vermais bg-couve mt-16 text-white hover:bg-colder"
					onClick={() => {
						loadMoreArtigos(artigos.page + 1)
					}}
				>
					Mais Artigos
				</button>
			) : null}
		</section>
	)
}
