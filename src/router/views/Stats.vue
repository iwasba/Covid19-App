
<template>
  <div>
    <div class="background centered">
      <h1>{{country}}</h1>
      <v-row class="centered-item">
        <v-col>
          <h3> TOTAL: {{summary.total}}</h3>
          <h3 class="deaths">DEATHS: {{summary.deaths}}</h3>
          <h3 class="recovers">RECOVERED: {{summary.recovered}}</h3>
        </v-col>
        <v-col>

          <h3 class="increase">{{calcDiff(this.cases[0],this.cases[1])}}</h3>
          <h3>INCREASE IN CASES </h3>
        </v-col>
        <v-col>
          <h3
            v-if="this.changeColor"
            class="decrease"
          >{{calcChange(this.cases[0],this.cases[1],this.cases[2])}}</h3>
          <h3
            v-if="!this.changeColor"
            class="increase"
          >{{calcChange(this.cases[0],this.cases[1],this.cases[2])}}</h3>
          <h3>FROM YESTERDAY </h3>
        </v-col>
      </v-row>
      <div class="chart-container">
        <chart
          v-if="loaded"
          :chartdata="caseChartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import dashboard from "../../components/Dashboard"
import chart from "../../components/CasesChart"

export default {
  name: "Home",
  props: {
  },
  components: {
    chart,
    // dashboard
  },
  data () {
    return {
      country: '',
      loaded: false,
      summary: {
        total: null,
        deaths: null,
        recovered: null,
      },

      changeColor: false,
      diffColor: false,

      //chart config
      caseChartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      deathChartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      recoverChartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },

      cases: [],
      deaths: [],
      recovers: [],

      chartOptions: {
        responsive: true,
        aspectRatio: 10,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        },
      }



    };
  },
  created () {
    this.country = this.$route.params.country;
  },
  async mounted () {
    console.log("mounted");

    axios.all([
      this.countryTotal(), //or direct the axios request
      this.countryDeath(),
      this.countryRecovered(),
    ])
      .then(axios.spread((first_response, second_response, third_response) => {

        //cases data
        first_response.data.forEach(element => {
          this.caseChartData.datasets[0].data.push(element.Cases);
          this.caseChartData.labels.push(element.Date)
          this.loaded = true
        });

        //deaths data
        second_response.data.forEach(element => {
          this.deathChartData.datasets[0].data.push(element.Cases);
          this.deathChartData.labels.push(element.Date)
          this.loaded = true
        });

        //recovered data
        third_response.data.forEach(element => {
          this.recoverChartData.datasets[0].data.push(element.Cases);
          this.recoverChartData.labels.push(element.Date)
          this.loaded = true
        });

        this.summary.total = first_response.data[first_response.data.length - 1].Cases
        this.summary.deaths = second_response.data[second_response.data.length - 1].Cases
        this.summary.recovered = third_response.data[third_response.data.length - 1].Cases

        for (var i = 0; i < 3; i++) {
          this.cases.push(first_response.data[first_response.data.length - 1 - i].Cases)
          this.deaths.push(second_response.data[first_response.data.length - 1 - i].Cases)
          this.recovers.push(third_response.data[first_response.data.length - 1 - i].Cases)
        }


      }))

  },

  methods: {
    calcDiff (before, after) {
      var difference = ((1 - Number(after) / Number(before)) * 100).toPrecision(3)

      if (difference > 0) {
        return "+" + difference + "%"
      }
      else {
        this.diffColor = true
        return difference + "%"
      }
    },

    calcChange (a, b, c) {
      var difference1 = ((1 - Number(b) / Number(a)) * 100).toPrecision(3)
      var difference2 = ((1 - Number(c) / Number(b)) * 100).toPrecision(3)

      var change = difference1 - difference2

      if (change > 0) {
        return "+" + change + "%"
      }
      else {
        this.changeColor = true
        return change + "%"
      }
    },
    countryTotal () {
      console.log('country called')
      return axios.get(`https://api.covid19api.com/total/country/${this.country}/status/confirmed`)
    },
    countryDeath () {
      console.log('death called')
      return axios.get(`https://api.covid19api.com/total/country/${this.country}/status/deaths`)
    },
    countryRecovered () {
      console.log('recover called')
      return axios.get(`https://api.covid19api.com/total/country/${this.country}/status/recovered`)
    }
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  font-size: 14px;
  font-weight: 100;
  font-family: "Lulo";
  opacity: 0.85;
  color: white;
}

.increase {
  color: rgb(228, 186, 186);
  font-size: 24px;
}
.decrease {
  color: rgb(183, 231, 181);
  font-size: 24px;
}

.deaths {
  color: rgb(228, 186, 186);
}

.recovers {
  color: rgb(183, 231, 181);
}

.centered-item {
  padding-top: 1%;
  padding-left: 25%;
  padding-right: 25%;
}

.chart-container {
  padding-top: -20%;
  height: 30%;
  padding-left: 25%;
  padding-right: 25%;
}

.background {
  background-image: linear-gradient(
      to bottom,
      rgba(245, 246, 252, 0.52),
      rgba(117, 19, 93, 0.73)
    ),
    url("../../assets/corona.gif");

  /* background-image: url("../../assets/corona.gif"); */
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.07);
  transform: scale(1.1);
}

@font-face {
  font-family: "Lulo";
  src: url("../../assets/Lulo.ttf");
}

h1 {
  padding-top: 60px;
  font-size: 60px;
  font-family: "Lulo";
  color: white;
}
</style>
