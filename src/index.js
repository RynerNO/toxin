import 'normalize.css'
import 'nouislider/distribute/nouislider.min.css'

import './styles.sass'

import imask from 'imask'

import Elements from './js/Elements'
import DatePicker from './js/DatePicker'
import Slider from './js/Slider'
// const dateMask = imask(document.getElementById('date-mask'), {
// 	mask: Date,
// 	blocks: {
// 		d: {
// 			mask: IMask.MaskedRange,
// 			from: 1,
// 			to: 31,
// 			maxLength: 2,
// 			placeholderChar: 'Д',
// 		},
// 		m: {
// 			mask: IMask.MaskedRange,
// 			from: 1,
// 			to: 12,
// 			maxLength: 2,
// 			placeholderChar: 'М',
// 		},
// 		Y: {
// 			mask: IMask.MaskedRange,
// 			from: 1900,
// 			to: 9999,
// 			placeholderChar: 'Г',
// 		},
// 	},
// 	lazy: false,
// })
// document.getElementById('date-mask').addEventListener('input', () => {
// 	console.log(dateMask.value)
// })



// const optionsDropdown = Elements.DropdownOptions('test_2')

// const expandedChecklist = Elements.ExpandedChecklist('test_3')

// const richChecklist = Elements.RichChecklist('test_4')

// const rateButton = Elements.RateButton("test_5")


// const rangeSlider = Elements.RangeSlider("test_6", {min: 1000, max: 16000, start: 5000, end: 15000, step: 1000})

// const likeBtns = document.querySelectorAll('.likeBtn')

// for(let likeBtn of likeBtns) {
// 	Elements.LikeBtn(likeBtn)
// }

// const pagination = Elements.Pagination('test_8')

// const toggle = Elements.Toggle('test_9', false)

// const sliders = document.querySelectorAll('.slider')

// for(const slider of sliders) {
// 	new Slider(slider, {
// 		autoplay: false
// 	})
// }
// const roomCards = document.querySelectorAll('.roomCard')

// for(let i = 0; i < roomCards.length; i++) {
// 	const rate = roomCards[i].getAttribute('rate')
// 	const rateButton = roomCards[i].querySelector('.rateButton')
// 	Elements.RateButton(rateButton, rate)
// }

const mobileMenu = document.querySelector('.header__mobile-menu')
const mobileMenuButton = document.querySelector('.header__mobile-button')
mobileMenuButton.addEventListener('click', () => {
	mobileMenu.classList.toggle('header__mobile-menu_visible')
})
const mobileMenuCloseButton = mobileMenu.querySelector('.header__mobile-menu-top button')
mobileMenuCloseButton.addEventListener('click', () => {
	mobileMenu.classList.toggle('header__mobile-menu_visible')
})

const dateDropdown = Elements.DropdownDate('landing_date')
const optionsDropdown = Elements.DropdownOptions('landing_options')
