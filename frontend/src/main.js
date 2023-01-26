import { createApp } from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'

import AllTickets from './components/AllTickets.vue'
import User from './components/AddUser.vue'
import NewTicket from './components/AddTicket.vue'
import Comment from './components/ViewTicket.vue'

const routes = [
  {
    name: 'AllTickets',
    path: '/',
    component: AllTickets
  },
  {
    name: 'User',
    path: '/user',
    component: User
  },
  {
    name: 'NewTicket',
    path: '/ticket',
    component: NewTicket
  },
  {
    name: 'Comment',
    path: '/ticket/:ticketId',
    component: Comment
  }
]

const router = createRouter({ 
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

createApp(App)
  .use(router)
  .mount('#app')