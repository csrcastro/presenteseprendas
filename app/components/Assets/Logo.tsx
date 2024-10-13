import { type SVGProps } from 'react'
import config from '../../config'

const {
	svg: { defaults },
} = config

function Logo(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props} xmlnsXlink="http://www.w3.org/1999/xlink">
			<path
				d="M4.322 18.178c.576 0 1.085-.025 1.525-.076.441-.051.81-.174 1.106-.369.297-.195.522-.475.674-.839.153-.364.229-.869.229-1.513 0-.508-.025-1.034-.076-1.576.864 0 1.669-.178 2.415-.534a6.2 6.2 0 0 0 1.932-1.424 6.813 6.813 0 0 0 1.284-2.046c.314-.771.47-1.581.47-2.428 0-1.424-.3-2.559-.902-3.407a5.887 5.887 0 0 0-2.339-1.945c-.958-.449-2.021-.737-3.191-.864A31.773 31.773 0 0 0 4.017.966c-.627 0-1.127.123-1.5.369a2.519 2.519 0 0 0-.864.953 4.03 4.03 0 0 0-.407 1.335 11.21 11.21 0 0 0-.102 1.513c0 .542.021 1.093.064 1.652.042.559.063 1.11.063 1.653 0 1.135-.051 2.262-.152 3.381a37.226 37.226 0 0 0-.153 3.381c0 1.153.292 1.937.877 2.352.585.415 1.411.623 2.479.623Zm1.805 2.771a10.3 10.3 0 0 1-1.258-.076 4.426 4.426 0 0 1-1.17-.305 3.108 3.108 0 0 1-.966-.636c-.28-.271-.496-.635-.648-1.093-.424-.136-.771-.326-1.043-.572a2.74 2.74 0 0 1-.635-.839 3.633 3.633 0 0 1-.318-1.042A7.738 7.738 0 0 1 0 15.203c0-1.135.051-2.262.153-3.381.101-1.119.152-2.246.152-3.381 0-.56-.021-1.115-.063-1.666A21.374 21.374 0 0 1 .178 5.11c0-.678.047-1.326.14-1.945.093-.618.279-1.161.559-1.627.28-.466.67-.839 1.17-1.119C2.547.14 3.203 0 4.017 0c.83 0 1.72.034 2.669.102.95.067 1.873.216 2.772.445a9.18 9.18 0 0 1 2.504 1.042 5.705 5.705 0 0 1 1.894 1.869c1.017.661 1.737 1.487 2.161 2.478.424.992.636 2.081.636 3.267 0 .865-.153 1.708-.458 2.53a7.872 7.872 0 0 1-1.259 2.225 7.32 7.32 0 0 1-1.906 1.665 6.525 6.525 0 0 1-2.403.877c0 .915-.055 1.661-.165 2.237-.11.577-.326 1.03-.648 1.36-.322.331-.78.556-1.373.674-.594.119-1.365.178-2.314.178ZM27.89 8.72c.288-.406.504-.856.648-1.347.144-.492.216-.983.216-1.475 0-.627-.14-1.212-.419-1.754a4.739 4.739 0 0 0-1.106-1.411 5.1 5.1 0 0 0-1.564-.928 5.047 5.047 0 0 0-1.792-.33c-.644 0-1.276.106-1.894.317a5.382 5.382 0 0 0-1.653.903c-.483.39-.873.86-1.169 1.411-.297.551-.445 1.174-.445 1.869 0 .491.076.97.229 1.436.152.466.364.903.635 1.309a5.121 5.121 0 0 0-1.309 1.894 6.041 6.041 0 0 0-.445 2.276c0 .729.14 1.415.42 2.059a5.512 5.512 0 0 0 1.131 1.691 5.452 5.452 0 0 0 1.678 1.157c.644.288 1.33.432 2.059.432.61 0 1.204-.093 1.78-.28a9.495 9.495 0 0 0 1.652-.712 2.48 2.48 0 0 0 1.462.725 12.55 12.55 0 0 0 1.665.114c.272 0 .564-.017.878-.051a3.06 3.06 0 0 0 .864-.216c.263-.11.479-.271.648-.483.17-.212.255-.495.255-.851a2.15 2.15 0 0 0-.166-.814 4.43 4.43 0 0 0-.419-.788 7.859 7.859 0 0 0-.547-.725 76.394 76.394 0 0 1-.546-.648c.322-.441.61-.911.864-1.411s.381-1.03.381-1.589c0-.407-.089-.729-.267-.966a1.743 1.743 0 0 0-.686-.547 2.925 2.925 0 0 0-.915-.241 9.572 9.572 0 0 0-.979-.051c-.187 0-.377.004-.572.013a13.97 13.97 0 0 1-.572.012ZM23.873.508c1.017 0 1.987.255 2.911.763a5.906 5.906 0 0 1 2.199 2.06 6.005 6.005 0 0 1 1.856 1.868 4.65 4.65 0 0 1 .712 2.53v.216c0 .059-.009.131-.026.216.678.305 1.094.831 1.246 1.576 1.254.339 1.882 1.195 1.882 2.568a4.35 4.35 0 0 1-.28 1.551 7.273 7.273 0 0 1-.712 1.398c.373.441.703.911.992 1.411.288.5.432 1.047.432 1.64 0 .509-.102.924-.305 1.246-.204.322-.471.58-.801.775a3.387 3.387 0 0 1-1.119.407 6.833 6.833 0 0 1-1.233.114c-.593 0-1.178-.033-1.754-.101a4.039 4.039 0 0 1-1.627-.56 9.76 9.76 0 0 1-1.615.585 6.56 6.56 0 0 1-1.716.229 6.043 6.043 0 0 1-2.962-.763 6.258 6.258 0 0 1-2.25-2.084 6.224 6.224 0 0 1-2.084-2.263 6.162 6.162 0 0 1-.763-3c0-.78.123-1.543.369-2.288a5.674 5.674 0 0 1 1.156-2.009 5.796 5.796 0 0 1-.635-2.618c0-.831.173-1.585.521-2.263a5.485 5.485 0 0 1 1.373-1.729A6.133 6.133 0 0 1 21.597.89a6.944 6.944 0 0 1 2.276-.382ZM39.839 18.178c.576 0 1.085-.025 1.525-.076.441-.051.81-.174 1.106-.369.297-.195.522-.475.674-.839.153-.364.229-.869.229-1.513 0-.508-.026-1.034-.076-1.576.864 0 1.669-.178 2.415-.534a6.2 6.2 0 0 0 1.932-1.424 6.813 6.813 0 0 0 1.284-2.046c.314-.771.47-1.581.47-2.428 0-1.424-.301-2.559-.902-3.407a5.887 5.887 0 0 0-2.339-1.945c-.958-.449-2.021-.737-3.191-.864a31.773 31.773 0 0 0-3.432-.191c-.627 0-1.127.123-1.5.369a2.53 2.53 0 0 0-.865.953c-.203.39-.338.835-.406 1.335a11.21 11.21 0 0 0-.102 1.513c0 .542.021 1.093.064 1.652.042.559.063 1.11.063 1.653 0 1.135-.051 2.262-.152 3.381a37.226 37.226 0 0 0-.153 3.381c0 1.153.292 1.937.877 2.352.585.415 1.411.623 2.479.623Zm1.805 2.771a10.3 10.3 0 0 1-1.258-.076 4.426 4.426 0 0 1-1.17-.305 3.108 3.108 0 0 1-.966-.636c-.28-.271-.496-.635-.648-1.093-.424-.136-.771-.326-1.043-.572a2.74 2.74 0 0 1-.635-.839 3.633 3.633 0 0 1-.318-1.042 7.738 7.738 0 0 1-.089-1.183c0-1.135.051-2.262.152-3.381.102-1.119.153-2.246.153-3.381a21.4 21.4 0 0 0-.064-1.666 21.88 21.88 0 0 1-.063-1.665c0-.678.047-1.326.14-1.945.093-.618.279-1.161.559-1.627.28-.466.67-.839 1.17-1.119C38.064.14 38.72 0 39.534 0c.83 0 1.72.034 2.669.102.95.067 1.873.216 2.772.445a9.18 9.18 0 0 1 2.504 1.042 5.705 5.705 0 0 1 1.894 1.869c1.017.661 1.737 1.487 2.161 2.478.424.992.635 2.081.635 3.267 0 .865-.152 1.708-.457 2.53a7.872 7.872 0 0 1-1.259 2.225 7.336 7.336 0 0 1-1.906 1.665 6.531 6.531 0 0 1-2.403.877c0 .915-.055 1.661-.165 2.237-.11.577-.326 1.03-.648 1.36-.323.331-.78.556-1.373.674-.594.119-1.365.178-2.314.178Z"
				fillRule="nonzero"
			/>
		</svg>
	)
}

export default Logo
