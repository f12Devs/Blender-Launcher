<template>
    <div style="height:100%" class="row">
        hi there, version is {{selected}}
        <div class="column">
            <q-btn-group class="self-end" style="vertical-alignment:bottom">
                <q-btn label="One" />
                <q-btn label="Two" />
                <q-btn label="Three" />
            </q-btn-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    computed: {
        selected() {
            return this.$store.state.selected
        }
    },
    props: ['tags']
}
</script>

<style>

</style>
