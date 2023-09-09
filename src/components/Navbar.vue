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
            <div v-if="!$store.state.user.name" class="auth">
                <router-link to="/login">Login</router-link>
                <router-link to="/register">Register</router-link>
            </div>
            <div v-else class="auth">
                <div class="avatar" @click="setUserModal">
                    <v-avatar color="#FAAA49" size="50">
                        <img v-if="$store.state.imageBase64" :src="$store.state.imageBase64" alt="Profile Photo" />
                        <v-icon v-else dark size="50">
                            mdi-account-circle
                        </v-icon>
                    </v-avatar>
                    <p>Hello, {{ $store.state.user.name }}!</p>
                </div>
                <div v-if="userModal" @click="logout" class="logout-dropDown">
                    Logout
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
    name: 'Navbar',
    data() {
        return {
            userModal: false,
            profileImage: '',  
        }
    },
    methods: {
        logout() {
            Cookies.remove('auth');
            this.$store.commit('setUser', '');
            this.$router.push('/login');
        },
        setUserModal() {
            this.userModal = !this.userModal;
        }
    },
    created() {
        const auth = Cookies.get('auth');
        if (auth) {
            const user = JSON.parse(auth);
            this.$store.commit('setUser', user);
        }
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

.avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    position: relative;
}

.avatar p {
    margin-top: 5px;
}

.logout-dropDown {
    cursor: pointer;
    background-color: white;
    color: black;
    padding: 30px 20px;
    border-radius: 15px;
    position: absolute;
    top: 80px;
    right: 40px;
}
</style>