import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Contacts from '../views/Contacts.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Events from '../views/Events.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: Contacts
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/events',
    name: 'events',
    component: Events
  },
]

const router = new VueRouter({
  routes
})

export default router
