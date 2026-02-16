import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'

import LoginPage from '@/features/auth/pages/login-page'
import { EditPlanningForm } from '@/features/planning/pages/edit-planning-page'
import { NewPlanningForm } from '@/features/planning/pages/new-planning-page'
import PlanningDetailPage from '@/features/planning/pages/planning-detail-page'
import PlanningListPage from '@/features/planning/pages/planning-list-page'
import { ProtectedLayout } from './protected-layout'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  loader: () => {
    const authStorage = localStorage.getItem('auth-storage')

    if (authStorage) {
      const parsed = JSON.parse(authStorage)

      if (parsed?.state?.isAuthenticated) {
        throw redirect({ to: '/plannings' })
      }
    }

    throw redirect({ to: '/login' })
  },
})

/* ---------------- PUBLIC ROUTES ---------------- */

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

/* ---------------- PROTECTED ROUTES ---------------- */

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
})

const planningListRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/plannings',
  component: PlanningListPage,
})

const newPlanningRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/plannings/new',
  component: NewPlanningForm,
})

const planningDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/plannings/$id',
  component: PlanningDetailPage,
})

const planningEditRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/plannings/edit/$id',
  component: EditPlanningForm,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  protectedRoute.addChildren([
    planningListRoute,
    newPlanningRoute,
    planningDetailRoute,
    planningEditRoute,
  ]),
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
