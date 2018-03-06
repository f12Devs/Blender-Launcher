export default [
    {
        path: '/home',
        name: 'main',
        component: () => import('layouts/home'),
        props: true
    },

    {
        // Always leave this as last one
        path: '*',
        component: () => import('pages/404')
    }
]
