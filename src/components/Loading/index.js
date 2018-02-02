import Vue from 'vue'
const LoadingConstructor = Vue.extend(require('./Loading.vue').default)

export default {
  install: Vue => {
    const toggleLoading = (el, binding) => {
      if (binding.value) {
        Vue.nextTick(() => {
          if (binding.modifiers.fullscreen) {
            el.originalPosition = document.body.style.position
            el.originalOverflow = document.body.style.overflow
            insertDom(document.body, el, binding)
          } else {
            el.originalPosition = el.style.position
            insertDom(el, el, binding)
          }
        })
      } else {
        if (el.domVisible) {
          el.instance.$on('after-leave', () => {
            el.domVisible = false
            if (binding.modifiers.fullscreen && el.originalOverflow !== 'hidden') {
              document.body.style.overflow = el.originalOverflow
            }
            if (binding.modifiers.fullscreen) {
              document.body.style.position = el.originalPosition
            } else {
              el.style.position = el.originalPosition
            }
          })
          el.instance.visible = false
        }
      }
    }

    const insertDom = (parent, el, binding) => {
      if (!el.domVisible) {
        Object.keys(el.loadingStyle).forEach(property => {
          el.loading.style[property] = el.loadingStyle[property]
        })
        if (el.originalPosition !== 'absolute') {
          parent.style.position = 'relative'
        }
        if (binding.modifiers.fullscreen) {
          parent.style.overflow = 'hidden'
        }
        el.domVisible = true
        parent.appendChild(el.loading)
        Vue.nextTick(() => {
          el.instance.visible = true
        })
        el.domInserted = true
      }
    }

    Vue.directive('loading', {
      bind: (el, binding) => {
        const loading = new LoadingConstructor({
          el: document.createElement('div'),
          data: {
            text: el.getAttribute('loading-text'),
            fullscreen: !!binding.modifiers.fullscreen
          }
        })
        el.instance = loading
        el.loading = loading.$el
        el.loadingStyle = {}
        toggleLoading(el, binding)
      },
      update: (el, binding) => {
        el.instance.setText(el.getAttribute('loading-text'))
        if (binding.oldValue !== binding.value) {
          toggleLoading(el, binding)
        }
      },
      unbind: (el, binding) => {
        if (el.domInserted) {
          if (binding.modifiers.fullscreen) {
            document.body.removeChild(el.loading)
          } else {
            el.loading &&
            el.loading.parentNode &&
            el.loading.parentNode.removeChild(el.loading)
          }
        }
      }
    })
  }
}
