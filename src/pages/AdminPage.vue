<template>
    <div>
        <div class="wrapper" :class="{ 'no-scroll' : modalPageIsOpen }">
            <header>
                <topline><p><b>Админ панель</b></p></topline>
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
                            >
                                <button class="side-menu__create-btn"
                                    @click="modalPageIsOpen = !modalPageIsOpen">
                                    Добавить событие +
                                </button>
                            </sidebar>
                        </aside>
                        <section class="body">
                            <div class="error" v-if="funnelsParams.error" v-html="funnelsData.error"></div>
                            <div class="loading" v-else-if="funnelsParams.loading">загрузка...</div>
                            <div class="funnels" v-else>
                                <div class="funnels__error-message" v-if="errorMessage">
                                    {{errorMessage}}
                                </div>
                                <p class="funnels__btn-container">
                                    <button 
                                        class="funnels__btn save"
                                        :class="{'__need-save' : needSaved}"
                                        @click="fetchUpdateData(formData)"
                                    >Сохранить ✔</button>
                                    <button
                                        class="funnels__btn delete"
                                        @click="deleteFunnel()"
                                    >Удалить ✖</button>
                                </p>
                                <hr>
                                <p><a :href="'/' + formData.id" target="_blank">Посмотреть на отображение →</a></p>
                                <p><b>Последнее изменение:</b> {{formData.date}}</p>
                                <p>
                                    <label>
                                        <b>Включен: </b>
                                        <input type="checkbox" v-model="formData.visible">
                                    </label>
                                </p>
                                <p>
                                    <label>
                                        <b>id события: </b>
                                        <input :value="formData.id" readonly>
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
                                        <input type="text" v-model="formData.organizerWebsiteUrl">
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
            <div class="modal-page" v-if="modalPageIsOpen">
                <modalpage
                    @close="modalPageIsOpen = false"
                />
            </div>
        </div>
    </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

import TopLine from "@/components/TopLine.vue";
import SideBar from "@/components/SideBar.vue";
import ModalPage from "@/components/ModalPage.vue";


export default {
    components: {
        "topline" : TopLine,
        "sidebar" : SideBar,
        "modalpage" : ModalPage,
    },

    data() {
        return {
            formData: {
                id: "",
                date: "",
                visible: "",
                name: "",
                desk: "",
                link: "",
                finalEventType: "registrationAndViewing",
                params: {
                    externalSources: {
                        tg: 0,
                        vk: 0,
                        email: 0,
                    }
                },
                organizerWebsiteUrl: "",
            },

            needSaved: false,

            errorMessage: "",
            message: "",

            modalPageIsOpen: false,
        };
    },

    watch: {
        '$route.params.id': function(newId, oldId) {
            if (newId !== oldId) {
                this.fetchFunelsParams(newId).then(() => {
                    this.getData();
                }).catch(error => {
                    this.errorMessage = error.message;
                });
            }
        },

        formData: {
            handler(newValue, oldValue) {
                if (newValue !== oldValue && JSON.stringify(newValue) !== JSON.stringify(this.funnelsParams)) {
                    this.needSaved = true;
                } else {
                    this.needSaved = false;
                }
            },
            deep: true
        }
    },

    computed: {
        ...mapState({
            eventsList: state => state.eventsList,
            funnelsParams: state => state.funnelsParams,
            updateData: state => state.updateData,
        }),
    },

    methods: {
        ...mapActions({
            fetchEventsList: "eventsList/fetchEventsList",
            fetchFunelsParams: "funnelsParams/fetchFunelsParams",
            fetchUpdateData: "updateData/fetchUpdateData",
        }),

        createFunnel() {
            
        },

        async deleteFunnel() {
            this.errorMessage = "";

            if (confirm('Вы действительно хотите удалить данные о событии?')) { 
                try {
                    let response = await fetch("https://localhost/funnels_api/admin/delete", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: this.formData.id })
                    });

                    if (!response.ok) throw new Error('Network response was not ok');
                    let result = await response.json();

                    if (result.error) {
                        this.errorMessage = result.error;
                    }
                } catch (e) {
                    this.errorMessage = e.message;
                }
            }
        },

        async getData() {
            this.eventId = this.$route.params.id || (this.eventsList.data.length !== 0 ? this.eventsList.data[0].id : null);

            if (this.eventId) {
                try {
                    await this.fetchFunelsParams(this.eventId);
                    this.formData = { ...this.funnelsParams.data };
                } catch (error) {
                    this.errorMessage = error.message;
                }
            }
        }
    },

    async created() {
        try {
            await this.fetchEventsList();
            this.getData();
        } catch (error) {
            this.errorMessage = error.message;
        }
    }
}
</script>

<style lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        
        &.no-scroll {
            overflow: hidden;
        }
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

        &__create-btn {
            padding: 5px 20px;
            border-radius: 5px;
            font-weight: 600;
            color: #fff;
            background: #008f86;
            margin: 20px 0 0 0;
        }
    }
    .body {
        flex: 0 0 75%;
        border-right: 2px solid;
    }
    .funnels {
        padding: 20px;

        &__error-message {
            border: 1px solid #9f0412;
            margin: 0 0 20px 0;
            padding: 5px;
            background: #f2f2f2;
        }

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

        a {
            color: #008f86;
            text-decoration: underline;
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

    .modal-page {
        position: absolute;
        min-width: 100vw;
        min-height: 100vh;
        width: 600px;
        background: rgba(44, 62, 80, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
                   