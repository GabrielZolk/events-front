<template>
    <div class="register-container">
        <form>
            <div>
                <div><label>Email</label></div>
                <input type="email" class='register-input' placeholder="your@email.com" />
            </div>
            <div>
                <div><label>Password</label></div>
                <input class='register-input' type="password" placeholder="password" />
            </div>
            <div>
                <div><label>Confirm password</label></div>
                <input type="password" class='register-input' placeholder="confirm password" />
            </div>
            <div>
                <button type="button" class='solid register-button'>Register</button>
            </div>
            <div>
                <router-link to="/login">
                <button type="button" class='outline register-button'>Login</button>
            </router-link>
            </div>
        </form>
    </div>
</template>

<style scoped>
.register-container {
    background-color: var(--primary-color-two);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.register-container .register-input, .register-button {
    padding: 10px;
    margin-bottom: 10px;
    width: -webkit-fill-available;
}
 
.register-input {
    border: none;
}

.register-button {
    cursor: pointer;
}

.register-button:active {
    opacity: 0.8;
}
</style>