// import js
import $ from 'jquery/dist/jquery.js'
import Popper from 'popper.js/dist/esm/popper.js'
require('bootstrap')
import Vue from 'vue/dist/vue.esm.js'

// import css
import './css/index.scss'

// js code
// google map
window.initMap = function() {
  const kaohsiung = {
    lat: 22.665768464,
    lng: 120.32489392799998
  }
  new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: kaohsiung
  })
}
// vue
