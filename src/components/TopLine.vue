<template>
    <div class="header">
        <div class="container">
            <div class="header__row">
                <div class="header__logo">
                    <img src="../assets/logo.png" alt="owen logo">
                    <p>OWEN<br>FUNNELS</p>
                    <router-link to="/"></router-link>
                </div>
                <div
                    class="header__burger-menu" 
                    @click="menuIsOpen = !menuIsOpen"
                    :class="{'__active' : menuIsOpen}"
                >
                    <span></span>
                </div>
                <nav 
                    class="menu" 
                    :class="{'__active' : menuIsOpen}"
                >
                    <ul>
                        <li>
                            <a href="https://stat.owen.ru/polls" target="_blank">OWEN опросы</a>
                        </li>
                        <li>
                            <router-link to="/admin">Админ панель</router-link>
                        </li>
                        <li>
                            <button class="header__exit-btn">
                                Выйти
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : "TopLine",

    data() {
        return {
            menuIsOpen: false,
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    padding: 15px 0 30px 0;
    border-bottom: 2px solid;
    
        &__row {
            display: flex;
            justify-content: space-between;
            align-items: center;

            position: relative;
        }

		&__logo {
            display: flex;
            align-items: center;
            font-size: 20px;
            font-weight: 600;
            text-align: start;
            position: relative;

            &::after {
                content: "";
                position: absolute;
                top: 10%;
                left: 73px;
                width: 2px;
                height: 80%;
                background: #2c3e50;
                text-shadow: 0 -0.5px 3px #ededed;
            }
             
            img {
                margin: 0 10px 0 0;
                width: 70px;
                height: 70px;
                display: inline-block;
            }

            p {
                text-shadow: 0 -0.5px 3px #ededed;
            }

            a {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
		}

		&__burger-menu {
            height: 50px;
            width: 50px;
            border-radius: 5px;
            background: #2c3e50;
            position: relative;
            cursor: pointer;
            box-shadow: 0 -0.5px 3px #2c3e50;

            z-index: 1;

            &::before, &::after, span {
                content: "";
                position: absolute;
                left: 10%;
                height: 3px;
                width: 80%;
                background: #fff;
                transition: all .3s;
            }

            &::before {
                top: 12px;
            }

            span {
                top: calc(50% - 1.5px);
            }

            &::after {
                bottom: 12px;
            }

            &.__active {
                &::before {
                    top: 23px;
                    transform: rotate(-45deg);
                }

                span {
                    display: none;
                }

                &::after {
                    bottom: 23px;
                    transform: rotate(45deg);
                }
            }
		}

		&__exit-btn {
            background: #fff;
            color: #2c3e50;
            padding: 5px 30px;
            border-radius: 5px;
            border: 2px solid #fff;
            transition: .3s;
            font-size: 20px;
            font-weight: 700;

            &:hover {
                background: #2c3e50;
                color: #fff;
            }
		}
}
.menu {
    position: absolute;
    top: 5px;
    right: 0;
    background-color: #2c3e50;
    padding: 40px 50px 20px 50px;
    border-radius: 5px;
    overflow: hidden;
    height: 0;
    opacity: 0;
    transition: all .3s;
    box-shadow: 0 -0.5px 3px #2c3e50;

    &.__active {
        height: auto;
        opacity: 1;
    }

    ul {
        padding: 5px;
        text-align: center;
    }

    li {
        margin: 0 0 20px 0;
        position: relative;

        &::after {
            content: "";
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0%;
            height: 2px;
            background: #fff;
        }

        &:hover {
            &::after {
                width: 100%;
            } 
        }

        &:nth-child(3) {
            &::after {
                width: 0%;
            }
        }

        a {
            color: #fff;
        }
    }
}

</style>