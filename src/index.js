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
import nursery from './js/nursery.js'
const app = new Vue({
  el: "#app",
  template: "#nurserys",
  data: {
    nurserys: [],
    district: '',
  },
  components: {
    nursery: nursery
  },
  methods: {
    fetchNurserys: function(url) {
      var self = this
      $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
          let nurserys = JSON.parse(data);
          nurserys.forEach((nursery) => {
            self.nurserys.push(nursery)
          })
        }
      })
    }
  },
  created: function() {
    this.fetchNurserys('https://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AE&CaseNo2=2&FileType=1&Lang=C&FolderType=')
    this.fetchNurserys('https://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AE&CaseNo2=1&FileType=1&Lang=C&FolderType=')
  },
  mounted: function() {

  }
})
