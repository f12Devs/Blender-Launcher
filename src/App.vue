<template>
    <div id="q-app">
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

            <q-layout-drawer v-model="leftDrawerOpen" content-class="bg-grey-2">
                <q-list no-border link inset-delimiter>
                    <q-list-header>Blender Varients:</q-list-header>
                    <div v-for="(item, key, index) in $store.state.versions" :key="item.name">
                        <q-item-separator v-if="index!=0" class="q-ma-none"/>
                        <q-item @click.native="$store.commit('setVersion', key)">
                            <q-item-side :avatar="key=='Stable' ? 'statics/BlenderDesktopLogo.png': null" :icon="key=='Stable' ? null: 'code'" />
                                <q-item-main>
                                    <q-item-tile label>
                                        <q-chip class="q-mr-xs" :color="tag == 'Stable'? 'blue' : tag=='Official' ? 'green' : tag == 'New Compiler' ? 'orange': tag == 'Blender 2.8' ? 'red' : null" v-for="tag in key.split(',')" :key="tag">
                                            {{tag}}
                                        </q-chip>
                                    </q-item-tile>
                                    <q-item-tile sublabel>{{item.name}}</q-item-tile>
                                </q-item-main>
                        </q-item>
                    </div>
                </q-list>
            </q-layout-drawer>

            <q-page-container style="height:100%">
                <home />
            </q-page-container>
        </q-layout>
    </div>
</template>

<script>
import home from './layouts/home.vue'
export default {
    name: 'App',
    data() {
        return {
            leftDrawerOpen: false
        }
    },
    components: { home }
}
</script>

<style>

</style>
