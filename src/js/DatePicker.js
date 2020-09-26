import Events from './Events'
export class DatePicker extends Events {
	constructor(element, year, month) {
		super()
		this.element =
			typeof element === 'string' ? document.querySelector(element) : element
		this.year = year || new Date().getFullYear()
		this.month = month || new Date().getMonth()
		this.date = {
			from: {},
			to: {},
		}
		this.events = {
			DATE_SELECTED: new CustomEvent('selected'),
		}
		this.#init()
	}

	#amountDaysInMonth(month, year) {
		return new Date(year, month + 1, 0).getDate()
	}

	// Helper function fro getCalendar method
	#addDays(start, count, element, decor) {
		for (let i = 0; i < count; i++) {
			const newEl = document.createElement('span')
			newEl.innerText = start + i
			if (decor) newEl.classList.add('datepicker__dayNumbers-decor')
			else newEl.classList.add('datepicker__dayNumbers-day')
			if (!decor)
				newEl.addEventListener('click', (e) => {
					this.#selectDay(e)
					this.#showGradient()
				})
			element.appendChild(newEl)
		}
	}
	#clearGradient() {
		const gradientEls = this.element.querySelectorAll(
			'.datepicker__dayNumbers-day'
		)
		for (let el of gradientEls) {
			el.classList.remove('datepicker__dayNumbers-day_gradient')
			el.classList.remove('datepicker__dayNumbers-day_gradient-start')
			el.classList.remove('datepicker__dayNumbers-day_gradient-end')
		}
	}
	/**
	 * Paints gradient from date 'from' to date 'to'
	 */
	#showGradient() {
		this.#clearGradient()
		if (!this.date.from.value || !this.date.to.value) return
		const els = this.element.querySelectorAll('.datepicker__dayNumbers-day')
		for (let i = 0, paint = false; i < els.length; i++) {
			if (this.date.to.value.getMonth() > this.date.from.value.getMonth())
				paint = true
			if (els[i] === this.date.to.element) {
				els[i].classList.add('datepicker__dayNumbers-day_gradient-end')
				break
			}
			if (paint) {
				els[i].classList.add('datepicker__dayNumbers-day_gradient')
			}
			if (els[i] === this.date.from.element) {
				paint = true
				els[i].classList.add('datepicker__dayNumbers-day_gradient-start')
			}
		}
	}
	/***
	 * Check if current month has selected day for applying styling
	 */
	#hasSelected(date) {
		const month = date.getMonth()
		const year = date.getFullYear()
		let newEl = false
		if (month === this.month && year === this.year) {
			const els = this.element.querySelectorAll('.datepicker__dayNumbers-day')

			for (let el of els) {
				if (el.innerText == date.getDate()) {
					el.classList.add('datepicker__dayNumbers-day_selected')
					newEl = el
				}
			}
		}
		return newEl
	}
	/***
	 * Handler for user click on day number
	 */
	#selectDay(e) {
		e.preventDefault()
		const selectedDate = new Date(this.year, this.month, +e.target.innerText)

		if (!this.date.from.value) {
			this.date.from.value = selectedDate
			this.date.from.element = e.target
			e.target.classList.add('datepicker__dayNumbers-day_selected')
			if (selectedDate > this.date.to.value) {
				this.date.to.value = undefined
				this.date.to.element.classList.remove(
					'datepicker__dayNumbers-day_selected'
				)
				this.date.to.element = undefined
			}
			this.emit('from', {
				from: this.date.from.value,
				to: this.date.to.value,
			})
			return
		}
		if (selectedDate.getTime() === this.date.from.value.getTime()) {
			this.date.from.value = undefined
			this.date.from.element = undefined
			e.target.classList.remove('datepicker__dayNumbers-day_selected')
			this.emit('from', {
				from: this.date.from.value,
				to: this.date.to.value,
			})
			return
		}
		if (this.date.from.value < selectedDate) {
			if (!!this.date.to.element)
				this.date.to.element.classList.remove(
					'datepicker__dayNumbers-day_selected'
				)
			e.target.classList.add('datepicker__dayNumbers-day_selected')
			this.date.to.value = selectedDate
			this.date.to.element = e.target
			this.emit('to', {
				from: this.date.from.value,
				to: this.date.to.value,
			})
			return
		} else {
			if (!!this.date.from.element)
				this.date.from.element.classList.remove(
					'datepicker__dayNumbers-day_selected'
				)
			e.target.classList.add('datepicker__dayNumbers-day_selected')
			this.date.from.value = selectedDate
			this.date.from.element = e.target
			this.emit('from', {
				from: this.date.from.value,
				to: this.date.to.value,
			})
			return
		}
	}
	/* Add days numbers into element based on current month and year*/
	#genCalendar() {
		const dayNumbersElement = this.element.querySelector(
			'.datepicker__dayNumbers'
		)
		const daysInCurrentMonth = this.#amountDaysInMonth(this.month, this.year)
		const daysInPreviousMonth = this.#amountDaysInMonth(
			this.month - 1,
			this.year
		)
		const freeSpaceBefore = new Date(this.year, this.month, 1).getDay()
		const freeSpaceAfter = 35 - freeSpaceBefore - daysInCurrentMonth
		dayNumbersElement.innerHTML = ''
		this.#addDays(
			daysInPreviousMonth - freeSpaceBefore,
			freeSpaceBefore,
			dayNumbersElement,
			true
		)
		this.#addDays(1, daysInCurrentMonth, dayNumbersElement, false)
		this.#addDays(1, freeSpaceAfter, dayNumbersElement, true)
		this.#setControlInfo()
		if (!!this.date.from.value) {
			const newEl = this.#hasSelected(this.date.from.value)
			if (newEl) this.date.from.element = newEl
		}
		if (!!this.date.to.value) {
			const newEl = this.#hasSelected(this.date.to.value)
			if (newEl) this.date.to.element = newEl
		}
		this.#showGradient()
	}

	/**
	 * Method for seting current month name and year number
	 * when changing current month or year
	 */
	#setControlInfo() {
		const controlElement = this.element.querySelector(
			'.datepicker__controls-info'
		)
		controlElement.innerHTML = ''
		const newEl = document.createElement('span')
		newEl.innerText = `${new Date(
			this.year,
			this.month
		).toLocaleString('default', { month: 'long' })} ${this.year}`
		controlElement.appendChild(newEl)
	}

	// Controls click handlers
	#next() {
		if (this.month === 11) {
			this.year++
			this.month = 0
		} else this.month++
		this.#genCalendar()
	}
	#previous() {
		if (this.month === 0) {
			this.year--
			this.month = 11
		} else this.month--
		this.#genCalendar()
	}
	close() {
		this.emit('cancel')
		this.date = {
			from: {},
			to: {},
		}
		this.active = false
		this.element.classList.add('datepicker_hidden')
	}

	open(date) {
		if (date) {
			this.date = {
				from: {
					value: date.from,
				},
				to: {
					value: date.to,
				},
			}
			this.year = date.from.getFullYear()
			this.month = date.from.getMonth()
		}
		this.active = true
		this.#genCalendar()
		this.element.classList.remove('datepicker_hidden')
	}
	#init() {
		this.#genCalendar()
		this.element
			.querySelector('.datepicker__back')
			.addEventListener('click', () => {
				this.#previous()
			})
		this.element
			.querySelector('.datepicker__forward')
			.addEventListener('click', () => {
				this.#next()
			})
		this.element
			.querySelector('.datepicker__submit')
			.addEventListener('click', () => {
				if (!this.date.from.value || !this.date.to.value) return
				this.emit('submit', {
					from: this.date.from.value,
					to: this.date.to.value,
				})
				this.close()
			})
		this.element
			.querySelector('.datepicker__cancel')
			.addEventListener('click', () => {
				this.close()
			})
	}
}

export default DatePicker
