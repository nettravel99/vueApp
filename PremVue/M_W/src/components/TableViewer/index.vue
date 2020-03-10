<template>
  <div :key="$route.meta.path" class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/neo.css'
// require('script-loader!jsonlint')
import 'codemirror/mode/asciiarmor/asciiarmor'
// import "codemirror/addon/display/autorefresh";

// import "./autorefresh";
// import 'codemirror/addon/lint/lint'
// import 'codemirror/addon/lint/json-lint'

export default {
  name: 'TableViewer',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      TableViewer: false
    }
  },
  watch: {
    value(value) {
      // const editor_value = this.TableViewer.getValue();
      this.TableViewer.setValue(String(value))
      setTimeout(() => {
        this.TableViewer.refresh()
        this.TableViewer.focus()
      }, 1000)
    },
    ID() {
      this.$destroy()
    }
  },
  mounted() {
    this.TableViewer = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      // gutters: ["CodeMirror-lint-markers"],
      theme: 'neo',
      lint: false,
      autofocus: true,
      readOnly: 'nocursor'
      //   autoRefresh :true
    })

    this.TableViewer.setValue(String(this.value))
    this.TableViewer.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.TableViewer.getValue()
    }
  }
}
</script>

<style scoped>
.json-editor {
  height: 100%;
  position: relative;
}
.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
}
.json-editor >>> .CodeMirror-scroll {
  min-height: 300px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>
