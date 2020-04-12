import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    colour: String,
    chartdata: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    if (this.colour == "white") {
      this.gradient.addColorStop(0, "rgba(255, 255,255, 0.75)");
      this.gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.25)");
      this.gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    }
    if (this.colour == "red") {
      this.gradient.addColorStop(0, "rgba(228,186,186, 0.75)");
      this.gradient.addColorStop(0.5, "rgba(228,186,186, 0.25)");
      this.gradient.addColorStop(1, "rgba(228,186,186, 0)");
    }
    if (this.colour == "green") {
      this.gradient.addColorStop(0, "rgba(183, 231, 181, 0.75)");
      this.gradient.addColorStop(0.5, "rgba(183, 231, 181, 0.25)");
      this.gradient.addColorStop(1, "rgba(183, 231, 181, 0)");
    }
    this.chartdata.datasets[0].backgroundColor = this.gradient;

    this.renderChart(this.chartdata, this.options);
  },
};
