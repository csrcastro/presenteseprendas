import { getStoryblokApi, type ISbResult } from '@storyblok/react'
import { Suspense, lazy, useState } from 'react'

import config from '../../config'
import AsteriskDividerShadow from '../Assets/Dividers/AsteriskDividerShadow'

const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))

const {
	sb: { listParams },
} = config

export default function Guias({
	guiasInitialState,
}: {
	guiasInitialState: ISbResult
}) {
	const [guias, setGuias] = useState({
		page: 1,
		slices: [guiasInitialState.data.stories],
		total: guiasInitialState.total,
	})

	const loadMoreGuias = async (page: number) => {
		const { data: newGuias } = await getStoryblokApi().get(`cdn/stories`, {
			version: ENV.STORYBLOK_EXPLORE,
			cv: ENV.CV,
			...listParams,
			starts_with: 'guias-de-presentes',
			page,
		})

		setGuias({
			page,
			slices: [...guias.slices, newGuias.stories],
			total: guias.total,
		})
	}

	return (
		<section className="mx-auto my-16 max-w-7xl px-8 text-center">
			<h2 className="heading-large text-warm pb-8 pt-0">Encontra o melhor presente</h2>

			<p className="mb-16 px-10 text-center text-black">
				{
					'Descobre o segredo para oferecer o presente perfeito em qualquer ocasião. Para aniversário, casamento, natal e muitos mais, temos os melhores guias, ideias e sugestões para te mostrar.'
				}
			</p>

			<h3 className="sr-only">Lista de guias de presentes</h3>

			{guias.slices.map((slice, index) => {
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
							<PresentesGrid ideias={slice} />
						</Suspense>
					</div>
				)
			})}

			{guias.total / listParams.per_page > guias.page ? (
				<button
					className="btn-large btn-vermais mt-16 bg-warm text-white hover:bg-warmer"
					onClick={() => {
						loadMoreGuias(guias.page + 1)
					}}
				>
					Ver mais
				</button>
			) : null}
		</section>
	)
}
