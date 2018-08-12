<template>
    <q-layout view="lHh Lpr lFf">
        <q-layout-header>
            <q-toolbar color="primary">
                <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen">
                    <q-icon name="menu" />
                </q-btn>

                <q-toolbar-title>
                    Blender Launcher
                </q-toolbar-title>
            </q-toolbar>
        </q-layout-header>

        <q-layout-drawer behavior="desktop" v-model="leftDrawerOpen" content-class="bg-grey-2">
            <q-list no-border link inset-delimiter>
                <q-list-header>Blender Variants:</q-list-header>
                <div v-for="(item, index) in $store.state.variants" :key="item.name">
                    <q-item-separator v-if="index!=0" class="q-ma-none" />
                    <q-item v-ripple link @click.native="$store.commit('setSelected', item.name)">
                        <q-item-side :avatar="item.name=='Stable' ? logoPath: null" :icon="item.name=='Stable' ? null: 'code'" />
                        <q-item-main>
                            <q-item-tile label>
                                <q-chip class="q-mr-xs" :color="tag == 'Stable'? 'blue' : tag=='Official' ? 'green' : tag == 'New Compiler' ? 'orange': tag == 'Blender 2.8' ? 'red' : null" v-for="tag in item.name.split(',')" :key="tag">
                                    {{tag}}
                                </q-chip>
                            </q-item-tile>
                            <q-item-tile sublabel>{{item.name}}</q-item-tile>
                        </q-item-main>
                        <q-item-side v-if="item.status === 'Downloading' || item.status === 'Installing'" right>
                            <q-spinner size="30px"></q-spinner>
                        </q-item-side>
                        <q-tooltip :delay="250">{{item.status }}</q-tooltip>
                    </q-item>
                </div>
            </q-list>
        </q-layout-drawer>

        <q-page-container style="height:100%">
            <home />
        </q-page-container>
    </q-layout>
</template>

<script>
import Home from './components/Home.vue'
import updateInstalled from './updateInstalled'
import path from 'path'
export default {
    name: 'LayoutDefault',
    components: {
        Home
    },
    data () {
        return {
            leftDrawerOpen: this.$q.platform.is.desktop,
            logoPath: path.join(process.env.BASE_URL, 'BlenderDesktopLogo.png')
        }
    },
    created () {
        updateInstalled(this.$store)
    }
}
</script>

<style>
</style>
