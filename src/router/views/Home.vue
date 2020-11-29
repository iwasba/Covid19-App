<template>
  <div class="background centered mt-n12">
    <v-row>
      <v-col cols="12">
        <h1>COVID-19 <br />TRACKER</h1>
      </v-col>
      <v-col class="centered searchBar" cols="12">
        <v-autocomplete
          dark
          v-model="country"
          :items="countries"
          item-text="Country"
          item-value="Country"
          dense
          filled
          label="Select your country"
        />
      </v-col>
      <v-col cols="12">
        <v-btn x-large outlined small color="white" class="mb-8">
          <router-link
            :to="{ name: 'stats', params: { country: this.country } }"
          >
            <h2>VIEW STATISTICS</h2>
          </router-link>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <div v-if="!loaded">
          <h5>Please wait fetching data...</h5>
          <v-progress-circular
            indeterminate
            color="white"
          ></v-progress-circular>
        </div>
      </v-col>
      <v-col cols="12">
        <div v-if="loaded">
          <h3>
            TOTAL: {{ numberWithCommas(summary.data.Global.TotalConfirmed) }}
          </h3>
          <h3 class="deaths">
            DEATHS:
            {{ numberWithCommas(summary.data.Global.TotalDeaths) }}
          </h3>
          <h3 class="recovers">
            RECOVERED:
            {{ numberWithCommas(summary.data.Global.TotalRecovered) }}
          </h3>
        </div>
      </v-col>
      <v-col :style="{ width: '50%' }">
        <h4>Powered by covid19api, <i>Designed by Aaron Jiang 2020</i></h4>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  props: {
    msg: String,
  },
  data() {
    return {
      country: "Canada",
      countries: null,
      summary: null,
      loaded: false,
    };
  },
  mounted() {
    window.scrollTo(0, 0);

    axios.all([this.summaryRequest()]).then(
      axios.spread((first_response) => {
        this.countries = first_response.data.Countries;
        this.summary = first_response;
      })
    );
    this.loaded = true;
  },

  methods: {
    submit() {
      this.$router.push("stats");
    },
    summaryRequest() {
      console.log("summary called");
      return axios.get("https://api.covid19api.com/summary");
    },
    numberWithCommas(x) {
      console.log(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<style scoped>
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  display: flex;
  justify-content: center;
  align-items: center;
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

h2 {
  color: white;
  font-size: 100%;
}

a {
  text-decoration: none;
}

@font-face {
  font-family: "Lulo";
  src: url("../../assets/Lulo.ttf");
}

@font-face {
  font-family: "Encode";
  src: url("../../assets/Lulo.ttf");
}

.deaths {
  color: rgb(228, 186, 186);
}

.recovers {
  color: rgb(183, 231, 181);
}

@media all and (min-width: 750px) {
  h4 {
    font-size: 1vw;
    opacity: 0.4;
    font-weight: 100;
    color: white;
  }

  h1 {
    font-size: 4vw;
    font-family: "Lulo";
    color: white;
  }
  .searchBar {
    padding: 0 30% 0 30%;
  }
  h3 {
    font-size: 20px;
    font-weight: 100;
    font-family: "Lulo";
    opacity: 0.85;
    color: white;
  }
}
@media all and (max-width: 750px) {
  h4 {
    font-size: 3vw;
    opacity: 0.4;
    font-weight: 100;
    color: white;
  }

  h1 {
    font-size: 8vw;
    font-family: "Lulo";
    color: white;
  }
  .searchBar {
    padding: 0 15% 0 15%;
  }
  h3 {
    font-size: 14px;
    font-weight: 100;
    font-family: "Lulo";
    opacity: 0.85;
    color: white;
  }
}

h5 {
  padding-top: 40px;
  padding-bottom: 20px;
  font-size: 8;
  opacity: 0.4;
  font-weight: 200;
  color: white;
}
</style>
