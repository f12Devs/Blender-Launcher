<template>
    <div style="height:100%" class="row">
            hi there, version is {{selected}}, installed version of that is {{installedVersion}}
            <div class="q-pa-md" style="position:fixed;bottom:0">
                <q-btn-group>
                <q-btn color="primary" size="lg" label="Launch" :disabled="installing" >
                    <q-tooltip>{{installing ? 'Can\'t launch while installing' : 'Launch selected version'}}</q-tooltip>
                </q-btn>
                <q-btn color="primary" :loading="installing" :percentage="progress" :disabled="$store.state.installed[selected].status == 'Updated'" @click="download()" size="lg" label="Update" >
                    <span slot="loading">{{$store.state.installed[selected].status + ': ' + progress + '%'}}</span>
                </q-btn>
            </q-btn-group>
            </div>
    </div>
</template>

<script src="./home.js"></script>

<style>

</style>
