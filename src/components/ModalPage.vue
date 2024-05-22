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
            <div v-if="updateData.error"> 
                <p class="form__error-message">{{updateData.error}}</p>
            </div>
            <div v-if="updateData.loading">
                <p class="form__loading">Загрузка...</p>
            </div>
            <div v-if="updateData.data">
                <p class="form__error-message" v-if="updateData.data.error"> {{updateData.data.error}}</p>
                <p class="form__message" v-if="updateData.data.message"> {{updateData.data.message}}</p>
            </div>
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
                    <input type="text" v-model="formData.params.externalSources.email">
                </label>
            </div>
            <p>
                <button 
                    class="form__save-btn"
                    @click="fetchUpdateData(JSON.stringify(formData))"
                >
                    Создать ✔
                </button>
            </p>
        </div>
    </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

export default {
    name : "ModalPage",

    data() {
        return {
            formData: {
                id: "",
                visible: true,
                name: "",
                desk: "",
                link: "",
                finalEventType: "registrationAndViewing",
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


                        email: "",
                    }
                },
            },
        };
    },

    computed: {
        ...mapState({
            updateData: state => state.updateData,
        }),
    },

    methods: {
        ...mapActions({
            fetchUpdateData: "updateData/fetchUpdateData",
        }),

        close() {
            if (confirm('Вы уверенны что хотите завершить добавление данных?')) this.$emit('close')
        }
    },

    created() {
        // this.updateData.data = [];
        // this.updateData.loading = false;
        // this.updateData.error = '';
    }
}
</script>

<style lang="scss" scoped>
    .form {
        background: #fff;
        padding: 20px;


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

        &__error-message {
            border: 1px solid #9f0412;
            padding: 5px;
            background: #f2f2f2;
        }

        &__message {
            border: 1px solid #008f86;
            padding: 5px;
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
