import 'normalize.css'
import 'nouislider/distribute/nouislider.min.css'
import './styles.sass'

import imask from 'imask'

import Elements from './js/Elements'
import DatePicker from './js/DatePicker'

const dateMask = imask(document.getElementById('date-mask'), {
	mask: Date,
	blocks: {
		d: {
			mask: IMask.MaskedRange,
			from: 1,
			to: 31,
			maxLength: 2,
			placeholderChar: 'Д',
		},
		m: {
			mask: IMask.MaskedRange,
			from: 1,
			to: 12,
			maxLength: 2,
			placeholderChar: 'М',
		},
		Y: {
			mask: IMask.MaskedRange,
			from: 1900,
			to: 9999,
			placeholderChar: 'Г',
		},
	},
	lazy: false,
})
document.getElementById('date-mask').addEventListener('input', () => {
	console.log(dateMask.value)
})

const datePicker = new DatePicker('#datepicker')
datePicker.on('submit', (date) => {
	console.log(date)
})
datePicker.on('cancel', () => {
	console.log('cancel')
})
const dateDropdown = Elements.DropdownDate('test')

const optionsDropdown = Elements.DropdownOptions('test_2')

const expandedChecklist = Elements.ExpandedChecklist('test_3')

const richChecklist = Elements.RichChecklist('test_4')

const rateButton = Elements.RateButton("test_5")


const rangeSlider = Elements.RangeSlider("test_6", {min: 1000, max: 16000, start: 5000, end: 15000, step: 1000})

const likeBtns = document.querySelectorAll('.likeBtn')

for(let likeBtn of likeBtns) {
	Elements.LikeBtn(likeBtn)
}