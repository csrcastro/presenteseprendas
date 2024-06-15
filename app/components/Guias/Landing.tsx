import { Disclosure, DisclosureButton } from '@headlessui/react'
import {
	type ISbStories,
	storyblokEditable,
	type ISbStoryData,
	type SbBlokData,
} from '@storyblok/react'
import { lazy, Suspense } from 'react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichContentGuia from '../Helpers/RichContentGuia'
import RichText from '../Helpers/RichText'

const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))
const PageNavigation = lazy(() => import('#app/components/PageNavigation'))

export interface IBlok extends SbBlokData {
	Title: string
	Copy: StoryblokRichtext
	Intro: string
	Content: StoryblokRichtext
	OurPicks: ISbStoryData[]
	_uid: string
}

export default function Landing({
	blok,
	picks,
	url,
	guias,
	guiasCurrentPage,
	guiasTotalPages,
}: {
	blok: IBlok
	picks: ISbStoryData[]
	url: URL
	guias: ISbStories['data']
	guiasCurrentPage: string
	guiasTotalPages: number
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
							className="to-backround aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-background to-warm opacity-25"
							style={{
								clipPath: `polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%,
                  55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 
                    58.9% 0.2%, 73.6% 51.7%)`,
							}}
						/>
					</div>
					<div className="absolute inset-x-0 bottom-0">
						<svg
							className="-mb-1 w-full text-warm"
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
					<div className="relative z-10 mx-auto max-w-3xl px-4">
						<div className="text-center uppercase">
							<h1 className="heading-large text-warm">{blok.Title}</h1>
						</div>

						<div className="mb-16">
							{!blok.Intro ? (
								<RichText document={blok.Copy} />
							) : (
								<>
									<p className="mb-6">{blok.Intro}</p>
									<Disclosure key={`${blok._uid}-content`}>
										{({ open }) => (
											<>
												{open ? null : (
													<div className="flex w-full items-center justify-center">
														<DisclosureButton className="btn-medium btn-lermais bg-warm text-white hover:bg-warmer">
															Ler mais
														</DisclosureButton>
													</div>
												)}

												<Disclosure.Panel as="div" unmount={false}>
													<RichContentGuia document={blok.Content} />
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								</>
							)}
						</div>
					</div>
				</div>
			</section>

			<section className="bg-warm">
				<div className="mx-auto px-4 pb-16 lg:max-w-7xl lg:px-8">
					<h2 className="heading-large text-white">
						Guias de presentes em destaque
					</h2>
					<PresentesGrid ideias={picks} />
				</div>
			</section>
			{guias.stories.length > 0 && (
				<Suspense
					fallback={<p className="pb-20 text-center">A carregar conteúdos</p>}
				>
					<section className="bg-background">
						<div className="mx-auto px-4 lg:max-w-7xl lg:px-8" id="guias">
							<h2 className="heading-large">Guias de Presentes</h2>
							<PresentesGrid ideias={guias.stories} alt={true} />
							<div className="my-16 text-center">
								<PageNavigation
									borderColor="warm"
									containerClasses="px-4 py-3 sm:px-6"
									current={parseInt(guiasCurrentPage, 10)}
									hash="guias"
									searchParam="pagina"
									textColor="warmer"
									total={guiasTotalPages}
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
