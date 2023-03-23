<template>
	<!-- <el-card style="width: 300px; height: 300px;" :body-style="{ padding: '0px' }"> -->
		<canvas ref="clockCanvas" width="300" height="300"></canvas>
	<!-- </el-card> -->
		
</template>

<script>

export default {
  data() {
    return {
      date: new Date(),
      context: null,
      centerX: 150,
      centerY: 150,
      clockRadius: 135,
    };
  },
  mounted() {
    this.context = this.$refs.clockCanvas.getContext("2d");
    setInterval(() => {
      this.date = new Date();
      this.drawClock();
    }, 1000);
  },
  methods: {
	
    drawClock() {
      // 绘制背景圆形
      this.context.clearRect(0, 0, this.$refs.clockCanvas.width, this.$refs.clockCanvas.height);
      this.context.beginPath();
      this.context.arc(this.centerX, this.centerY, this.clockRadius, 0, Math.PI * 2);
      this.context.fillStyle = "#f7f7f7";
      this.context.fill();

      // 绘制时间刻度
	for (let i = 0; i < 60; i++) {
	    let angle = i * (Math.PI / 30);
	    let isHourTick = i % 5 === 0;
	    let radius = isHourTick ? this.clockRadius - 20 : this.clockRadius - 10;
	    let tickWidth = isHourTick ? 10 : 2;
	    let x = this.centerX + Math.sin(angle) * radius;
	    let y = this.centerY - Math.cos(angle) * radius;
	    this.context.beginPath();
	    this.context.arc(x, y, tickWidth, 0, Math.PI * 2);
	    this.context.fillStyle = "#320101";
	    this.context.fill();
	    if (isHourTick) {
	        this.context.save();
	        this.context.translate(x, y);
	        this.context.rotate(-angle);
	        this.context.textAlign = "center";
	        this.context.textBaseline = "middle";
	        this.context.fillStyle = "#ffffff";
	        this.context.font = "bold 16px Arial";
	        this.context.fillText(i / 5 === 0 ? 12 : i / 5, 0, 0);
	        this.context.restore();
	    }
	}

	

      // 绘制时针
      let hour = this.date.getHours();
      let minute = this.date.getMinutes();
      let second = this.date.getSeconds();
      this.context.save();
      this.context.translate(this.centerX, this.centerY);
      this.context.rotate((hour * 30 + minute / 2) / 180 * Math.PI);
      this.context.beginPath();
      this.context.lineWidth = 10;
      this.context.lineCap = "round";
      this.context.moveTo(0, 0);
      this.context.lineTo(0, -this.clockRadius / 2);
      this.context.stroke();
      this.context.restore();

      // 绘制分针
      this.context.save();
      this.context.translate(this.centerX, this.centerY);
      this.context.rotate((minute * 6 + second / 10) / 180 * Math.PI);
      this.context.beginPath();
      this.context.lineWidth = 6;
      this.context.lineCap = "round";
      this.context.moveTo(0, 0);
      this.context.lineTo(0, -this.clockRadius * 0.7);
      this.context.stroke();
      this.context.restore();

      // 绘制秒针
      this.context.save();
      this.context.translate(this.centerX, this.centerY);
      this.context.rotate(second * 6 / 180 * Math.PI);
      this.context.beginPath();
      this.context.lineWidth = 2;
      this.context.lineCap = "round";
      this.context.moveTo(0, 0);
      this.context.lineTo(0, -this.clockRadius * 0.9);
      this.context.strokeStyle = "red";
      this.context.stroke();
      this.context.restore();
	  
    }
  }
};
</script>
