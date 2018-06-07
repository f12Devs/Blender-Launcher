<template>
    <div style="height:100%" class="row">
        <div style="height:100%" class="column">
            hi there, version is {{selected}}, installed version of that is {{installedVersion}}
            <div class="q-pa-md" style="position:fixed;bottom:0">
                <q-btn-group>
                    <q-btn @click="launch" color="primary" size="lg" label="Launch" :disabled="installing" v-if="$store.state.installed[selected].status != 'Not Installed'">
                    </q-btn>
                    <q-btn color="primary" :loading="installing" :percentage="progress" :disabled="$store.state.installed[selected].status == 'Updated'" @click="download()" size="lg" :label="$store.state.installed[selected].status != 'Not Installed' ? 'Update' : 'Install'">
                        <span slot="loading">{{$store.state.installed[selected].status + ': ' + progress + '%'}}</span>
                    </q-btn>
                    <q-btn icon="more vert" v-if="$store.state.installed[selected].status != 'Not Installed' && !installing" color="primary">
                        <q-popover>
                            <q-list separator link>
                                <q-item @click.native="uninstall" v-close-overlay>
                                    <q-item-side icon="delete" inverted color="primary" />
                                    <q-item-main>
                                        <q-item-tile label>Uninstall</q-item-tile>
                                    </q-item-main>
                                </q-item>
                                <q-item v-close-overlay @click.native="download">
                                    <q-item-side icon="file download" inverted color="primary" />
                                    <q-item-main>
                                        <q-item-tile label>Reinstall</q-item-tile>
                                    </q-item-main>
                                </q-item>
                            </q-list>
                        </q-popover>
                    </q-btn>
                </q-btn-group>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./Home.ts">
</script>

<style>
</style>
