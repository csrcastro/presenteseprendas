import { type ReactElement, type SVGProps } from 'react'
import config from '../../../config'
import sprite from '../../../sprites/sprite.svg'

const {
	svg: { defaults },
} = config
function Uau({
	className,
}: SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...defaults}
			viewBox="0 0 376 107"
			className={className}
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<use xlinkHref={`${sprite}#uau`}></use>
		</svg>
	)
}

export default Uau
