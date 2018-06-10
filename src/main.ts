import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Quasar, {
    CloseOverlay,
    QBtn,
    QBtnGroup,
    QChip,
    QIcon,
    QItem,
    QItemMain,
    QItemSeparator,
    QItemSide,
    QItemTile,
    QLayout,
    QLayoutDrawer,
    QLayoutHeader,
    QList,
    QListHeader,
    QPage,
    QPageContainer,
    QPopover,
    QSpinner,
    QToolbar,
    QToolbarTitle,
    QTooltip,
    Ripple
} from 'quasar'
import 'quasar-extras/animate'
import 'quasar-extras/material-icons'
import 'quasar-extras/roboto-font'
import './styles/quasar.styl'

Vue.use(Quasar, {
    components: {
        QBtn,
        QBtnGroup,
        QChip,
        QIcon,
        QItem,
        QItemMain,
        QItemSeparator,
        QItemSide,
        QItemTile,
        QLayout,
        QLayoutDrawer,
        QLayoutHeader,
        QList,
        QListHeader,
        QPage,
        QPageContainer,
        QPopover,
        QSpinner,
        QToolbar,
        QToolbarTitle,
        QTooltip
    },
    directives: {
        CloseOverlay,
        Ripple
    },
    plugins: {}
})

Vue.config.productionTip = false

new Vue({
    render: (h) => h(App),
    store
}).$mount('#app')
