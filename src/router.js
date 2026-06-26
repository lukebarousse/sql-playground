import { createRouter, createWebHashHistory } from 'vue-router'
import Workspace from '@/views/Workspace'
import Inquiries from '@/views/Inquiries'
import Welcome from '@/views/Welcome'
import MainView from '@/views/MainView'
import LoadView from '@/views/LoadView'
import store from '@/store'
import database from '@/lib/database'
import { getStartupLoadRoute } from '@/lib/datasets'

export const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/',
    name: 'MainView',
    component: MainView,
    children: [
      {
        path: '/workspace',
        name: 'Workspace',
        component: Workspace
      },
      {
        path: '/inquiries',
        name: 'Inquiries',
        component: Inquiries
      }
    ]
  },
  {
    path: '/load',
    name: 'Load',
    component: LoadView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.db && to.name !== 'Load') {
    // On a fresh load/refresh there is no database in memory. Try to restore
    // the last dataset the user loaded (or the configured default), so we
    // don't fall back to the bundled demo database.
    const startup = await getStartupLoadRoute()
    if (startup) {
      next(startup)
      return
    }
    const newDb = database.getNewDatabase()
    await newDb.loadDb()
    store.commit('setDb', newDb)
  }
  next()
})

export default router
