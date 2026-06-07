export function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
	for (const source of sources) {
		if (source) {
			for (const key of Object.keys(source) as (keyof T)[]) {
				const value = source[key];
				if (value !== null && typeof value === "object" && !Array.isArray(value)) {
					if (!target[key] || typeof target[key] !== "object") {
						target[key] = {} as T[keyof T];
					}
					deepMerge(target[key] as Record<string, unknown>, value as Record<string, unknown>);
				} else {
					target[key] = value as T[keyof T];
				}
			}
		}
	}

	return target;
}
