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
                    <section class="body">
                        <div class="error" v-if="funnelsData.error" v-html="funnelsData.error"></div>
                        <div class="loading" v-else-if="funnelsData.loading">загрузка...</div>
                        <div class="funnels" v-else>
                            <p>Событие: <b>{{funnelsData.data.name}}</b></p>
                            <p>Описание: <b>{{funnelsData.data.desk}}</b></p>
                            <p>Ссылка на страницу события: <b><a :href="funnelsData.data.link" target="_blank">{{funnelsData.data.link}}</a></b></p>
                            <br>
                            <h2>Воронки</h2>

                            <div class="funnels__tab-slider">
                                <ul class="funnels__tab-slider-head">
                                    <li 
                                        v-for="(value, key, index) in funnelsData.data.dataSources"
                                        :key="key"
                                        :class="{'__active' : index === activeSlide}"
                                        @click="activeSlide = index"
                                    >
                                        {{ getName(key) }}
                                    </li>
                                </ul>
                                <div class="funnels__tab-slider-body">
                                    <div
                                        class="funnels__tab-slider-page"
                                        v-for="(value, key, index) in funnelsData.data.dataSources"
                                        :key="key"
                                        :class="{'__active' : index === activeSlide}"
                                    >
                                        <funnel
                                            :source="key"
                                            :data="funnelsData.data.dataSources[key]"
                                            :finalEventType="funnelsData.data.finalEventType"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
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

        getName(key) {
            switch (key) {
                case "tg":
                    return "Телеграмм"
                case "vk":
                    return "Вконтакте"
                case "email":
                    return "Email"
            }
        }
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
            position: relative;
            margin-right: -20px;
            margin-left: -20px;
            overflow: hidden;
        }

        &__tab-slider-head {
            display: flex;
            padding: 5px 20px 0 20px;
            position: relative;
            overflow: hidden;
                
            li {
                padding: 5px 30px;
                margin: 0 10px 0 0;
                box-shadow: 0 -0.5px 3px #939393;
                font-weight: 700;
                border-radius: 5px 5px 0 0;
                cursor: pointer;
                background-color: #ededed;
                transition: .3s;

                &:hover {
                    color: #008f86;
                }

                &.__active {
                    color: #008f86;
                    background-color: #fff;
                    position: relative;
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

        &__tab-slider-body {
            margin: 30px 0 0 0;
        }

        &__tab-slider-page {
            display: none;

            &.__active {
                display: block;
            }
        }
    }
</style>