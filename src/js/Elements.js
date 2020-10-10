import DatePicker from './DatePicker'
import Events from './Events'
import slider from 'nouislider'
export class Elements {
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
	static RichChecklist(id) {
		return new RichChecklist(id)
	}
	static RateButton(id) {
		return new RateButton(id)
	}
	static RangeSlider(id,  options) {
		return new RangeSlider(id,  options)
	}
	static LikeBtn(el) {
		return new LikeBtn(el)
	}
	static Pagination(id) {
		return new Pagination(id)
	}
}
export default Elements

class ElementsBase extends Events {
	constructor() {
		super()
	}
}
class DropdownDate extends ElementsBase {
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
			this.hide()
		})
		calendar.on('cancel', () => {
			const placeholder = 'ДД.ММ.ГГГГ'
			if (this.date) {
				this.#setTextDateFrom(this.date)
				this.#setTextDateTo(this.date)
				this.hide()
				return
			}
			this.#setTextDateFrom(placeholder)
			this.#setTextDateTo(placeholder)
			this.hide()
			
		})
		this.callendarContainer = this.wrapper.querySelector('.dateDropdown__calendar')
		const buttons = this.wrapper.querySelectorAll('.dateDropdown__button')
		for (let button of buttons) {
			button.addEventListener('click', (e) => {
				e.preventDefault()
				if (!calendar.active) {
					calendar.open(this.date)
					this.show()
				} else {
					calendar.close()
					this.hide()
				}
			})
		}
	}
	show() {
		this.callendarContainer.classList.remove('dateDropdown__calendar_hidden')

	}
	hide() {
		this.callendarContainer.classList.add('dateDropdown__calendar_hidden')
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

class DropdownOptions extends ElementsBase {
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

class ExpandedChecklist extends ElementsBase {
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
		if(!this.contentHeight) {
			this.contentHeight = this.content.offsetHeight
		}
		this.content.style.height = "0px"
		this.#parseOptions()
		for (let [name, option] of this.options) {
			console.log(name)
			option.checkBox.addEventListener('click', () => {
				option.checked = !option.checked
				option.checkBox.classList.toggle(`checkbox_checked`)
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
				checkBox: optionEl.querySelector(`.checkbox`),
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
		this.content.style.height = `0px`
		this.expanded = false
	}
	show() {
		
		this.expand_btn.classList.add(`${this.baseClass}__button_expanded`)
		this.content.style.height = `${this.contentHeight}px`
		this.content.style.transition = `all 0.2s linear`
		this.expanded = true
	}
}

class RichChecklist extends ElementsBase {
	constructor(id) {
		super()
		this.wrapper = document.querySelector(`#${id}`)
		this.baseClass = 'richCheckbox'
		this.expanded = false
		this.#init()
	}
	#init() {
		this.#parseOptions()
		for (let [name, option] of this.options) {
			option.checkBox.addEventListener('click', () => {
				option.checked = !option.checked
				option.checkBox.classList.toggle(`checkbox_checked`)
				this.options.set(name, option)
				this.emit('check', { name, ...option })
			})
		}
	}
	#parseOptions() {
		this.options = new Map()
		let optionEls = this.wrapper.querySelectorAll(`.${this.baseClass}__option`)
		for (let optionEl of optionEls) {
			let option = {
				checkBox: optionEl.querySelector(`.checkbox`),
				checked: false,
			}
			this.options.set(optionEl.getAttribute('name'), option)
		}
	}
	getOption(name) {
		return this.options.get(name).checked
	}
}


class RateButton extends ElementsBase {
	constructor(id) {
		super()
		this.wrapper = document.querySelector(`#${id}`)
		this.baseClass = 'rateButton'
		this.#init()
	}
	#init() {
		this.#parseStars()
		for(let i =0; i < this.stars.length; i++) {
			this.stars[i].addEventListener('mouseenter', () => {
				this.#paintStars(i)
			})
			this.stars[i].addEventListener('mouseout', () => {
				this.#clearStars()
			})
			this.stars[i].addEventListener('click', () => {
				this.selectedRate = i + 1
				this.emit('rateSelect', this.selectedRate)
			})
		}
	}
	#parseStars() {
		let stars = this.wrapper.querySelectorAll('i')
		this.stars = []
		for(let star of stars) {
			this.stars.push(star)
		}
	 }
	 #clearStars() {
		for(let i =0; i < this.stars.length; i++) {
			if(i < this.selectedRate) {
				this.stars[i].innerText = "star"
				continue
			}
			this.stars[i].innerText = "star_border"
		}
	 }
	 #paintStars(idx) {
		
		 for(let i = 0; i <= idx; i++) {
			 console.log("paint")
			 
			 this.stars[i].innerText = "star"
		 }
	 }
	 setRate(rate) {
		 this.selectedRate = rate
		 this.#clearStars()
	 }
}


class RangeSlider extends ElementsBase {
	constructor(id, {min, max, start, end, step}) {
		super()
		
		this.wrapper = document.querySelector(`#${id}`)
		this.baseClass = "rangeSlider"
		this.slider = slider.create(this.wrapper.querySelector(`.${this.baseClass}__slider`), {
			start: [start , end],
			connect: true,
			step: step,
			range: {
				'min': min,
				'max': max
			}
		})
		this.#init()
	}
	#init() {
	
		this.valuesEl = this.wrapper.querySelector(`.${this.baseClass}__values`)
		this.currency = this.wrapper.querySelector(`.${this.baseClass}__currency`).innerText
		this.slider.on('update', () => {
			
			this.#setValues()
		})
	}
	#setValues() {
		let values = this.slider.get()
		
		this.valuesEl.innerText = `${Math.ceil(values[0])}${this.currency} - ${Math.ceil(values[1])}${this.currency}`
	} 
}


class LikeBtn extends ElementsBase {
	constructor(el) {
		super()
		this.wrapper = el
		this.baseClass = "likeBtn"
		this.#init()
	}
	#init() {
		this.liked = this.wrapper.getAttribute("liked") || "false"
		this.likes = Number(this.wrapper.getAttribute("likes")) || 0
		this.likesCounter = this.wrapper.querySelector(`span`)
		this.icon = this.wrapper.querySelector(`i`)
		this.#setLikesAmmount()
		this.#setVisual()
		this.wrapper.addEventListener("click", () => {
			if(this.liked === "true") {
				this.likes -= 1
				this.liked = "false"
			} else {
				this.likes += 1
				this.liked = "true"
			}
			this.#setLikesAmmount()
			this.#setVisual()
		})
	}
	#setLikesAmmount() {
		this.likesCounter.innerText = this.likes
	}
	#setVisual() {
		if(this.liked === "true") {
			this.wrapper.classList.add('likeBtn__active')
			this.likesCounter.style.color = "#BC9CFF"
			this.icon.style.color = "#BC9CFF"
			this.icon.innerText = "favorite"
			
		} else {
			this.wrapper.classList.remove('likeBtn__active')
			this.likesCounter.style.color = "rgba(31, 32, 65, 0.25)"
			this.icon.style.color = "rgba(31, 32, 65, 0.25)"
			this.icon.innerText = "favorite_border"
		
		}
	}
}

class Pagination extends ElementsBase {
	constructor(id) {
		super()
		this.wrapper = document.querySelector(`#${id}`)
		this.baseClass = "pagination"
		this.#init() 
	}
	#init() {
		
		this.#reinitPagination()
		
		

	}
	#reinitPagination() {
		let pages = this.wrapper.getAttribute('pages')
		let currentPage = +this.wrapper.getAttribute('current-page') || 1
		this.wrapper.innerHTML = ""
		let prevPage = ((currentPage - 1) === 0) ? 1 : currentPage - 1
		let nextPage = ((currentPage + 1) >= pages) ? pages : currentPage + 1

		let prev = document.createElement('span')
		let next = document.createElement('span')
		let current = document.createElement('span')
		let first = document.createElement('span')
		let last = document.createElement('span')
		let dots1 = document.createElement('span')
		let dots2 = document.createElement('span')
		let arrowNext = document.createElement('i')
		prev.classList.add(`${this.baseClass}__item`)
		next.classList.add(`${this.baseClass}__item`)
		current.classList.add(`${this.baseClass}__item`)
		first.classList.add(`${this.baseClass}__item`)
		last.classList.add(`${this.baseClass}__item`)
		dots1.classList.add(`${this.baseClass}__item`, `${this.baseClass}__dots`)
		dots2.classList.add(`${this.baseClass}__item`, `${this.baseClass}__dots`)
		arrowNext.classList.add(`${this.baseClass}__item`, 'material-icons')
		arrowNext.innerText = "arrow_forward"
		dots1.innerText = '...'
		dots2.innerText = '...'
		first.innerText = 1
		last.innerText = pages
		prev.innerText = prevPage
		current.innerText = currentPage
		next.innerText = nextPage
		arrowNext.addEventListener('click', () => {
			let page = currentPage + 1
			this.#changePage(page)
		})
		prev.addEventListener('click', () => {
			let page = +prev.innerText
			this.#changePage(page)
		})
		next.addEventListener('click', () => {
			let page = +next.innerText
			this.#changePage(page)
		})
		last.addEventListener('click', () => {
			this.#changePage(15)
		})
		first.addEventListener('click', () => {
			this.#changePage(1)
		})
		current.classList.add(`${this.baseClass}__current`)
		if(currentPage == 1) {
			this.wrapper.appendChild(current)
			prev.innerText = nextPage
			next.innerText = nextPage + 1
			this.wrapper.appendChild(prev)
			this.wrapper.appendChild(next)
		}
		if(prevPage == 1 && currentPage != 1) {
			this.wrapper.appendChild(prev)
			this.wrapper.appendChild(current)		
			this.wrapper.appendChild(next)
		}
		if(prevPage != 1) {
			this.wrapper.appendChild(first)
			this.wrapper.appendChild(dots1)
			this.wrapper.appendChild(prev)
			this.wrapper.appendChild(current)
			if(currentPage != pages) {
				this.wrapper.appendChild(next)
			}
		}
		if(nextPage != pages) {
			this.wrapper.appendChild(dots2)
			this.wrapper.appendChild(last)
			
		}
		if(currentPage != pages) {
			this.wrapper.appendChild(arrowNext)
		}
		
	}
	#changePage(page) {
		let currentPage = +this.wrapper.getAttribute('current-page') || 1
		if(currentPage == page) return

		this.wrapper.setAttribute('current-page', page)
		this.#reinitPagination()
	}
}