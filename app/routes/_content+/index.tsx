import {
	type LoaderFunction,
	type MetaArgs,
	type MetaFunction,
	defer,
} from '@remix-run/node'
import { Form, useLoaderData, Await, useLocation } from '@remix-run/react'
import {
	type ISbStories,
	type ISbStory,
	type ISbStoryData,
	getStoryblokApi,
	useStoryblokState,
} from '@storyblok/react'
import { Suspense, lazy } from 'react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
// import StaticCategoriesIcons from "#app/components/StaticCategoriesIcons";
import { GeneralErrorBoundary } from '#app/components/error-boundary.js'
import { type IBlok } from '#app/components/PerguntasFrequentes'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'
import sprite from '#app/sprites/sprite.svg'

const {
	sb: { listParams },
	svg: { defaults },
	img: { format },
} = config

const FeaturedPromocoesThree = lazy(
	() => import('#app/components/Sections/FeaturedPromocoesThree'),
)
const Guias = lazy(() => import('#app/components/Guias/Home'))

const HomeGuiasDestaques = lazy(
	() => import('#app/components/Sections/HomeGuiasDestaques'),
)
const MonetizedMobileBannerOne = lazy(
	() => import('#app/components/Monetize/MonetizedMobileBannerOne.js'),
)
const MonetizedMobileBannerTwo = lazy(
	() => import('#app/components/Monetize/MonetizedMobileBannerTwo.js'),
)
const Perguntas = lazy(() => import('#app/components/PerguntasFrequentes'))
const Promocoes = lazy(() => import('#app/components/Promocoes/Home'))
const StaticCategories = lazy(() => import('#app/components/StaticCategories'))

const Error = lazy(() => import('#app/components/Errors/Route404Error'))

export function ErrorBoundary() {
	const location = useLocation()
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: () => (
					<Suspense fallback={<p className="pb-20 text-center">Erro</p>}>
						<Error location={location.pathname} />
					</Suspense>
				),
			}}
		/>
	)
}

export const loader: LoaderFunction = async () => {
	const storyStoryblokParams = {
		version: ENV.STORYBLOK_EXPLORE,
		cv: ENV.CV,
	}

	const listStoryblokParams = {
		...storyStoryblokParams,
		...listParams,
	}

	const guiasInitialState = getStoryblokApi().get(`cdn/stories`, {
		...listStoryblokParams,
		starts_with: 'guias-de-presentes',
	})
	const promocoesInitialState = getStoryblokApi().get(`cdn/stories`, {
		...listStoryblokParams,
		starts_with: 'promocoes',
		resolve_relations: ['Promocao.Loja'],
	})

	const { data } = await getStoryblokApi()
		.get(`cdn/stories/home`, {
			...storyStoryblokParams,
			resolve_relations: [
				'page.featuredGuias',
				'page.featuredPromocoes',
				'page.Categorias',
			],
		})
		.catch(_ => {
			return { data: null }
		})

	if (!data) {
		throw new Response('Not Found', { status: 404 })
	}

	return defer({
		data,
		guiasInitialState,
		promocoesInitialState,
	})
}

const metadata = {
	title: 'Presentes e Prendas: o segredo para oferecer mais e melhor!',
	description: `Presentes e Prendas: ajudamos-te a oferecer melhor 🎁 em qualquer ocasião. Guias, ideias e sugestões para todos os gostos, estilos e carteiras.`,
}

export const meta: MetaFunction<typeof loader> = ({
	data: loaderData,
}: MetaArgs) => {
	if (!loaderData) {
		return []
	}
	const {
		data: {
			story: { content },
		},
	} = loaderData as {
		data: ISbStory['data']
	}
	return [
		...content.featuredGuias.map(
			(
				{
					content: {
						Image: { filename },
					},
				}: { content: { Image: { filename: string } } },
				index: number,
			) => ({
				tagName: 'link',
				rel: 'preload',
				href: `${filename}/m/${index === 0 ? '249x187' : '187x140'}${format}`,
				as: 'image',
				imageSizes: `${
					index === 0
						? '(min-width: 1360px) 384px, (min-width: 1040px) calc(26.67vw + 27px), (min-width: 780px) 33.33vw, (min-width: 480px) calc(50vw - 16px), calc(100vw - 32px)'
						: '(min-width: 1360px) 288px, (min-width: 1040px) calc(20vw + 20px), (min-width: 780px) 25vw, calc(50vw - 16px)'
				}`,
				imageSrcSet: `${
					index === 0
						? `${filename}/m/446x335${format} 446w, ${filename}/m/249x187${format} 249w, ${filename}/m/303x228${format} 303w, ${filename}/m/384x288${format} 384w`
						: `${filename}/m/187x140${format} 187w, ${filename}/m/228x171${format} 228w, ${filename}/m/288x216${format} 288w, ${filename}/m/253x190${format} 253w`
				}`,
				fetchpriority: 'high',
			}),
		),
		...generateMetadata('/', metadata),
		generateStructureddata(
			{
				breadcrumbs: [],
				collection: {
					url: '',
					name: 'Presentes e Prendas',
					description: content.SeoDescription,
					stories: [...content.featuredGuias, ...content.featuredPromocoes],
				},
				faq: content.PerguntasFrequentes,
			},
			'',
			metadata,
		),
	]
}

export default function Slug() {
	const { data, guiasInitialState, promocoesInitialState } = useLoaderData<
		typeof loader
	>() as {
		data: ISbStory['data']
		guiasInitialState: Promise<ISbStories>
		promocoesInitialState: Promise<ISbStories>
	}

	const story = useStoryblokState(data.story) as ISbStoryData<{
		featuredPromocoes: ISbStoryData[]
		featuredGuias: ISbStoryData[]
		Categorias: ISbStoryData[]
		PerguntasFrequentes: IBlok[]
	}>

	const { featuredPromocoes, featuredGuias, Categorias, PerguntasFrequentes } =
		story?.content

	return (
		<main className="min-h-screen">
			<section className="relative bg-warm pt-16">
				<div className="absolute inset-x-0 bottom-0">
					<svg
						className="-mb-1 w-full text-background"
						fill="currentColor"
						preserveAspectRatio="none"
						viewBox="0 0 224 12"
					>
						<path
							d={`M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z`}
						/>
					</svg>
				</div>
				<div className="mx-auto px-4 pb-20 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
					<h1 className="sr-only">
						{'Presentes e Prendas: o segredo para oferecer melhor'}
					</h1>
					<Form
						action="pesquisa"
						method="get"
						className="relative max-w-xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-2xl"
					>
						<label className="sr-only" htmlFor="pesquisa">
							{'Pesquisa na Presentes e Prendas'}
						</label>
						<div className="flex rounded-md focus-within:shadow-lg">
							<div className="relative flex flex-grow items-stretch">
								<svg
									{...defaults}
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cold"
									xmlnsXlink="http://www.w3.org/1999/xlink"
								>
									<use xlinkHref={`${sprite}#sparkles`} />
								</svg>
								<input
									className="block w-full rounded-none rounded-l-md border-0 py-4 pl-10 text-text-light placeholder:text-text-lighter focus:ring-0 focus:ring-offset-0 sm:text-sm sm:leading-6"
									id="pesquisa"
									name="pesquisa"
									placeholder="Pesquisa ideias de presentes"
									type="text"
								/>
							</div>
							<button
								aria-label="Pesquisar"
								className="rounded-r-md bg-cold px-6 text-white hover:bg-colder"
								type="submit"
							>
								<span className="sr-only">Pesquisar</span>
								<svg
									{...defaults}
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									className="h-7 w-auto px-2"
									xmlnsXlink="http://www.w3.org/1999/xlink"
								>
									<use xlinkHref={`${sprite}#magnifier`} />
								</svg>
							</button>
						</div>
					</Form>
					{/* <StaticCategoriesIcons categorias={Categorias} /> */}
				</div>
			</section>
			<h2 className="heading-large text-warm mx-auto max-w-3xl">
				Destaques
				<span className="sr-only"> que não vais querer perder</span>
			</h2>
			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<HomeGuiasDestaques
					containerClasses="pb-16 px-4 lg:px-16"
					heading="Guias de Presentes em Destaque"
					ideias={featuredGuias}
				/>
			</Suspense>
			<AsteriskDividerShadow className="mx-auto mb-16 h-8 fill-warm" />
			<aside className="mx-auto max-w-3xl px-8">
				<Suspense fallback={null}>
					<MonetizedMobileBannerOne />
				</Suspense>
			</aside>
			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<Await resolve={guiasInitialState}>
					{state => <Guias guiasInitialState={state} />}
				</Await>
			</Suspense>
			<AsteriskDividerShadow className="mx-auto mb-16 h-8 fill-warm" />
			<aside className="mx-auto max-w-3xl px-8">
				<Suspense fallback={null}>
					<MonetizedMobileBannerTwo />
				</Suspense>
			</aside>
			<Suspense fallback={null}>
				<FeaturedPromocoesThree promocoes={featuredPromocoes} />
			</Suspense>
			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<StaticCategories categorias={Categorias} />
			</Suspense>
			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<Await resolve={promocoesInitialState}>
					{state => <Promocoes promocoesInitialState={state} />}
				</Await>
			</Suspense>
			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<Perguntas perguntas={PerguntasFrequentes} />
			</Suspense>
		</main>
	)
}
