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
                            <p class="funnels__btn-container">
                                <button 
                                    class="funnels__btn save"
                                    :calss="{'__need-save' : needSaved}"
                                    @click="saveFunnel()"
                                >Сохранить ✔</button>
                                <button
                                    class="funnels__btn delete"
                                    @click="deleteFunnel()"
                                >Удалить ✖</button>
                            </p>
                            <hr>
                            <p><b>Последнее изменение:</b> {{formData.date}}</p>
                            <p>
                                <label>
                                    <b>Включен: </b>
                                    <input type="checkbox" v-model="formData.visible">
                                </label>
                            </p>
                            <p>
                                <label>
                                    <b>id события:</b>
                                    <input type="text" v-model="formData.id">
                                </label>
                            </p>
                            <p>
                                <label>
                                    <b>Название события:</b>
                                    <input type="text" v-model="formData.name">
                                </label>
                            </p>
                            <p>
                                <label>
                                    <b>Описание события:</b>
                                    <textarea cols="30" rows="10" v-model="formData.desk"></textarea>
                                </label>
                            </p>
                            <p>
                                <label>
                                    <b>Ссылка на страницу события:</b>
                                    <input type="text" v-model="formData.link">
                                </label>
                            </p>
                            <p>
                                <label>
                                    <b>Сценарий: </b>
                                    <select v-model="formData.finalEventType">
                                        <option value="registrationAndViewing">Регистрация и просмотр</option>
                                        <option value="goOrganizerWebsite">Переход на сайт организатора</option>
                                    </select>
                                </label>
                            </p>
                            <p v-if="formData.finalEventType === 'goOrganizerWebsite'">
                                <label>
                                    <b>Адрес сайта организатора:</b>
                                    <input type="text" v-model="formData.params.organizerSite">
                                </label>
                            </p>
                            <hr>
                            <h2>Внешние источники</h2>
                            
                            <p>
                                <label>
                                    tg postId:
                                    <input type="text" v-model="formData.params.externalSources.tg">
                                </label>
                            </p>
                            <p>
                                <label>
                                    vk postId:
                                    <input type="text" v-model="formData.params.externalSources.vk">
                                </label>
                            </p>
                            <p>
                                <label>
                                    mailing id:
                                    <input type="text" v-model="formData.params.externalSources.email">
                                </label>
                            </p>
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

    data() {
        return {
            formData: [],

            needSaved: false,
        }
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
            this.eventId = this.$route.params.id || (this.eventsList.data.length !== 0 ? this.eventsList.data[0].id : null);

            if (this.eventId) {
                this.fetchFunelsParams(this.eventId).then(()=> {
                    this.formData = this.funnelsParams.data;
                })
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
    .funnels {
        padding: 20px;

        &__btn-container {
            display: flex;
            gap: 10px;

        }

        &__btn {
            padding: 5px 20px;
            border-radius: 5px;
            font-weight: 600;
            color: #fff;

            &.save {
                background-color: #008f86;
            }

            &.delete {
                background: #2c3e50;
            }
        }

        hr {
            height: 1px;
            background-color: #2c3e50;
            margin: 5px 0;
        }

        p {
            margin: 0 0 20px 0;
        }

        input, textarea, select {
            border: 1px solid;
            border-radius: 5px;
            padding: 5px;
        }

        input[type="text"], textarea {
            display: block;
            width: 500px;
        }

        input[type="checkbox"] {
            width: 15px;
            height: 15px;
        }

        h2 {
            font-size: 25px;
            font-weight: 600;
            margin: 0 0 20px 0;
        }
    }
</style>