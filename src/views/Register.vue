<template>
    <div class="register-container">
        <form>
            <div>
                <div><label>Name</label></div>
                <input type="text" class='register-input' v-model="name" placeholder="your name" />
            </div>
            <div>
                <div><label>Email</label></div>
                <input type="email" class='register-input' v-model="email" placeholder="your@email.com" />
            </div>
            <div>
                <div><label>Password</label></div>
                <input class='register-input' type="password" v-model="password" placeholder="password" />
            </div>
            <div>
                <div><label>Confirm password</label></div>
                <input type="password" class='register-input' v-model="confirmPassword" placeholder="confirm password" />
            </div>
            <div>
                <button type="button" class='solid register-button' @click="register">Register</button>
            </div>
            <div>
                <router-link to="/login">
                    <button type="button" class='outline register-button'>Login</button>
                </router-link>
            </div>
        </form>
        <v-alert v-if="responseStatus" border="left" color="green" elevation="24" type="success">Registered! Redirecting...</v-alert>
        <p>{{ error }}</p>
    </div>
</template>

<script>
import axios from '../api/axios-config';

export default {
    name: 'Register',
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: '',
            responseStatus: null
        };
    },
    methods: {
        async register() {
            if (this.password !== this.confirmPassword) {
                this.error = 'Password does not match';
                return;
            }

            try {
                if (!this.name || !this.email || !this.password || !this.confirmPassword) {
                    this.error = 'All fields are required';
                    return;
                }
                const response = await axios.post('/users', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                });

                this.responseStatus = response;

                setTimeout(() => {
                    this.$router.push('/login');
                }, 5000);
            } catch (error) {
                this.error = 'Internal error (500)';
            }

        },
    }
}
</script>

<style scoped>
.register-container {
    background-color: var(--primary-color-two);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.register-container .register-input,
.register-button {
    padding: 10px;
    margin-bottom: 10px;
    width: -webkit-fill-available;
}

.register-input {
    border: 2px solid white;
}

.register-button {
    cursor: pointer;
}

.register-button:active {
    opacity: 0.8;
}
</style>
