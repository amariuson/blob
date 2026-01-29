/**
 * Track whether form values have changed from their initial state.
 *
 * @example
 * ```svelte
 * const dirty = createDirtyTracker({ name: profile.name, email: profile.email });
 *
 * <form>
 *   <input bind:value={dirty.values.name} />
 *   <input bind:value={dirty.values.email} />
 *   <button disabled={!dirty.isDirty}>Save</button>
 * </form>
 * ```
 */
export function createDirtyTracker<T extends Record<string, unknown>>(initial: T) {
	const initialSnapshot = { ...initial };
	const values = $state({ ...initial });

	const isDirty = $derived(
		Object.keys(initialSnapshot).some((key) => values[key] !== initialSnapshot[key])
	);

	return {
		/** Current form values - bind to inputs */
		values,
		/** True if any value differs from initial */
		get isDirty() {
			return isDirty;
		},
		/** Reset to initial values */
		reset() {
			Object.assign(values, initialSnapshot);
		},
		/** Update initial snapshot (e.g., after successful save with new server data) */
		setInitial(newInitial: Partial<T>) {
			Object.assign(initialSnapshot, newInitial);
		}
	};
}
