import DatePicker from './DatePicker'
import Events from './Events'
export class Dropdown {
	constructor() {}
	static DropdownDate(id) {
		return new DropdownDate(id)
	}
	static DropdownOptions(id) {
		return new DropdownOptions(id)
	}

	static ExpandedChecklist(id) {
		return new ExpandedChecklist(id)
	}
}
export default Dropdown

class DropdownBase extends Events {
	constructor() {
		super()
	}
}
class DropdownDate extends DropdownBase {
	constructor(id) {
		super()
		this.id = id
		this.wrapper = document.querySelector(`#${id}`)
		this.#init(id)
	}
	#init(id) {
		const calendar = new DatePicker(this.wrapper.querySelector(`#${id}_cal`))
		calendar.on('from', (date) => {
			this.#setTextDateFrom(date)
		})
		calendar.on('to', (date) => {
			this.#setTextDateTo(date)
		})
		calendar.on('submit', (date) => {
			this.#setTextDateFrom(date)
			this.#setTextDateTo(date)
			this.date = date
			this.emit('change', this.date)
		})
		calendar.on('cancel', () => {
			const placeholder = 'ДД.ММ.ГГГГ'
			if (this.date) {
				this.#setTextDateFrom(this.date)
				this.#setTextDateTo(this.date)
				return
			}
			this.#setTextDateFrom(placeholder)
			this.#setTextDateTo(placeholder)
		})
		const buttons = this.wrapper.querySelectorAll('.DropdownDate__button')
		for (let button of buttons) {
			button.addEventListener('click', (e) => {
				e.preventDefault()
				if (!calendar.active) {
					calendar.open(this.date)
				} else calendar.close()
			})
		}
	}
	#setTextDateFrom(date) {
		const from = this.wrapper.querySelector(`#${this.id}_from`)
		if (typeof date === 'string') from.innerText = date
		if (!date.from) return

		const day = date.from.getDate()
		const month = date.from.getMonth() + 1
		const year = date.from.getFullYear()

		from.innerText = `${day
			.toString()
			.padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`
	}
	#setTextDateTo(date) {
		console.log(typeof date)
		const to = this.wrapper.querySelector(`#${this.id}_to`)
		if (typeof date === 'string') to.innerText = date
		if (!date.to) return

		const day = date.to.getDate()
		const month = date.to.getMonth() + 1
		const year = date.to.getFullYear()
		to.innerText = `${day
			.toString()
			.padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`
	}
	hasDate() {
		if (!this.date) return false
		return true
	}
	getDate() {
		return this.date
	}
}

class DropdownOptions extends DropdownBase {
	constructor(id) {
		super()
		this.wrapper = document.querySelector(`#${id}`)
		this.baseClass = 'dropdownOptions'
		this.hideClass = `${this.baseClass}_hidden`
		this.disabledClass = `${this.baseClass}__icon_disabled`
		this.clearButton = this.wrapper.querySelector(`.${this.baseClass}__clear`)
		this.confirmButton = this.wrapper.querySelector(
			`.${this.baseClass}__confirm`
		)
		this.visible = false
		this.data = []
		this.#init()
	}
	#init() {
		this.content = this.wrapper.querySelector(`.${this.baseClass}__content`)

		let dropdown_btn = this.wrapper.querySelector(`.${this.baseClass}__button`)
		dropdown_btn.addEventListener('click', (e) => {
			e.preventDefault()
			if (this.visible) return this.hide()
			this.show()
		})
		this.dropdownBtnText = dropdown_btn.querySelector('span')
		this.deffaultText = this.dropdownBtnText.innerText
		this.#parseOptions()
		this.#checkOptions()
		this.on('change', () => {
			this.#checkOptions()
		})
		for (let [name, option] of this.options) {
			console.log(name)
			option.buttonDecr.addEventListener('click', () => {
				this.#decrOption(name)
			})
			option.buttonIncr.addEventListener('click', () => {
				this.#incrOption(name)
			})
		}
		this.clearButton.addEventListener('click', () => {
			this.clear()
		})
		this.confirmButton.addEventListener('click', () => {
			this.emit('confirm', this.options)
			this.hide()
		})
	}
	#parseOptions() {
		this.options = new Map()
		let optionsEls = this.wrapper.querySelectorAll(`.${this.baseClass}__option`)
		for (const optionEl of optionsEls) {
			this.options.set(optionEl.getAttribute('name'), {
				count: 0,
				text: optionEl.querySelector(`.${this.baseClass}__option-text`)
					.innerText,
				buttonDecr: optionEl.querySelector(`.${this.baseClass}__decr`),
				counter: optionEl.querySelector(`.${this.baseClass}__option-counter`),
				buttonIncr: optionEl.querySelector(`.${this.baseClass}__incr`),
			})
		}
	}
	#checkOptions() {
		let showClear = false
		let text = ''
		for (let [name, option] of this.options) {
			if (option.count > 0) {
				showClear = true
				option.buttonDecr.classList.remove(this.disabledClass)
				if (text.length > 0) text += `, ${option.count} ${option.text}`
				else text = `${option.count} ${option.text}`
			} else {
				option.buttonDecr.classList.add(this.disabledClass)
			}
			this.dropdownBtnText.innerText =
				text.length > 0 ? text : this.deffaultText
		}
		if (showClear) {
			this.clearButton.classList.remove(this.hideClass)
		} else {
			this.clearButton.classList.add(this.hideClass)
		}
	}
	#incrOption(name) {
		console.log('incr')
		let option = this.options.get(name)

		option.count += 1

		option.counter.innerText = option.count
		this.options.set(name, option)
		this.emit('change', name)
	}
	#decrOption(name) {
		let option = this.options.get(name)
		if (option.count == 0) return
		option.count -= 1
		option.counter.innerText = option.count
		this.options.set(name, option)
		this.emit('change', name)
	}
	getOption(name) {
		if (!name) return this.options
		return this.options.get(name)
	}
	clear() {
		for (let [name, option] of this.options) {
			option.count = 0
			option.counter.innerText = 0
			this.options.set(name, option)
		}
		this.#checkOptions()
	}
	show() {
		this.content.classList.remove(this.hideClass)
		this.visible = true
	}

	hide() {
		this.content.classList.add(this.hideClass)
		this.visible = false
	}
}

class ExpandedChecklist extends DropdownBase {
	constructor(id) {
		super()
		this.wrapper = document.querySelector(`#${id}`)
		this.baseClass = 'expCheckbox'
		this.expanded = false
		this.#init()
	}
	#init() {
		this.expand_btn = this.wrapper.querySelector(`.${this.baseClass}__button`)
		this.expand_btn.addEventListener('click', () => {
			if (this.expanded) return this.hide()
			this.show()
		})

		this.content = this.wrapper.querySelector(`.${this.baseClass}__content`)

		this.#parseOptions()
		for (let [name, option] of this.options) {
			console.log(name)
			option.checkBox.addEventListener('click', () => {
				option.checked = !option.checked
				option.checkBox.classList.toggle(`${this.baseClass}__checkbox_checked`)
				this.options.set(name, option)
				this.emit('check', { name, ...option })
			})
		}
	}
	#parseOptions() {
		this.options = new Map()
		let optionEls = this.content.querySelectorAll(`.${this.baseClass}__option`)
		for (let optionEl of optionEls) {
			let option = {
				checkBox: optionEl.querySelector(`.${this.baseClass}__checkbox`),
				checked: false,
			}
			this.options.set(optionEl.getAttribute('name'), option)
		}
	}
	getOption(name) {
		return this.options.get(name).checked
	}
	hide() {
		this.expand_btn.classList.remove(`${this.baseClass}__button_expanded`)
		this.content.classList.add(`${this.baseClass}__content_hidden`)
		this.expanded = false
	}
	show() {
		this.expand_btn.classList.add(`${this.baseClass}__button_expanded`)
		this.content.classList.remove(`${this.baseClass}__content_hidden`)
		this.expanded = true
	}
}
