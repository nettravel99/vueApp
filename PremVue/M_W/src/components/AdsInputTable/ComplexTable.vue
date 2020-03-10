<template>
<div>
    <el-button size="mini" type="text" @click="Dvalue = true">{{row[col.prop]}}</el-button>
    <el-dialog :title="col.label" :visible.sync="Dvalue" width="60%" center>
        <el-table border size="mini" ref="complexTable" :data="tableData" style="font-size:10.5px;" height="250">
            <el-table-column>
                <template slot-scope="scope">
                    <el-checkbox @change="handleSelect(scope.row)" checked></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip v-for="(col,i) in headers" :prop="'C'+i" :label="col" :key="'col'+i">

            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
    <el-button @click="validateTable">Ok</el-button>
  </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    props: ['row', 'col'],
    data() {
        return {
            Dvalue: false,
            selections: []
        }
    },
    created() {
        this.tableData.map(row => this.selections.push(row));
    },
    mounted() {
        this.$emit('input', this.selections);
        this.$emit('change', this.selections);
    },
    computed: {
        headers() {
            return this.chunkArray(this.row['Type' + this.col.prop + 'D'], 11)[0]
        },
        tableData() {
            let data = this.chunkArray(this.row['Type' + this.col.prop + 'D'], 11);
            data.shift();
            let out = [];
            data.map((row) => {
                let rowO = {};
                row.map((col, i) => {
                    rowO['C' + i] = col
                })
                out.push(rowO)
            })
            return out;
        }
    },
    methods: {
        validateTable() {
            if (this.selections.length < 1) {
                this.$alert('Atleast one check is required', 'Warning', {
                    confirmButtonText: 'Dismiss'
                });

            } else {
                this.Dvalue = false
            }
        },
        handleSelect(row) {
            if (!this.selections.includes(row)) {
                this.selections.push(row);
            } else {
                var index = this.selections.indexOf(row)
                if (index > -1) {
                    this.selections.splice(index, 1)
                }
            }
        },
        handleSelectionChange(val) {
            this.selections = val;
        },
        chunkArray(myArray, chunk_size) {
            var index = 0;
            var arrayLength = myArray.length;
            var tempArray = [];
            for (index = 0; index < arrayLength; index += chunk_size) {
                let myChunk = myArray.slice(index, index + chunk_size);
                tempArray.push(myChunk);
            }
            return tempArray;
        }
    }
}
</script>

<style>

</style>
