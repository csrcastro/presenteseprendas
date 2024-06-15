export const loader = async () => {
	const sitemaps = [
		'/sitemap_static.xml',
		'/sitemap_guias.xml',
		'/sitemap_promocoes.xml',
		'/sitemap_categorias.xml',
		'/sitemap_lojas.xml',
		'/sitemap_autores.xml',
		'/sitemap_paginas.xml',
	]

	const sitemap_entries = sitemaps.map((sitemap: string) => {
		return `<sitemap><loc>${ENV.BASE_URL}${sitemap}</loc></sitemap>`
	})

	const response = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap_entries.join('')}
    </sitemapindex>`

	return new Response(response, {
		status: 200,
		headers: {
			'Content-Type': 'application/xml',
			'xml-version': '1.0',
			encoding: 'UTF-8',
			'Cache-Control': `public, max-age=${60 * 5}`,
		},
	})
}
