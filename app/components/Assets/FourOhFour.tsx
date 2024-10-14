import { type SVGProps } from 'react'
import config from '../../config'
const {
	svg: { defaults },
} = config
function FourOhFour({ className }: SVGProps<SVGSVGElement>) {
	return (
		<svg className={className} viewBox="0 0 279 112" {...defaults}>
			<path
				d="M67.536 46.656c0-2.208.048-4.392.144-6.552.096-2.16.144-4.344.144-6.552 0-1.92-.072-4.368-.216-7.344a43.871 43.871 0 0 0-1.296-8.712c-.72-2.832-1.848-5.256-3.384-7.272C61.392 8.208 59.28 7.2 56.592 7.2H41.904c-1.824 0-3.984 1.008-6.48 3.024-2.496 2.016-5.088 4.632-7.776 7.848-2.688 3.216-5.352 6.792-7.992 10.728-2.64 3.936-5.016 7.8-7.128 11.592-2.112 3.792-3.816 7.272-5.112 10.44C6.12 54 5.472 56.448 5.472 58.176c0 2.976.12 5.664.36 8.064.24 2.4.84 4.44 1.8 6.12.96 1.68 2.376 2.976 4.248 3.888 1.872.912 4.488 1.368 7.848 1.368 2.208 0 4.44-.072 6.696-.216 2.256-.144 4.488-.216 6.696-.216 0 2.688.216 5.136.648 7.344.432 2.208 1.176 4.08 2.232 5.616 1.056 1.536 2.544 2.712 4.464 3.528 1.92.816 4.416 1.224 7.488 1.224 3.648 0 6.72-.12 9.216-.36 2.496-.24 4.512-.936 6.048-2.088 1.536-1.152 2.64-2.88 3.312-5.184.672-2.304 1.008-5.472 1.008-9.504 2.304 0 4.152-.432 5.544-1.296 1.392-.864 2.448-1.992 3.168-3.384.72-1.392 1.2-2.976 1.44-4.752.24-1.776.36-3.576.36-5.4a55.07 55.07 0 0 0-.288-5.76c-.192-1.824-.648-3.48-1.368-4.968a9.343 9.343 0 0 0-3.168-3.672c-1.392-.96-3.288-1.584-5.688-1.872ZM56.592 1.728c3.552 0 6.456.984 8.712 2.952 2.256 1.968 3.96 4.536 5.112 7.704 3.648.864 6.384 2.904 8.208 6.12 1.824 3.216 3.096 6.864 3.816 10.944.72 4.08 1.08 8.208 1.08 12.384v10.584c2.304.768 4.128 1.824 5.472 3.168a14.17 14.17 0 0 1 3.096 4.608c.72 1.728 1.176 3.6 1.368 5.616.192 2.016.288 4.08.288 6.192 0 2.208-.072 4.368-.216 6.48-.144 2.112-.552 4.08-1.224 5.904-.672 1.824-1.728 3.456-3.168 4.896-1.44 1.44-3.408 2.592-5.904 3.456-.288 4.416-1.032 7.824-2.232 10.224-1.2 2.4-2.856 4.176-4.968 5.328-2.112 1.152-4.632 1.824-7.56 2.016-2.928.192-6.312.288-10.152.288-2.208 0-4.32-.168-6.336-.504-2.016-.336-3.864-.912-5.544-1.728-1.68-.816-3.144-1.968-4.392-3.456-1.248-1.488-2.208-3.384-2.88-5.688a17.94 17.94 0 0 1-4.68-2.16 11.894 11.894 0 0 1-3.672-3.744c-2.304 0-4.464-.096-6.48-.288-2.016-.192-3.864-.648-5.544-1.368-1.68-.72-3.12-1.8-4.32-3.24-1.2-1.44-2.136-3.408-2.808-5.904-2.784-.672-4.968-1.872-6.552-3.6a16.712 16.712 0 0 1-3.528-5.976C.816 70.68.36 68.256.216 65.664A135.126 135.126 0 0 1 0 58.176c0-2.016.744-4.8 2.232-8.352 1.488-3.552 3.432-7.416 5.832-11.592s5.136-8.424 8.208-12.744 6.168-8.232 9.288-11.736c3.12-3.504 6.096-6.384 8.928-8.64 2.832-2.256 5.304-3.384 7.416-3.384h14.688ZM133.92 96.192c7.776 0 13.872-1.512 18.288-4.536 4.416-3.024 7.752-6.96 10.008-11.808 2.256-4.848 3.672-10.32 4.248-16.416.576-6.096.864-12.168.864-18.216 0-5.28-.648-10.32-1.944-15.12-1.296-4.8-3.288-9.024-5.976-12.672-2.688-3.648-6.12-6.552-10.296-8.712-4.176-2.16-9.192-3.24-15.048-3.24-7.872 0-14.016 1.608-18.432 4.824-4.416 3.216-7.704 7.344-9.864 12.384-2.16 5.04-3.48 10.656-3.96 16.848-.48 6.192-.72 12.312-.72 18.36 0 5.568.576 10.68 1.728 15.336 1.152 4.656 3.024 8.688 5.616 12.096 2.592 3.408 5.976 6.072 10.152 7.992 4.176 1.92 9.288 2.88 15.336 2.88Zm10.224 15.696c-3.264 0-6.432-.264-9.504-.792a37.354 37.354 0 0 1-8.712-2.592c-2.736-1.2-5.28-2.808-7.632-4.824-2.352-2.016-4.392-4.464-6.12-7.344-3.36-2.016-6.12-4.464-8.28-7.344a35.002 35.002 0 0 1-5.04-9.432 52.252 52.252 0 0 1-2.52-10.656 85.458 85.458 0 0 1-.72-11.016c0-7.008.336-13.968 1.008-20.88.672-6.912 2.28-13.104 4.824-18.576 2.544-5.472 6.384-9.912 11.52-13.32C118.104 1.704 125.136 0 134.064 0c6.336 0 12.216 1.248 17.64 3.744 5.424 2.496 9.864 6.48 13.32 11.952 3.264 2.112 6.048 4.68 8.352 7.704a43.163 43.163 0 0 1 5.616 9.792 50.091 50.091 0 0 1 3.096 10.944c.624 3.792.936 7.56.936 11.304 0 7.104-.36 14.04-1.08 20.808-.72 6.768-2.4 12.792-5.04 18.072-2.64 5.28-6.552 9.528-11.736 12.744-5.184 3.216-12.192 4.824-21.024 4.824ZM252.144 46.656c0-2.208.048-4.392.144-6.552.096-2.16.144-4.344.144-6.552 0-1.92-.072-4.368-.216-7.344a43.871 43.871 0 0 0-1.296-8.712c-.72-2.832-1.848-5.256-3.384-7.272C246 8.208 243.888 7.2 241.2 7.2h-14.688c-1.824 0-3.984 1.008-6.48 3.024-2.496 2.016-5.088 4.632-7.776 7.848-2.688 3.216-5.352 6.792-7.992 10.728-2.64 3.936-5.016 7.8-7.128 11.592-2.112 3.792-3.816 7.272-5.112 10.44-1.296 3.168-1.944 5.616-1.944 7.344 0 2.976.12 5.664.36 8.064.24 2.4.84 4.44 1.8 6.12.96 1.68 2.376 2.976 4.248 3.888 1.872.912 4.488 1.368 7.848 1.368 2.208 0 4.44-.072 6.696-.216 2.256-.144 4.488-.216 6.696-.216 0 2.688.216 5.136.648 7.344.432 2.208 1.176 4.08 2.232 5.616 1.056 1.536 2.544 2.712 4.464 3.528 1.92.816 4.416 1.224 7.488 1.224 3.648 0 6.72-.12 9.216-.36 2.496-.24 4.512-.936 6.048-2.088 1.536-1.152 2.64-2.88 3.312-5.184.672-2.304 1.008-5.472 1.008-9.504 2.304 0 4.152-.432 5.544-1.296 1.392-.864 2.448-1.992 3.168-3.384.72-1.392 1.2-2.976 1.44-4.752.24-1.776.36-3.576.36-5.4a55.07 55.07 0 0 0-.288-5.76c-.192-1.824-.648-3.48-1.368-4.968a9.343 9.343 0 0 0-3.168-3.672c-1.392-.96-3.288-1.584-5.688-1.872ZM241.2 1.728c3.552 0 6.456.984 8.712 2.952 2.256 1.968 3.96 4.536 5.112 7.704 3.648.864 6.384 2.904 8.208 6.12 1.824 3.216 3.096 6.864 3.816 10.944.72 4.08 1.08 8.208 1.08 12.384v10.584c2.304.768 4.128 1.824 5.472 3.168a14.17 14.17 0 0 1 3.096 4.608c.72 1.728 1.176 3.6 1.368 5.616.192 2.016.288 4.08.288 6.192 0 2.208-.072 4.368-.216 6.48-.144 2.112-.552 4.08-1.224 5.904-.672 1.824-1.728 3.456-3.168 4.896-1.44 1.44-3.408 2.592-5.904 3.456-.288 4.416-1.032 7.824-2.232 10.224-1.2 2.4-2.856 4.176-4.968 5.328-2.112 1.152-4.632 1.824-7.56 2.016-2.928.192-6.312.288-10.152.288-2.208 0-4.32-.168-6.336-.504-2.016-.336-3.864-.912-5.544-1.728-1.68-.816-3.144-1.968-4.392-3.456-1.248-1.488-2.208-3.384-2.88-5.688a17.94 17.94 0 0 1-4.68-2.16 11.894 11.894 0 0 1-3.672-3.744c-2.304 0-4.464-.096-6.48-.288-2.016-.192-3.864-.648-5.544-1.368-1.68-.72-3.12-1.8-4.32-3.24-1.2-1.44-2.136-3.408-2.808-5.904-2.784-.672-4.968-1.872-6.552-3.6a16.712 16.712 0 0 1-3.528-5.976c-.768-2.256-1.224-4.68-1.368-7.272a135.126 135.126 0 0 1-.216-7.488c0-2.016.744-4.8 2.232-8.352 1.488-3.552 3.432-7.416 5.832-11.592s5.136-8.424 8.208-12.744 6.168-8.232 9.288-11.736c3.12-3.504 6.096-6.384 8.928-8.64 2.832-2.256 5.304-3.384 7.416-3.384H241.2Z"
				fillRule="nonzero"
			/>
		</svg>
	)
}

export default FourOhFour
