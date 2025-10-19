<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  const route = useRoute();
</script>

<template>
  <el-menu
    :default-active="route.path"
    class="el-menu-demo"
    mode="horizontal"
    router
  >
    <el-menu-item index="/home">首页</el-menu-item>
    <el-menu-item index="/product">产品</el-menu-item>
    <!-- <el-menu-item index="/reagent">试剂耗材</el-menu-item> -->
    <el-menu-item index="/agent">代理品牌</el-menu-item>
    <el-menu-item index="/tech">技术材料</el-menu-item>
    <!-- <el-menu-item index="/user">用户管理</el-menu-item> -->
    <!-- <el-menu-item index="/bill">订单管理</el-menu-item> -->
    <!-- <el-menu-item index="/chart">数据报表</el-menu-item> -->
    <el-menu-item index="/message">客户留言</el-menu-item>
    <el-menu-item index="/services">服务项目</el-menu-item>
    <el-menu-item index="/articles">文章管理</el-menu-item>
    <el-menu-item index="/company">公司信息</el-menu-item>
  </el-menu>
</template>