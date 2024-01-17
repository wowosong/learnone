## 概念

## 为什么你应该使用 Pinia？ 

Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。如果你熟悉组合式 API 的话，你可能会认为可以通过一行简单的 `export const state = reactive({})` 来共享一个全局状态。对于单页应用来说确实可以，但如果应用在服务器端渲染，这可能会使你的应用暴露出一些安全漏洞。 而如果使用 Pinia，即使在小型单页应用中，你也可以获得如下功能：

- Devtools 支持 
  - 追踪 actions、mutations 的时间线
  - 在组件中展示它们所用到的 Store
  - 让调试更容易的 Time travel
- 热更新 
  - 不必重载页面即可修改 Store
  - 开发时可保持当前的 State
- 插件：可通过插件扩展 Pinia 功能
- 为 JS 开发者提供适当的 TypeScript 支持以及**自动补全**功能。
- 支持服务端渲染



## 安装

```shell
yarn add pinia
# 或者使用 npm
npm install pinia
```

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

## Store

### Store 是什么？

Store (如 Pinia) 是一个保存状态和业务逻辑的实体，它并不与你的组件树绑定。换句话说，**它承载着全局状态**。它有点像一个永远存在的组件，每个组件都可以读取和写入它。它有**三个概念**，[state](https://pinia.vuejs.org/zh/core-concepts/state.html)、[getter](https://pinia.vuejs.org/zh/core-concepts/getters.html) 和 [action](https://pinia.vuejs.org/zh/core-concepts/actions.html)，我们可以假设这些概念相当于组件中的 `data`、 `computed` 和 `methods`。

```javascript
import { defineStore } from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useAlertsStore = defineStore('alerts', {
  // 其他配置...
})
```

可选式写法

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore("counter", {
    // state:()=>({
    //         count:0
    // }),
    state: () => {
        return {
            count: 0,
            data:{
                name:"counter"
            }
        }
    }, 
    getters: {
        double: (state) => state.count * 2, 
        getCount: (state) => {
            console.log("getter:", state.count++)
            return state.count++;
        },
        AddCount(state) {
            return (data) => state.count + data;
        }
    },
    actions: {
        increment() {
            console.log('increment')
            this.count++;
        },
        async getList() {
            console.log(this)
            await axios.get("https://www.fastmock.site/mock/lpg/test").then((xhr) => {
                console.log(xhr)
                this.data=xhr.data
            })
        }
    }
})
```

```vue
<script setup>
    import { useCounterStore } from '@/stores/counter'
    const counter = useCounterStore()
    counter.count++
    // 自动补全！ ✨
    counter.$patch({ count: counter.count + 1 })
    // 或使用 action 代替
    counter.increment()
</script>
<template>
<!-- 直接从 store 中访问 state -->
<div>Current Count: {{ counter.count }}</div>
</template>

```

组合式写法

```javascript
export const useCounterStore1 = defineStore('counter1', () => {
    const count1 = ref(0)
    const doubleCount = computed(() => count1.value * 2)

    function increment1() {
        console.log('increment1')
        count1.value++
    }

    return {count1, doubleCount, increment1}
})
```

你可以用和之前一样的方式来定义 Store，然后通过 `mapStores()`、`mapState()` 或 `mapActions()` 访问

```javascript
export default {
  computed: {
    // 允许访问 this.counterStore 和 this.userStore
    ...mapStores(useCounterStore, userState),
    // 允许读取 this.count 和 this.double
    ...mapState(useCounterStore, ["count", "double"]),
    ...mapState(userState, ["data"]),
  },
  methods: {
    ...mapActions(useCounterStore, ["increment"]),
    ...mapActions(userState, ["toUpperCaseOfName"]),
  },
}
```

### 使用 Store

虽然我们前面定义了一个 store，但在我们使用 `<script setup>` 调用 `useStore()`(或者使用 `setup()` 函数，**像所有的组件那样**) 之前，store 实例是不会被创建的：

```javascript
<script setup>
  import { useCounterStore } from '@/stores/counter'
  // 可以在组件中的任意位置访问 `store` 变量 ✨
  const store = useCounterStore()
</script>
```

你可以定义任意多的 store，但为了让使用 pinia 的益处最大化(比如允许构建工具自动进行代码分割以及 TypeScript 推断)，**你应该在不同的文件中去定义 store**。

如果你还不会使用 `setup` 组件，[你也可以通过**映射辅助函数**来使用 Pinia](https://pinia.vuejs.org/zh/cookbook/options-api.html)。

一旦 store 被实例化，你可以直接访问在 store 的 `state`、`getters` 和 `actions` 中定义的任何属性。

请注意，`store` 是一个用 `reactive` 包装的对象，这意味着不需要在 getters 后面写 `.value`，就像 `setup` 中的 `props` 一样，**如果你写了，我们也不能解构它**：

```javascript
<script setup>
const store = useCounterStore()
// ❌ 这将不起作用，因为它破坏了响应性
// 这就和直接解构 `props` 一样
const { name, doubleCount } = store
name // 将始终是 "Eduardo"
doubleCount // 将始终是 0
setTimeout(() => {
  store.increment()
}, 1000)
// ✅ 这样写是响应式的
// 💡 当然你也可以直接使用 `store.doubleCount`
const doubleValue = computed(() => store.doubleCount)
</script>
```

### 保持响应性

为了从 store 中提取属性时保持其响应性，你需要使用 `storeToRefs()`。它将为每一个响应式属性创建引用。当你只使用 store 的状态而不调用任何 action 时，它会非常有用。请注意，你可以直接从 store 中解构 action，因为它们也被绑定到 store 上：

```vue
<script setup>
import { storeToRefs } from 'pinia'
const store = useCounterStore()
// `name` 和 `doubleCount` 是响应式的 ref
// 同时通过插件添加的属性也会被提取为 ref
// 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
const { name, doubleCount } = storeToRefs(store)
// 作为 action 的 increment 可以直接解构
const { increment } = store
</script>
```



## `State`

在大多数情况下，state 都是你的 store 的核心。人们通常会先定义能代表他们 APP 的 state。在 Pinia 中，state 被定义为一个返回初始状态的函数。这使得 Pinia 可以同时支持服务端和客户端。

### 访问 `state`

默认情况下，你可以通过 `store` 实例访问 state，直接对其进行读写。

```javascript
const store = useStore()

store.count++
```

### `重置 state`

使用[选项式 API](https://pinia.vuejs.org/zh/core-concepts/#option-stores) 时，你可以通过调用 store 的 `$reset()` 方法将 state 重置为初始值。

```javascript
const store = useStore()
<el-button @click="counter.$reset()">重置</el-button>
store.$reset()
```

在 `$reset()` 内部，会调用 `state()` 函数来创建一个新的状态对象，并用它替换当前状态。

在 [Setup Stores](https://pinia.vuejs.org/core-concepts/#setup-stores) 中，您需要创建自己的 `$reset()` 方法：

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function $reset() {
    count.value = 0
  }

  return { count, $reset }
})
```

#### 使用选项式 API 的用法

如果你不能使用组合式 API，但你可以使用 `computed`，`methods`，...，那你可以使用 `mapState()` 辅助函数将 state 属性映射为只读的计算属性：

```javascript
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 可以访问组件中的 this.count
    // 与从 store.count 中读取的数据相同
    ...mapState(useCounterStore, ['count'])
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'count',
      // 你也可以写一个函数来获得对 store 的访问权
      double: store => store.count * 2,
      // 它可以访问 `this`，但它没有标注类型...
      magicValue(store) {
        return store.someGetter + this.count + this.double
      },
    }),
  },
}
```

### 可修改的 state

如果你想修改这些 state 属性 (例如，如果你有一个表单)，你可以使用 `mapWritableState()` 作为代替。但注意你不能像 `mapState()` 那样传递一个函数：

```javascript
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 可以访问组件中的 this.count，并允许设置它。
    // this.count++
    // 与从 store.count 中读取的数据相同
    ...mapWritableState(useCounterStore, ['count'])
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'count',
    }),
  },
}
```

对于像数组这样的集合，你并不一定需要使用 `mapWritableState()`，`mapState()` 也允许你调用集合上的方法，除非你想用 `cartItems = []` 替换整个数组。

### 变更 state

除了用 `store.count++` 直接改变 store，你还可以调用 `$patch` 方法。它允许你用一个 `state` 的补丁对象在同一时间更改多个属性：

```javascript
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})
```

不过，用这种语法的话，有些变更真的很难实现或者很耗时：任何集合的修改（例如，向数组中添加、移除一个元素或是做 `splice` 操作）都需要你创建一个新的集合。因此，`$patch` 方法也接受一个函数来组合这种难以用补丁对象实现的变更。

```javascript
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

两种变更 store 方法的主要区别是，`$patch()` 允许你将多个变更归入 devtools 的同一个条目中。同时请注意，**直接修改 `state`，`$patch()` 也会出现在 devtools 中**，而且可以进行 time travel (在 Vue 3 中还没有)。

### 替换 `state`

你**不能完全替换掉** store 的 state，因为那样会破坏其响应性。但是，你可以 *patch* 它。

```javascript
// 这实际上并没有替换`$state`
store.$state = { count: 24 }
// 在它内部调用 `$patch()`：
store.$patch({ count: 24 })
```

你也可以通过变更 `pinia` 实例的 `state` 来设置整个应用的初始 state。这常用于 [SSR 中的激活过程](https://pinia.vuejs.org/zh/ssr/#state-hydration)。

```javascript
pinia.state.value = {}
```

### 订阅 state

类似于 Vuex 的 [subscribe 方法](https://vuex.vuejs.org/zh/api/index.html#subscribe)，你可以通过 store 的 `$subscribe()` 方法侦听 state 及其变化。比起普通的 `watch()`，使用 `$subscribe()` 的好处是 *subscriptions* 在 *patch* 后只触发一次 (例如，当使用上面的函数版本时)。

```javascript
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 和 cartStore.$id 一样
  mutation.storeId // 'cart'
  // 只有 mutation.type === 'patch object'的情况下才可用
  mutation.payload // 传递给 cartStore.$patch() 的补丁对象。

  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('cart', JSON.stringify(state))
})
```

默认情况下，*state subscription* 会被绑定到添加它们的组件上 (如果 store 在组件的 `setup()` 里面)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 `{ detached: true }` 作为第二个参数，以将 *state subscription* 从当前组件中*分离*：

```javascript
<script setup>
const someStore = useSomeStore()
// 此订阅器即便在组件卸载之后仍会被保留
someStore.$subscribe(callback, { detached: true })
</script>
```

TIP

你可以在 `pinia` 实例上使用 `watch()` 函数侦听整个 state。

```javascript
watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
);
watch: {
  "counter1.count1": {
    handler(newvalue, oldvalue) {
      console.log(3333);
      console.log("watch", newvalue, oldvalue);
    },
      deep: true,
  },
};
watch(
  () => counter1.count1,
  (newvalue, olodvalue) => {
    console.log(2);
    console.log(newvalue, olodvalue);
  }
);
```

## Getter

Getter 完全等同于 store 的 state 的[计算值](https://cn.vuejs.org/guide/essentials/computed.html)。可以通过 `defineStore()` 中的 `getters` 属性来定义它们。**推荐**使用箭头函数，并且它将接收 `state` 作为第一个参数：

```javascript
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
})
```

大多数时候，getter 仅依赖 state，不过，有时它们也可能会使用其他 getter。因此，即使在使用常规函数定义 getter 时，我们也可以通过 `this` 访问到**整个 store 实例**，**但(在 TypeScript 中)必须定义返回类型**。这是为了避免 TypeScript 的已知缺陷，**不过这不影响用箭头函数定义的 getter，也不会影响不使用 `this` 的 getter**。

```javascript
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 自动推断出返回类型是一个 number
    doubleCount(state) {
      return state.count * 2
    },
    // 返回类型**必须**明确设置
    doublePlusOne(): number {
      // 整个 store 的 自动补全和类型标注 ✨
      return this.doubleCount + 1
    },
  },
})
```

然后你可以直接访问 store 实例上的 getter 了：

```vue
<script setup>
  import { useCounterStore } from './counterStore'
  const store = useCounterStore()
</script>
<template>
<p>Double count is {{ store.doubleCount }}</p>
<div>Current getThisGetter: {{ counter.getThisGetter }}</div>
</template>
```

### 访问其他 getter

与计算属性一样，你也可以组合多个 getter。通过 `this`，你可以访问到其他任何 getter。即使你没有使用 TypeScript，你也可以用 [JSDoc](https://jsdoc.app/tags-returns.html) 来让你的 IDE 提示类型。

```javascript
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 类型是自动推断出来的，因为我们没有使用 `this`
    doubleCount: (state) => state.count * 2,
    // 这里我们需要自己添加类型(在 JS 中使用 JSDoc)
    // 可以用 this 来引用 getter
    /**
     * 返回 count 的值乘以 2 加 1
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 自动补全 ✨
      return this.doubleCount + 1
    },
  },
})
```

### 向 getter 传递参数

*Getter* 只是幕后的**计算**属性，所以不可以向它们传递任何参数。不过，你可以从 *getter* 返回一个函数，该函数可以接受任意参数：

```javascript
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

并在组件中使用：

```javascript
<script setup>
import { useUserListStore } from './store'
const userList = useUserListStore()
const { getUserById } = storeToRefs(userList)
// 请注意，你需要使用 `getUserById.value` 来访问
// <script setup> 中的函数
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

请注意，当你这样做时，**getter 将不再被缓存**，它们只是一个被你调用的函数。不过，你可以在 getter 本身中缓存一些结果，虽然这种做法并不常见，但有证明表明它的性能会更好：

```javascript
export const useStore = defineStore('main', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```

### 访问其他 store 的 getter

想要使用另一个 store 的 getter 的话，那就直接在 *getter* 内使用就好：

```javascript
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

### 使用 `setup()` 时的用法

作为 store 的一个属性，你可以直接访问任何 getter(与 state 属性完全一样)

```vue
<script setup>
const store = useCounterStore()
store.count = 3
store.doubleCount // 6
</script>
```

### 使用选项式 API 的用法

在下面的例子中，你可以假设相关的 store 已经创建了：

```javascript
// 示例文件路径：
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0,
    }),
    getters: {
        doubleCount(state) {
            return state.count * 2
        },
    },
})
```

### 使用 `setup()` 

虽然并不是每个开发者都会使用组合式 API，但 `setup()` 钩子依旧可以使 Pinia 在选项式 API 中更易用。并且不需要额外的映射辅助函数！

```javascript
<script>
    import { useCounterStore } from '../stores/counter'

export default defineComponent({
    setup() {
        const counterStore = useCounterStore()

        return { counterStore }
    },
    computed: {
        quadrupleCounter() {
            return this.counterStore.doubleCount * 2
        },
    },
})
</script>
```

这在将组件从选项式 API 迁移到组合式 API 时很有用，但**应该只是一个迁移步骤**，始终尽量不要在同一组件中混合两种 API 样式。

### 不使用 `setup()`

你可以使用[前一节的 state](https://pinia.vuejs.org/zh/core-concepts/state.html#options-api) 中的 `mapState()` 函数来将其映射为 getters：

```javascript
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
    computed: {
        // 允许在组件中访问 this.doubleCount
        // 与从 store.doubleCount 中读取的相同
        ...mapState(useCounterStore, ['doubleCount']),
        // 与上述相同，但将其注册为 this.myOwnName
        ...mapState(useCounterStore, {
            myOwnName: 'doubleCount',
            // 你也可以写一个函数来获得对 store 的访问权
            double: store => store.doubleCount,
        }),
    },
}
```

## Actions

Action 相当于组件中的 [method](https://v3.vuejs.org/guide/data-methods.html#methods)。它们可以通过 `defineStore()` 中的 `actions` 属性来定义，**并且它们也是定义业务逻辑的完美选择。**

```javascript
export const useCounterStore = defineStore('main', {
    state: () => ({
        count: 0,
    }),
    actions: {
        increment() {
            this.count++
        },
        randomizeCounter() {
            this.count = Math.round(100 * Math.random())
        },
    },
})
```

类似 [getter](https://pinia.vuejs.org/zh/core-concepts/getters.html)，action 也可通过 `this` 访问**整个 store 实例**，并支持**完整的类型标注(以及自动补全✨)**。**不同的是，`action` 可以是异步的**，你可以在它们里面 `await` 调用任何 API，以及其他 action！下面是一个使用 [Mande](https://github.com/posva/mande) 的例子。请注意，你使用什么库并不重要，只要你得到的是一个`Promise`，你甚至可以 (在浏览器中) 使用原生 `fetch` 函数：

```javascript
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
    state: () => ({
        userData: null,
        // ...
    }),

    actions: {
        async registerUser(login, password) {
            try {
                this.userData = await api.post({ login, password })
                showTooltip(`Welcome back ${this.userData.name}!`)
            } catch (error) {
                showTooltip(error)
                // 让表单组件显示错误
                return error
            }
        },
    },
})
```

你也完全可以自由地设置任何你想要的参数以及返回任何结果。当调用 action 时，一切类型也都是可以被自动推断出来的。

Action 可以像函数或者通常意义上的方法一样被调用：

```vue
<script setup>
    const store = useCounterStore();
    // 将 action 作为 store 的方法进行调用
    store.randomizeCounter()
</script>
<template>
<!-- 即使在模板中也可以 -->
<button @click="store.randomizeCounter()">Randomize</button>
</template>
```

### 访问其他 store 的 action

想要使用另一个 store 的话，那你直接在 *action* 中调用就好了：

```javascript
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

### 使用选项式 API 的用法

在下面的例子中，你可以假设相关的 store 已经创建了：

```javascript
// 示例文件路径：
// ./src/stores/counter.js

import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

### 使用 `setup()`

虽然并不是每个开发者都会使用组合式 API，但 `setup()` 钩子依旧可以使 Pinia 在选项式 API 中更易用。并且不需要额外的映射辅助函数!

```vue
<script>
    import { useCounterStore } from '../stores/counter'
    export default defineComponent({
        setup() {
            const counterStore = useCounterStore()
            return { counterStore }
        },
        methods: {
            incrementAndPrint() {
                this.counterStore.increment()
                console.log('New Count:', this.counterStore.count)
            },
        },
    })
</script>
```

### 不使用 `setup()` 

如果你不喜欢使用组合式 API，你也可以使用 `mapActions()` 辅助函数将 action 属性映射为你组件中的方法。

```javascript
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
    methods: {
        // 访问组件内的 this.increment()
        // 与从 store.increment() 调用相同
        ...mapActions(useCounterStore, ['increment'])
        // 与上述相同，但将其注册为this.myOwnName()
        ...mapActions(useCounterStore, { myOwnName: 'increment' }),
},
}
```

### 订阅 action

你可以通过 `store.$onAction()` 来监听 action 和它们的结果。传递给它的回调函数会在 action 本身之前执行。`after` 表示在 promise 解决之后，允许你在 action 解决后执行一个回调函数。同样地，`onError` 允许你在 action 抛出错误或 reject 时执行一个回调函数。这些函数对于追踪运行时错误非常有用，类似于[Vue docs 中的这个提示](https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors)。

这里有一个例子，在运行 action 之前以及 action resolve/reject 之后打印日志记录

```javascript
const unsubscribe = someStore.$onAction(
    ({
        name, // action 名称
        store, // store 实例，类似 `someStore`
        args, // 传递给 action 的参数数组
        after, // 在 action 返回或解决后的钩子
        onError, // action 抛出或拒绝的钩子
    }) => {
        // 为这个特定的 action 调用提供一个共享变量
        const startTime = Date.now()
        // 这将在执行 "store "的 action 之前触发。
        console.log(`Start "${name}" with params [${args.join(', ')}].`)

        // 这将在 action 成功并完全运行后触发。
        // 它等待着任何返回的 promise
        after((result) => {
            console.log(
                `Finished "${name}" after ${
                Date.now() - startTime
                }ms.\nResult: ${result}.`
            )
        })

        // 如果 action 抛出或返回一个拒绝的 promise，这将触发
        onError((error) => {
            console.warn(
                `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
            )
        })
    }
)

// 手动删除监听器
unsubscribe()
```

默认情况下，*action 订阅器*会被绑定到添加它们的组件上(如果 store 在组件的 `setup()` 内)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 `true` 作为第二个参数传递给 *action 订阅器*，以便将其从当前组件中分离：

```vue
<script setup>
    const someStore = useSomeStore()
    // 此订阅器即便在组件卸载之后仍会被保留
    someStore.$onAction(callback, true)
</script>
```

## 插件

由于有了底层 API 的支持，Pinia store 现在完全支持扩展。以下是你可以扩展的内容：

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变甚至取消 action
- 实现副作用，如[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- **仅**应用插件于特定 store

插件是通过 `pinia.use()` 添加到 pinia 实例的。最简单的例子是通过返回一个对象将一个静态属性添加到所有 store。

```javascript
import { createPinia } from 'pinia'

// 创建的每个 store 中都会添加一个名为 `secret` 的属性。
// 在安装此插件后，插件可以保存在不同的文件中
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 将该插件交给 Pinia
pinia.use(SecretPiniaPlugin)

// 在另一个文件中
const store = useStore()
store.secret // 'the cake is a lie'
```

这对添加全局对象很有用，如路由器、modal 或 toast 管理器。

### 简介

Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。它接收一个可选参数，即 *context*。

```javascript
export function myPiniaPlugin(context) {
  context.pinia // 用 `createPinia()` 创建的 pinia。 
  context.app // 用 `createApp()` 创建的当前应用(仅 Vue 3)。
  context.store // 该插件想扩展的 store
  context.options // 定义传给 `defineStore()` 的 store 的可选对象。
  // ...
}
```

然后用 `pinia.use()` 将这个函数传给 `pinia`：

```javascript
pinia.use(myPiniaPlugin)
```

插件只会应用于**在 `pinia` 传递给应用后**创建的 store，否则它们不会生效。

### 扩展 Store

你可以直接通过在一个插件中返回包含特定属性的对象来为每个 store 都添加上特定属性：

```typescript
pinia.use(() => ({ hello: 'world' }))
```

你也可以直接在 `store` 上设置该属性，但**可以的话，请使用返回对象的方法，这样它们就能被 devtools 自动追踪到**：

```typescript
pinia.use(({ store }) => {
  store.hello = 'world'
})
```

任何由插件返回的属性都会被 devtools 自动追踪，所以如果你想在 devtools 中调试 `hello` 属性，为了使 devtools 能追踪到 `hello`，请确保**在 dev 模式下**将其添加到 `store._customProperties` 中：

```javascript
// 上文示例
pinia.use(({ store }) => {
  store.hello = 'world'
  // 确保你的构建工具能处理这个问题，webpack 和 vite 在默认情况下应该能处理。
  if (process.env.NODE_ENV === 'development') {
    // 添加你在 store 中设置的键值
    store._customProperties.add('hello')
  }
})
```

值得注意的是，每个 store 都被 [`reactive`](https://cn.vuejs.org/api/reactivity-core.html#reactive)包装过，所以可以自动解包任何它所包含的 Ref(`ref()`、`computed()`...)。

```javascript
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // 每个 store 都有单独的 `hello` 属性
  store.hello = ref('secret')
  // 它会被自动解包
  store.hello // 'secret'

  // 所有的 store 都在共享 `shared` 属性的值
  store.shared = sharedRef
  store.shared // 'shared'
})
```

这就是在没有 `.value` 的情况下你依旧可以访问所有计算属性的原因，也是它们为什么是响应式的原因。

#### 添加新的 state

如果你想给 store 添加新的 state 属性或者在服务端渲染的激活过程中使用的属性，**你必须同时在两个地方添加它**。。

- 在 `store` 上，然后你才可以用 `store.myState` 访问它。
- 在 `store.$state` 上，然后你才可以在 devtools 中使用它，并且，**在 SSR 时被正确序列化(serialized)**。

除此之外，你肯定也会使用 `ref()`(或其他响应式 API)，以便在不同的读取中共享相同的值：

```javascript
import { toRef, ref } from 'vue'

pinia.use(({ store }) => {
  // 为了正确地处理 SSR，我们需要确保我们没有重写任何一个 
  // 现有的值
  if (!Object.prototype.hasOwnProperty(store.$state, 'hasError')) {
    // 在插件中定义 hasError，因此每个 store 都有各自的
    // hasError 状态
    const hasError = ref(false)
    // 在 `$state` 上设置变量，允许它在 SSR 期间被序列化。
    store.$state.hasError = hasError
  }
  // 我们需要将 ref 从 state 转移到 store
  // 这样的话,两种方式：store.hasError 和 store.$state.hasError 都可以访问
  // 并且共享的是同一个变量
  // 查看 https://cn.vuejs.org/api/reactivity-utilities.html#toref
  store.hasError = toRef(store.$state, 'hasError')

  // 在这种情况下，最好不要返回 `hasError`
  // 因为它将被显示在 devtools 的 `state` 部分
  // 如果我们返回它，devtools 将显示两次。
})
```

需要注意的是，在一个插件中， state 变更或添加(包括调用 `store.$patch()`)都是发生在 store 被激活之前，**因此不会触发任何订阅函数**。

**WARNING**

如果你使用的是 **Vue 2**，Pinia 与 Vue 一样，受限于[相同的响应式限制](https://v2.cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项)。在创建新的 state 属性时,如 `secret` 和 `hasError`，你需要使用 `Vue.set()` (Vue 2.7) 或者 `@vue/composition-api` 的 `set()` (Vue < 2.7)。

```javascript
import { set, toRef } from '@vue/composition-api'
pinia.use(({ store }) => {
  if (!Object.prototype.hasOwnProperty(store.$state, 'hello')) {
    const secretRef = ref('secret')
    // 如果这些数据是要在 SSR 过程中使用的
    // 你应该将其设置在 `$state' 属性上
    // 这样它就会被序列化并在激活过程中被接收
    set(store.$state, 'secret', secretRef)
    // 直接在 store 里设置，这样你就可以访问它了。
    // 两种方式都可以：`store.$state.secret` / `store.secret`。
    set(store, 'secret', secretRef)
    store.secret // 'secret'
  }
})
```

### 添加新的外部属性

当添加外部属性、第三方库的类实例或非响应式的简单值时，你应该先用 `markRaw()` 来包装一下它，再将它传给 pinia。下面是一个在每个 store 中添加路由器的例子：

```javascript
import { markRaw } from 'vue'
// 根据你的路由器的位置来调整
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

### 在插件中调用 `$subscribe`

你也可以在插件中使用 [store.$subscribe](https://pinia.vuejs.org/zh/core-concepts/state.html#subscribing-to-the-state) 和 [store.$onAction](https://pinia.vuejs.org/zh/core-concepts/actions.html#subscribing-to-actions) 。

```typescript
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 响应 store 变化
  })
  store.$onAction(() => {
    // 响应 store actions
  })
})
```

### 添加新的选项

在定义 store 时，可以创建新的选项，以便在插件中使用它们。例如，你可以创建一个 `debounce` 选项，允许你让任何 action 实现防抖。

```javascript
defineStore('search', {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // 这将在后面被一个插件读取
  debounce: {
    // 让 action searchContacts 防抖 300ms
    searchContacts: 300,
  },
})
```

然后，该插件可以读取该选项来包装 action，并替换原始 action：

```javascript
// 使用任意防抖库
import debounce from 'lodash/debounce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 我们正在用新的 action 来覆盖这些 action
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```

注意，在使用 setup 语法时，自定义选项作为第 3 个参数传递：

```javascript
defineStore(
  'search',
  () => {
    // ...
  },
  {
    // 这将在后面被一个插件读取
    debounce: {
      // 让 action searchContacts 防抖 300ms
      searchContacts: 300,
    },
  }
)
```

### TypeScript

上述一切功能都有类型支持，所以你永远不需要使用 `any` 或 `@ts-ignore`。

#### 标注插件类型

一个 Pinia 插件可按如下方式实现类型标注：

```typescript
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

#### 为新的 store 属性添加类型

当在 store 中添加新的属性时，你也应该扩展 `PiniaCustomProperties` 接口。

```typescript
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // 通过使用一个 setter，我们可以允许字符串和引用。
    set hello(value: string | Ref<string>)
    get hello(): string

    // 你也可以定义更简单的值
    simpleNumber: number

    // 添加路由(#adding-new-external-properties)
    router: Router
  }
}
```

然后，就可以安全地写入和读取它了：

```typescript
pinia.use(({ store }) => {
  store.hello = 'Hola'
  store.hello = ref('Hola')

  store.simpleNumber = Math.random()
  // @ts-expect-error: we haven't typed this correctly
  store.simpleNumber = ref(Math.random())
})
```

`PiniaCustomProperties` 是一个通用类型，允许你引用 store 的属性。思考一下这个例子，如果把初始选项复制成 `$options`(这只对 option store 有效)，如何标注类型：

```typescript
pinia.use(({ options }) => ({ $options: options }))
```

我们可以通过使用 `PiniaCustomProperties` 的4种通用类型来标注类型：

```typescript
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, S, G, A> {
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
  }
}
```

TIP

当在泛型中扩展类型时，它们的名字必须**与源代码中完全一样**。`Id` 不能被命名为 `id` 或 `I` ，`S` 不能被命名为 `State`。下面是每个字母代表的含义：

- S: State
- G: Getters
- A: Actions
- SS: Setup Store / Store

#### 为新的 state 添加类型

当添加新的 state 属性(包括 `store` 和 `store.$state` )时，你需要将类型添加到 `PiniaCustomStateProperties` 中。与 `PiniaCustomProperties` 不同的是，它只接收 `State` 泛型：

```typescript
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```

#### 为新的定义选项添加类型

当为 `defineStore()` 创建新选项时，你应该扩展 `DefineStoreOptionsBase`。与 `PiniaCustomProperties` 不同的是，它只暴露了两个泛型：State 和 Store 类型，允许你限制定义选项的可用类型。例如，你可以使用 action 的名称：

```typescript
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // 任意 action 都允许定义一个防抖的毫秒数
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```

TIP

还有一个可以从一个 store 类型中提取 *getter* 的 `StoreGetters` 类型。你也可以且**只可以**通过扩展 `DefineStoreOptions` 或 `DefineSetupStoreOptions` 类型来扩展 *setup store* 或 *option store* 的选项。

### Nuxt.js

当[在 Nuxt 中使用 pinia](https://pinia.vuejs.org/zh/ssr/nuxt.html) 时，你必须先创建一个 [Nuxt 插件](https://nuxt.com/docs/guide/directory-structure/plugins)。这样你才能访问到 `pinia` 实例：

```javascript
// plugins/myPiniaPlugin.js
import { PiniaPluginContext } from 'pinia'
import { Plugin } from '@nuxt/types'

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // 响应 store 变更
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  // 请注意，如果你使用的是 TS，则必须添加类型。
  return { creationTime: new Date() }
}

const myPlugin: Plugin = ({ $pinia }) => {
  $pinia.use(MyPiniaPlugin)
}

export default myPlugin
```



注意上面的例子使用的是 TypeScript。如果你使用的是 `.js` 文件，你必须删除类型标注 `PiniaPluginContext` 和 `Plugin` 以及它们的导入语句。