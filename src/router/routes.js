export default [
    {
        path: '/home',
        name: 'main',
        component: () => import('layouts/main'),
        props: true
    },

    {
        // Always leave this as last one
        path: '*',
        component: () => import('pages/404')
    }
]
