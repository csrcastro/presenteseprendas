import { expect, test } from '#tests/playwright-utils.ts'

test('Search from home page', async ({ page }) => {
	await page.goto('/')

	await page.getByRole('textbox', { name: /pesquisa/i }).fill('__nonexistent__')
	await page.getByRole('button', { name: 'pesquisar' }).click()

	await page.goto(`/pesquisa?pesquisa=__nonexistent__`)
	await expect(page.getByText('Guias de Presentes')).toBeVisible()
})
