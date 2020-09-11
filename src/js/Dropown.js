export class Dropdown {
	constructor(dropdownClassName) {
		this.dropdownEls = document.querySelectorAll(`.${dropdownClassName}`)
	}
	init() {
		for (let el of this.dropdownEls) {
			const dropdownItems = el.querySelector('.dropdown__items')
			dropdownItems.style.transform = `translate3d(0px, ${el.clientHeight}px, 0px)`
			console.log(`translate3d(0px, ${el.clientHeight}px, 0px)`)
			el.addEventListener('click', (e) => {
				if (el.getAttribute('data-expanded') === 'false') {
					el.setAttribute('data-expanded', 'true')
					return dropdownItems.classList.add('dropdown__items-visible')
				}
				dropdownItems.classList.remove('dropdown__items-visible')
				el.setAttribute('data-expanded', 'false')
			})
		}
	}
}
export default Dropdown
