import { type SVGProps } from 'react'
import config from '../../../config'
import sprite from '../../../sprites/sprite.svg'

const {
	svg: { defaults },
} = config

function Top({ className }: SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...defaults}
			viewBox="0 0 360 127"
			className={className}
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<use xlinkHref={`${sprite}#top`}></use>
		</svg>
	)
}

export default Top
