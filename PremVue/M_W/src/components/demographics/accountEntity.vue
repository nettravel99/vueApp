<template>
  <div>
    <el-button size="mini" type="primary" round :title="entities" @click="dialogVisible = true">Active In {{ entities.slice(0,5).join(',')+'...' }}</el-button>
    <el-dialog :title="'Change The Acitv Entity For Account: '+account" :visible.sync="dialogVisible" width="60%">
      <el-row>
        <el-col :span="24" style="display:inline-block">
                    &nbsp;&nbsp;
          <el-checkbox-group v-model="entities">
            <el-checkbox v-for="entity in allEntities" :key="'ent'+entity" style="width:300px;" :value="entity" :label="entity">
              {{ entity + '-' + names['E'+entity] }}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  M
} from '@/api/index'
export default {
  props: {
    account: String
  },
  data() {
    return {
      dialogVisible: false,
      entities: [],
      names: {},
      selEntities: [],
      allEntities: []
    }
  },
  async mounted() {
    const data = await M('getAccountEnity^MWD', {
      k: this.account
    })
    if (data && data.data && data.data.entities) {
      this.entities = data.data.entities.split(':')[2].split(',')
      this.allEntities = data.data.entities.split(':')[0].split(',')
    }
    if (data && data.data && data.data.definition) {
      this.names = data.data.definition
    }
  },
  methods: {
    sortNumber(a, b) {
      return a - b
    },
    async handleSave() {
      const data = await M('saveDemoEnt^MWD', {
        entities: this.entities.sort(this.sortNumber).join(','),
        account: this.account
      })
      if (data && data.data && data.data.status) {
        const status = data.data.status
        if (status == 1) {
          this.$message({
            message: 'Entities Saved Successfully',
            type: 'success'
          })
          this.$forceUpdate()
        } else {
          this.$message.error(status)
        }
      }
      this.dialogVisible = false
    }
  }
}
</script>
