import $ from 'jquery/dist/jquery.js'
import nursery from './nursery.js'
export default {
  template: "#nurserys",
  data: function() {
    return {
      picked: null,
      nurserys: [],
      district: "全部",
      map: new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {
          lat: 22.665768464,
          lng: 120.32489392799998
        }
      })
    }
  },
  components: {
    nursery: nursery
  },
  methods: {
    fetchNurserys: function(url) {
      const self = this
      $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
          const nurserys = JSON.parse(data);
          nurserys.forEach((nursery) => {
            nursery["district"] = self.getDistrict(nursery)
            nursery["marker"] = self.getMarker(nursery)
            self.nurserys.push(nursery)
          })
        }
      })
    },
    getDistrict: function(nursery) {
      let result = "no district"
      const r = /高雄市\W*區/
      let matched = nursery["informaddress"].match(r)
      if (matched !== null) {
        result = matched[0].substr(3, 3)
      }
      return result
    },
    getMarker: function(nursery) {
      let result = new google.maps.Marker({
        title: nursery.org_Text,
        position: {
          lat: parseFloat(nursery.lat),
          lng: parseFloat(nursery.lng)
        }
      })
      return result;
    },
    fitMap: function() {
      // move map to markers's center and zoom
      this.map.fitBounds(this.mapLatLngBounds)
      this.map.panToBounds(this.mapLatLngBounds)
    },
    setPicked: function(index) {
      if (this.picked === index) {
        this.picked = null
      } else {
        this.picked = index
      }
    }
  },
  computed: {
    districts: function() {
      let districts = ["全部"]
      this.nurserys.forEach((nursery) => {
        let district = nursery["district"]
        if (districts.indexOf(district) === -1) {
          districts.push(district)
        }
      })
      return districts
    },
    districtNurserys: function() {
      if (this.district === "全部") {
        return this.nurserys
      }
      const self = this
      let nurserys = []
      this.nurserys.forEach((nursery) => {
        if (nursery["district"] === self.district) {
          nurserys.push(nursery)
        }
      })
      return nurserys
    },
    mapLatLngBounds: function() {
      let bounds = new google.maps.LatLngBounds()
      if (this.picked !== null) {
        let lat = parseFloat(this.districtNurserys[this.picked].lat)
        let lng = parseFloat(this.districtNurserys[this.picked].lng)
        let location = new google.maps.LatLng(lat, lng)
        bounds.extend(location)
      } else {
        this.districtNurserys.forEach((nursery) => {
          let lat = parseFloat(nursery["lat"])
          let lng = parseFloat(nursery["lng"])
          let location = new google.maps.LatLng(lat, lng)
          bounds.extend(location)
        })
      }
      return bounds;
    }
  },
  watch: {
    district: function() {
      this.picked = null
    },
    districtNurserys: function(newNurserys, oldNurserys) {
      // set markers
      oldNurserys.forEach((nursery) => {
        nursery.marker.setMap(null)
      })
      newNurserys.forEach((nursery) => {
        nursery.marker.setMap(this.map)
      })
      this.fitMap()
    },
    picked: function(index) {
      this.fitMap()
      let streetView = this.map.getStreetView()
      if (index !== null) {
        let lat = parseFloat(this.districtNurserys[index].lat)
        let lng = parseFloat(this.districtNurserys[index].lng)
        let location = new google.maps.LatLng(lat, lng)
        streetView.setPosition(location)
        streetView.setVisible(true)
      } else {
        streetView.setVisible(false)
      }
    }
  },
  mounted: function() {
    this.fetchNurserys('https://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AE&CaseNo2=2&FileType=1&Lang=C&FolderType=')
    this.fetchNurserys('https://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AE&CaseNo2=1&FileType=1&Lang=C&FolderType=')
  }
}
