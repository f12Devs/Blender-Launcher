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
                    <q-list-header>Stable Version</q-list-header>
                    <q-item @click.native="$store.commit('setVersion', 'stable')">
                        <q-item-side avatar="statics/BlenderDesktopLogo.png" />
                        <q-item-main label="Blender Stable" sublabel="version 2.79" />
                    </q-item>
                    <q-list-header>Experimental Builds</q-list-header>
                    <q-item v-for="item in $store.state.versions.experimental" :key="item.name" @click.native="$store.commit('setVersion', item.tags)">
                        <q-item-side icon="code" />
                        <q-item-main :label="item.tags.join(', ')" :sublabel="item.name" />
                    </q-item>
                </q-list>
            </q-layout-drawer>

            <q-page-container style="height:100%">
                <home />
            </q-page-container>
        </q-layout>
    </div>
</template>

<script>
import home from './layouts/home'
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
