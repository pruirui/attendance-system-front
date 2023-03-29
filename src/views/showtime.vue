<template>

  <div>
    <h3 style="align-items: center; justify-content: center; display: flex; height: 30px; width: 300px; margin-top: 5px; margin-bottom: 5px;">{{ time }}</h3>
	<h3 style="align-items: center; justify-content: center; display: flex; height: 30px; width: 300px; margin-top: 5px; margin-bottom: 5px;">	{{info}} </h3>

    <h3 style="align-items: center; justify-content: center; display: flex; height: 30px; width: 300px; margin-top: 5px; margin-bottom: 5px;">{{ formattedDate }} {{null_str}} {{ dayOfWeek }}</h3>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'

export default {
  name: 'Clock',
  setup() {
	const info = ref('')
    const time = ref('')
    const formattedDate = ref('')
    const dayOfWeek = ref('')
	const null_str = '\t'.repeat(3)
    const updateTime = () => {
      const now = new Date()
      const hour = ('0' + now.getHours()).slice(-2)
      const minute = ('0' + now.getMinutes()).slice(-2)
      const second = ('0' + now.getSeconds()).slice(-2)
      time.value = `${hour}:${minute}:${second}`
      const year = now.getFullYear()
      const month = ('0' + (now.getMonth() + 1)).slice(-2)
      const day = ('0' + now.getDate()).slice(-2)
      formattedDate.value = `${year}-${month}-${day}`
      dayOfWeek.value = now.toLocaleString('default', { weekday: 'long' })

      info.value = 'GMT+0800 (中国标准时间)';

    }

    onMounted(() => {
      setInterval(updateTime, 1000)
    })

    return {
		time,
		formattedDate,
		dayOfWeek,
		info,
    }
  },
}
</script>

 
