<template>
    <div class="wrapper">
        <header>
            <topline />
        </header>
        <main class="content">
            <div class="container">
                <div class="row">
                    <aside class="sidebar">
                        <sidebar
                            :loading="eventsList.loading"
                            :data="getVisibleFunnelsData"
                            :error="eventsList.error"
                        />
                    </aside>
                    <pre>
                        funnelsData.data
                    </pre>
                    <section class="body">
                        <div class="funnels">
                            <p>Событие: <b>{{funnelsData.data.eventData.eventName}}</b></p>
                            <p>Описание: <b>{{funnelsData.data.eventData.eventDesk}}</b></p>
                            <p>Ссылка на страницу события: <b><a :href="funnelsData.data.eventData.eventLink" target="_blank">{{funnelsData.data.data.eventLink}}</a></b></p>
                            <br>
                            <h2>Воронки</h2>

                            <div class="funnels__tab-slider">
                                <ul>
                                    <li 
                                        v-for="(value, key, index) in funnelsData.data.data.dataSources"
                                        :key="key"
                                        :class="{'__active' : index === activeSlide}"
                                        @click="activeSlide = index"
                                    >
                                        {{ key }}
                                    </li>
                                    <li v-if="Object.keys(funnelsData.data.data.dataSources).length > 1">Общая</li>
                                </ul>
                            </div>
                        </div>
                         <funnel />
                    </section>
                </div>
            </div>
        </main>
    </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from "vuex";

import TopLine from "@/components/TopLine.vue"
import SideBar from "@/components/SideBar.vue"
import MarketingFunnel from "@/components/MarketingFunnel.vue"

export default {
    components: {
        "topline": TopLine,
        "sidebar": SideBar,
        "funnel": MarketingFunnel,
    },

    data() {
        return {
            eventId: null,
            activeSlide: 0,
        }
    },

    watch: {
        '$route.params.id': function(newId, oldId) {
            if(newId !== oldId) this.fetchFunnelsData(this.$route.params.id)
        }
    },

    computed: {
        ...mapState({
            eventsList: (state) => state.eventsList,
            funnelsData: (state) => state.funnelsData,
        }),

        ...mapGetters("eventsList", [
            "getVisibleFunnelsData"
        ])
    },
    methods: {
        ...mapActions({
            fetchEventsList: "eventsList/fetchEventsList",
            fetchFunnelsData: "funnelsData/fetchFunelsData",
        }),
    },

    created() {        
        this.fetchEventsList().then(() => {
            this.eventId = this.$route.params.id || (this.getVisibleFunnelsData.length !== 0 ? this.getVisibleFunnelsData[0].id : null);

            if (this.eventId) {
                this.fetchFunnelsData(this.eventId);
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
    }
    .sidebar {
        flex: 0 0 25%;
    }
    .body {
        flex: 0 0 75%;
        border-right: 2px solid;
    }

    .funnels {
        padding: 20px;

        p {
            margin: 0 0 10px 0;
        }

        a {
            color: #008f86;
            text-decoration: underline;
        }

        h2 {
            font-size: 25px;
            font-weight: 700;
        }

        &__tab-slider {
            margin: 30px 0 0 0;
            ul {
                display: flex;
                position: relative;
                overflow: hidden;
                padding: 5px 20px 0 20px;
                margin-right: -20px;
                margin-left: -20px;
                
                li {
                    padding: 5px 25px;
                    margin: 0 10px 0 0;
                    box-shadow: 0 -0.5px 3px #939393;
                    font-weight: 700;
                    position: relative;
                    border-radius: 5px 5px 0 0;
                    cursor: pointer;
                    z-index: 1;

                    &:hover {
                        color: #008f86;
                    }

                    &.__active {
                        color: #008f86;
                        z-index: 2;
                    }
                }

                &::after {
                    content: "";
                    display: block;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    height: 15px;
                    color: #ffffff;
                    -webkit-box-shadow: 0 0 5px #939393;
                    box-shadow: 0 0 5px #939393;
                }
            }
        }
    }
</style>