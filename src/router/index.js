import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie';

import Home from '../views/Home.vue'
import Contacts from '../views/Contacts.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Events from '../views/Events.vue'

Vue.use(VueRouter)

function authVerify() {
    const token = Cookies.get('auth');
    return !!token;
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: Contacts,
    beforeEnter: (to, from, next) => {
      if (authVerify()) {
          next();
      } else {
          next('/login');
      }
  }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    beforeEnter: (to, from, next) => {
      if (authVerify()) {
          next();
      } else {
          next('/login');
      }
  }
  },
  {
    path: '/events',
    name: 'events',
    component: Events,
    beforeEnter: (to, from, next) => {
        if (authVerify()) {
            next();
        } else {
            next('/login');
        }
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
