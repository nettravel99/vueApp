<template>
  <el-row type="flex" justify="center" style="padding-top:10px;">
    <el-col :span="12">
      <el-card class="box-shadow" style="height:80vh;padding:10px">
        <div slot="header">
          <h1>New Account</h1>
        </div>
        <el-steps :active="activeStep" align-center>
          <el-step title="Step 1" description="Basic Info" />
          <el-step title="Step 2" description="Verify Eligibility" />
          <el-step title="Step 3" description="Some description" />
          <el-step title="Step 4" description="Some description" />
        </el-steps>
        <br>
        <step1 v-if="activeStep==0" @newaccount="triageEvent" />
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import step1 from './components/newaccount/step1'
export default {
  components: {
    step1
  },
  data() {
    return {
      activeStep: 0
    }
  },
  methods: {
    triageEvent(e) {
      this.$emit('newaccount', e)
    }
  }
}
</script>
