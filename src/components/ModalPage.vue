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
            <div class="form__error-message" v-if="updateData.error"> {{updateData.error}} </div>
            <div class="form__loading" v-if="updateData.loading">Загрузка...</div>
            <div class="form__message" v-if="updateData.message">{{updateData.message}}</div>
            <br>
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
            <p>
                <button 
                    class="form__save-btn"
                    @click="fetchUpdateData(formData)"
                >Создать ✔
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
                        tg: "",
                        vk: "",
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
}
</script>

<style lang="scss">
    .form {
        width: 600px;
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

        input[type="text"], textarea {
            display: block;
            width: 500px;
        }

        input[type="checkbox"] {
            width: 15px;
            height: 15px;
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