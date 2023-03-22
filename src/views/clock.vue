<template>
  <div>
    <h3>{{ time }}</h3>
    <h4>{{ formattedDate }}, {{ dayOfWeek }}</h4>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Clock',
  setup() {
    const time = ref('')
    const formattedDate = ref('')
    const dayOfWeek = ref('')

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
    }

    onMounted(() => {
      setInterval(updateTime, 1000)
    })

    return {
      time,
      formattedDate,
      dayOfWeek,
    }
  },
}
</script>

 
