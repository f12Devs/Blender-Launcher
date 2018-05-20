import Vue from 'vue'
import App from './App.vue'
import store from './store'

import './styles/quasar.styl'
import 'quasar-extras/animate'
import 'quasar-extras/roboto-font'
import 'quasar-extras/material-icons'
import Quasar, {
    QBtn,
    QLayout,
    QLayoutHeader,
    QLayoutDrawer,
    QPage,
    QPageContainer,
    QToolbar,
    QToolbarTitle,
    QList,
    QListHeader,
    QItemSeparator,
    QItem,
    QItemSide,
    QItemMain
} from 'quasar'

Vue.use(Quasar, {
    components: {
        QBtn,
        QLayout,
        QLayoutHeader,
        QLayoutDrawer,
        QPage,
        QPageContainer,
        QToolbar,
        QToolbarTitle,
        QList,
        QListHeader,
        QItemSeparator,
        QItem,
        QItemSide,
        QItemMain
    },
    directives: {},
    plugins: {}
})

Vue.config.productionTip = false

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')
