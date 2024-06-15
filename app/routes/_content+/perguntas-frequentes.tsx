import { Disclosure, DisclosureButton } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { type MetaFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	type ISbStoriesParams,
	type ISbStoryData,
	type ISbResult,
	getStoryblokApi,
	useStoryblokState,
	type SbBlokData,
} from '@storyblok/react'

import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichContent from '#app/components/Helpers/RichContent'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

interface IFaq extends SbBlokData {
	Title: string
	Copy: StoryblokRichtext
}

const metadata = {
	title: 'Algumas perguntas frequentes acerca da Presentes e Prendas.',
	description:
		'Vamos responder aquelas questões mundanas que te podem passar pela cabeça.',
}

export const meta: MetaFunction<typeof loader> = () => [
	...generateMetadata('perguntas-frequentes', metadata),
	generateStructureddata(
		{
			breadcrumbs: [
				{ name: 'Perguntas Frequentes', item: 'perguntas-frequentes' },
			],
		},
		'perguntas-frequentes',
		metadata,
	),
]

export const loader = async () => {
	const sbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
	}

	const { data }: ISbResult = await getStoryblokApi().get(
		`cdn/stories/pages/perguntas-frequentes`,
		sbParams,
	)

	return json({
		data,
	})
}

export default function PerguntasFrequentes() {
	const { data } = useLoaderData<typeof loader>()
	const story: ISbStoryData | null = useStoryblokState(data.story)

	if (!story) return null

	const faqs: IFaq[] = story.content?.Conteudo

	return (
		<main className="mx-auto max-w-7xl px-6 lg:px-8">
			<article className="divide mx-auto max-w-4xl divide-y">
				<h1 className="heading-large">Perguntas Frequentes</h1>
				<dl className="divide mb-16 space-y-6 divide-y">
					{faqs.map((faq: IFaq) => (
						<Disclosure
							key={faq._uid}
							as="div"
							className="pt-6"
							defaultOpen={true}
						>
							{({ open }) => (
								<>
									<dt>
										<DisclosureButton className="flex w-full items-start justify-between text-left">
											<span className="font-heading">{faq.Title}</span>
											<span className="ml-6 flex h-7 items-center">
												{open ? (
													<MinusIcon aria-hidden="true" className="h-6 w-6" />
												) : (
													<PlusIcon aria-hidden="true" className="h-6 w-6" />
												)}
											</span>
										</DisclosureButton>
									</dt>
									<Disclosure.Panel
										as="dd"
										className="mt-2 pr-12 text-sm text-text-light"
										unmount={false}
									>
										<RichContent document={faq.Copy} />
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					))}
				</dl>
			</article>
		</main>
	)
}
