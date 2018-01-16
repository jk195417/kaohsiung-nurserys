import $ from 'jquery/dist/jquery.js'
import nursery from './nursery.js'
export default {
  template: "#nurserys",
  data: function() {
    return {
      nurserys: [],
      district: "全部"
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
    mapCenter: function() {
      const result = {
        lat: 0,
        lng: 0
      }
      this.districtNurserys.forEach((nursery) => {
        result["lat"] += parseFloat(nursery["lat"])
        result["lng"] += parseFloat(nursery["lng"])
      })
      result["lat"] = result["lat"] / this.districtNurserys.length
      result["lng"] = result["lng"] / this.districtNurserys.length
      return result
    }
  },
  mounted: function() {
    this.fetchNurserys('https://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AE&CaseNo2=2&FileType=1&Lang=C&FolderType=')
    this.fetchNurserys('https://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AE&CaseNo2=1&FileType=1&Lang=C&FolderType=')
  }
}
