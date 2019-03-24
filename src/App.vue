<template>
    <div id="app">
        <transition name="fade">
            <component :is="info.currentComponent" :info.sync="info"></component>
        </transition>
        <p><strong>©</strong>&nbsp;红岩网校工作站</p>
    </div>
</template>
<script>
    import confirmation from './components/confirmation'
    import querying from './components/querying'
    export default {
        components: {
            confirmation,
            querying
        },
        data() {
            return {
                info: {
                    data: {
                        username: "",
                        admission_card_id: "",
                        write_total: "",
                        write_listen: "",
                        write_read: "",
                        write_write: ""
                    },
                    currentComponent: "querying",
                    isAutoVerified: false, 
                    isQueryed: false
                }
            }
        },
        mounted() {
        
        }
    };
</script>

<style lang="less" scoped>
    @designWidth: 7.5;

    #app {
        width: 100vw;
        height: 100vh;
        background-color: #c2daff;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        p {
            align-self: flex-end;
            position: relative;
            font-size: 2.883vw;
            color: #3768b5;
            bottom: calc(26vw / @designWidth);
            letter-spacing: 0.4vw;
            font-family: "PingFangSC-Regular", sans-serif;

            strong {
                font-size: 3.451vw;
            }
        }
    }

    .fade-enter-active {
        transition: opacity .5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>