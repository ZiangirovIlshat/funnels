<template>
    <div class="sidebar">
        <div class="sidebar__head">
            <div class="sidebar__head-burger">
                <span></span>
            </div>
            Список событий
        </div>
        <div>
            <div class="error" v-if="error" v-html="error"></div>
            <div class="loading" v-else-if="loading">загрузка...</div>
            <div class="sidebar__list" v-else>
                <div class="sidebar__error" v-if="data.length === 0">
                    не найдено событий
                </div>
                <ul v-else>
                    <li v-for="event in data" :key="event.id">
                        <router-link :to="'/' + event.id">{{event.name}}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "SideBar",

    props: {
        loading: {
            require: true,
            type: Boolean,
        },
        data: {
            require: true,
            type: Array,
        },
        error: {
            require: true,
            type: String,
        },
    },
}
</script>

<style lang="scss" scoped>
    .sidebar {
        height: 100%;
        border-left: 2px solid;
        border-right: 2px solid;

        &__head {
            background: #2c3e50;
            color: #fff;
            padding: 10px;
            display: flex;
            align-items: center;
        }

        &__head-burger {
            width: 30px;
            height: 15px;
            margin: 0 10px 0 0;
            position: relative;
            font-size: 20px;

            &::before, &::after, span {
                content: "";
                position: absolute;
                left: 0;
                width: 100%;
                height: 2px;
                background: #fff;
            }

            &::before {
                top: 0;
            }

            span {
                top: calc(50% - 1px)
            }

            &::after {
                bottom: 0;
            }
		}

        &__loading {
            font-size: 20px;
            margin: 40px 0 0 0;
        }

        &__list {
            border-top: 2px solid #fff;

            li {
                a {
                    display: block;
                    color: inherit;
                    font-size: 20px;
                    padding: 10px;
                    position: relative;
                    transition: .3s;

                    &::after {
                        content: "";
                        position: absolute;
                        left: 3%;
                        bottom: 5px;
                        height: 2px;
                        width: 0%;
                        background: #2c3e50;
                    }

                    &:hover {
                        margin: 0 0 0 5px;
                        &::after {
                            width: 90%;
                        }
                    }

                    &.active-link {
                        margin: 0 0 0 5px;
                        &::after {
                            width: 90%;
                        }
                    }
                }
            }
        }

        &__error {
            font-size: 20px;
            margin: 40px 0 0 0;
        }
    }
</style>