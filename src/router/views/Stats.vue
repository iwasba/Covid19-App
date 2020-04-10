
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

          <h3 class="increase">{{calcDiff(this.summary.total,this.summary.total_last)}}</h3>
          <h3>INCREASE IN CASES </h3>
        </v-col>
      </v-row>
      <div class="chart-container">
        <chart
          v-if="loaded"
          :chartdata="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import chart from "../../components/CasesChart"

export default {
  name: "Home",
  props: {
  },
  components: {
    chart
  },
  data () {
    return {
      country: '',
      loaded: false,
      countryCases: null,
      summary: {
        total: null,
        deaths: null,
        recovered: null,
        total_last: null,
        deaths_last: null,
        recovered_last: null,

      },

      //chart config
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
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

        this.countryCases = first_response.data

        this.countryCases.forEach(element => {
          this.chartData.datasets[0].data.push(element.Cases);
          this.chartData.labels.push(element.Date)
          this.loaded = true
        });

        this.summary.total = first_response.data[first_response.data.length - 1].Cases
        this.summary.deaths = second_response.data[second_response.data.length - 1].Cases
        this.summary.recovered = third_response.data[third_response.data.length - 1].Cases

        this.summary.total_last = first_response.data[first_response.data.length - 2].Cases
        this.summary.deaths_last = second_response.data[second_response.data.length - 2].Cases
        this.summary.recovered_last = third_response.data[third_response.data.length - 2].Cases

      }))

  },

  methods: {
    calcDiff (before, after) {
      console.log(before, ' ', after)

      var difference = ((1 - Number(after) / Number(before)) * 100).toPrecision(3)

      var percent = (difference > 0) ? "+" + difference + "%" : "-" + difference + "%"

      return percent
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
  font-size: 36px;
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
