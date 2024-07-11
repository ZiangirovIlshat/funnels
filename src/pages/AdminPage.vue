<template>
        <div
            class="wrapper" 
            :class="{ '__no-scroll' : modalPageIsOpen }"
            :style="{ 'max-height' : modalPageIsOpen ? modalPageHeight + 'px' : 'auto' }"
        >

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
                                <button
                                    class="side-menu__create-btn"
                                    @click="modalPageIsOpen = !modalPageIsOpen, getHeight()"
                                >
                                    Добавить событие +
                                </button>
                            </sidebar>
                        </aside>
                        <section class="body">
                            <div class="error" v-if="funnelsParams.error" v-html="funnelsParams.error"></div>
                            <div class="loading" v-else-if="funnelsParams.loading">загрузка...</div>
                            <div class="funnels" v-else-if="funnelsParams.data">
                                <div v-if="errorMessage">
                                    <p class="funnels__error-message">{{errorMessage}}</p>
                                </div>

                                <div v-if="message">
                                    <p class="funnels__message" v-if="message"> {{message}}</p>
                                </div>

                                <div>
                                    <p class="funnels__loading" v-if="loading">Загрузка...</p>
                                </div>

                                <p class="funnels__btn-container">
                                    <button 
                                        class="funnels__btn save"
                                        :class="{ '__need-save' : needSaved }"
                                        @click="saveData()"
                                    >
                                        Сохранить ✔
                                    </button>
                                    <button
                                        class="funnels__btn delete"
                                        @click="deleteFunnel()"
                                    >
                                        Удалить ✖
                                    </button>
                                </p>

                                <hr>

                                <p>
                                    <a :href="'/new_funnels/' + formData.id" target="_blank">Посмотреть на отображение →</a>
                                </p>

                                <p>
                                    <b>Последнее изменение:</b> {{formData.date}}
                                </p>

                                <p>
                                    <label>
                                        <b>Включен: </b>
                                        <input type="checkbox" v-model="formData.visible">
                                    </label>
                                </p>

                                <p>
                                    <b>id события:</b>
                                    <span>
                                        <b>{{formData.id}}</b>
                                    </span>
                                </p>

                                <p>
                                    <label>
                                        <b>Название события:</b>
                                        <input
                                            :class="{
                                                '__need-save' :formData.name !== funnelsParams.data.name
                                            }"
                                            type="text"
                                            v-model="formData.name"
                                        >
                                    </label>
                                </p>

                                <p>
                                    <label>
                                        <b>Описание события:</b>
                                        <textarea
                                            :class="{
                                                '__need-save' :formData.desk !== funnelsParams.data.desk
                                            }"
                                            cols="30"
                                            rows="10"
                                            v-model="formData.desk"
                                        >
                                        </textarea>
                                    </label>
                                </p>

                                <p>
                                    <label>
                                        <b>Ссылка на страницу события:</b>
                                        <input
                                            :class="{
                                                '__need-save' :formData.link !== funnelsParams.data.link
                                            }"
                                            type="text"
                                            v-model="formData.link"
                                        >
                                    </label>
                                </p>

                                <!-- <p>
                                    <label>
                                        <b>Сценарий: </b>
                                        <select
                                            :class="{
                                                '__need-save' :formData.finalEventType !== funnelsParams.data.finalEventType
                                            }"
                                            v-model="formData.finalEventType"
                                        >
                                            <option value="registrationAndViewing">Регистрация и просмотр</option>
                                            <option value="goOrganizerWebsite">Переход на сайт организатора</option>
                                        </select>
                                    </label>
                                </p>

                                <p v-if="formData.finalEventType === 'goOrganizerWebsite'">
                                    <label>
                                        <b>Адрес сайта организатора:</b>
                                        <input
                                            :class="{
                                                '__need-save' :formData.organizerWebsiteUrl !== funnelsParams.data.organizerWebsiteUrl
                                            }"
                                            type="text"
                                            v-model="formData.organizerWebsiteUrl"
                                        >
                                    </label>
                                </p> -->

                                <hr>

                                <h2>Внешние источники</h2>

                                <template v-if="funnelsParams.data.params && funnelsParams.data.params.externalSources">
                                    <div>
                                        <!-- <label>
                                            tg postId:
                                            <input 
                                                :class="{
                                                    '__need-save' :formData.params.externalSources.tg !== funnelsParams.data.params.externalSources.tg
                                                }"
                                                type="text"
                                                v-model="formData.params.externalSources.tg"
                                            >
                                        </label> -->

                                        <fieldset>
                                            <legend>tg</legend>
                                            <label>
                                                Кол-во подписчиков
                                                <input
                                                    :class="{
                                                        '__need-save' :formData.params.externalSources.tg.total !== funnelsParams.data.params.externalSources.tg.total
                                                    }"
                                                    type="number"
                                                    v-model="formData.params.externalSources.tg.total"
                                                >
                                            </label>

                                            <br>

                                            <label>
                                                Кол-во просмотров
                                                <input
                                                    :class="{
                                                        '__need-save' :formData.params.externalSources.tg.read !== funnelsParams.data.params.externalSources.tg.read
                                                    }"
                                                    type="number"
                                                    v-model="formData.params.externalSources.tg.read"
                                                >
                                            </label>
                                        </fieldset>
                                    </div>

                                    <div>
                                        <!-- <label>
                                            vk postId:
                                            <input
                                                class="{
                                                    '__need-save' :formData.params.externalSources.vk !== funnelsParams.data.params.externalSources.vk
                                                }"
                                                type="text"
                                                v-model="formData.params.externalSources.vk"
                                            >
                                        </label> -->

                                        <fieldset>
                                            <legend>vk</legend>
                                            <label>
                                                Кол-во подписчиков
                                                <input
                                                    :class="{
                                                        '__need-save' :formData.params.externalSources.vk.total !== funnelsParams.data.params.externalSources.vk.total
                                                    }"
                                                    type="number"
                                                    v-model="formData.params.externalSources.vk.total"
                                                >
                                            </label>

                                            <br>

                                            <label>
                                                Кол-во просмотров
                                                <input
                                                    :class="{
                                                        '__need-save' :formData.params.externalSources.vk.read !== funnelsParams.data.params.externalSources.vk.read
                                                    }"
                                                    type="number"
                                                    v-model="formData.params.externalSources.vk.read"
                                                >
                                            </label>
                                        </fieldset>
                                    </div>

                                    <div>
                                        <p>
                                            <label>
                                                mailing id:
                                                <input
                                                    :class="{
                                                        '__need-save' :formData.params.externalSources.email !== funnelsParams.data.params.externalSources.email
                                                    }"
                                                    type="number"
                                                    v-model="formData.params.externalSources.email"
                                                >
                                            </label>
                                        </p>

                                        <p>
                                            <label>
                                                mailing id:
                                                <input
                                                    :class="{
                                                        '__need-save' :formData.params.externalSources.secondEmail !== funnelsParams.data.params.externalSources.secondEmail
                                                    }"
                                                    type="number"
                                                    v-model="formData.params.externalSources.secondEmail"
                                                >
                                                (повторная рассылка)
                                            </label>
                                        </p>
                                    </div>
                                </template>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <div class="modal-page" ref="modalPage" v-if="modalPageIsOpen">
                <modalpage
                    @close="modalPageIsOpen = false"
                    @create="fetchEventsList(), getHeight()"
                />
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
                id: "", date: "", visible: "", name: "", desk: "", link: "", finalEventType: "registrationAndViewing",
                params: {
                    externalSources: {
                        // tg: "",
                        // vk: "",
                        email: 0,
                        secondEmail: 0,

                        // the kostyl
                        tg: { total: 0, read: 0, },
                        vk: { total: 0, read: 0, },
                    }
                },
                organizerWebsiteUrl: 0,
            },

            needSaved: false,

            errorMessage: "",
            message: "",
            loading: "",

            modalPageIsOpen: false,
            modalPageHeight: null,
        };
    },

    computed: {
        ...mapState({
            eventsList: state => state.eventsList,
            funnelsParams: state => state.funnelsParams,
        }),
    },

    methods: {
        ...mapActions({
            fetchEventsList: "eventsList/fetchEventsList",
            fetchFunelsParams: "funnelsParams/fetchFunelsParams",
        }),

        async saveData() {
            this.loading = true
            try {
                const response = await fetch("http://localhost/funnels_api/admin/update", {
                    method: "POST",
                    body: JSON.stringify(this.formData)
                });

                const responseText = await response.json();
                
                if(responseText.error) {
                    throw new Error(responseText.error);
                }

                if(responseText.message) {
                    this.message = responseText.message
                }

                this.getData()

            } catch (error) {
                this.errorMessage = error
            } finally {
                this.loading = false
            }
        },

        async deleteFunnel() {
            if (!confirm('Вы действительно хотите удалить данные о событии?')) return
                
            this.loading = true

            try {
                let params = new URLSearchParams(); 
                params.set('id', this.formData.id);
                let response = await fetch("http://localhost/funnels_api/admin/delete", {
                    method: "POST",
                    body: params
                });

                if (!response.ok) {
                    throw new Error("Не удалось удалить данные о событии");
                }

                const responseText = await response.json();

                if (responseText.error) {
                    this.errorMessage = "Не удалось удалить данные о событии";
                    return;
                }

                if(responseText.message) {
                    this.message = responseText.message
                }

                window.location.pathname = "/new_funnels/admin/";
                this.getData();
            } catch (error) {
                this.errorMessage = "Не удалось удалить данные о событии";
            } finally {
                this.loading = false
            }
        },

        async getData() {
            this.errorMessage = "";
            await this.fetchEventsList();

            let eventId = "";

            if(this.$route.params.id === "") {
                if(this.eventsList.data.length > 0) {
                    window.location.pathname = "/new_funnels/admin/" + this.eventsList.data[0].id

                    eventId = this.eventsList.data[0].id
                } else {
                    this.errorMessage = "Не удалось получить данные по событию"
                }
            } else {
                eventId = this.$route.params.id
            }

            try {
                await this.fetchFunelsParams(eventId);
                this.formData = structuredClone(this.funnelsParams.data);

                if(this.formData.error) {
                    this.errorMessage = "Не удалось получить данные по событию"
                }
            } catch (error) {
                this.errorMessage = "Не удалось получить данные по событию";
            }
        },

        deepcompare(a, b){
            if(typeof a !== typeof b) return false;
            if(typeof a !== 'object') return a === b;
            if(Object.keys(a).length != Object.keys(b).length) return false;
            for(var k in a){
                if(!(k in b)) return false;
                if(!this.deepcompare(a[k], b[k])) return false;
            }
            return true;
        },

        getHeight() {
            if(!this.modalPageIsOpen) return

            setTimeout(() => {
                this.modalPageHeight = this.$refs.modalPage.scrollHeight
            }, 200);
        }
    },

    watch: {
        '$route.params.id': async function(newId, oldId) {
            if (newId !== oldId) {
                try {
                    await this.fetchFunelsParams(newId)
                    this.formData = JSON.parse(JSON.stringify(this.funnelsParams.data));

                    if(this.formData.error) {
                        this.errorMessage = "Не удалось получить данные по событию"
                    }

                    this.errorMessage = ""
                    this.message = ""
                    this.loading = ""
                } catch (error) {
                    this.errorMessage = error;
                }
            }
        },

        formData: {
            handler() {
                if(!this.deepcompare(this.funnelsParams.data, this.formData)) {
                    this.needSaved = true
                } else {
                    this.needSaved = false
                }
            },
            deep: true
        }
    },

    async created() {
        this.getData()
    }
}
</script>

<style lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;

        &.__no-scroll {
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
            margin: 20px 5px 0 5px;

            @media(max-width: 768px) {
                padding: 5px;
                font-size: 12px;
            }
        }
    }
    .body {
        flex: 0 0 75%;
        border-right: 2px solid;
    }
    .funnels {
        padding: 20px;
        position: relative;

        &__loading {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 20px;
        }

        &__message {
            border: 1px solid #008f86;
            margin: 0 0 20px 0;
            padding: 5px;
            background: #f2f2f2;
        }

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

                &.__need-save {
                    background-color: #fea000;
                }
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

            span {
                color: #008f86;
            }
        }

        input, textarea, select {
            border: 1px solid;
            border-radius: 5px;
            padding: 5px;

            &.__need-save {
                border: 1px solid #fea000;
                outline: 1px solid #fea000;
            }
        }

        input[type="text"], textarea {
            display: block;
            width: 500px;
        }

        input[type="checkbox"] {
            width: 15px;
            height: 15px;
        }

        fieldset {
            border: 1px solid #D3D3D3;
            padding: 10px;
            margin: 0 0 10px 0;
            width: 500px;

            input[type="number"] {
                width: 400px;
            }
        }

        h2 {
            font-size: 25px;
            font-weight: 600;
            margin: 0 0 20px 0;
        }
    }

    .modal-page {
        padding: 25px;
        position: absolute;
        top:0;
        overflow-x: hidden;
        width: 100%;
        min-height: 100%;
        background: rgba(44, 62, 80, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;

        z-index: 10;
    }
</style>