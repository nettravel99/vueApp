<template>
    <el-table border size="mini" :data="tableData" style="font-size:10.5px;max-width:720px" height="100">
        <el-table-column :show-overflow-tooltip="col.colType !== 'table' && col.colType !== 'selection'" v-for="(col) in columns" :prop="col.prop" :label="col.label" :key="col.prop" :width="col.size > 7 ? col.size*8 : col.size*12">
            <template slot-scope="scope">
                 <simple-table :row="scope.row" v-if="scope.row['Type'+col.prop]==='S'" :col="col" />
                 <complex-table :row="scope.row" v-if="scope.row['Type'+col.prop]==='C'" :col="col" v-model="checks[scope.row['C0']]"/>
                <span v-if="col.colType !== 'table' && col.colType !== 'selection'">{{scope.row[col.prop]}}</span>
                <el-checkbox v-if="col.colType === 'selection'" @change="handleSelect(scope.row)"></el-checkbox>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import SimpleTable from './SimpleTable';
import ComplexTable from './ComplexTable';
export default {
    components:{
        SimpleTable,
        ComplexTable
    },
    data() {
        return {
            multipleSelection: [],
            checks:{}
        }
    },
    props: ['frame', 'extraValues'],
    mounted() {
    },
    computed: {  
        finalValue(){ 
           let out = [];
           let values = this.multipleSelection.map(row =>{
                row.checks = this.checks[row.C0].map(r => r.C0)
                return row;
            })
            values.map(r =>{
                out.push(`${r.C0}\t${r.C1}\t${r.C2}\t${r.C3}\t${r.C4}\t${r.C5}\t${''}\t${r.checks.join('*$C(220)*')}\t${1}\t`)
            })
            return out.join('*$C(230)*');
        },

        columns() {
            let outTable = [];
            let table = this.frame.split('\t') || [];
            table.shift();
            table.map((column, i) => {
                let col = column.split('^')[0];
                let colName = col.substring(0, col.length - 9);
                let colSize = col.substring(col.length - 4, col.length - 2);
                let colType = col.substring(col.length - 8, col.length - 7);
                let type
                if (colType === 'R') {
                    type = 'selection'
                } else if (colType === 'N') {
                    type = 'table'
                }
                outTable.push({
                    prop: 'C' + i,
                    label: colName,
                    size: colSize,
                    colType: type
                });
            })
            return outTable
        },
        tableData() {
            let out = [];
            let table = this.frame.split('\t') || [];
            table.shift();
            if (!this.extraValues) return [];
            this.extraValues.map((rec) => {
                let row = {};
                rec.split('\t').map((field, i) => {
                    let column;
                    if (field.indexOf(String.fromCharCode(1)) > -1) {
                        column = field.split(String.fromCharCode(1))[0]
                        let checks = field.split(String.fromCharCode(1))

                        if (checks[1].indexOf('�') > -1) {
                            row["TypeC" + i] = "C"
                            row["TypeC" + i + "D"] = checks[1].split('�');
                            row["TypeC" + i + "F"] = table[i]

                        } else if (checks[1].indexOf('\r') > -1) {
                            row["TypeC" + i] = "S"
                            row["TypeC" + i + "D"] = checks[1].split('\r');
                            row["TypeC" + i + "F"] = table[i]
                        }
                    } else {
                        column = field;
                    }
                    row["C" + i] = column
                })
                out.push(row);
            })
            return out
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSelect(row) {
            if (!this.multipleSelection.includes(row)){
                this.multipleSelection.push(row);
            } else {
                var index = this.multipleSelection.indexOf(row)
                if (index > -1 ){
                    this.multipleSelection.splice(index,1)
                }
            }
            this.$emit('input',this.finalValue)
            this.$emit('change',this.finalValue)
        }
    },
}
</script>

<style>
.el-table--mini th,
.el-table--mini td {
    padding: 2px 0 !important;
}
</style>
