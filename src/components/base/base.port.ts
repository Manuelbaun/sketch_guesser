export interface BasePort<T> {
	get<K extends keyof T>(key: K): T[K];
	set<K extends keyof T>(key: K, value: T[K]): void;

	entries<T extends { [key: string]: any }, K extends keyof T>(o: T): [keyof T, T[K]][];
}
