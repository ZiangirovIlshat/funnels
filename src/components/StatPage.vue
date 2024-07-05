<template>
    <div class="stat-page">
        <div class="stat-page__pie-char-body">
            <h3>Переходы:</h3>
        </div>

        <div class="stat-page__pie-char-body">
            <h3>Регитсрации:</h3>
        </div>

        <div class="stat-page__pie-char-body">
            <h3>Просмотры:</h3>
        </div>

        <h3>
            Источники:
        </h3>
        <ul class="stat-page__sources-list">
            <li><span :style="{background: colors['tg']}"></span> - Телеграмм</li>
            <li><span :style="{background: colors['vk']}"></span> - Вконтакте</li>
            <li><span :style="{background: colors['email']}"></span> - Email</li>
            <li><span :style="{background: colors['another']}"></span> - Другой</li>
        </ul>

        <div class="stat-page__lists">
            <div class="stat-page__lists-header">
                <h3>Списки:</h3>
                <button @click="downloadXls()">Скачать как xls</button>
            </div>
            <list>Общий список регистраций:</list>
            <!-- <p>Регистраций: 0</p> -->
            <br>
            <list>Общий список просмотров:</list>
            <!-- <p>Просмотров: 0</p> -->
        </div>
    </div>
</template>

<script>

import MailsList from "@/components/MailsList.vue"

export default {
    name: "StatPage",

    components: {
        "list": MailsList,
    },

    data() {
        return {
            colors: {
                "tg" : "#229ED9",
                "vk" : "#0077FF",
                "email" : "#FF9C24",
                "another" : "#939393",
            },

            statData: [],
        }
    },

    methods: {
        getData() {
            
        }
    },

    created() {
       
    }
}
</script>

<style lang="scss" scoped>
    .stat-page {
        padding-left: 50px;
        padding-right: 50px;

        h3 {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 20px 0;
        }

        &__sources-list {
            li {
                line-height: 15px;
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
                gap: 10px;
                span {
                    display: block;
                    height: 15px;
                    width: 50px;
                    box-shadow: 0 0 2px #939393;
                }
            }
        }

        &__lists {
            margin: 50px 0 0 0;
        }

        &__lists-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 0 20px 0;

            h3 {
                margin: 0;
            }

            button {
                font-weight: 600;
                text-decoration: underline;
            }
        }
    }

</style>