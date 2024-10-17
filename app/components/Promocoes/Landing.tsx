import {
	type ISbStories,
	storyblokEditable,
	type ISbStoryData,
	type SbBlokData,
} from '@storyblok/react'
import { lazy, Suspense } from 'react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import Text from '#app/components/Content/Text'

const PageNavigation = lazy(() => import('#app/components/PageNavigation'))
const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
)

export interface IBlok extends SbBlokData {
	Title: string
	Copy: StoryblokRichtext
	Content: IBlok[]
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
			<section className="bg-colder">
				<div className="mx-auto px-4 pb-16 lg:max-w-7xl lg:px-8">
					<h2 className="heading-large text-white">{'Destaques'}</h2>
					<PromocoesGrid promocoes={picks} />
				</div>
			</section>
			{promocoes.stories.length > 0 && (
				<Suspense
					fallback={
						<p className="pb-20 text-center">{'A carregar conteúdos'}</p>
					}
				>
					<section className="bg-background">
						<div className="mx-auto px-4 lg:max-w-7xl lg:px-8" id="promocoes">
							<h2 className="heading-large text-colder">
								{'Todas as Promoções'}
							</h2>
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
			<section className="border-t-2 border-cold">
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
					<div className="relative mx-auto max-w-5xl px-4">
						<h1 className="heading-large text-cold">{blok.Title}</h1>
						<div className="mb-16">
							{blok?.Content.map((part: IBlok) => {
								if (part.component === 'Content--Text') {
									return <Text key={part._uid} content={part.Copy} />
								}
								return (
									<div key={part._uid}>
										<p>{part.component}</p>
										{JSON.stringify(part)}
										<br />
										<br />
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
