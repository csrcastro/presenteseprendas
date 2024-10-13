import { type SbBlokData } from '@storyblok/react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichContentGuia from './Helpers/RichContentGuia'

export interface IBlok extends SbBlokData {
	Copy: StoryblokRichtext
}

export default function PerguntasFrequentes({
	perguntas,
}: {
	perguntas: IBlok[]
}) {
	return (
		<section className="mx-auto my-16 max-w-3xl px-8">
			<h3 className="heading-large pb-8 pt-0 text-cold">
				Perguntas e respostas sobre
				<br />
				presentes e prendas
			</h3>

			{perguntas.map((nestedBlok: IBlok, index: number) => (
				<dl key={`faq-${index}`}>
					<dt className="font-serif text-xl mb-4 text-cold">
						{`${nestedBlok.Title}`}
					</dt>
					<dd>
						<RichContentGuia document={nestedBlok.Copy} />
					</dd>
				</dl>
			))}

			<p className="mb-8">
				Presentes e prendas originais servem como veículos de comunicação e
				expressão de emoções, desempenhando um papel relevante nos
				relacionamentos humanos e interações sociais.
			</p>
			<p className="mb-8">
				Existem várias alturas em que um presente pode ser apropriado. Por
				exemplo, um presente de agradecimento pode ser uma ótima maneira de
				mostrar a sua apreciação por alguém que fez algo especial por si. Um
				presente de despedida pode ser uma maneira carinhosa de dizer adeus a um
				colega de trabalho ou amigo que está a mudar-se, e um presente de
				boas-vindas pode ser uma maneira calorosa de receber alguém a um novo
				lar ou trabalho.
			</p>
			<p className="mb-8">
				Aqui na Presentes e Prendas exploramos o universo dos presentes, dando
				dicas e sugestões para te ajudar a escolher os presentes ideais para
				cada pessoa e cada ocasião.
			</p>
			<p className="font-serif my-16 px-10 text-center text-5xl text-warm">
				Boas Prendas!
			</p>
		</section>
	)
}
