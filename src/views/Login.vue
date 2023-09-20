<template>
    <div class="login-container">
        <form>
            <div>
                <div><label>Email</label></div>
                <input class='login-input' type="email" name="email" v-model="email" placeholder='your@email.com'>
            </div>
            <div>
                <div><label>Password</label></div>
                <input class='login-input' type="password" name="password" v-model="password" placeholder='password' />
            </div>
            <div>
                <button type='button' class='clear login-button'>Recover Password</button>
            </div>
            <div>
                <button type='button' class='solid login-button' @click="login">Login</button>
            </div>
            <div>
                <router-link to="/register">
                    <button type='button' class='outline login-button'>Register</button>
                </router-link>
            </div>
        </form>
        <p>{{ error }}</p>
    </div>
</template>

<script>
import axios from '../api/axios-config';
import Cookies from 'js-cookie';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            error: ''
        };
    },
    methods: {
        async login() {
            try {
                if (!this.email || !this.password) {
                    this.error = 'All fields are required';
                    return;
                }

                const response = await axios.post('/login', {
                    email: this.email,
                    password: this.password,
                });
                const token = response.data.token;
                const user = response.data.user;

                const userData = {
                    id: user ? user.id : null,
                    name: user ? user.name : null,
                    email: user ? user.userEmail : null,
                    token,
                }

                if (token) {
                    Cookies.set('auth', JSON.stringify(userData), { expires: 1 });
                    this.$store.commit('setToken', token);
                    this.$store.commit('setUser', user);
                    this.$router.push('/');
                }
                this.error = 'Wrong email or password';
            } catch (error) {
                this.error = 'Internal error';
                console.log(error)
            }
        },
    }
};
</script>

<style scoped>
.login-container {
    background-color: var(--primary-color-two);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.login-container .login-input,
.login-button {
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    width: -webkit-fill-available;
}

.login-input {
    border: 2px solid white;
}

.login-button:active {
    opacity: 0.8;
}
</style>