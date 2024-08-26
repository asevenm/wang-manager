<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  const route = useRoute();
</script>

<template>
  <el-menu
    :default-active="route.path.slice(1)"
    class="el-menu-demo"
    mode="horizontal"
    router
  >
    <el-menu-item index="home">首页</el-menu-item>
    <el-sub-menu index="resource">
      <template #title>资源管理</template>
      <el-menu-item index="product">产品</el-menu-item>
      <el-menu-item index="agent">代理品牌</el-menu-item>
      <el-menu-item index="tech">技术材料</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="user">用户管理</el-menu-item>
    <el-menu-item index="bill">订单管理</el-menu-item>
    <el-menu-item index="chart">数据报表</el-menu-item>
  </el-menu>
</template>