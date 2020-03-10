<template>
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 116.000000 80.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)"
      fill="#108bb7"
      stroke="none"
    >
      <path
        d="M375 513 c-110 -153 -237 -329 -282 -391 -46 -62 -83 -115 -83 -118
0 -2 101 -4 224 -4 l224 0 168 233 c92 127 168 239 168 247 1 14 -203 308
-214 310 -3 0 -95 -125 -205 -277z"
      />
      <path
        d="M762 324 l-63 -86 83 -118 83 -119 128 -1 c70 0 127 2 127 5 0 5
-290 405 -294 405 0 0 -29 -39 -64 -86z"
      />
      <path
        d="M601 99 c-35 -49 -61 -92 -59 -95 3 -2 65 -3 138 -2 l132 3 -71 93
c-39 50 -73 92 -74 92 -1 0 -31 -41 -66 -91z"
      />
    </g>
  </svg>
</template>

<script>
export default {
  data: () => ({
    width: null,
    height: null
  }),

  beforeCreate() {
    if (this.props && this.props.width) {
      this.width = (this.props.width / 100) * 116.0
    } else {
      this.width = 116.0
    }
    if (this.props && this.props.height) {
      this.height = (this.props.height / 100) * 80.0
    } else {
      this.height = 80.0
    }
  }
}
</script>
