<template>
    <div style="height:100%" class="row">
        <div style="height:100%" class="column">
            hi there, version is {{selected}}, installed version of that is {{installedVersion}}
            <div class="q-pa-md" style="position:fixed;bottom:0">
                <q-btn-group>
                <q-btn @click="launch" color="primary" size="lg" label="Launch" :disabled="installing" >
                </q-btn>
                <q-btn color="primary" :loading="installing" :percentage="progress" :disabled="$store.state.installed[selected].status == 'Updated'" @click="download()" size="lg" label="Update" >
                    <span slot="loading">{{$store.state.installed[selected].status + ': ' + progress + '%'}}</span>
                </q-btn>
            </q-btn-group>
            </div>
        </div>
    </div>
</template>

<script src="./home.js"></script>

<style>

</style>
