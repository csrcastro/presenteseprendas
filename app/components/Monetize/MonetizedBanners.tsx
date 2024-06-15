import config from '../../config'
import imagemtemu from '../../images/presentes-temu.png'
import sprite from '../../sprites/sprite.svg'

const {
	svg: { defaults },
} = config

export default function MonetizedBanners() {
	return (
		<div className="hidden sm:block">
			<span className="block text-center text-xs font-bold uppercase text-text-light">
				Publicidade
			</span>
			<div className="mx-auto mt-6 max-w-[260px] rounded-md bg-white p-4 shadow-md lg:max-w-[332px]">
				<a rel="sponsored" href="https://temu.to/m/ezja6iomcym" target="_blank">
					<div className="bg-gradient-to-tr from-[#FFD3BA] via-[#FFF1C3] to-[#FFCBAB] p-2">
						<img
							src={imagemtemu}
							className="mx-auto h-auto w-32"
							alt="Prendas gratuitas Temu"
							title=" Descobre as prendas gratuitas da Temu"
						/>
						<h4 className="mb-2 text-center font-serif text-2xl font-black text-warm">
							Prendas Gratuitas
						</h4>
						<svg
							{...defaults}
							className={`mx-auto mb-2 h-20 w-20 fill-[#fb7701]`}
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<use xlinkHref={`${sprite}#temu`} />
						</svg>
						<div className="text-center text-xs font-bold text-text-light">
							para novos utilizadores da aplicação TEMU
						</div>
					</div>
				</a>
			</div>
			<div className="mx-auto mt-6 max-w-[260px] rounded-md bg-white p-4 shadow-md lg:max-w-[332px]">
				<a
					rel="sponsored"
					href="https://www.awin1.com/cread.php?s=3398229&v=54171&q=465991&r=1450658"
					target="_blank"
				>
					<img
						width={300}
						height={600}
						className="w-full"
						alt="O seu Spa privado em casa - Bestway"
						src="https://www.awin1.com/cshow.php?s=3398229&v=54171&q=465991&r=1450658"
					/>
				</a>
			</div>
			<div className="mx-auto mt-6 max-w-[260px] rounded-md bg-white p-4 shadow-md lg:max-w-[332px]">
				<a
					rel="sponsored"
					href="https://www.awin1.com/cread.php?s=3209351&v=20983&q=399162&r=1450658"
					target="_blank"
				>
					<img
						width={300}
						height={250}
						className="w-full"
						alt="Ofertas destacadas - PcComponentes"
						src="https://www.awin1.com/cshow.php?s=3209351&v=20983&q=399162&r=1450658"
					/>
				</a>
			</div>
			<div className="mx-auto mt-6 max-w-[260px] rounded-md bg-white p-4 shadow-md lg:max-w-[332px]">
				<a
					rel="sponsored"
					href="https://www.awin1.com/cread.php?s=3344257&v=45793&q=459467&r=1450658"
					target="_blank"
				>
					<img
						width={300}
						height={250}
						className="w-full"
						alt="Promoções ativas Primor"
						src="https://www.awin1.com/cshow.php?s=3344257&v=45793&q=459467&r=1450658"
					/>
				</a>
			</div>
			<div className="mx-auto mt-6 max-w-[260px] rounded-md bg-white p-4 shadow-md lg:max-w-[332px]">
				<a
					rel="sponsored"
					href="https://www.awin1.com/cread.php?s=3632185&v=28903&q=438506&r=1450658"
					target="_blank"
				>
					<img
						width={336}
						height={280}
						className="w-full"
						alt="ESDEMARCA - Your partner in fashion"
						src="https://www.awin1.com/cshow.php?s=3632185&v=28903&q=438506&r=1450658"
					/>
				</a>
			</div>
		</div>
	)
}
