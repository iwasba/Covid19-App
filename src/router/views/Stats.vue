<template>
  <div class="background centered">
    <div>
      <v-row class="padTop" />
      <v-row>
        <v-col class="centerContent" cols="3">
          <v-icon x-large color="white" @click="goBack">
            mdi-chevron-left
          </v-icon>
        </v-col>
        <v-col cols="7" class="centered">
          <h1>{{ country }}</h1>
        </v-col>
        <v-spacer />
      </v-row>
      <div class="centered-item">
        <v-tabs
          class="mt-n4"
          v-model="tab"
          dark
          background-color="transparent"
          grow
        >
          <v-tab v-for="n in 3" :key="n" color="transparent">
            {{ items[n - 1] }}
          </v-tab>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <dashboard
                v-if="loaded"
                dashboard="CASES"
                :summary="numberWithCommas(summary.total)"
                :type="cases"
                :chartdata="caseChartData"
                :chartOptions="chartOptions"
                colour="white"
              />
            </v-tab-item>
            <v-tab-item>
              <dashboard
                v-if="loaded"
                dashboard="DEATHS"
                :summary="numberWithCommas(summary.deaths)"
                :type="deaths"
                :chartdata="deathChartData"
                :chartOptions="chartOptions"
                colour="red"
              />
            </v-tab-item>
            <v-tab-item>
              <dashboard
                v-if="loaded"
                dashboard="RECOVERY"
                :summary="numberWithCommas(summary.recovered)"
                :type="recovers"
                :chartdata="recoverChartData"
                :chartOptions="chartOptions"
                colour="green"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import dashboard from "../../components/Dashboard";

export default {
  name: "Stats",
  props: {},
  components: {
    dashboard,
  },
  data() {
    return {
      country: "",
      loaded: false,
      summary: {
        total: null,
        deaths: null,
        recovered: null,
      },
      cases: [],
      deaths: [],
      recovers: [],

      //chart config
      caseChartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      deathChartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      recoverChartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      chartOptions: {
        maintainAspectRatio: true,
        scales: {
          yAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
      tab: null,
      items: ["CASES", "DEATHS", "RECOVERY"],
    };
  },
  created() {
    this.country = this.$route.params.country;
  },
  async mounted() {
    window.scrollTo(0, 0);

    axios
      .all([
        this.countryTotal(), //or direct the axios request
        this.countryDeath(),
        this.countryRecovered(),
      ])
      .then(
        axios.spread((first_response, second_response, third_response) => {
          //cases data
          first_response.data.forEach((element) => {
            this.caseChartData.datasets[0].data.push(element.Cases);
            this.caseChartData.labels.push(element.Date);
          });

          //deaths data
          second_response.data.forEach((element) => {
            this.deathChartData.datasets[0].data.push(element.Cases);
            this.deathChartData.labels.push(element.Date);
          });

          //recovered data
          third_response.data.forEach((element) => {
            this.recoverChartData.datasets[0].data.push(element.Cases);
            this.recoverChartData.labels.push(element.Date);
          });

          this.summary.total =
            first_response.data[first_response.data.length - 1].Cases;
          this.summary.deaths =
            second_response.data[second_response.data.length - 1].Cases;
          this.summary.recovered =
            third_response.data[third_response.data.length - 1].Cases;

          for (var i = 0; i < 3; i++) {
            this.cases.push(
              first_response.data[first_response.data.length - 1 - i].Cases
            );
            this.deaths.push(
              second_response.data[first_response.data.length - 1 - i].Cases
            );
            this.recovers.push(
              third_response.data[first_response.data.length - 1 - i].Cases
            );
          }
          this.loaded = true;
        })
      );
  },

  methods: {
    goBack() {
      console.log("called");
      this.$router.go(-1);
    },
    numberWithCommas(x) {
      console.log(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    calcDiff(before, after) {
      var difference = ((1 - Number(after) / Number(before)) * 100).toPrecision(
        3
      );

      if (difference > 0) {
        return "+" + difference + "%";
      } else {
        this.diffColor = true;
        return difference + "%";
      }
    },

    calcChange(a, b, c) {
      var difference1 = ((1 - Number(b) / Number(a)) * 100).toPrecision(3);
      var difference2 = ((1 - Number(c) / Number(b)) * 100).toPrecision(3);

      var change = difference1 - difference2;

      if (change > 0) {
        return "+" + change + "%";
      } else {
        this.changeColor = true;
        return change + "%";
      }
    },
    countryTotal() {
      console.log("country called");
      return axios.get(
        `https://api.covid19api.com/total/country/${this.country}/status/confirmed`
      );
    },
    countryDeath() {
      console.log("death called");
      return axios.get(
        `https://api.covid19api.com/total/country/${this.country}/status/deaths`
      );
    },
    countryRecovered() {
      console.log("recover called");
      return axios.get(
        `https://api.covid19api.com/total/country/${this.country}/status/recovered`
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.padTop {
  height: 80px;
}
.backButton {
  position: absolute;

  top: 100px;
  left: -35vw;
}

img:active {
  opacity: 0.3;
}

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

@media all and (min-width: 750px) {
  .centered-item {
    padding-top: 1%;
    padding-left: 15%;
    padding-right: 15%;
  }
  h1 {
    font-size: 60px;
    font-family: "Lulo";
    color: white;
  }
}
@media all and (max-width: 750px) {
  .centered-item {
    padding-top: 1%;
    padding-left: 5%;
    padding-right: 5%;
  }
  h1 {
    font-size: 30px;
    font-family: "Lulo";
    color: white;
  }
}
.background {
  background-image: linear-gradient(
      to bottom,
      rgba(245, 246, 252, 0.52),
      rgba(117, 19, 93, 0.73)
    ),
    url("../../assets/corona.gif");

  width: 100%;
  height: 120%;
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

.centerContent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.theme--light.v-tabs-items {
  background: transparent;
}
h4 {
  padding-top: 40px;
  font-size: 8;
  opacity: 0.4;
  font-weight: 100;
  color: white;
}
</style>
