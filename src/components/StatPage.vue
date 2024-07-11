<template>
    <div class="stat-page">
        <div class="stat-page__chars">
            <div class="stat-page__pie-char-body">
                <h3>Переходы:</h3>
                <piechar
                    :charData="statData.transitions"
                    :size="170"
                />
                <template  v-for="item in getPercents(statData.transitions)" :key="item">
                    <p v-if="item.percent > 0"> {{item.label}} - <b>{{item.percent + ' %'}}</b> </p>
                </template>
            </div>

            <div class="stat-page__pie-char-body">
                <h3>Регитсрации:</h3>
                <piechar
                    :charData="statData.registrations"
                    :size="170"
                />
                <template  v-for="item in getPercents(statData.registrations)" :key="item">
                    <p v-if="item.percent > 0"> {{item.label}} - <b>{{item.percent + ' %'}}</b> </p>
                </template>
            </div>

            <div class="stat-page__pie-char-body">
                <h3>Просмотры:</h3>
                <piechar
                    :charData="statData.views"
                    :size="170"
                />
                <template  v-for="item in getPercents(statData.views)" :key="item">
                    <p v-if="item.percent > 0"> {{item.label}} - <b>{{item.percent + ' %'}}</b> </p>
                </template>
            </div>
        </div>

        <br>

        <div class="stat-page__sources-list">
            <h3>Источники:</h3>
            <ul>
                <li><span :style="{ background: colors.tg }"></span> - Телеграмм</li>
                <li><span :style="{ background: colors.vk }"></span> - Вконтакте</li>
                <li><span :style="{ background: colors.email }"></span> - Email</li>
                <li><span :style="{ background: colors.site }"></span> - site</li>
                <li><span :style="{ background: colors.another }"></span> - Другое</li>
            </ul>
        </div>

        <br>
        <hr>
        <br>

        <div class="funnel__filters">
            <h3>Фильтры:</h3>
            <p>
                <label>
                    Убрать дубли :
                    <input type="checkbox" @change="getFilteredData()" v-model="filterUniqueValues">
                </label>
            </p>
            <p>
                <label>
                    Убрать "owen.ru" :
                    <input type="checkbox" @change="getFilteredData()" v-model="filterOurEmails">
                </label>
            </p>
        </div>

        <br>

        <div class="stat-page__email-lists">
            <div class="stat-page__lists-header">
                <h3>Списки:</h3>
                <button @click="downloadXls()">Скачать как xls</button>
            </div>
            <list v-if="filteredRegistrations.length > 0" :list="filteredRegistrations">Общий список регистраций:</list>
            <p v-else>Регистраций: 0</p>
            <br>
            <list v-if="filteredViews.length > 0" :list="filteredViews">Общий список просмотров:</list>
            <p v-else>Просмотров: 0</p>
        </div>
    </div>
</template>

<script>

import * as XLSX from 'xlsx';

import MailsList from "@/components/MailsList.vue";

import PieChar from "@/components/PieChar.vue";

export default {
    name: "StatPage",

    components: {
        "list": MailsList,
        "piechar": PieChar,
    },

    props: {
        data: {
            require: true,
            type: Object,
        }
    },

    data() {
        return {
            colors: {
                "tg" : "#229ED9",
                "vk" : "#0077FF",
                "email" : "#FF9C24",
                "another" : "#DCDCDC",
                "site" : "#008f86",
            },

            statData: [],

            registrations: [],
            filteredRegistrations: [],

            views: [],
            filteredviews: [],

            filterUniqueValues: false,
            filterOurEmails: false,
        }
    },

    methods: {
        prepareData() {
            if(!this.data) return
            this.statData = {}

            if(this.data.tg && this.data.vk && this.data.email) {
                this.statData.transitions = [
                    { label: 'Телеграмм', number: this.data.tg.transitions.length ?? 0, color: this.colors.tg },
                    { label: 'Вк', number: this.data.vk.transitions.length ?? 0, color: this.colors.vk },
                    { label: 'Email', number: this.data.email.transitions.length ?? 0, color: this.colors.email },
                    { label: 'site', number: this.data.site.transitions.length ?? 0, color: this.colors.site },
                    { label: 'Другое', number: this.data.another.transitions.length ?? 0, color: this.colors.another },
                ];

                this.statData.registrations = [
                    { label: 'Телеграмм', number: this.data.tg.registrations.length ?? 0, color: this.colors.tg },
                    { label: 'Вк', number: this.data.vk.registrations.length ?? 0, color: this.colors.vk },
                    { label: 'Email', number: this.data.email.registrations.length ?? 0, color: this.colors.email },
                    { label: 'site', number: this.data.site.registrations.length ?? 0, color: this.colors.site },
                    { label: 'Другое', number: this.data.another.registrations.length ?? 0, color: this.colors.another },
                ];

                this.statData.views = [
                    { label: 'Телеграмм', number: this.data.tg.views.length ?? 0, color: this.colors.tg },
                    { label: 'Вк', number: this.data.vk.views.length ?? 0, color: this.colors.vk },
                    { label: 'Email', number: this.data.email.views.length ?? 0, color: this.colors.email },
                    { label: 'site', number: this.data.site.views.length ?? 0, color: this.colors.site },
                    { label: 'Другое', number: this.data.another.views.length ?? 0, color: this.colors.another },
                ];
            }
        },

        getTotalLists() {
            if(!this.data) return

            if(this.data.tg && this.data.vk && this.data.email) {
                this.registrations =  [
                    ...this.data.tg.registrations,
                    ...this.data.vk.registrations,
                    ...this.data.email.registrations,
                    ...this.data.site.registrations,
                    ...this.data.another.registrations
                ];

                this.views = [
                    ...this.data.tg.views,
                    ...this.data.vk.views,
                    ...this.data.email.views,
                    ...this.data.site.views,
                    ...this.data.another.views,
                ];
            }
        },

        getPercents(data) {
            if(!data) return 

            let sum = 0;

            data.forEach(element => {
                sum += element.number
            });

            let percent = [];

            data.forEach(element => {
                percent.push( {"label" : element.label , "percent" : ((element.number / sum) * 100).toFixed(2)} )
            });

            return percent;
        },

        getFilteredData() {
            this.filteredRegistrations = JSON.parse(JSON.stringify(this.registrations))
            this.filteredviews = JSON.parse(JSON.stringify(this.views))

            if(this.filterUniqueValues) this.getUniqueValues()
            if(this.filterOurEmails) this.removeOurEmails()
        },

        getUniqueValues() {
            this.filteredRegistrations = removeDuplicates(this.filteredRegistrations)
            this.filteredviews = removeDuplicates(this.filteredviews)

            function removeDuplicates(arr) {
                return arr.filter((item, index) => arr.indexOf(item) === index);
            }
        },

        removeOurEmails() {
            this.filteredRegistrations = this.filteredRegistrations.filter((email) => email.slice(-7) !== "owen.ru");
            this.filteredViews = this.filteredViews.filter((email) => email.slice(-7) !== "owen.ru");
        },

        downloadXls() {
            const wb = XLSX.utils.book_new();

            let data = [
                {
                    name: "Регистраций",
                    emails: this.registrations
                },
                {
                    name: "Просмотров",
                    emails: this.views
                }
            ];

            data.forEach(list => {
                const ws = XLSX.utils.json_to_sheet(list.emails.map(email => ({ email: email })));
                XLSX.utils.book_append_sheet(wb, ws, list.name);
            });

            XLSX.writeFile(wb, 'emails_lists.xlsx');
        },
    },

    created() {
        this.prepareData()
        this.getTotalLists()

        this.filteredRegistrations = JSON.parse(JSON.stringify(this.registrations))
        this.filteredViews = JSON.parse(JSON.stringify(this.views))
    }
} 
</script>

<style lang="scss" scoped>
    .stat-page {
        padding-left: 50px;
        padding-right: 50px;

        &__chars {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 20px;
            margin: 30px 0;

            @media(max-width: 768px) {
                flex-direction: column;
            }
        }

        &__pie-char-body {
            box-shadow: 0 0 4px #d3d3d3;
            padding: 15px;
            border-radius: 15px;

            h3 {
                text-align: center;
            }
        }

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

        &__email-lists {
            h3 {
                margin: 0;
            }

            p {
                color: #939393;
                font-weight: 600;
                padding: 0 0 0 20px;
            }
		}
    }

</style>