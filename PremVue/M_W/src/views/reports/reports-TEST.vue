<template>
  <el-form :model="form" ref="form" label-width="80px" >
    <el-form-item label="Account">
      <el-input v-model="form.account" style="width:250px"></el-input>
      <account-lookup v-model="form.account" />
      <general-lookup lookup="PC" title="Procedures" v-model="form.account" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
  
</template>

<script>
import { M } from '@/api/index'
import AccountLookup from '@/components/lookups/account'
import GeneralLookup from '@/components/lookups/index'; 
export default {
  data(){
    return {
        form:{

        }
    }
  },
  components:{
    AccountLookup,
    GeneralLookup
  },
  methods:{
    async onSubmit(){
      let data = await M("Test^MW",{
        account:this.form.account
      })
      this.form.account = data.data.result;
    }
  }
}
</script>
