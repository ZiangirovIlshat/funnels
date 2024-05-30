<template>
    <div>
        <div class="form">
            <header class="form__header">
                <p>Создать событие</p>
                <div 
                    class="form__close-btn"
                    @click="close()"
                >
                    ✖
                </div>
            </header>
            <div v-if="errorMessage"> 
                <p class="form__error-message">{{errorMessage}}</p>
            </div>
            <div v-if="loading">
                <p class="form__loading">Загрузка...</p>
            </div>
            <div v-if="message">
                <p class="form__message" v-if="message"> {{message}}</p>
            </div>
            <div v-if="!created">
                <p>
                    <label>
                        <b>Включен: </b>
                        <input type="checkbox" v-model="formData.visible">
                    </label>
                </p>
                <p>
                    <label>
                        <b>id события:</b>
                        <p><i>id должно совпадать с id группы событий в трекере*</i></p>
                        <input v-model="formData.id">
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
                        <input type="text" v-model="formData.params.organizerWebsiteUrl">
                    </label>
                </p>
                <hr>
                <p>Внешние источники:</p>
                <div>
                    <!-- <label>
                        tg postId:
                        <input type="text" v-model="formData.params.externalSources.tg">
                    </label> -->

                    <!-- the kostyl -->
                    <fieldset>
                        <legend>tg</legend>
                        <label>
                            Кол-во подписчиков
                            <input type="number" v-model="formData.params.externalSources.tg.total">
                        </label>
                        <label>
                            Кол-во просмотров
                            <input type="number" v-model="formData.params.externalSources.tg.read">
                        </label>
                    </fieldset>
                    <!-- _______ -->
                </div>
                <div>
                    <!-- <label>
                        vk postId:
                        <input type="text" v-model="formData.params.externalSources.vk">
                    </label> -->

                    <!-- the kostyl -->
                    <fieldset>
                        <legend>vk</legend>
                        <label>
                            Кол-во подписчиков
                            <input type="number" v-model="formData.params.externalSources.vk.total">
                        </label>
                        <label>
                            Кол-во просмотров
                            <input type="number" v-model="formData.params.externalSources.vk.read">
                        </label>
                    </fieldset>
                    <!-- _______ -->
                </div>
                <div>
                    <label>
                        mailing id:
                        <input type="number" v-model="formData.params.externalSources.email">
                    </label>
                </div>
                <p>
                    <button 
                        class="form__save-btn"
                        @click="saveData()"
                    >
                        Создать ✔
                    </button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>

import { mapState } from "vuex";

export default {
    name : "ModalPage",

    data() {
        return {
            formData: {
                id: "", visible: true, name: "", desk: "", link: "", finalEventType: "registrationAndViewing",
                params: {
                    organizerWebsiteUrl: "",
                    externalSources: {
                        // tg: "",
                        // vk: "",

                        // the kostyl
                        tg: {
                            "total": 0,
                            "read": 0,
                        },
                        vk: {
                            "total": 0,
                            "read": 0,
                        },

                        email: 0,
                    }
                },
            },

            errorMessage: "",
            message: "",
            loading: false,


            created: false,
        };
    },

    computed: {
        ...mapState({
            eventsList: (state) => state.eventsList,
        }),
    },

    methods: {
        async saveData() {
            this.errorMessage = "";
            this.message = "";
            this.loading = true;

            if(this.checkId(this.formData.id)) {
                this.errorMessage = "Событиe с таким id уже существует";
                this.loading = false;
                return;
            }

            console.log(JSON.stringify(this.formData))

            try {
                const response = await fetch("https://stat.owen.ru/funnels_api/admin/update", {
                    method: "POST",
                    body: JSON.stringify(this.formData),
                });

                const responseText = await response.json();

                if(responseText.error) {
                    throw new Error(responseText.error)
                }

                if(responseText.message) {
                    this.message = responseText.message;
                }

                this.$emit("create");
                this.created = true;
            } catch (error) {
                this.errorMessage = error
            } finally {
                this.loading = false
            }
        },

        checkId(id) {
            return this.eventsList.data.find((element) => element.id === id);
        },

        close() {
            if(this.created) {
                this.$emit('close');
                return;
            }

            if (confirm('Вы уверенны что хотите завершить добавление данных?')) this.$emit('close')
        },
    },

    created() {
        this.checkId()
    }
}
</script>

<style lang="scss" scoped>
    .form {
        background: #fff;
        padding: 20px;
        max-width: 600px;
        min-width: 300px;
        position: relative;
        height: 100%;

		&__header {
            display: flex;
            justify-content: space-between;
            margin: 0 0 30px 0;
            padding: 0 0 10px 0;
            font-weight: 600;
            border-bottom: 1px solid;
		}

		&__close-btn {
            cursor: pointer;
		}

        p {
            margin: 0 0 10px 0;
        }

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

        &__error-message {
            border: 1px solid #9f0412;
            padding: 5px;
            background: #f2f2f2;
        }

        &__message {
            border: 1px solid #008f86;
            padding: 20px 40px;
            background: #f2f2f2;
        }

        input, textarea, select {
            border: 1px solid;
            border-radius: 5px;
            padding: 5px;
        }

        input[type="text"], input[type="number"], textarea {
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

		&__save-btn {
            padding: 5px 20px;
            border-radius: 5px;
            font-weight: 600;
            color: #fff;
            background: #008f86;
            margin: 20px 0 0 0;
		}
    }

</style>
