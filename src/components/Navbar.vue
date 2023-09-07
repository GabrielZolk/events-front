<template>
    <div class="navbar">
        <h1>EventHub</h1>
        <nav>
            <div class="menu">
                <router-link to="/">Home</router-link>
                <router-link to="/events">Events</router-link>
                <router-link to="/contacts">Contacts</router-link>
                <router-link to="/user">Profile</router-link>
            </div>
            <div class="auth">
                <router-link to="/login">Login</router-link>
                <router-link to="/register">Register</router-link>
            </div>
          </nav>
    </div>
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 40px;
    background-color: #333;
    color: #fff;
}

.navbar h1 {
    background-image: var(--primary-color-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

nav {
    display: flex;
    align-items: center;
    gap: 50px;
}

nav a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    border-radius: 4px;
}

nav a.router-link-exact-active {
    color: var(--primary-color-one);
}

.auth {
    display: flex;
    gap: 10px;
    align-items: center;
}

.menu {
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>