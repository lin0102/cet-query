<template>
    <div id="confirmation">
        <img :src="imgSrc" alt="验证码图片获取失败" class="verifyImg">
        <div class="verify">
            <p>请输入验证码：</p>
            <input type="text" v-model="verify_code">
        </div>
        <div class="confirm" @click="submit">
            <img src="../assets/reflect.png">
            点击确定
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            info: {
                type: Object,
                default: function() {
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
                }
            }
        },
        data() {
            return {
                verify_code: '',
                imgSrc: ''
            }
        },
        methods: {
            submit: function() {
                if(this.verify_code.trim().length == 4) {
                    this.info.currentComponent = 'querying';
                    this.axios.get(`${window.g.apiUrl}cetsearch/message/search/has_verify?verify_code=${this.verify_code}`)
                        .then(res => {
                            if(res.data.info === 'success') {
                                for(let key in this.info.data) {
                                    this.info.data[key] = res.data.data[key];
                                }
                                localStorage.setItem('data', JSON.stringify(this.info.data));
                                this.info.isQueryed = true;
                            } else if(res.data.info === 'verify_code error') {
                                alert('验证码输入有误');
                                this.info.currentComponent = 'confirmation';
                            } else if(res.data.info === 'has no preset message'){
                                alert('请先完善自己的个人信息');
                                window.location.href = 'https://wx.idsbllp.cn/cetsearch/login/redirect/preset';
                            } else if(res.data.info === "not support exanmination type") {
                                alert('不支持查询此考试类型');
                            }
                        })
                        .catch(err => {
                            alert('服务器忙，请稍候重试');
                            console.log(err);
                        })
                }
            }
        },
        mounted() {
            // this.axios.post(`${window.g.apiUrl}cetsearch/message/search/get_pic`)
            //     .then(res => {
            //         if(res.data.info === 'success') {
            //             this.imgSrc = res.data.data;
            //         } else if(res.data.info === 'time limit') {
            //             alert('未到查询时间，请耐心等候');
            //         }
            //     })
            //     .catch(err => {
            //         alert('服务器忙，请稍候重试');
            //         console.log(err);
            //     })
        }
    }
</script>

<style lang="less" scoped>
    @designWidth: 7.5;
    #confirmation {
        width: 92vw;
        height: calc(545vw / @designWidth);
        background-color: #fbfdff;
        border-radius: 1.333vw;
        margin-top: 33.867vw;
        border: 0.267vw solid #073b79;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding-top: calc(30vw / @designWidth);
        padding-bottom: calc(30vw / @designWidth);
        box-sizing: border-box;
        .verifyImg {
            display: block;
            width: 44.667vw;
            height: 27.067vw;
            background-color: #c2daff;
            border: 0.267vw solid #073b79;
            border-radius: 1.333vw;
        }
        .verify {
            display: flex;
            align-items: flex-start;
            p {
                font-family: tiaotiao;
                color: #073b79;
                font-size: calc(36vw / @designWidth);
                margin: 0;
                padding: 0;
            }
            input {
                flex-grow: 0;
                font-size: calc(32vw / @designWidth);
                color: #f8822b;
                border: none;
                border-bottom: calc(2.5vw / @designWidth) solid #cad6e4;
                padding-left: calc(15vw / @designWidth);
                margin-left: calc(5vw / @designWidth);
                width: calc(300vw / @designWidth);
                outline: none;
            }
        }
        .confirm {
            width: calc(294vw / @designWidth);
            height: calc(75vw / @designWidth);
            background-color: #9bc2ff;
            border-radius: calc(10vw / @designWidth);
            position: relative;
            text-align: center;
            line-height: calc(75vw / @designWidth);
            border: calc(2vw / @designWidth) solid #073b79;
            font-family: tiaotiao;
            color: #073b79;
            font-size: calc(38vw / @designWidth);
            img {
                position: absolute;
                width: calc(31vw / @designWidth);
                height: calc(37vw / @designWidth);
                left: calc(6vw / @designWidth);
                top: calc(5vw / @designWidth);
            }
        }
    }
</style>