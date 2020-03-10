<template>
  <div>
    <el-row
      type="flex"
      align="top"
      style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: rgb(84, 92, 100);display:inline-block;width:100%"
    >
      <el-button
        type="warning"
        size="mini"
        icon="el-icon-star-off"
        circle
        @click="dialogSaveSet=true"
      />
      <el-dialog title="Save Favorite Set" :visible.sync="dialogSaveSet">
        <el-form :model="formSaveSet">
          <el-form-item label="Favorite">
            <el-select
              v-model="formSaveSet.favorite"
              placeholder="Please Select a Set Number to Save Current Schedule Configuration"
            >
              <el-option v-for="i in 10" :key="'favoriteSet'+i" :label="'Set No.'+i" :value="i" />
            </el-select>
          </el-form-item>
          <ElFormItem label="Name">
            <el-input v-model="formSaveSet.name" placeholder="Please input set name" />
          </ElFormItem>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogSaveSet = false">Cancel</el-button>
          <el-button type="primary" @click="favoriteSaveSet">Save</el-button>
        </span>
      </el-dialog>
      <el-radio-group v-model="selectedSet" size="mini" @change="handleSelectedSet">
        <el-radio
          v-for="(set,i) in favoriteSets.slice(0, 20)"
          :key="'option'+i"
          style="color: rgb(255, 208, 75);font-size:17px;"
          :label="i"
        >{{ set.name }}&nbsp;</el-radio>
      </el-radio-group>
    </el-row>
    <el-row>
      <el-col :span="24">
        <scheduler :key="'selectedSet-'+key" :vtype="selectedType" :day="selectedDay" :sres="selectedRes" :nday="''+selectedNoDays" :tday="selectedTypeofDays" @reloadSet="reloadSet" />
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { M } from '@/api/index'
import scheduler from '@/components/scheduler/schedule'

export default {
  components: {
    scheduler
  },
  data() {
    return {
      dialogSaveSet: false,
      selectedSet: '',
      favoriteSets: [],
      formSaveSet: {},
      selectedRes: [],
      selectedDay: new Date(),
      selectedNoDays: '',
      selectedTypeofDays: [],
      selectedKey: '',
      key: 0,
      selectedType: ''
    }
  },
  async created() {
    const data = await M('getCodes^MWS')
    if (data && data.data && data.data.favoriteSets) {
      this.favoriteSets = data.data.favoriteSets
    }
  },
  methods: {
    reloadSet(e) {
      this.selectedNoDays = e.nday,
      this.selectedDay = e.day,
      this.selectedRes = e.res,
      this.selectedTypeofDays = e.tday,
      this.selectedType = e.vtype
      this.key = new Date().getTime()
    },
    async favoriteSaveSet() {
      const payload = {
        res: this.selectedRes,
        day: this.selectedNoDays,
        tday: this.selectedTypeofDays,
        type: this.selectedType
      }
      this.formSaveSet.set = payload

      await M('favoriteSaveSet^MWS', this.formSaveSet)
      const data = await M('getSets^MWS')
      if (data && data.favoriteSets) {
        this.favoriteSets = data.favoriteSets
      }
      this.dialogSaveSet = false
    },
    async handleSelectedSet() {
      const data = await M('getSetDetails^MWS', {
        set: this.selectedSet
      })
      if (data && data.data && data.data.favoriteSet) {
        const set = data.data.favoriteSet
        this.selectedRes = set.res
        this.selectedNoDays = set.day
        this.selectedTypeofDays = set.tday,
        this.selectedType = set.type
        this.key = new Date().getTime()
      }
    }
  }
}
</script>
