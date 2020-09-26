import 'normalize.css'
import './styles.sass'
import imask from 'imask'
import rangeSlider from 'nouislider'
import Dropdown from './js/Dropown'
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
const dateDropdown = Dropdown.DropdownDate('test')

const optionsDropdown = Dropdown.DropdownOptions('test_2')
