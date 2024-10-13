import { type ISbStories, getStoryblokApi } from '@storyblok/react'
import { Suspense, lazy, useState } from 'react'

import config from '../../config'
import AsteriskDividerShadow from '../Assets/Dividers/AsteriskDividerShadow'

const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
)

const {
	sb: { listParams },
} = config

export default function Promocoes({
	promocoesInitialState,
}: {
	promocoesInitialState: ISbStories
}) {
	const [promocoes, setPromocoes] = useState({
		page: 1,
		slices: [promocoesInitialState.data.stories],
		total: promocoesInitialState.total,
	})

	const loadMorePromocoes = async (page: number) => {
		const { data: newpromocoes } = await getStoryblokApi().get(`cdn/stories`, {
			version: ENV.STORYBLOK_EXPLORE,
			cv: ENV.CV,
			...listParams,
			starts_with: 'promocoes',
			page,
			resolve_relations: ['Promocao.Loja'],
		})
		setPromocoes({
			page,
			slices: [...promocoes.slices, newpromocoes.stories],
			total: promocoes.total,
		})
	}

	return (
		<section className="mx-auto mb-16 max-w-7xl px-8">
			<h3 className="heading-large text-colder">Promoções mais recentes</h3>

			{promocoes.slices.map((list, index) => {
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
							<PromocoesGrid promocoes={list} />
						</Suspense>
					</div>
				)
			})}

			{promocoes.total / listParams.per_page > promocoes.page ? (
				<div className="text-center">
					<button
						className="btn-large btn-vermais mt-16 bg-warm text-white hover:bg-warmer"
						onClick={() => {
							loadMorePromocoes(promocoes.page + 1)
						}}
					>
						Ver mais
					</button>
				</div>
			) : null}
		</section>
	)
}
