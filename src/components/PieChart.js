import { Pie, mixins } from 'vue-chartjs'
export default {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: ['options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
