<template>
    <div class="container">
        <template v-if="items.length === 0">
            <el-empty description="无公司" />
        </template>
        <template v-else>
            <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <span>Card name</span>
                    <el-button class="button" text>Operation button</el-button>
                  </div>
                </template>
                <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
              </el-card>
        </template>
        
        
    </div>
</template>

<script setup lang="ts" >
import { ref } from 'vue';
interface Company{
    name: string
}
const items = ref([])

console.log(items.value.length)

</script>

<style scoped>

</style>
