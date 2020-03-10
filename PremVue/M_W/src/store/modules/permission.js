import {
  asyncRouterMap,
  constantRouterMap
} from '@/router'
import Layout from '@/views/layout/Layout'

/**
 *
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 *
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        const {
          roles
        } = data
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }

        const routes = []
        if (data && data.routes && data.routes.dashboard) {
          /*
          routes.push({
            path: '/MWDB',
            component: Layout,
            redirect: '/MWDB/Dashboard',
            name: 'MedicsWeb-Dashboard',
            meta: {
              title: 'Dashboard',
              icon: 'table'
            },
            children: [{
              path: 'Dashboard',
              name: 'Dashboard',
              component: () => import('@/views/dashboard/index'),
              meta: {
                title: 'Dashboard'
              }
            }]
          })
      */
        }
      
        if (data && data.routes && data.routes.ai) {
          routes.push({
            path: '/MWAI',
            component: Layout,
            redirect: '/MWAI/AccountInquiry',
            name: 'MedicsWeb-AccountInquiry',
            meta: {
              title: 'AccountInquiry',
              icon: 'ai'
            },
            children: [{
              path: 'AccountInquiry',
              name: 'AccountInquery',
              component: () => import('@/views/AI/index'),
              meta: {
                title: 'Account Inquiry'
              }
            }]
          })
        }

        if (data && data.routes && data.routes.demographics) {
          routes.push({
            path: '/MWDM',
            component: Layout,
            redirect: '/MWDM/Demographics',
            name: 'MWDM-Demographics',
            meta: {
              title: 'Demographics',
              icon: 'demo',
              noCache: true
            },
            children: [{
              path: 'Demographics',
              name: 'Demographics',
              component: () => import('@/views/demographics/index'),
              meta: {
                title: 'Demographics',
                noCache: true
              }
            }]
          })
        }
        if (data && data.routes && data.routes.scheduler) {
          /*
          routes.push({
            path: '/MWS',
            component: Layout,
            redirect: '/MWS/Scheduler',
            name: 'MedicsWeb-Scheduler',
            meta: {
              title: 'Scheduler',
              icon: 'calendar',
              noCache: true
            },
            children: [{
              path: 'Scheduler',
              name: 'Scheduler',
              noCache: true,
              component: () => import('@/views/Scheduler/index'),
              meta: {
                title: 'Scheduler'
              }
            }]
          })
        */
        }

        if (routes) accessedRouters = accessedRouters.concat(routes)
        const dynamicRoutes = []
        if (data.routes.reports) {
          dynamicRoutes.push({
            path: '/reports-utils',
            component: () => import('@/views/reports/main'),
            name: 'ReportsIndex',
            hidden: false,
            redirect: '/reports-utils/lookup',
            meta: {
              title: 'Reports Utilities',
              noCache: false
            },
            children: [{
              path: 'lookup',
              component: () => import('@/views/reports/reports'),
              name: 'lookupReportsUtil',
              hidden: false,
              meta: {
                title: 'Reports Lookup',
                noCache: false
              }
            }, {
              path: 'schreports',
              component: () => import('@/views/reports/scheduled'),
              name: 'schedReportsUtil',
              hidden: false,
              meta: {
                title: 'Scheduled Reports',
                noCache: false
              }
            }]
          })
          Object.keys(data.routes.reports).forEach(function(item) {
            const route = {
              path: item,
              component: () => import('@/views/reports/index'),
              name: item,
              meta: {
                title: item,
                noCache: false
              },
              redirect: '/reports',
              children: []
            }
            data.routes.reports[item].forEach(function(report) {
              route.children.push({
                path: report.PROG,
                component: () => import('@/views/reports/index'),
                name: report.PROG,
                meta: {
                  title: report.NAME,
                  ...report,
                  noCache: false
                }
              })
            })
            dynamicRoutes.push(route)
          })
          const finalDynRoutes = {
            path: '/reports',
            redirect: '/reports-util/lookup',
            component: Layout,
            name: 'Reports',
            meta: {
              title: 'Reports',
              icon: 'statistics',
              noCache: false
            },
            children: dynamicRoutes
          }
          accessedRouters = accessedRouters.concat(finalDynRoutes)
        }

        if (data && data.sub) {
        
          accessedRouters.push({
            path: '/MWSUB',
            component: () => import('@/views/submissions/mwsub'),
            name: 'MWSUB',
            hidden:true,
            meta: {
              title: 'Submissions',
              noCache: true
            },
          })
          const routes = data.sub
          const nlevel = []
          const lite=[]
          for (const i in routes) {
            const r = {
              path: routes[i][0].FOLDER,
              component: () => import('@/views/reports/index'),
              name: 'lite-'+routes[i][0].FOLDER,
              meta: { title: routes[i][0].FOLDER },
              children: []
            }
            for (const k in routes[i]) {
              const lr = {
                path: routes[i][k].PROG,
                component: () => import('@/views/reports/index'),
                name: 'lite-'+routes[i][k].NAME + '' + i + 1,
                meta: { title: routes[i][k].NAME,
                  PROG: routes[i][k].PROG,
                  NAME: routes[i][k].NAME

                }
              }
              r.children.push(lr)
            }
            nlevel.push(r)
          }
          for (const i in routes) {
            const r = {
              path: routes[i][0].FOLDER,
              component: () => import('@/views/reports/index'),
              name: routes[i][0].FOLDER,
              hidden:true,
              meta: { title: routes[i][0].FOLDER },
              children: []
            }
            for (const k in routes[i]) {
              const lr = {
                path: routes[i][k].PROG,
                component: () => import('@/views/reports/index'),
                name: routes[i][k].NAME + '' + i + 1,
                hidden:true,
                meta: { title: routes[i][k].NAME,
                  PROG: routes[i][k].PROG,
                  NAME: routes[i][k].NAME,
                  FOLDER: routes[i][k].FOLDER

                }
              }
              r.children.push(lr)
            }
            lite.push(r)
          }

          const nestedRouter = {
            path: '/submissions',
            component: Layout,
            redirect: data.subRedirect,
            name: 'Submissions',
            meta: {
              title: 'Submissions',
              icon: 'ins'
            },
            children: [{
              path: 'electronic-submissions',
              component: () => import('@/views/submissions/index'),
              name: 'Electronic Submissions',
              redirect: data.subRedirect,
              meta: { title: 'Electronic Submissions' },
              children: nlevel
            },{
              path: 'prepared_files',
              component: () => import('@/views/submissions/preparedfiles'),
              name: 'Prepared-Files',
              meta: { title: 'Prepared FIles' },
            },{
              path: 'Denials',
              component: () => import('@/views/submissions/denials'),
              name: 'Denials',
              meta: { title: 'Denials' },
            }]
          }
          let liteSubReports = [];
          if (data.routes.reports){
              Object.keys(data.routes.reports).forEach(function(item) {
                data.routes.reports[item].forEach(function(report) {
                  if (report.LIST ==='Insurance Control'){
                    liteSubReports.push({
                      path: report.PROG,
                      component: () => import('@/views/reports/index'),
                      name: 'lite-sub-'+report.PROG,
                      meta: {
                        title: report.NAME,
                        ...report,
                        noCache: false
                      }
                    })
                  }
                })
              })
          }
          const liteNestedRouter = {
            path: '/lite-submissions',
            redirect: data.subRedirect,
            name: 'lite-submissions',
            component: () => import('@/views/submissions/mwsub'),
            hidden:true,
            meta: {
              title: 'lite-submissions',
              icon: 'ins'
            },
            children: [{
              path: 'electronic-submissions',
              component: () => import('@/views/reports/index'),
              name: 'Electronic Submissions.',
              redirect: data.subRedirect,
              hidden:true,
              meta: { title: 'Electronic Submissions' },
              children: lite
            },{
              path: 'electronic-submissions-reports',
              component: () => import('@/views/reports/index'),
              name: 'Insurance Control Reports',
              hidden:true,
              meta: { title: 'Insurance Control Reports' },
              children: liteSubReports
            },
          {
            path: 'prepared_files',
            component: () => import('@/views/submissions/preparedfiles'),
            name: 'lite-Prepared-Files',
            hidden:true,
            meta: { title: 'Prepared FIles', },
          },{
            path: 'Denials',
            component: () => import('@/views/submissions/denials'),
            name: 'lite-Denials',
            hidden:true,
            meta: { title: 'Denials' },
          },
        ]
          }
          accessedRouters = accessedRouters.concat(nestedRouter)
          accessedRouters = accessedRouters.concat(liteNestedRouter)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
/*

    {
      path: 'submissions',
      component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: 'Submissions',
      meta: { title: 'Submissions' },
      redirect: '/Submissions/form1/processrecon',
      children: [
        {
          path: 'processrecon',
          component: () => import('@/views/nested/menu1/menu1-2'),
          name: 'Form 1',
          redirect: '/Submissions/form1/processrecon',
          meta: { title: 'menu1-2',NAME:'',PROG:'' },
          children: [
            {
              path: 'Processrecon',
              name: 'ProcessRecon',
              meta: { title: 'Process Recon' }
            },
          ]
        },
      ]
    },

    {
      path: 'menu1',
      component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: 'Menu1',
      meta: { title: 'menu1' },
      redirect: '/nested/menu1/menu1-1',
      children: [
        {
          path: 'menu1-1',
          component: () => import('@/views/nested/menu1/menu1-1'),
          name: 'Menu1-1',
          meta: { title: 'menu1-1' }
        },
        {
          path: 'menu1-2',
          component: () => import('@/views/nested/menu1/menu1-2'),
          name: 'Menu1-2',
          redirect: '/nested/menu1/menu1-2/menu1-2-1',
          meta: { title: 'menu1-2' },
          children: [
            {
              path: 'menu1-2-1',
              component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
              name: 'Menu1-2-1',
              meta: { title: 'menu1-2-1' }
            },
            {
              path: 'menu1-2-2',
              component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
              name: 'Menu1-2-2',
              meta: { title: 'menu1-2-2' }
            }
          ]
        },
        {
          path: 'menu1-3',
          component: () => import('@/views/nested/menu1/menu1-3'),
          name: 'Menu1-3',
          meta: { title: 'menu1-3' }
        }
      ]
    },

  {
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1/menu1-1',
  name: 'Nested',
  meta: {
    title: 'nested',
    icon: 'nested'
  },
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: 'Menu1',
      meta: { title: 'menu1' },
      redirect: '/nested/menu1/menu1-1',
      children: [
        {
          path: 'menu1-1',
          component: () => import('@/views/nested/menu1/menu1-1'),
          name: 'Menu1-1',
          meta: { title: 'menu1-1' }
        },
        {
          path: 'menu1-3',
          component: () => import('@/views/nested/menu1/menu1-3'),
          name: 'Menu1-3',
          meta: { title: 'menu1-3' }
        }
      ]
    },

*/
