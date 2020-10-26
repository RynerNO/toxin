import 'normalize.css'
import 'nouislider/distribute/nouislider.min.css'

import './styles.sass'

import imask from 'imask'

import Elements from './js/Elements'
import Slider from './js/Slider'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
let d_mask = document.getElementById('date-mask')
if(d_mask) {
const dateMask = imask(d_mask, {
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
}

const sliders = document.querySelectorAll('.slider')

 for(const slider of sliders) {
 	new Slider(slider, {
 		autoplay: false
 	})
 }
 const roomCards = document.querySelectorAll('.roomCard')

 for(let i = 0; i < roomCards.length; i++) {
 	const rate = roomCards[i].getAttribute('rate')
 	const rateButton = roomCards[i].querySelector('.rateButton')
	Elements.RateButton(rateButton, rate)
 }
const radio = Elements.Radio('.radio', "male")
const mobileMenu = document.querySelector('.header__mobile-menu')
const mobileMenuButton = document.querySelector('.header__mobile-button')
mobileMenuButton.addEventListener('click', () => {
	mobileMenu.classList.toggle('header__mobile-menu_visible')
})
const mobileMenuCloseButton = mobileMenu.querySelector('.header__mobile-menu-top button')
mobileMenuCloseButton.addEventListener('click', () => {
	mobileMenu.classList.toggle('header__mobile-menu_visible')
})
const likeBtns = document.querySelectorAll('.likeBtn')

for(let likeBtn of likeBtns) {
	Elements.LikeBtn(likeBtn)
}
const dateDropdown = Elements.DropdownDate('date')
const optionsDropdown = Elements.DropdownOptions('options')
const rangeSlider = Elements.RangeSlider("range", {min: 1000, max: 16000, start: 5000, end: 15000, step: 1000})
const Checklist = Elements.RichChecklist('checkbox')
const richChecklist = Elements.RichChecklist('checkbox_rich')
const optionsDropdownComf = Elements.DropdownOptions('options_comfort')
const expandedChecklist = Elements.ExpandedChecklist('checkbox_exp')
const pagination = Elements.Pagination('pagination')
const chart_el = document.querySelector('.room_chart')
if(chart_el) {
	const chart = am4core.create("room__chart", am4charts.PieChart);
	const gradient_yellow = new am4core.LinearGradient();
	const gradient_purple = new am4core.LinearGradient();
	const gradient_green = new am4core.LinearGradient();
	const gradient_black = new am4core.LinearGradient();
	gradient_yellow.addColor(am4core.color("#FFBA9C"));
	gradient_yellow.addColor(am4core.color("#FFE39C"));

	gradient_yellow.rotation = -120
	gradient_purple.addColor(am4core.color('#BC9CFF'))
	gradient_purple.addColor(am4core.color('#8BA4F9'))
	gradient_green.addColor(am4core.color('#6FCF97'))
	gradient_green.addColor(am4core.color('#66D2EA'))
	gradient_black.addColor(am4core.color('#909090'))
	gradient_black.addColor(am4core.color('#3D4975'))

	chart.data = [ 
		{
		"status": "Удовлетворительно",
		"reviews": 65,
		"color": gradient_purple
	},
	{
		
		"status": "Хорошо",
		"reviews": 65,
		"color": gradient_green
	}, 
	{
		"status": "Великолепно",
		"reviews": 130,
		"color": gradient_yellow
	},{
		"status": "Разочарован",
		"reviews": 0,
		"color": gradient_black
	}];

	chart.radius = am4core.percent(100);
	let pieSeries = chart.series.push(new am4charts.PieSeries());
	pieSeries.dataFields.value = "reviews";
	pieSeries.dataFields.category = "status";
	pieSeries.labels.template.disabled = true;
	pieSeries.ticks.template.disabled = true;
	chart.innerRadius = am4core.percent(90)
	chart.maxWidth = "120px"
	chart.maxHeight = "121px"
	pieSeries.slices.template.stroke = am4core.color("#fff");
	pieSeries.slices.template.strokeWidth = 2;
	pieSeries.slices.template.strokeOpacity = 1;
	pieSeries.slices.template.propertyFields.fill = "color";
	pieSeries.slices.template.fillOpacity = 1;
	let hs = pieSeries.slices.template.states.getKey("hover");
	hs.properties.scale = 1;
	hs.properties.fillOpacity = 0.5;
	pieSeries.slices.template.tooltipText = "{value.value}";
	chart.logo.disabled = true;
	let legendContainer = am4core.create("room__chart-legend", am4core.Container);
	legendContainer.width = am4core.percent(100);
	legendContainer.height = am4core.percent(100);
	legendContainer.y = 30
	chart.legend = new am4charts.Legend();
	chart.legend.parent = legendContainer
	legendContainer.logo.disabled = true
	let marker = chart.legend.markers.template.children.getIndex(0);
	marker.cornerRadius(12, 12, 12, 12);
	marker.strokeWidth = 12;
	marker.strokeOpacity = 1;
	marker.stroke = am4core.color("#fff");
	pieSeries.legendSettings.valueText= " "
	chart.legend.height = 10
	let label = pieSeries.createChild(am4core.Label);
	label.text = "{values.value.sum}";
	label.horizontalCenter = "middle";
	label.verticalCenter = "middle";
	label.fontSize = 24;
	label.fontWeight = "bold"
	label.fill = am4core.color("#BC9CFF");
	label.fontFamily = "Quicksand"
	label.paddingTop = "-12px"
	let label2 = pieSeries.createChild(am4core.Label);
	label2.text = "голосов";
	label2.horizontalCenter = "middle";
	label2.verticalCenter = "middle";
	label2.fontSize = 12;
	label2.paddingTop = "25px"
	label2.fontWeight = "bold"
	label2.fill = am4core.color("#BC9CFF");
	label2.fontFamily = "Montserrat"
}
