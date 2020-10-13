export class Slider {
	constructor(slider, options = {}) {
		this.autoplay = options.autoplay === false ? false : true
		this.autoplayDelay = options.autoplayDelay || 5000
		this.infinite = options.infinite === false ? false : true
		this.slider =
			typeof slider === 'string' ? document.querySelector(slider) : slider
		this.currentSlide = 0
		this.#init()
	}
	_slideToLeft() {
		window.requestAnimationFrame(() => {
			if (
				this.currentSlide === this.slides.length - 1 ||
				this.currentSlide === 0
			) {
				return
			}
			this.currentSlide += 1
			this.slidesContainer.style.transition = 'left 0.3s linear'
			this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide
			}px`
			this.#dotsRepaint()
		})
	}
	_slideToRight() {
		window.requestAnimationFrame(() => {
			if (
				this.currentSlide === this.slides.length - 1 ||
				this.currentSlide === 0
			) {
				return
			}
			this.currentSlide -= 1
			this.slidesContainer.style.transition = 'left 0.3s linear'
			this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide
			}px`
			this.#dotsRepaint()
		})
	}
	#dotsRepaint() {
		for(let i = 0; i < this.dotsContainer.children.length; i++) {
			this.dotsContainer.children[i].classList.remove('slider__dots_active')
			if(this.infinite && (i+1) === this.currentSlide) {
				this.dotsContainer.children[i].classList.add('slider__dots_active')
				
			}
			if(this.currentSlide === i && !this.infinite) {
				this.dotsContainer.children[i].classList.add('slider__dots_active')
			}
		}
	}
	#setAutoplay() {
		this.autoplayTimeout = setTimeout(() => this._slideToLeft(), this.autoplayDelay)
	}
	#setInfinite() {
		// Clone nodes from start and end of the slider and insert
		let beforeClone = this.slides[this.slides.length - 1].cloneNode(true)
		let afterClone = this.slides[0].cloneNode(true)
		this.slidesContainer.insertBefore(beforeClone, this.slides[0])
		this.slidesContainer.appendChild(afterClone)

		// shift current slide to one because of the node insert
		this.currentSlide = 1
		this.slidesContainer.style.left = `-${
			this.slidesContainer.clientWidth * this.currentSlide
		}px`
		this.#dotsRepaint()
		// for smoth switch to start or end of the slider set it on transitionend event
		this.slidesContainer.addEventListener('transitionend', () => {
			this.slidesContainer.style.transition = 'none'

			if (this.currentSlide === this.slides.length - 1) {
				this.slidesContainer.style.left = `-${this.slidesContainer.clientWidth}px`
				this.currentSlide = 1
				this.#dotsRepaint()
			}
			if (this.currentSlide === 0) {
				this.slidesContainer.style.left = `-${
					this.slidesContainer.clientWidth * (this.slides.length - 2)
				}px `
				this.currentSlide = this.slides.length - 2
				this.#dotsRepaint()
			}
			if (this.autoplay && this.autoplayTimeout) {
				clearTimeout(this.autoplayTimeout)
				this.#setAutoplay()
			}
		})
	}
	#drag(start, end) {
		window.requestAnimationFrame(() => {
			this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide + (start - end)
			}px`
		})
	}
	#dragEnd(start, end) {
		if (end - start > 150) {
			this._slideToRight()
		} else if (end - start < -150) {
			this._slideToLeft()
		} else {
			this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide
			}px`
		}
	}
	#setDragging() {
		this.slidesContainer.setAttribute('draggable', 'true')
		let startX
		let endX
		this.slidesContainer.addEventListener('drag', (e) => {
			if (e.clientX === 0) return
			endX = e.clientX
			if (!startX) startX = endX

			this.#drag(startX, endX)
		})
		this.slidesContainer.addEventListener('dragend', (e) => {
			if (!startX) return
			this.#dragEnd(startX, endX)
			startX = undefined
			endX = undefined
		})
		this.slidesContainer.addEventListener('touchmove', (e) => {
			if (e.targetTouches[0].clientX === 0) return
			endX = e.targetTouches[0].clientX
			if (!startX) startX = endX
			this.#drag(startX, endX)
		})
		this.slidesContainer.addEventListener('touchend', (e) => {
			if (!startX) return
			this.#dragEnd(startX, endX)
			startX = undefined
			endX = undefined
		})
	}
	#init() {
		this.slidesContainer = this.slider.querySelector('.slider__slides')
		this.slides = this.slidesContainer.children
		this.dotsContainer = this.slider.querySelector('.slider__dots')
		for(let i = 0; i < this.slides.length; i++) {
			let dot = document.createElement('i')
			if(i === this.currentSlide) {
				dot.classList.add('slider__dots_active')
			}
			dot.addEventListener('click', () => {
				this.currentSlide = (this.infinite) ? i + 1 : i
				this.slidesContainer.style.transition = 'left 0.3s linear'
				this.slidesContainer.style.left = `-${
				this.slidesContainer.clientWidth * this.currentSlide
			}px`
				this.#dotsRepaint()
			})
			this.dotsContainer.appendChild(dot)
		}
		if (this.infinite) {
			this.#setInfinite()
		}
		this.arrowLeft = this.slider
			.querySelector('.slider__controls')
			.querySelector('.slider__arrow-left')
		this.arrowRigth = this.slider
			.querySelector('.slider__controls')
			.querySelector('.slider__arrow-right')

		this.arrowLeft.addEventListener('click', (e) => {
			e.preventDefault()
			this._slideToRight()
			
		})
		this.arrowRigth.addEventListener('click', (e) => {
			e.preventDefault()
			this._slideToLeft()
		})

		window.addEventListener('resize', () => {
			window.requestAnimationFrame(() => {
				for (let slide of this.slides) {
					slide.style.width = `${this.slidesContainer.clientWidth}px`
				}
				this.slidesContainer.style.left = `-${
					this.slidesContainer.clientWidth * this.currentSlide
				}px`
			})
		})
		if (this.autoplay) {
			this.#setAutoplay()
		}
		this.#setDragging()
	}
}

export default Slider