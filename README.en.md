[English](README.en.md) | [中文](README.md)

# Markdown-it Vue Custom Component Plugin (markdown-it-vue-custom-component)

This is a plugin designed for [markdown-it](https://github.com/markdown-it/markdown-it) or markdown-it-vue-custom-component that allows you to seamlessly embed, render, and interact with custom Vue 3 components within your Markdown content.

This plugin is particularly suitable for scenarios requiring dynamic content display, such as:

- Embedding interactive charts or data visualization components in documentation.
- Gradually rendering and updating components in streaming output (e.g., AI conversations).
- Creating rich, dynamic Vue application-infused static sites or documentation.

---

#### [github](https://github.com/renqiankun/markdown-it-custom-component-demo)
#### [demo](https://renqiankun.github.io/markdown-it-custom-component-demo/dist/)
---

## Features

- **Vue 3 Component Support**: Directly use your favorite Vue 3 components within Markdown.
- **Dynamic Data Passing**: Pass data or props to components via the Markdown container's info-string.
- **Streaming Render Support**: Supports rendering intermediate states (loading) when data streams are not fully received, and updating components once data reception is complete, ideal for AI conversations and similar scenarios.
- **Flexible Prop Passing**:
  - Pass the info-string as a single prop.
  - Parse a JSON string and pass it as a single prop.
  - Destructure a JSON string and pass each key-value pair as individual props to the component.
- **Lifecycle Management**: The plugin provides a `destroy` method to clean up all rendered Vue component instances when the host component unmounts, preventing memory leaks.
- **Context Inheritance**: Automatically inherits Vue's `appContext`, allowing your custom components to access globally registered components, directives, and plugins.
- **Highly Configurable**: Provides independent configuration for each component, such as whether to force remounting or render intermediate states.
- **Debug Mode**: Built-in `debug` mode for printing logs and warnings to the console, simplifying development and debugging.

## Installation

```bash
npm install markdown-it-vue-custom-component
# Or
yarn add markdown-it-vue-custom-component
```

_(Note: This package name is hypothetical; please change it according to your actual published name)_

Also, ensure `markdown-it` and `vue` are installed in your project.

```bash
npm install markdown-it vue
# Or
yarn add markdown-it vue
```

## Quick Start

In your Vue project (e.g., where you use `md-editor-v3`), you can configure and use it as follows.

### 1. Create Plugin Instance

First, import the `customComponentPlugin` factory function from the plugin and create an instance.

```typescript
// In your Vue component
import { onUnmounted, getCurrentInstance } from 'vue'
import customComponentPlugin from 'markdown-it-custom-component' 
import 'markdown-it-custom-component/style.css'

// Create plugin instance
const { customPlugin, destroy } = customComponentPlugin()

// Call destroy to clean up resources when the component unmounts
onUnmounted(() => {
  destroy()
})
```

### 2. Configure markdown-it

Add `customPlugin` to `markdown-it`'s plugin list. If you are using `md-editor-v3`, you can configure it like this:

```typescript
import { config } from 'md-editor-v3'
import MyComponent from './MyComponent.vue' // Your custom Vue component
import customComponentPlugin, {
  type MDCustomPluginComponentOptions
} from 'markdown-it-custom-component'
import 'markdown-it-custom-component/style.css'
const { customPlugin, destroy } = customComponentPlugin()

// Get Vue application context
const appContext = getCurrentInstance()?.appContext

config({
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        plugin: customPlugin,
        options: {
          debug: true, // Enable debug mode
          appContext: appContext, // Pass Vue context
          components: {
            // Register a custom container named 'my-component'
            'my-component': {
              component: MyComponent, // Associate Vue component
              propsUseJson: true, // Attempt to parse data as JSON
              multipleProps: true // Destructure JSON into multiple props
            } as MDCustomPluginComponentOptions
          }
        }
      }
    ]
  }
})
```

### 3. Use in Markdown

Now, you can embed your components in Markdown content using the `:::` container syntax.

```markdown
This is regular Markdown content.

:::
 my-component { "title": "Dynamic Title", "value": 42 }
:::

The block above will be rendered as your `MyComponent.vue` component, receiving `title` and `value` as props.
```

## 鈿欙笍 Configuration Options

### Global Options (`MdCustomPluginOptions`)

Passed when calling `md.use(customPlugin, options)`.

| Option             | Type                                             | Default Value          | Description                                                                                                                                                             |
| :----------------- | :----------------------------------------------- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components`       | `Record<string, MDCustomPluginComponentOptions>` | **Required**           | An object where keys are Markdown container tags and values are detailed configurations for that component.                                                             |
| `appContext`       | `AppContext`                                     | `undefined`            | Vue's application context instance (`getCurrentInstance().appContext`). Strongly recommended to pass this to ensure global components, directives, etc., are available. |
| `placeholderClass` | `string`                                         | `'custom-placeholder'` | The CSS class name for the placeholder before the component is rendered.                                                                                                |
| `propsKey`         | `string`                                         | `'_data'`              | The prop name passed to the component when data is not JSON or not destructured.                                                                                        |
| `debug`            | `boolean`                                        | `false`                | Whether to print plugin logs and warnings to the console.                                                                                                               |

### Single Component Options (`MDCustomPluginComponentOptions`)

Configured individually for each component within the global `components` object.

| Option               | Type      | Default Value             | Description                                                                                                                                                                                          |
| :------------------- | :-------- | :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `component`          | `any`     | **Required**              | The Vue component object to be rendered.                                                                                                                                                             |
| `forceMount`         | `boolean` | `false`                   | Whether to force destroy and recreate the component on every data update. `false` attempts to reuse the component instance and only update props, which is better for performance.                   |
| `renderIntermediate` | `boolean` | `false`                   | Whether to render the component when streaming data is not fully received. `true` will render the component even with incomplete data, requiring the component itself to handle intermediate states. |
| `loadingText`        | `string`  | `'Loading...'`            | The placeholder text before the component is rendered.                                                                                                                                               |
| `propsUseJson`       | `boolean` | `false`                   | When `true`, the plugin attempts to parse the info-string as JSON. If parsing fails, it's treated as a string.                                                                                       |
| `multipleProps`      | `boolean` | `false`                   | Only effective when `propsUseJson: true` and JSON parsing is successful. `true` will destructure the JSON object, passing each key-value pair as an individual prop to the component.                |
| `propsKey`           | `string`  | Global `propsKey`         | Overrides the global `propsKey` to specify a different prop name for this component.                                                                                                                 |
| `placeholderClass`   | `string`  | Global `placeholderClass` | Overrides the global `placeholderClass`.                                                                                                                                                             |

### Additional Props Received by Components

Regardless of your configuration, all components rendered via this plugin will receive an additional prop named `_isComplete`.

- **`_isComplete: boolean`**:
  - `true`: Indicates that the Markdown container's closing tag `:::` has been parsed, and the data stream is complete.
  - `false`: Indicates that the data stream is incomplete (only possible when `renderIntermediate: true`).

## Example: A Complete Vue Component

Here is a complete Vue component example using `md-editor-v3` and this plugin.

```vue
<template>
  <MdEditor v-model="text" />
</template>

<script setup lang="ts">
import { ref, onUnmounted, getCurrentInstance } from 'vue'
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

// 1. Import your plugin and custom components
import customComponentPlugin, { type MDCustomPluginComponentOptions } from 'markdown-it-custom-component';
import 'markdown-it-custom-component/style.css'
import MyChart from './components/MyChart.vue';

// 2. Create plugin instance
const { customPlugin, destroy } = customComponentPlugin()

// 3. Clean up on component unmount
onUnmounted(() => {
  destroy()
})

// 4. Configure md-editor-v3
config({
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        plugin: customPlugin,
        options: {
         debug: false,
          propsKey: '_data',
          placeholderClass: 'custom-placeholder',
          appContext: getCurrentInstance()?.appContext,
          components: {
            'my-chart': {
              component: MyChart,
               forceMount: false,
                renderIntermediate: false,
                propsUseJson: false,
                multipleProps: false,
                propsKey: '_data',
                placeholderClass: 'custom-placeholder',
            } as MDCustomPluginComponentOptions
          }
        }
      }
    ]
  }
})

// 5. Markdown content
const text = ref(`
## This is a dynamic chart

The content below is rendered by a Vue component:

::: my-chart { "type": "bar", "data": [40, 20, 12, 39, 10] }
:::
`)
</script>
```

## Important Notes

1.  **Memory Management**: It is crucial to call the `destroy()` function in the `onUnmounted` hook of the host Vue component (i.e., the component that calls `customComponentPlugin()`). This will unmount all Vue components created by this plugin instance, preventing memory leaks.
2.  **Vue Context (`appContext`)**: To enable your custom components to use globally registered components (e.g., UI library components), directives, or provide/inject, you must pass `appContext`.

---

