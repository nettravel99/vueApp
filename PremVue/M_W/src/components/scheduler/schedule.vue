<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div style="float:left; width: 150px;padding-left:5px;">
          <br>
          <span>
            <center>{{ nav && nav.selectionStart ? moment(new Date(nav.selectionStart)).format('L') + '': '' }}</center>
          </span>
          <el-date-picker v-model="cDate" type="date" placeholder="Pick a day" :picker-options="pickerOptions" style="vertical-align:top;padding-top: 2px;width:140px" size="mini" @change="emitReloadSet" />
          <br><br>
          <span>ViewType</span>
          <el-select v-model="cView" style="vertical-align:top;padding-top: 2px;width:140px" filterable reserve-keyword placeholder="Days" size="mini" @change="handleViewChange">
            <el-option :key="'viewtype-r'" :label="'Resources'" :value="'Resources'" />
            <el-option :key="'viewtype-d'" :label="'Day Combined'" :value="'Day'" />
            <el-option :key="'viewtype-w'" :label="'Week Combined'" :value="'Week'" />
          </el-select>
          <br v-if="cView ==='Resources'"><br v-if="cView ==='Resources'">
          <span v-if="cView ==='Resources'"># of Days</span>
          <el-input-number v-if="cView ==='Resources'" v-model="dayToShow" size="mini" :min="1" :max="7" style="vertical-align:top;padding-top: 2px;width:140px" @change="emitReloadSet" />
          <br v-if="cView ==='Resources'"><br v-if="cView ==='Resources'">
          <span v-if="cView ==='Resources'">Day of The Week</span>
          <el-select v-if="cView ==='Resources'" v-model="cSelectedDays" style="vertical-align:top;padding-top: 2px;width:140px" filterable remote reserve-keyword placeholder="Days" size="mini" multiple @change="emitReloadSet">
            <el-option :key="'resource-monday'" :label="'Monday'" :value="1" />
            <el-option :key="'resource-tuesday'" :label="'Tuesday'" :value="2" />
            <el-option :key="'resource-wednesday'" :label="'Wednesday'" :value="3" />
            <el-option :key="'resource-thursday'" :label="'Thursday'" :value="4" />
            <el-option :key="'resource-friday'" :label="'Friday'" :value="5" />
            <el-option :key="'resource-saturday'" :label="'Saturday'" :value="6" />
            <el-option :key="'resource-sunday'" :label="'Sunday'" :value="7" />
          </el-select>
          <br><br>
          <span>Resources</span>
          <el-select v-model="selRes" style="vertical-align:top;padding-top: 2px;width:140px" filterable reserve-keyword placeholder="Resources" size="mini" multiple @change="emitReloadSet">
            <el-option v-for="(item,index) in resources" :key="'resource-'+index" :label="item.name.substring(0,13)" :value="item.id">
              <span :style="{'background-color':item.color}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>{{ item.id }} {{ item.name }}</span>
            </el-option>
          </el-select>
        </div>
        <el-card v-loading="loading" style="margin-left: 150px;" :body-style="{ padding: '0px' }" element-loading-text="Loading Appointments..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <div style="height:90vh;">
            <calendar id="dp" ref="calendar" :config="initConfig" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <bookingDialog :id="aptid" v-model="booking" :args="bookingArgs" :resource="selectedRes" :date="bookingArgs.start" :resources="resources" @reload="handlecChange" @message="showMessage" />
  </div>
</template>
<style>
  @import './calendar_transparent.css';
  .intrahour {
    background-color: turquoise !important;
  }
  .svg-icon-scheduler {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
    padding-right: 5px;
    width: 5em !important;
    height: 5em !important;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
<script>
import DayPilot from '@/components/scheduler/daypilot-all.min'
import {
  M
} from '@/api/index'
import moment from 'moment'
import bookingDialog from '@/components/scheduler/bookingDialog'
import NProgress from 'nprogress'
// import genLookup from "@/components/lookups/index";
export default {
  components: {
    bookingDialog
  },
  props: {
    set: String,
    nday: String,
    tday: Array,
    sres: Array,
    day: [Date, String],
    vtype: String
  },
  data() {
    const _vm = this
    return {
      pickerOptions: {
        disabledDate() {
          return false // time.getTime() > Date.now();
        },
        shortcuts: [{
          text: 'Today',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: 'Yesterday',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: 'A week ago',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      cDate: this.day,
      cSelectedDays: this.tday,
      loading: '',
      selectedRes: '',
      favoriteSets: [],
      formSaveSet: {},
      dialogSaveSet: false,
      dayToShow: this.nday,
      cellbg: {},
      aptid: '',
      booking: false,
      bookingArgs: {},
      testing: '',
      moment: moment,
      endDate: '',
      startDate: this.day,
      beginHour: 9,
      endHour: 17,
      cSelectedlocation: [],
      cSelectedAppointmentType: [],
      cSelectedResource: this.sres,
      selRes: this.sres,
      cLoading: false,
      locations: [],
      resources: [],
      appointmentTypes: [],
      nav: null,
      cView: this.vtype || 'Resources',
      form: {
        lc: '',
        id: '',
        account: '',
        apptType: '',
        chkin: '',
        citystate: '',
        comments: '',
        date: '',
        dg: '',
        dob: '',
        dp: '',
        group: '',
        ins: '',
        lang: '',
        length: 15,
        noshow: '',
        nosms: '',
        notes: '',
        place: '',
        pnotes: '',
        policy: '',
        preferred: '',
        proc: '',
        ref: '',
        sex: '',
        ssn: '',
        time: '',
        work: '',
        zip: '',
        ad1: '',
        ad2: '',
        cell: '',
        home: '',
        emergency: '',
        name: '',
        resource: ''
      },
      initConfig: {
        theme: 'calendar_transparent',
        startDate: this.cDate,
        dayBeginsHour: 8,
        dayEndsHour: 18,
        BusinessBeginsHour: 8,
        BusinessEndsHour: 18,
        heightSpec: 'Parent100Pct',
        cellDuration: 15,
        rowMinHeight: 60,
        viewType: this.vtype,
        timeRangeSelectedHandling: 'Enabled',
        eventDoubleClickHandling: 'Enabled',
        timeRangeDoubleClickHandling: 'Enabled',
        onBeforeCellRender: function(args) {
          if (args && args.cell && _vm.cView === 'Resources') {
            if (
              args.cell.resource &&
                _vm.cellbg['D' + args.cell.start] &&
                _vm.cellbg['D' + args.cell.start]['R' + args.cell.resource]
            ) {
              let text = _vm.cellbg['D' + args.cell.start][
                'R' + args.cell.resource
              ].split('|')[0]
              let color = _vm.cellbg['D' + args.cell.start][
                'R' + args.cell.resource
              ].split('|')[1]
              if (text === '~~') {
                color = '#C0C0C0'
                text = ''
              }
              const html = `<span style="font-size:11px;color:gray;float:right;padding-right:25px">${text}<span>`
              args.cell.backColor = color
              args.cell.html = html
            }
            // args.cell.html="hola there"
            // console.log(args)
          } else {
            args.cell.backColor = 'white'
          }
          /*
            console.log(args.cell);
            if (args.cell.end.getMinutes() > 0) {
              args.cell.cssClass = "intrahour";
            }
            */
        },
        onEventDoubleClick: function(args) {
          // _vm.aptid = args.e.id();
          _vm.$store.dispatch('editBooking', {
            id: args.e.id(),
            new: false
          })
          _vm.$nextTick(() => {
            _vm.booking = true
          })
        },
        onTimeRangeDoubleClick(args) {
          _vm.$store.dispatch('addBooking', {
            start: args.start,
            end: args.end,
            resource: args.resource,
            new: true,
            id: ''
          })
          _vm.$nextTick(() => {
            _vm.booking = true
          })
        },
        eventDeleteHandling: 'Disabled',
        onEventMoved: async function(e) {
          const date = e.newStart
          const id = e.e.id()
          const res = e.newResource
          if (await _vm.handleMove(id, date, res)) { this.message('Appointment moved') }
        },
        onEventResized: async function(e) {
          const date = e.newStart
          let res
          const length = _vm.diff_minutes(e.newEnd, date)
          const id = e.e.id()
          if (await _vm.handleMove(id, date, res, length)) { this.message('Appointment resized') }
        },
        onBeforeEventRender: function() {
          // args.data.barColor = args.data.color;
          /*
            args.data.areas = [
              {
                top: 6,
                right: 2,
                icon: "icon-triangle-down",
                visibility: "Hover",
                action: "ContextMenu",
                style:
                  "font-size: 12px; background-color: #f9f9f9; border: 1px solid #ccc; padding: 2px 2px 0px 2px; cursor:pointer;"
              } DayPilot.Calendar.dispose()
            ];
            */
        },
        onBeforeHeaderRender: function(args) {
          if (_vm.viewType !== 'Resouces') return
          args.header.html = "<span title='" + args.header.name + "'>" + args.header.name + '</span>'
        },
        contextMenu: new DayPilot.Menu({
          items: [{
            text: 'Delete',
            onClick: function(args) {
              var e = args.source
              this.calendar.events.remove(e)
              this.calendar.message('Deleted.')
            }
          },
          {
            text: '-'
          },
          {
            text: 'Blue',
            icon: 'icon icon-blue',
            color: '#1155cc',
            onClick: function(args) {
              this.updateColor(args.source, args.item.color)
            }
          },
          {
            text: 'Green',
            icon: 'icon icon-green',
            color: '#6aa84f',
            onClick: function(args) {
              this.updateColor(args.source, args.item.color)
            }
          },
          {
            text: 'Yellow',
            icon: 'icon icon-yellow',
            color: '#f1c232',
            onClick: function(args) {
              this.updateColor(args.source, args.item.color)
            }
          },
          {
            text: 'Red',
            icon: 'icon icon-red',
            color: '#cc0000',
            onClick: function(args) {
              this.updateColor(args.source, args.item.color)
            }
          }
          ]
        })
      }
    }
  },
  computed: {
    // DayPilot.Calendar object
    // https://api.daypilot.org/daypilot-calendar-class/
    calendar: function() {
      return this.$refs.calendar.control
    }
  },
  watch: {
    cView(v) {
      if (v === 'Day' || v === 'Week') {
        this.cSelectedDays = []
        this.dayToShow = 0
      }
    }
  },
  async created() {
    const data = await M('getCodes^MWS')
    if (data && data.data && data.data.resources) {
      this.resources = data.data.resources
      // this.cSelectedResource[0]=this.resources[0]
    }
    if (data && data.data && data.data.appointmentTypes) {
      this.appointmentTypes = data.data.appointmentTypes
    }
    if (data && data.data && data.data.locations) {
      this.locations = data.data.locations
    }
    if (data && data.data && data.data.favoriteSets) {
      this.favoriteSets = data.data.favoriteSets
    }
  },
  beforeDestroy() {
    if (!this.calendar) {
      return
    }
    this.calendar.dispose()
  },
  async mounted() {
    // this.loadEvents();
    // let _vm = this;
    var dp = this.calendar
    dp.headerLevels = 2
    // var nav = new DayPilot.Navigator("nav");
    // this.nav = nav;
    // nav.select("2017-03-13")
    // this.nav.showMonths = 1;
    /*
      this.nav.onTimeRangeSelected = function(args) {
        dp.startDate = args.start;
        _vm.startDate = args.start;
        _vm.endDate = args.end;
        dp.update();
        _vm.handlecChange();
      };
      //nav.selectMode = this.cView==="Resources" ? 'Day':this.cView;
      nav.init();
      _vm.startDate = nav.selectionStart;
      _vm.endDate = nav.selectionEnd;
      */
    dp.bubble = new DayPilot.Bubble({
      cssOnly: true,
      cssClassPrefix: 'bubble_default',
      onLoad: function(args) {
        var ev = args.source
        args.async = true // notify manually using .loaded()
        // simulating slow server-side load
        setTimeout(function() {
          // console.log("ev", ev);
          args.html = 'testing bubble for: <br>' + ev.text()
          args.loaded()
        }, 500)
      }
    })
    await this.handlecChange()
  },
  methods: {
    handleViewChange() {
      const v = this.cView
      if (v === 'Day' || v === 'Week') {
        this.cSelectedDays = []
        this.dayToShow = 0
      }
      this.emitReloadSet()
    },
    diff_minutes(dt2, dt1) {
      var diff = (dt2.getTime() - dt1.getTime()) / 1000
      diff /= 60
      return Math.abs(Math.round(diff))
    },
    getTime(t) {
      let ap = 'AM'
      let hours = new Date(t).getHours() + ''
      if (hours >= 12) {
        hours = hours - 12
        ap = 'PM'
      }
      if (hours == 0) hours = 12
      if (hours.length == 1) hours = '0' + hours
      let minutes = new Date(t).getMinutes() + ''
      if (minutes.length == 1) minutes = '0' + minutes
      return `${hours}:${minutes} ${ap}`
    },
    async handleSelectedSet() {
      const data = await M('getSetDetails^MWS', {
        set: this.selectedSet
      })
      if (data && data.data && data.data.favoriteSet) {
        const set = data.data.favoriteSet
        this.cSelectedlocation = set.app
        this.sres = set.res
        this.cSelectedlocation = set.loc
        this.dayToShow = set.day
      }
      setTimeout(async() => {
        await this.handlecChange()
      }, 10)
    },
    showMessage(message) {
      const dp = this.calendar
      dp.message(`${message}`)
    },
    updateColor: function(e, color) {
      var dp = this.calendar
      e.data.color = color
      dp.events.update(e)
      dp.message('Color updated')
    },
    async handlecChange() {
      // this.loading = true;
      NProgress.start()
      this.aptid = ''
      // this.nav.selectMode = this.cView==="Resources" ? 'Day': this.cView;
      // this.nav.update();
      const dp = this.calendar
      const view = this.cView
      const data = await M('getSchedule^MWS', {
        view: view,
        res: this.sres,
        startDate: this.cDate, // this.nav.selectionStart,
        day: this.cDate, // this.nav.selectionDay,
        dayToShow: this.dayToShow,
        tday: this.tday
      })
      //
      if (data && data.data && data.data.resources) {
        this.resources = data.data.resources
      }
      if (data && data.data && data.data.locations) {
        this.locations = data.data.locations
      }
      if (data && data.data && data.data.appointmentTypes) {
        this.appointmentTypes = data.data.appointmentTypes
      }
      if (data && data.data && data.data.start) {
        dp.startDate = data.data.start
        this.cDate = data.data.start
      }
      if (data && data.data && data.data.columns && this.cView === 'Resources') {
        dp.columns = data.data.columns
      }
      if (data && data.data && data.data.cellbg) {
        this.cellbg = data.data.cellbg
      }
      dp.viewType = this.cView
      dp.init()

      if (data && data.data && data.data.events) {
        try {
          this.calendar.update({
            events: data.data.events
          })
        } catch (e) {
          this.$alert('Scheduler Error', 'Please refresh the page \n' + e.message, {
            confirmButtonText: 'OK',
            callback: () => {
              this.$router.go()
            }
          })
        }
      }
      // this.loading = false;
      NProgress.done()
    },
    async favoriteSaveSet() {
      const payload = {
        res: this.sres,
        loc: this.cSelectedlocation,
        apt: this.cSelectedAppointmentType,
        day: this.dayToShow
      }
      this.formSaveSet.set = payload
      await M('favoriteSaveSet^MWS', this.formSaveSet)
      const data = await M('getSets^MWS')
      if (data && data.favoriteSets) {
        this.favoriteSets = data.favoriteSets
      }
      this.dialogSaveSet = false
    },
    async handleMove(val, sDate, res, len) {
      let data = await M('BOOKDET^MWS', {
        id: val
      })
      let form
      if (data && data.data && data.data.form) {
        form = { ...this.form,
          ...data.data.form
        }
        form.date = sDate
        form.time = this.getTime(sDate)
        form.id = val
        if (res) form.resource = res
        if (len) form.length = len
      } else {
        return false
      }
      data = await M('book^MWS', form)
      if (data && data.data && data.data.status) {
        const status = data.data.status
        if (status !== 'BOOKED') {
          this.$alert(status)
        } else {
          if (data && data.data && data.data.seqn) {
            await this.handlecChange()
            return true
          } else {
            this.$alert(status)
          }
        }
      }
    },
    emitReloadSet() {
      // await this.handlecChange();
      // return
      this.$emit('reloadSet', {
        nday: this.dayToShow,
        res: this.selRes,
        tday: this.cSelectedDays,
        day: this.cDate, // this.nav.startDate
        vtype: this.cView
      })
    }
  }
}
</script>
