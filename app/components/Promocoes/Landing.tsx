import {
	type ISbStories,
	storyblokEditable,
	type ISbStoryData,
	type SbBlokData,
} from '@storyblok/react'
import { lazy, Suspense } from 'react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichText from '../Helpers/RichText'

const PageNavigation = lazy(() => import('#app/components/PageNavigation'))
const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
)

export interface IBlok extends SbBlokData {
	Title: string
	Copy: StoryblokRichtext
}

export default function Landing({
	blok,
	picks,
	url,
	promocoes,
	promocoesCurrentPage,
	promocoesTotalPages,
}: {
	blok: IBlok
	url: URL
	picks: ISbStoryData[]
	promocoesCurrentPage: string
	promocoesTotalPages: number
	promocoes: ISbStories['data']
}) {
	return (
		<main {...storyblokEditable(blok)} key={blok._uid}>
			<section aria-labelledby="Cabeçalho da página de guias">
				<div className="relative overflow-hidden bg-background">
					<div
						aria-hidden="true"
						className="absolute inset-x-0 -top-16 flex transform-gpu justify-center overflow-hidden blur-3xl"
					>
						<div
							className="to-backround aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-background to-colder opacity-25"
							style={{
								clipPath: `polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%,
                  55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 
                  21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)`,
							}}
						/>
					</div>
					<div className="absolute inset-x-0 bottom-0">
						<svg
							className="-mb-1 w-full text-colder"
							fill="currentColor"
							preserveAspectRatio="none"
							viewBox="0 0 224 12"
						>
							<path
								d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 
              C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z"
							/>
						</svg>
					</div>
					<div className="relative mx-auto max-w-3xl px-4">
						<h1 className="heading-large text-cold">{blok.Title}</h1>
						<div className="mb-16">
							<RichText document={blok.Copy} />
						</div>
					</div>
				</div>
			</section>
			<section className="bg-colder">
				<div className="mx-auto px-4 pb-16 lg:max-w-7xl lg:px-8">
					<h3 className="heading-large text-white">Promoções em destaque</h3>
					<PromocoesGrid promocoes={picks} />
				</div>
			</section>
			{promocoes.stories.length > 0 && (
				<Suspense
					fallback={<p className="pb-20 text-center">A carregar conteúdos</p>}
				>
					<section className="bg-background">
						<div className="mx-auto px-4 lg:max-w-7xl lg:px-8" id="promocoes">
							<h3 className="heading-large">Promoções</h3>
							<PromocoesGrid promocoes={promocoes.stories} />
							<div className="my-16 text-center">
								<PageNavigation
									borderColor="cold"
									containerClasses="px-4 py-3 sm:px-6"
									current={parseInt(promocoesCurrentPage, 10)}
									hash="promocoes"
									searchParam="pagina"
									textColor="colder"
									total={promocoesTotalPages}
									url={url}
								/>
							</div>
						</div>
					</section>
				</Suspense>
			)}
		</main>
	)
}
