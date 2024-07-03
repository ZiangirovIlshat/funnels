<template>
    <div class="wrapper">
        <header>
            <topline/>
        </header>
        <main class="content">
            <div class="container">
                <div class="row">
                    <aside class="side-menu">
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
                            <p class="error" v-if="errorMessage"> {{errorMessage}}</p>

                            <div v-else>
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
                                        <li
                                            :class="{'__active' : sources.length === activeSlide}"
                                            @click="activeSlide = sources.length"
                                        >
                                            Переходы
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
                                        <div
                                            class="funnels__tab-slider-page"
                                            :class="{'__active' : sources.length === activeSlide}"
                                        >
                                            <statPage/>
                                        </div>
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
import StatPage from "@/components/StatPage.vue"

export default {
    components: {
        "topline": TopLine,
        "sidebar": SideBar,
        "funnel": MarketingFunnel,
        "statPage": StatPage
    },

    data() {
        return {
            eventId: null,
            activeSlide: 0,
            sources: [],

            errorMessage: "",
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
        },

        async getData() {
            this.errorMessage = ""

            await this.fetchEventsList();

            let eventId = "";

            if(this.$route.params.id === "") {
                if(this.getVisibleFunnelsData.length > 0) {
                    window.location.pathname = "/new_funnels/" + this.getVisibleFunnelsData[0].id

                    eventId = this.getVisibleFunnelsData[0].id
                } else {
                    this.errorMessage = "Не удалось получить данные"
                }
            } else {
                eventId = this.$route.params.id
            }

            try {
                await this.fetchFunnelsData(eventId);
                if(this.funnelsData.data.visible === false) {this.errorMessage = "Не удалось получить данные"; return;}
                this.sources = Object.keys(this.funnelsData.data.dataSources)
            } catch (error) {
                this.errorMessage = "Не удалось получить данные";
            }
        },
    },

    watch: {
        '$route.params.id': async function(newId, oldId) {
            if (newId !== oldId) {
                try {
                    if(!newId) {this.getData(); return}
                    await this.fetchFunnelsData(newId)
                    if(this.funnelsData.data.visible === false) { this.funnelsData.error = "Не найдено событие" ; return }
                    this.sources = Object.keys(this.funnelsData.data.dataSources)
                } catch (error) {
                    this.errorMessage = error;
                }
            }
        },
    },

    async created() {
        this.getData();
    }
}
</script>

<style lang="scss" scoped>
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
                padding: 10px 30px;
                margin: 0 10px 0 0;
                box-shadow: 0 -0.5px 3px #939393;
                font-weight: 700;
                border-radius: 5px 5px 0 0;
                cursor: pointer;
                background-color: #ededed;
                transition: .3s;

                @media(max-width: 992px) {
                    padding: 5px 15px;
                }

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