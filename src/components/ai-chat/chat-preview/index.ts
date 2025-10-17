import type MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import { createVNode, getCurrentInstance, render as vueRender, type AppContext } from 'vue'

export interface MDCustomPluginComponentOptions {
  /**Vue3 组件 */
  component: any
  /**组件强制渲染，默认false, 在renderIntermediate:true下有效，
   * 即中间态数据仍展示自定义组件时，在数据接收完成后true重新强制渲染组件，false则只是重新处理传入props*/
  forceMount?: boolean
  /**默认false 组件接收完整数据前是否渲染中间态，需组件内部处理数据不完整清空，字符串数据或无法解析的json数据都会当做字符串通过propsKey(默认data)传递给组件 */
  renderIntermediate?: boolean
  loadingText?: string
  /**默认false，当数据为json字符串时，false时则将数据通过propsKey传入组件，true则将数据尝试转为json再通过propsKey形式传入 */
  propsUseJson?: boolean
  /** propsUseJson:true下有效，解析json成功后，解构json，将json的每个key作为props传入，以支持多参数，解析json失败则以propsKey形式以字符串形式传入*/
  multipleProps?: boolean
  /**vue组件接受的prop值 默认_data ,覆盖全局的propsKey， 同时vue组件会额外传入 _isComplete:boolean, true则表示数据接收完全*/
  propsKey?: string
  /**占位区域class 默认chat-placeholder*/
  placeholderClass?: string
}

export interface MdCustomPluginOptions {
  /**自定义组件map */
  components: Record<string, MDCustomPluginComponentOptions>
  /**占位区域class 默认chat-placeholder*/
  placeholderClass?: string
  /**vue组件接受的prop值 默认_data ,同时vue组件会额外传入 _isComplete:boolean, true则表示数据接收完全 */
  propsKey?: string
  /**是否开启debug 错误输出模式，默认false */
  debug?: boolean
}

// mountedMap 现在只存储 vnode 和 el 的弱引用
type MountedMapType = {
  el: WeakRef<HTMLElement>
  vnode: any
  complete: boolean
}

/**
 * 执行 组件monted时 的参数
 */
type MontedOrUpdateType = {
  el: HTMLElement
  isComplete: boolean
  propsUseJson: boolean
  multipleProps: boolean
  component: any
  propsKey: string
  content: string
  uid: string
  forceMount: boolean
  appContext?: AppContext
  mountedMap: Map<string, MountedMapType>
  debug?: boolean
}

const pluginName = 'custom-component-plugin'
let globalFnInstanceIndex = 0
let globalMdInstanceIndex = 0

/**
 * 创建一个 markdown-it 插件实例，用于在 markdown 中嵌套使用自定义 Vue3 组件。
 * @returns 返回一个包含 `plugin` 函数和 `destroy` 函数的对象。
 */
export default function customComponentPlugin() {
  globalFnInstanceIndex++
  const mountedMap = new Map<string, MountedMapType>()
  const queue: (() => void)[] = []
  let scheduled = false
  const appContext: AppContext | undefined =
    getCurrentInstance()?.appContext || (window as any)?.__APP__?._context

  // 识别容器的固定标记
  const marker = ':::'

  /**
   * markdown-it 插件函数
   * @param md markdown-it 实例
   * @param options 插件配置，在 md.use() 时传入
   */
  const customPlugin = (md: MarkdownIt, options: MdCustomPluginOptions) => {
    if (!options?.components || typeof options.components !== 'object') {
      throw new Error(`[${pluginName}] Missing "components" option or need to be an object`)
    }
    globalMdInstanceIndex++
    const instanceId = `${new Date().getTime()}_${globalMdInstanceIndex}_${globalFnInstanceIndex}`

    if ((md as any)[`_customComponentPluginInstalled_${instanceId}`]) return
    ;(md as any)[`_customComponentPluginInstalled_${instanceId}`] = true

    const debug = options.debug || false
    const registeredTags = Object.keys(options.components)

    function getElOrCleanup(uid: string) {
      return mountedMap.get(uid)?.el?.deref?.()
    }

    const schedule = (fn: () => void) => {
      queue.push(fn)
      if (!scheduled) {
        scheduled = true
        requestAnimationFrame(() => {
          if (mountedMap.size > 0 || queue.length > 0) {
            queue.forEach((job) => job())
          }
          queue.length = 0
          scheduled = false
        })
      }
    }

    // *** 核心修改点 ***
    // 不再为每个组件单独注册 use(container)，而是只注册一次
    // 使用一个统一的、能被识别的名称，例如 'custom-container'
    md.use(container, 'custom-container', {
      // 1. 使用固定的、默认的 marker 字符。
      //    这样插件才能正确识别以 ':::' 开头的行。
      marker: ':',

      // 2. 在 validate 函数中，检查 ':::' 后面的 tag 是否是我们注册过的组件。
      validate: function (params: string) {
        if (!params) return false
        // params 是 ':::' 后面的所有内容，例如 ' my-component {"foo":"bar"} :::'
        // const firstTagName = params?.trim?.() // 提取第一个词作为 tag
        const firstTagName = params?.trim?.().split(/\s+/)[0] // 提取第一个词作为 tag
        // 检查这个 tag 是否在我们的组件列表中
        return registeredTags.some((tag) => firstTagName.indexOf(tag) > -1)
      },

      // 3. 在 render 函数中，动态处理不同的组件
      render(tokens: any[], idx: number) {
        const token = tokens[idx]
        const info = token?.info?.trim?.() || ''

        // token.nesting === 1 代表是起始标签 ':::'
        if (token.nesting !== 1) {
          return '' // 如果不是起始标签，直接返回空字符串
        }
        const tag = info.split(/\s+/)[0] // 从 info 中解析出 tag
        const config = options.components[tag] // 根据 tag 获取对应的组件配置

        if (!config) {
          return `<!-- [${pluginName}] Error: Component config for tag "${tag}" not found. -->`
        }

        const uid = `${instanceId}-${idx}`
        let content = info.substring(tag.length).trim()
        const isComplete = content.endsWith(marker)
        content = content.replace(new RegExp(`${marker}$`), '').trim()

        const loadingText = config.loadingText || '加载中...'
        const forceMount = config.forceMount || false
        const renderIntermediate = config.renderIntermediate || false
        const propsUseJson = config.propsUseJson || false
        const component = config.component
        const multipleProps = config.multipleProps || false
        const propsKey = config.propsKey || options.propsKey || '_data'
        const placeholderClass =
          config.placeholderClass || options.placeholderClass || 'custom-placeholder'
        const className = `md-custom-component-${uid}`
        const shouldRender = isComplete || renderIntermediate

        const placeholderHtml = `<span class="${placeholderClass} ${isComplete ? 'custom-is-complete' : ''} ${tag} ${className}">${loadingText}</span>`

        if (!shouldRender) {
          return placeholderHtml
        }

        if (mountedMap.get(uid)?.complete) {
          const el = getElOrCleanup(uid)
          if (el) {
            return el.outerHTML
          }
        }

        schedule(() => {
          let el: any = getElOrCleanup(uid)
          el = el || document.querySelector<HTMLElement>(`.${className}`)
          if (!el) return
          mountedOrUpdateHand({
            el,
            uid,
            isComplete,
            propsUseJson,
            multipleProps,
            content,
            component,
            forceMount,
            propsKey,
            mountedMap,
            appContext: appContext,
            debug
          })
        })

        return placeholderHtml
      }
    })
  }

  const destroy = () => {
    mountedMap.forEach((info) => {
      const el = info.el?.deref?.()
      if (el) {
        vueRender(null, el)
      }
    })
    mountedMap.clear()
    queue.length = 0
  }

  return { customPlugin, destroy }
}

/**
 * 组件挂载 或 更新
 */
function mountedOrUpdateHand(params: MontedOrUpdateType) {
  const {
    el,
    isComplete,
    propsUseJson,
    multipleProps,
    component,
    propsKey,
    content,
    uid,
    mountedMap,
    forceMount,
    appContext,
    debug
  } = params

  const jsonStr: any = content
  let json: null | Record<string, any> = null
  if (isComplete && propsUseJson) {
    try {
      json = JSON.parse(jsonStr)
    } catch (e) {
      warn(`JSON parse failed for content: ${jsonStr}`, debug)
    }
  }

  const extendsProps = { _isComplete: isComplete }

  if (mountedMap.has(uid) && !forceMount) {
    const info = mountedMap.get(uid)
    const vnode = info?.vnode
    if (!vnode) {
      warn(`VNode not found for UID ${uid} on update.`, debug)
      return
    }
    mountedMap.set(uid, { ...info, el: new WeakRef(el), vnode, complete: isComplete })

    let newProps: Record<string, any> = {}
    if (!propsUseJson || !isComplete || json === null) {
      newProps = { [propsKey]: jsonStr }
    } else if (multipleProps) {
      newProps = { [propsKey]: undefined, ...json }
    } else {
      newProps = { [propsKey]: json }
    }
    Object.assign(vnode.component.props, { ...newProps, ...extendsProps })
    return
  }

  let initialProps: Record<string, any> = {}
  if (isComplete && propsUseJson && json !== null) {
    if (multipleProps) {
      initialProps = { ...json }
    } else {
      initialProps = { [propsKey]: json }
    }
  } else {
    initialProps = { [propsKey]: jsonStr }
  }

  const vnode = createVNode(component, { ...initialProps, ...extendsProps })

  if (appContext) {
    vnode.appContext = appContext
  } else {
    log('AppContext is null, global components/directives may not be available.', debug)
  }

  vueRender(null, el)
  el.innerHTML = ''
  vueRender(vnode, el)

  mountedMap.set(uid, { el: new WeakRef(el), vnode, complete: isComplete })
}

function log(str: string, debug = false) {
  if (debug) console.log(`[${pluginName}]`, str)
}

function warn(str: string, debug = true) {
  // Default debug to true for warnings
  if (debug) console.warn(`[${pluginName}]`, str)
}
