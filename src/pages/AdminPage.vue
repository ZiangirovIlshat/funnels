<template>
    <div>
            <div class="wrapper">
        <header>
            <topline />
        </header>
        <main class="content">
            <div class="container">
                <div class="row">
                    <aside class="side-menu">
                        <sidebar
                            :loading="eventsList.loading"
                            :data="eventsList.data"
                            :error="eventsList.error"
                            :path="'/admin/'"
                        />
                    </aside>
                    <section class="body">
                        <div class="error" v-if="funnelsParams.error" v-html="funnelsData.error"></div>
                        <div class="loading" v-else-if="funnelsParams.loading">загрузка...</div>
                        <div class="funnels" v-else>
                            <pre>
                                {{funnelsParams.data}}
                            </pre>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
    </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

import TopLine from "@/components/TopLine.vue"
import SideBar from "@/components/SideBar.vue"

export default {
    components: {
        "topline": TopLine,
        "sidebar": SideBar,
    },

    watch: {
        '$route.params.id': function(newId, oldId) {
            if(newId !== oldId) this.fetchFunelsParams(this.$route.params.id)
        }
    },

    computed: {
        ...mapState({
            eventsList: (state) => state.eventsList,
            funnelsParams: (state) => state.funnelsParams,
        }),
    },

    methods: {
        ...mapActions({
            fetchEventsList: "eventsList/fetchEventsList",
            fetchFunelsParams: "funnelsParams/fetchFunelsParams",
        }),
    },

    created() {
        this.fetchEventsList().then(()=> {
            console.log(this.eventsList.data.length)
            this.eventId = this.$route.params.id || (this.eventsList.data.length !== 0 ? this.eventsList.data[0].id : null);

            if (this.eventId) {
                this.fetchFunelsParams(this.eventId)
            }
        })
    }
}
</script>

<style lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    .content {
        flex: 1 0 100%;
    }
    .row {
        display: flex;
        justify-content: space-between;
        min-height: calc(100vh - 117px);
    }
    .side-menu {
        flex: 0 0 25%;
    }
    .body {
        flex: 0 0 75%;
        border-right: 2px solid;
    }
</style>