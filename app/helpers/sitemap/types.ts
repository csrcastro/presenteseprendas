export interface Link {
	frequency?: string
	id?: number
	priority?: number
	published_at?: string
	full_slug?: string
	slug?: string
}

export type Links<T> = Record<string, T>
