import config from '#app/config'
import imagemtemu from '#app/images/presentes-temu.png'
import sprite from '#app/sprites/sprite.svg'

const {
	svg: { defaults },
} = config

export default function MonetizedMobileBannerTemu() {
	return (
		<div className="mb-8">
			<span className="text-text-light block text-center text-xs font-bold uppercase">
				Publicidade
			</span>
			<div className="mx-auto mt-2 rounded-md bg-white p-4 shadow-md">
				<a rel="sponsored" href="https://temu.to/m/ezja6iomcym" target="_blank">
					<div className="bg-gradient-to-tr from-[#FFD3BA] via-[#FFF1C3] to-[#FFCBAB] p-2">
						<img
							src={imagemtemu}
							className="mx-auto h-auto w-24"
							alt="Prendas gratuitas Temu"
							title=" Descobre as prendas gratuitas da Temu"
						/>
						<h4 className="text-warm mb-2 text-center font-serif text-2xl font-black">
							Prendas Gratuitas
						</h4>
						<svg
							{...defaults}
							className={`mx-auto mb-2 h-12 w-12 fill-[#fb7701]`}
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<use xlinkHref={`${sprite}#temu`} />
						</svg>
						<div className="text-text-light text-center text-xs font-bold">
							para novos utilizadores da aplicação TEMU
						</div>
					</div>
				</a>
			</div>
		</div>
	)
}
