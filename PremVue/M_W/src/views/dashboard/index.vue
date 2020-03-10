<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>Dashboard</span>
          </div>
          <panel-group />

        </el-card>

      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <single-bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import SingleBarChart from './components/SingleBarChart'
import PieChart from './components/PieChart'

const lineChartData = {
  expectedData: [100, 120, 161, 134, 105, 160, 165],
  actualData: [120, 82, 91, 154, 162, 140, 145]
}

export default {
  components: {
    LineChart,
    BarChart,
    PanelGroup,
    PieChart,
    SingleBarChart
  },
  data() {
    return {
      lineChartData: lineChartData
    }
  }
}
</script>
<style lang="scss" scoped>
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
</style>
