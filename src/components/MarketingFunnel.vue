<template>
    <div class="funnel">
        <div class="funnel__non-data" v-if="!checkData()">
            Нет данных для отображения
        </div>
        <div class="funnel__body" v-else>
            <div class="funnel__visualization">
                <h3>График:</h3>
                <ul>
                    <template 
                        v-for="(item, key) in funnelData"
                        :key="key"
                    >
                        <li
                            :style="{background: colors[source], width: (item.percent > 2 ? item.percent : 1.5) + '%'}"
                            v-if="item.count > 0"
                        >
                            <span 
                                :class="{'__outside' : item.percent < 25}">
                                {{key + ': ' + addThousandSeparator(item.count) + ' (' + item.percent + '%)'}}
                            </span>
                        </li>
                    </template>
                </ul>
            </div>

            <br>

            <div class="funnel__filters" v-if="finalEventType === 'registrationAndViewing'">
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

            <div class="funnel__email-lists" v-if="finalEventType === 'registrationAndViewing'">
                <div class="funnel__lists-header">
                    <h3>Списки:</h3>
                    <button @click="downloadXls()">Скачать как xls</button>
                </div>
                <list v-if="filteredData.registrations.length > 0" :list="filteredData.registrations">Регистраций</list>
                <p v-else>Регистрации: 0</p>
                <br>
                <list v-if="filteredData.views.length > 0" :list="filteredData.views">Просмотров</list>
                <p v-else>Просмотры: 0</p>
            </div>
        </div>
    </div>
</template>

<script>

import * as XLSX from 'xlsx';

import MailsList from "@/components/MailsList.vue"

export default {
    name: "MarketingFunnel",

    components: {
        "list": MailsList,
    },

    props: {
        source: {
            require: true,
            type: String,
        },

        finalEventType: {
            require: true,
            type: String,
        },

        data: {
            require: true,
            type: Object,
        }
    },

    data() {
        return {
            headings: {
                "tg" : [
                    ["Подписчиков", "Показов", "Переходов", "Регистраций", "Просмотров"],
                    ["Подписчиков", "Показов", "Переходов", "Перешли на сайт организатора"],
                ],
                "vk" : [
                    ["Подписчиков", "Показов", "Переходов", "Регистраций", "Просмотров"],
                    ["Подписчиков", "Показов", "Переходов", "Перешли на сайт организатора"],
                ],
                "email" : [
                    ["Доставлено", "Прочитано", "Переходов", "Регистраций", "Просмотров"],
                    ["Доставлено", "Прочитано", "Переходов", "Перешли на сайт организатора"],
                ],
            },

            colors: {
                "tg" : "#229ED9",
                "vk" : "#0077FF",
                "email" : "#FF9C24",
            },

            filteredData: [],

            funnelData: null,

            filterUniqueValues: false,
            filterOurEmails: false,
        }
    },

    methods: {
        checkData() {
            for (let key in this.funnelData) {
                if(this.funnelData[key]["count"] > 0) return true
            }
            return false
        },

        addThousandSeparator(num) {
            if(num) return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return 0
        },

        getFunnel() {
            if(this.finalEventType === "registrationAndViewing") return this.getRegistrationAndViewingFunnel()
            if(this.finalEventType === "goOrganizerWebsite") return this.getGoOrganizerWebsiteFunnel()
        },

        getRegistrationAndViewingFunnel() {
            let funnel = {};
            let headings = this.headings[this.source][0];

            funnel[headings[0]] = {"percent" : 100 , "count" : this.filteredData.total};
            funnel[headings[1]] = {"percent" : (100 * (this.filteredData.read / this.filteredData.total)).toFixed(1), "count" : this.filteredData.read};
            funnel[headings[2]] = {"percent" : (100 * (this.filteredData.transitions.length / this.filteredData.total)).toFixed(1) , "count" : this.filteredData.transitions.length};
            funnel[headings[3]] = {"percent" : (100 * (this.filteredData.registrations.length / this.filteredData.total)).toFixed(1), "count" : this.filteredData.registrations.length};
            funnel[headings[4]] = {"percent" : (100 * (this.filteredData.views.length / this.filteredData.total)).toFixed(1), "count" : this.filteredData.views.length};

            return funnel;
        },

        getGoOrganizerWebsiteFunnel() {
            let funnel = {};
            let headings = funnel[this.headings[this.source]][1];

            funnel[headings[0]] = {"percent" : 100 , "count" : this.filteredData.total};
            funnel[headings[1]] = {"percent" : (100 * (this.data.read / this.data.total)).toFixed(1), "count" : this.data.read};
            funnel[headings[2]] = {"percent" : (100 * (this.data.transitions.length / this.data.total)).toFixed(1), "count" : this.data.transitions.length};
            funnel[headings[3]] = {"percent" : (100 * (this.data.trafficToOrganizerWebsite.length / this.data.total)).toFixed(1), "count" : this.data.trafficToOrganizerWebsite.length};

            return funnel;
        },

        getFilteredData() {
            this.filteredData = JSON.parse(JSON.stringify(this.data))

            if(this.filterUniqueValues) this.getUniqueValues()
            if(this.filterOurEmails) this.removeOurEmails()

            this.funnelData = this.getFunnel()
        },

        getUniqueValues() {
            this.filteredData.transitions = removeDuplicates(this.filteredData.transitions)
            this.filteredData.registrations = removeDuplicates(this.filteredData.registrations)
            this.filteredData.views = removeDuplicates(this.filteredData.views)

            function removeDuplicates(arr) {
                return arr.filter((item, index) => arr.indexOf(item) === index);
            }
        },

        removeOurEmails() {
            this.filteredData.registrations = this.filteredData.registrations.filter((email) => email.slice(-7) !== "owen.ru");
            this.filteredData.views = this.filteredData.views.filter((email) => email.slice(-7) !== "owen.ru");
        },

        downloadXls() {
            const wb = XLSX.utils.book_new();

            let data = [
                {
                    name: "Регистраций",
                    emails: this.filteredData.registrations
                },
                {
                    name: "Просмотров",
                    emails: this.filteredData.views
                }
            ];

            data.forEach(list => {
                const ws = XLSX.utils.json_to_sheet(list.emails.map(email => ({ email: email })));
                XLSX.utils.book_append_sheet(wb, ws, list.name);
            });

            XLSX.writeFile(wb, this.source + '_emails_lists.xlsx');
        },
    },


    created() {
        this.filteredData = JSON.parse(JSON.stringify(this.data))
        this.funnelData = this.getFunnel()
    }
}
</script>

<style lang="scss" scoped>
    .funnel {
        padding-left: 50px;
        padding-right: 50px;

        &__non-data {
            font-size: 20px;
            text-align: center;
            margin: 50px 0 0 0;
            color: #939393;
        }

		&__body {
            margin: 50px 0 0 0;
		}

        h3 {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 20px 0;
        }

        &__filters {
            p {
                margin: 0 0 10px 0;

                label {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                }

                input {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    
                    &:checked {
                        background: #008f86;
                    }
                }
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

		&__lists-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 0 20px 0;

            button {
                font-weight: 600;
                text-decoration: underline;
            }
		}


		&__visualization {
            ul {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
        
                li {
                    border-radius: 5px;
                    box-shadow: 0 0 5px #939393;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: start;
                    position: relative;

                    &:hover {
                        transform: scale(1.02);
                    }

                    span {
                        color: #fff;
                        white-space: nowrap;
                        padding: 0 20px;

                        @media(max-width: 1430px) {
                            color: #2c3e50;
                            text-decoration: underline;
                        }

                        &.__outside {
                            color: #2c3e50;
                            position: absolute;
                            padding: 0;
                            left: calc(100% + 5px);
                        }
                    }
                }
            }
		}
}

</style>