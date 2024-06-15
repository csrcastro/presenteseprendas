import { type SVGProps } from 'react'
import config from '../../../config'
import sprite from '../../../sprites/sprite.svg'

const {
	svg: { defaults },
} = config

function Omg({ className }: SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...defaults}
			viewBox="0 0 397 126"
			className={className}
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<use xlinkHref={`${sprite}#omg`}></use>
		</svg>
	)
}

export default Omg
