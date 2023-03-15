# vue-manage-system 智慧考勤系统


基于 Vue3 + pinia + Element Plus 的后台管理系统解决方案。

[English document](https://github.com/lin-xin/manage-system/blob/master/README_EN.md)


## 功能

-   [x] Element Plus
-   [x] vite 3
-   [x] pinia
-   [x] typescript
-   [x] 登录/注销
-   [x] Dashboard
-   [x] 表格
-   [x] Tab 选项卡
-   [x] 表单
-   [x] 图表 :bar_chart:
-   [x] 富文本/markdown编辑器
-   [x] 图片拖拽/裁剪上传
-   [x] 权限管理
-   [x] 三级菜单
-   [x] 自定义图标


## 安装步骤
> 因为使用vite3，node版本需要 14.18+

```
git clone https://github.com/lin-xin/vue-manage-system.git      // 把模板下载到本地
cd vue-manage-system    // 进入模板目录
npm install         // 安装项目依赖，等待安装完成之后，安装失败可用 cnpm 或 yarn

// 运行
npm run dev

// 执行构建命令，生成的dist文件夹放在服务器下即可访问
npm run build
```

## 组件使用说明与演示

### vue-schart

vue.js 封装 sChart.js 的图表组件。访问地址：[vue-schart](https://github.com/lin-xin/vue-schart#/) 

<p><a href="https://www.npmjs.com/package/vue-schart"><img src="https://img.shields.io/npm/dm/vue-schart.svg" alt="Downloads"></a></p>

```html
<template>
    <div>
        <schart class="wrapper" canvasId="myCanvas" :options="options"></schart>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Schart from "vue-schart"; // 导入Schart组件
const options = ref({
    type: "bar",
    title: {
        text: "最近一周各品类销售图",
    },
    labels: ["周一", "周二", "周三", "周四", "周五"],
    datasets: [
        {
            label: "家电",
            data: [234, 278, 270, 190, 230],
        },
        {
            label: "百货",
            data: [164, 178, 190, 135, 160],
        },
        {
            label: "食品",
            data: [144, 198, 150, 235, 120],
        },
    ],
})
</script>
<style>
    .wrapper {
        width: 7rem;
        height: 5rem;
    }
</style>
```

## 项目截图

### 登录


### 首页

![Image text](https://github.com/lin-xin/manage-system/raw/master/screenshots/wms1.png)

## License

[MIT](https://github.com/lin-xin/vue-manage-system/blob/master/LICENSE)
