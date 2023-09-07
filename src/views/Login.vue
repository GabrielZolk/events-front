<template>
    <div class="login-container">
        <form>
            <div>
                <div><label>Email</label></div>
                <input class='login-input' type="email" name="email" placeholder='your@email.com'>
            </div>
            <div>
                <div><label>Password</label></div>
                <input class='login-input' type="password" name="password" placeholder='password'/>
            </div>
            <div>
                <button type='button' class='clear login-button'>Recover Password</button>
            </div>
            <div>
                <button type='button' class='solid login-button'>Login</button>
            </div>
            <div>
                <router-link to="/register">
                    <button type='button' class='outline login-button'>Register</button>
                </router-link>
            </div>
        </form>
    </div>
</template>

<style scoped>
.login-container {
    background-color: var(--primary-color-two);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.login-container .login-input, .login-button {
    padding: 10px;
    margin-bottom: 10px;
    width: -webkit-fill-available;
}

.login-input {
    border: none;
}

.login-button {
    cursor: pointer;
}

.login-button:active {
    opacity: 0.8;
}
</style>