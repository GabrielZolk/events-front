<template>
  <div class="home">
    <h1>Welcome to <span>EventHub</span></h1>
    <p>Here you can schedule your events, connect with friends and organize your time!</p>
    <div v-if="!$store.state.user.name" class="auth">
      <router-link to="/login">
        <button type='button' class='solid login-button'>Login</button>
      </router-link>
      <router-link to="/register">
        <button type='button' class='outline login-button'>Register</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  background: var(--primary-color-gradient);
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
  color: var(--primary-color-one);
  font-size: 80px;
  margin-bottom: 20px;
}

h1,

p {
  color: var(--dark-color);
  font-size: 60px;
}

</style>
