import config from '../../config'
const {
	img: { format },
} = config

export default function GuiaImage({
	image,
	alt,
	title,
}: {
	image: { filename: string }
	alt: string
	title: string
}) {
	return (
		<div className="relative mb-8 overflow-hidden rounded-lg shadow">
			<div
				className="absolute h-full w-full bg-warm/5 blur-xl"
				style={{
					backgroundPosition: 'center',
					backgroundImage: `url("${image.filename}/m/394x296${format}")`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
				}}
			/>
			<img
				alt={alt}
				title={title}
				height="296"
				src={`${image.filename}/m/394x296${format}`}
				sizes={`(min-width: 1360px) 547px, (min-width: 780px) calc(38.93vw + 25px), (min-width: 640px) calc(75vw - 36px), (min-width: 480px) calc(83.57vw - 41px), calc(91.88vw - 45px)`}
				srcSet={`${image.filename}/m/547x411${format} 547w, ${image.filename}/m/539x405${format} 539w, ${image.filename}/m/493x370${format} 493w, ${image.filename}/m/394x296${format} 394w`}
				width="394"
				className="relative mx-auto w-11/12 rounded-lg xs:w-10/12 sm:w-9/12"
			/>
		</div>
	)
}
