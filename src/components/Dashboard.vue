
<template>
  <div>
    <v-row>
      <v-col>
        <h3 class="total">{{summary}}</h3>
        <!-- <h3> TOTAL: {{summary.total}}</h3>
        <h3 class="deaths">DEATHS: {{summary.deaths}}</h3>
        <h3 class="recovers">RECOVERED: {{summary.recovered}}</h3> -->
      </v-col>
      <v-col>

        <h3 class="increase">{{calcDiff(this.type[0],this.type[1])}}</h3>
        <h3>INCREASE IN {{dashboard}} </h3>
      </v-col>
      <v-col>
        <h3
          v-if="this.changeColor"
          class="decrease"
        >{{calcChange(this.type[0],this.type[1],this.type[2])}}</h3>
        <h3
          v-if="!this.changeColor"
          class="increase"
        >{{calcChange(this.type[0],this.type[1],this.type[2])}}</h3>
        <h3>FROM YESTERDAY</h3>
      </v-col>
    </v-row>
    <div class="container">
      <chart
        :width="100"
        :height="50"
        :colour="colour"
        :chartdata="chartdata"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import chart from "./CasesChart"

export default {
  name: "Home",
  props: {
    dashboard: String,
    summary: Object,
    type: Array,
    chartdata: Object,
    chartOptions: Object,
    colour: String
  },
  components: {
    chart
  },
  data () {
    return {

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

    };
  },

  async mounted () {
    console.log("mounted");

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
      var difference1 = ((1 - Number(b) / Number(a)) * 100)
      var difference2 = ((1 - Number(c) / Number(b)) * 100)

      var change = (difference1 - difference2).toPrecision(3)

      if (change > 0) {
        return "+" + change + "%"
      }
      else {
        this.changeColor = true
        return change + "%"
      }
    },
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

.total {
  font-size: 40px;
}

.centered-item {
  padding-top: -20%;
  padding-left: 25%;
  padding-right: 25%;
}

.container {
  padding-left: 3%;
  padding-right: 3%;
}

@font-face {
  font-family: "Lulo";
  src: url("../assets/Lulo.ttf");
}

h1 {
  padding-top: 60px;
  font-size: 60px;
  font-family: "Lulo";
  color: white;
}
</style>
