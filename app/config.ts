const svgDefaults: {
	clipRule?: number | string | undefined
	fillRule?: 'nonzero' | 'evenodd' | 'inherit' | undefined
	strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined
	strokeMiterlimit?: number | string | undefined
	xmlns?: string | undefined
	xmlSpace?: string | undefined
} = {
	clipRule: 'evenodd',
	fillRule: 'evenodd',
	strokeLinejoin: 'round',
	strokeMiterlimit: '2',
	xmlns: 'http://www.w3.org/2000/svg',
	xmlSpace: 'preserve',
}

const listParams: {
	sort_by: string
	is_startpage: boolean
	per_page: number
} = {
	sort_by: 'first_published_at:desc',
	is_startpage: false,
	per_page: 8,
}

export default {
	sb: {
		listParams,
	},
	img: {
		format: `/smart/filters:format(webp)`,
	},
	svg: {
		defaults: svgDefaults,
	},
	sd: {
		name: 'Presentes e Prendas',
		logoPath: 'https://presenteseprendas.pt/presenteseprendas.png',
		sameAs: [
			'https://www.facebook.com/presenteprendas',
			'https://www.instagram.com/presenteseprendas',
			'https://www.twitter.com/presenteprendas',
			'https://www.youtube.com/@presenteseprendas',
			'https://www.pinterest.pt/presenteseprendas',
		],
		description:
			'A Presentes e Prendas quer-te inspirar na hora de encontrar presentes e prendas. Temos para ti guias de presentes originais, ideias de prendas e promoções que não vais querer perder.',
	},
}
