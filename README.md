# Markdown-it 或 md-editor-v3 Vue 自定义组件插件 (markdown-it-vue-custom-component)

这是一个为 [markdown-it](https://github.com/markdown-it/markdown-it)  或 md-editor-v3 设计的插件，它允许您在 Markdown 内容中无缝嵌入、渲染和交互自定义的 Vue 3 组件。

此插件特别适用于需要动态内容展示的场景，例如：

- 在文档中嵌入交互式图表或数据可视化组件。

- 在流式输出（如 AI 对话）中逐步渲染和更新组件。

- 创建丰富的、包含动态 Vue 应用的静态站点或文档。


---

#### [github](https://github.com/renqiankun/markdown-it-custom-component-demo)
#### [demo](https://renqiankun.github.io/markdown-it-custom-component-demo/dist/)
---

## ✨ 功能特性

- **Vue 3 组件支持**: 直接在 Markdown 中使用您最喜欢的自定义的Vue 3 组件。

- **动态数据传递**: 通过 Markdown 容器 将数据或 props 传递给组件。

- **流式渲染支持**: 支持在数据流未完全接收时渲染中间态（loading），并在数据接收完毕后更新组件，非常适合 AI 对话等场景，或在数据完成前直接展示您的组件，但此时需您的组件处理数据不完整的情况。

- **灵活的 Props 传递**:
  - 将 数据作为单个 prop 传递。
  - 将 JSON 字符串解析并作为单个 prop 传递。
  - 将 JSON 字符串解构，并将每个键值对作为独立的 props 传递给组件。

- **生命周期管理**: 插件提供了 `destroy` 方法，用于在宿主组件卸载时清理所有渲染的 Vue 组件实例，防止内存泄漏。

- **上下文继承**: 自动继承 Vue 的 `appContext`，让您的自定义组件可以访问全局注册的组件、指令和插件，若不传入`appContext`则可能组件内部无法使用全局组件及指令

- **高度可配置**: 为每个组件提供独立的配置，如是否强制重新挂载、是否渲染中间态等。

- **调试模式**: 内置 `debug` 模式，方便在控制台输出日志和警告，简化开发调试过程。

## 📦 安装

```bash
npm install markdown-it-custom-component
# 或者
yarn add markdown-it-custom-component
```

同时，确保您的项目中已安装 `markdown-it` 或`md-editor-v3`和 `vue`。

## 🚀 快速上手

在您的 Vue 项目中（例如，一个使用 `md-editor-v3` 的地方），您可以这样配置和使用它。

### 1. 创建插件实例

首先，从插件中导入 `customComponentPlugin` 工厂函数并创建一个实例。

```typescript
// 在你的 Vue 组件中
import { onUnmounted, getCurrentInstance } from 'vue';
import customComponentPlugin from 'markdown-it-custom-component'; // 插件名称

// 创建插件实例
const { customPlugin, destroy } = customComponentPlugin();

// 在组件卸载时调用 destroy 清理资源
onUnmounted(() => {
  destroy();
});
```

### 2. 配置 markdown-it 或 md-editor-v3

将 `customPlugin` 添加到 `markdown-it` 的插件列表中。如果您使用 `md-editor-v3`，可以像下面这样配置：

```typescript
import { onUnmounted, getCurrentInstance } from 'vue';
import { config } from 'md-editor-v3';
import MyComponent from './MyComponent.vue'; // 你的自定义 Vue 组件
import customComponentPlugin ,{ type MDCustomPluginComponentOptions } from 'markdown-it-custom-component';

// 创建插件实例
const { customPlugin, destroy } = customComponentPlugin();
// 获取 Vue 应用上下文
const appContext = getCurrentInstance()?.appContext;

config({
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        plugin: customPlugin,
        // 此处的options在markdown-it中一致。
        options: {
          debug: true, // 开启调试模式
          appContext: appContext, // 传入 Vue 上下文
          components: {
            // 注册一个名为 'my-component' 的容器，my-component此名称需和流式输出的一致
            'my-component': {
              component: MyComponent, // 关联 Vue 组件
              propsUseJson: true,    // 尝试将数据解析为 JSON
              multipleProps: true,   // 将 JSON 解构为多个 props
            } as MDCustomPluginComponentOptions
          }
        }
      }
    ];
  },
});

// markdown-it 参照 md.use(customPlugin,options)

// 在组件卸载时调用 destroy 清理资源
onUnmounted(() => {
  destroy();
});
```

### 3. 在 Markdown 中使用

现在，您可以在 Markdown 内容中使用 `:::` 容器语法来嵌入您的组件了。

```markdown
这里是普通的 Markdown 内容。

::: 
my-component { "title": "动态标题", "value": 42 }
:::

上面这个块会被渲染成你的 `MyComponent.vue` 组件，并接收 `title` 和 `value` 作为 props。
```

## ⚙️ 配置选项

### 全局选项 (`MdCustomPluginOptions`)

在 `md.use(customPlugin, options)` 时传入。

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `components` | `Record<string, MDCustomPluginComponentOptions>` | **必需** | 一个对象，键是 Markdown 中的容器标签名，需和流式返回数据一致,如：::: my-component  data ::: ，值是该组件的详细配置。 |
| `appContext` | `AppContext` | `undefined` | Vue 的应用上下文实例 (`getCurrentInstance().appContext`)。强烈建议传入，以确保全局组件、指令等可用。 |
| `placeholderClass` | `string` | `'custom-placeholder'` | 组件渲染前的占位符的 CSS 类名。 |
| `propsKey` | `string` | `'_data'` | 当数据不作为 JSON 或不解构时，传递给组件的 prop 名称。 |
| `debug` | `boolean` | `false` | 是否在控制台打印插件的日志和警告信息。 |

### 单组件选项 (`MDCustomPluginComponentOptions`)

在全局 `components` 对象中为每个组件单独配置。

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `component` | `any` | **必需** | 要渲染的 Vue 组件对象。 |
| `forceMount` | `boolean` | `false` | 是否在每次数据更新时都强制销毁并重新创建组件。`false` 会尝试复用组件实例并仅更新 props，性能更好。 |
| `renderIntermediate` | `boolean` | `false` | 在流式数据未接收完毕时是否渲染组件。`true` 会在数据不完整时也渲染组件，组件内部需要处理中间态。 |
| `loadingText` | `string` | `'加载中...'` | 组件渲染前的占位符文本。 |
| `propsUseJson` | `boolean` | `false` | `true` 时，插件会尝试将 info-string 解析为 JSON。如果失败，则按字符串处理。 |
| `multipleProps` | `boolean` | `false` | 仅在 `propsUseJson: true` 且 JSON 解析成功时有效。`true` 会将 JSON 对象解构，每个键值对作为一个独立的 prop 传入组件。 |
| `propsKey` | `string` | 全局 `propsKey` | 覆盖全局 `propsKey`，为该组件指定一个不同的 prop 名称。 |
| `placeholderClass` | `string` | 全局 `placeholderClass` | 覆盖全局 `placeholderClass`。 |

### 组件接收的额外 Props

无论您如何配置，所有通过此插件渲染的组件都会额外接收一个名为 `_isComplete` 的 prop。

- **`_isComplete: boolean`**:
  - `true`: 表示 Markdown 容器的闭合标签 `:::` 已被解析，数据流已完整。
  - `false`: 表示数据流不完整

## 示例：一个完整的 Vue 组件

这是一个使用 `md-editor-v3` 和本插件的完整 Vue 组件示例。

```
<template>
  <MdEditor v-model="text" />
</template>

<script setup lang="ts">
import { ref, onUnmounted, getCurrentInstance } from 'vue';
import { MdEditor, config } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

// 1. 导入你的插件和自定义组件
import customComponentPlugin, { type MDCustomPluginComponentOptions } from 'markdown-it-custom-component';
import MyChart from './components/MyChart.vue';

// 2. 创建插件实例
const { customPlugin, destroy } = customComponentPlugin();

// 3. 在组件卸载时清理
onUnmounted(() => {
  destroy();
});

// 4. 配置 md-editor-v3
config({
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        plugin: customPlugin,
        options: {
          debug: true,
          appContext: getCurrentInstance()?.appContext,
          components: {
            'my-chart': {
              component: MyChart,
              propsUseJson: true,
              multipleProps: true,
            } as MDCustomPluginComponentOptions,
          },
        },
      },
    ];
  },
});

// 5. Markdown 内容
const text = ref(`
## 这是一个动态图表

下面的内容是一个 Vue 组件渲染的：

::: 
my-chart { "type": "bar", "data": [40, 20, 12, 39, 10] }
:::
`);
</script>
```

## ⚠️ 注意事项

1. **内存管理**: 请务必在宿主 Vue 组件（即调用 `customComponentPlugin()` 的组件）的 `onUnmounted` 钩子中调用 `destroy()` 函数。这将卸载所有由该插件实例创建的 Vue 组件，防止内存泄漏。

2. **Vue 上下文 (****`appContext`****)**: 为了让您的自定义组件能够使用全局注册的组件（如 UI 库组件）、指令或 provide/inject，必须传入 `appContext`。

