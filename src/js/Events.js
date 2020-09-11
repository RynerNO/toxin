export class Events {
	constructor() {
		this.EVENT_LISTENERS = new Map()
	}
	emit(name, payload) {
		if (this.EVENT_LISTENERS.has(name)) {
			this.EVENT_LISTENERS.get(name).forEach((cb) => {
				cb(payload)
			})
		}
	}
	on(name, callback) {
		if (!this.#isFunction(callback)) {
			throw new Error('Callback must be a function')
		}
		if (this.EVENT_LISTENERS.has(name)) {
			this.EVENT_LISTENERS.get(name).push(callback)
		} else {
			this.EVENT_LISTENERS.set(name, [callback])
		}
	}
	#isFunction(f) {
		if (typeof f === 'function') {
			return true
		}
		return false
	}
}

export default Events
