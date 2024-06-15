import { type ISbStoryData } from '@storyblok/react'
import { lazy, Suspense } from 'react'
const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))
export default function GuiasRelated({
	related,
}: {
	related: { data?: { stories: ISbStoryData[] } }
}) {
	if (!related.data) return null

	if (related.data.stories.length === 0) return null

	return (
		<section className="pb-8 text-center">
			<h3 className="heading-large pt-0 text-colder">Guias Relacionados</h3>
			<Suspense
				fallback={<p className="pb-20 text-center">A carregar conteúdos</p>}
			>
				<PresentesGrid ideias={related.data.stories} alt={true} />
			</Suspense>
		</section>
	)
}
