
<template>
  <div>
    <div class="background centered">
      <h1>COVID <br />TRACKER</h1>
      <div class="centered-item">
        <v-autocomplete
          dark
          v-model="country"
          :items="countries"
          item-text="Country"
          item-value="Country"
          dense
          filled
          label="Select your country"
        >
        </v-autocomplete>

        <v-btn
          x-large
          outlined
          small
          color="white"
          class="mb-8"
        >
          <router-link :to="{ name: 'stats', params: { country:this.country } }">
            <h2>VIEW STATISTICS</h2>
          </router-link>
        </v-btn>
        <div v-if="loaded">
          <h3> TOTAL: {{summary.data.Global.TotalConfirmed}}</h3>
          <h3 class="deaths">DEATHS: {{summary.data.Global.TotalDeaths}}</h3>
          <h3 class="recovers">RECOVERED: {{summary.data.Global.TotalRecovered}}</h3>
        </div>
      </div>
      <h4>Powered by covid19api, <i>Designed by Aaron Jiang 2019</i></h4>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  props: {
    msg: String
  },
  data () {
    return {
      country: "Canada",
      countries: null,
      summary: null,
      loaded: false,
    };
  },
  mounted () {
    console.log("mounted");

    axios.all([
      this.summaryRequest()
    ])
      .then(axios.spread((first_response) => {
        this.countries = first_response.data.Countries
        this.summary = first_response
      }))
    this.loaded = true
  },


  methods: {
    submit () {
      this.$router.push('stats')
    },
    summaryRequest () {
      console.log('summary called')
      return axios.get('https://api.covid19api.com/summary')
    }
  }
};
</script>



<style scoped>
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

h2 {
  color: white;
  font-size: 100%;
}

a {
  text-decoration: none;
}

.centered-item {
  padding-top: 1%;
  padding-left: 34%;
  padding-right: 34%;
}

@font-face {
  font-family: "Lulo";
  src: url("../../assets/Lulo.ttf");
}

@font-face {
  font-family: "Encode";
  src: url("../../assets/Lulo.ttf");
}

h3 {
  font-size: 14px;
  font-weight: 100;
  font-family: "Lulo";
  opacity: 0.85;
  color: white;
}

.deaths {
  color: rgb(228, 186, 186);
}

.recovers {
  color: rgb(183, 231, 181);
}

h1 {
  padding-top: 190px;
  font-size: 60px;
  font-family: "Lulo";
  color: white;
}

h4 {
  padding-top: 80px;
  font-size: 8;
  opacity: 0.4;
  font-weight: 100;
  color: white;
}
</style>
