<template>
    <div class="sidebar">
        <div class="sidebar__head">
            <div class="sidebar__head-burger">
                <span></span>
            </div>
            Список событий
        </div>
        <div>
            <div class="sidebar__error" v-if="error" v-html="error"></div>
            <div class="sidebar__loading" v-else-if="loading">загрузка...</div>
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
        min-height: calc(100vh - 117px);
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
            padding: 10px;

            li {
                margin: 0 0 20px 0;
                text-align: start;
                cursor: pointer;
                font-size: 20px;
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0%;
                    height: 2px;
                    background: #2c3e50;
                }

                &:hover {
                    &::after {
                        width: 100%;
                    } 
                }

                a {
                    color: inherit;
                }
            }
        }

        &__error {
            font-size: 20px;
            margin: 40px 0 0 0;
        }
    }
</style>