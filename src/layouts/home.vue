<template>
    <div style="height:100%" class="row">
        <div style="height:100%" class="column">
            hi there, version is {{selected}}, installed version of that is {{installedVersion}}
            <div class="q-pa-md" style="position:fixed;bottom:0">
                <q-btn-group>
                <q-btn color="primary" size="lg" label="Launch" />
                <q-btn color="primary" :loading="installing" :percentage="progress" @click="download()" size="lg" :disabled="false" label="Update" >
                    <span slot="loading">{{$store.state.installed[selected].status + ': ' + progress.toFixed(1) + '%'}}</span>
                </q-btn>
            </q-btn-group>
            </div>
        </div>
        <!-- <q-layout-footer class="column"> -->
        <!-- </q-layout-footer> -->
    </div>
</template>

<script src="./home.js"></script>

<style>

</style>
