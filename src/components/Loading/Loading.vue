<template lang='pug'>
  transition(name="loading" @after-leave="handleAfterLeave")
    div(
      v-show="visible"
      class="loading-mask"
      :class={'fullscreen': fullscreen}
    )
      .spinner
        .spinner__loading
          each val in [1,2,3,4,5]
            div(class='rect' + val)
        div.loading-text(v-if="text") {{ text }}
</template>
<script>
export default {
  name: 'loading',
  data () {
    return {
      visible: true,
      fullscreen: true,
      text: null
    }
  },
  methods: {
    handleAfterLeave () {
      this.$emit('after-leave')
    },
    setText (text) {
      this.text = text
    }
  }
}
</script>
<style lang='stylus'>
.loading-enter-active
  animation loading-in .4s ease
.loading-leave-active
  animation loading-out .4s ease forwards

@keyframes loading-in
  0%
    opacity 0
  100%
    opacity 0.6

@keyframes loading-out
  0%
    opacity 0.6
  100%
    opacity 0

// loading

.loading-mask
  position absolute
  z-index 10000
  background-color rgba(255,235,215, .8)
  margin 0
  top 0
  right 0
  bottom 0
  left 0
  transition opacity .3s
  &.fullscreen
    position fixed
  .spinner
    top 50%
    margin-top -50px
    width 100%
    text-align center
    position absolute
    .loading-text
      margin 3px 0
      font-size 14px
    &__loading
      margin 0 auto
      width 50px
      height 50px
      text-align center
      font-size 10px
      &>div
        background-color #4e4e4e
        height 100%
        width 6px
        display inline-block
        margin 0 2px
        animation spinner-loading 1.2s infinite ease-in-out
    .rect2
      animation-delay -1.1s
    .rect3
      animation-delay -1.0s
    .rect4
      animation-delay -0.9s
    .rect5
      animation-delay -0.8s
@keyframes spinner-loading
  0%, 40%, 100%
    transform scaleY(0.5)
  20%
    transform scaleY(1.0)
</style>
