<template>
  <div class="home">
    <h1>Welcome to <span>EVENTHUB</span></h1>
    <p>Here you can schedule your events, connect with friends and organize your time!</p>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  components: {
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 80px;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

span {
  font-weight: bold;
  color: var(--primary-color-two);
  font-size: 80px;
  margin-bottom: 20px;
}

h1, p {
  color: var(--dark-color);
  font-size: 60px;
}
</style>
