<template>
  <component
    :is="spinners[Math.floor(Math.random() * spinners.length)]"
    :loading="loading"
    :color="color"
    :size="size"
    :margin="margin"
    :radius="radius"
  />
</template>
<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import GridLoader from 'vue-spinner/src/GridLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import SkewLoader from 'vue-spinner/src/SkewLoader.vue'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import SquareLoader from 'vue-spinner/src/SquareLoader.vue'

export default {
  name: 'Spinner',
  components: {
    PulseLoader,
    GridLoader,
    ClipLoader,
    RiseLoader,
    BeatLoader,
    SyncLoader,
    RotateLoader,
    FadeLoader,
    PacmanLoader,
    ScaleLoader,
    SkewLoader,
    MoonLoader,
    RingLoader,
    BounceLoader,
    DotLoader,
    SquareLoader
  },
  props: ['loading', 'color', 'size', 'margin', 'radius'],
  data() {
    return {
      spinners: [
        'PulseLoader',
        'GridLoader',
        'ClipLoader',
        'RiseLoader',
        'BeatLoader',
        'SyncLoader',
        'RotateLoader',
        'FadeLoader',
        'PacmanLoader',
        'SquareLoader',
        'ScaleLoader',
        'SkewLoader',
        'MoonLoader',
        'RingLoader',
        'BounceLoader',
        'DotLoader'
      ]
    }
  }
}
</script>
