<template>
    <div class="funnel">
        <div class="funnel__body">
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
            <div class="funnel__visualization">
                <h3>График:</h3>
                <ul>
                    <li
                        v-for="(item, key) in funnelData"
                        :key="key"
                        :style="{background: colors[source], width: item.percent + '%'}"
                    >
                        <span :class="{'__outside' : item.percent < 25}">
                            {{key + ': ' + item.count + ' (' + item.percent + '%)'}}
                        </span>
                    </li>
                </ul>
            </div>
            <br>
            <div class="funnel__email-lists" v-if="finalEventType === 'registrationAndViewing'">
                <h3>Списки:</h3>
                <mailslist :list="this.filteredData.registrations"></mailslist>
                <br>
                <mailslist :list="this.filteredData.views"></mailslist>
            </div>
        </div>
    </div>
</template>

<script>

import MailsList from "@/components/MailsList.vue"

export default {
    name: "MarketingFunnel",

    comments: {
        "mailslist": MailsList,
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

            funnelData: null,

            filterUniqueValues: false,
            filterOurEmails: false,
        }
    },

    methods: {
        getFunnel() {
            if(this.finalEventType === "registrationAndViewing") return this.getRegistrationAndViewingFunnel()
            if(this.finalEventType === "goOrganizerWebsite") return this.getGoOrganizerWebsiteFunnel()
        },

        getRegistrationAndViewingFunnel() {
            let funnel = {};
            let headings = this.headings[this.source][0];

            funnel[headings[0]] = {"percent" : 100 , "count" : this.filteredData.total};
            funnel[headings[1]] = {"percent" : (100 * (this.filteredData.read / this.filteredData.total)).toFixed(2), "count" : this.filteredData.read};
            funnel[headings[2]] = {"percent" : (100 * (this.filteredData.transitions.length / this.filteredData.total)).toFixed(2) , "count" : this.filteredData.transitions.length};
            funnel[headings[3]] = {"percent" : (100 * (this.filteredData.registrations.length / this.filteredData.total)).toFixed(2), "count" : this.filteredData.registrations.length};
            funnel[headings[4]] = {"percent" : (100 * (this.filteredData.views.length / this.filteredData.total)).toFixed(2), "count" : this.filteredData.views.length};

            return funnel;
        },

        getGoOrganizerWebsiteFunnel() {
            let funnel = {};
            let headings = funnel[this.headings[this.source]][1];

            funnel[headings[0]] = {"percent" : 100 , "count" : this.filteredData.total};
            funnel[headings[1]] = {"percent" : (100 * (this.data.read / this.data.total)).toFixed(2), "count" : this.data.read};
            funnel[headings[2]] = {"percent" : (100 * (this.data.transitions.length / this.data.total)).toFixed(2), "count" : this.data.transitions.length};
            funnel[headings[3]] = {"percent" : (100 * (this.data.trafficToOrganizerWebsite.length / this.data.total)).toFixed(2), "count" : this.data.trafficToOrganizerWebsite.length};

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