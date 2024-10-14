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
		<div className="relative mb-4 overflow-hidden rounded-lg shadow">
			<div
				className="absolute h-full w-full bg-warm/5 blur-xl"
				style={{
					backgroundPosition: 'center',
					backgroundImage: `url("${image.filename}/m/314x252${format}")`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
				}}
			/>
			<img
				alt={alt}
				title={title}
				height="209"
				src={`${image.filename}/m/314x209${format}`}
				sizes={`(min-width: 780px) 504px, (min-width: 640px) calc(50vw + 124px), (min-width: 480px) calc(83.57vw - 41px), calc(91.88vw - 45px)`}
				srcSet={`${image.filename}/m/504x336${format} 504w, ${image.filename}/m/444x296${format} 444w, ${image.filename}/m/360x240${format} 360w, ${image.filename}/m/314x209${format} 314w`}
				width="314"
				className="relative mx-auto w-11/12 rounded-lg xs:w-10/12 sm:w-9/12"
			/>
		</div>
	)
}
