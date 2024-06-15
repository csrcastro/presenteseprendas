import { storyblokEditable, type ISbStoryData } from '@storyblok/react'

const Loja = ({ blok }: { blok: ISbStoryData }) => {
	if (!blok) {
		return null
	}

	const {
		content: { Title, Image },
		full_slug,
	} = blok

	return (
		<div {...storyblokEditable(blok.content)} key={blok.content._uid}>
			<a className="group block flex-shrink-0" href={`/${full_slug}`}>
				<div className="flex items-center">
					<div className="rounded-full">
						<img
							alt={Title}
							className="inline-block h-16 w-16 p-2"
							src={`${Image.filename}`}
						/>
					</div>
					<div className="ml-3">
						<p className="text-gray-700 group-hover:text-gray-900 text-sm">
							<span className="font-bold">{`${Title}`}</span>
						</p>
					</div>
				</div>
			</a>
		</div>
	)
}

export default Loja
