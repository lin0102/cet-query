<template>
    <div id="querying">
        <img src="../assets/banner.png" alt="" class="banner">
        <div class="progress" v-if="!info.isQueryed">
            <img src="../assets/pencil.png" alt="" class="pencil">
            <div class="border"></div>
            <p>正在查询中......</p>
            <div @click="jump">跳转到第三方网站</div>
        </div>
        <div class="content" v-if="info.isQueryed">
            <div>
                <p>
                    <strong>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</strong>
                    <span>{{info.data.username}}</span>
                </p>
            </div>
            <div>
                <p><strong>准考证号：</strong><span>{{info.data.admission_card_id}}</span></p>
            </div>
            <div>
                <p>
                    <strong>总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分：</strong>
                    <span>{{info.data.write_total}}</span>
                </p>
            </div>
            <div>
                <p>
                    <strong>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科：</strong>
                    听力&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{{info.data.write_listen}}</span>
                </p>
            </div>
            <div>
                <p><strong></strong>阅读&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{info.data.write_read}}</span></p>
            </div>
            <div>
                <p><strong></strong>写作和翻译&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{info.data.write_write}}</span></p>
            </div>
            <div>
                <img src="../assets/ink.png" alt="墨水">
                <img src="../assets/pen.png" alt="笔">
            </div>
        </div>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk'
    
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
                            isQueryed: false,  
                        }
                    }
                }
            }
        },
        methods: {
            jump: function () {
                window.location.href = 'http://cet.neea.edu.cn/cet/';
            }
        },
        mounted() {
            let self = this;
            let formData = new FormData();
            if (window.location.href === "https://wx.idsbllp.cn/cetsearch/login/redirect/query") {
                formData.append('url', window.location.href);
                this.axios.post(`${window.g.apiUrl}cetsearch/setting/js_sign_query`, formData)
                    .then(res => {
                        let data = {
                            debug: false,
                            appId: window.g.appId,
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'onMenuShareQZone', 
                                'updateAppMessageShareData',
                                'updateTimelineShareData'
                            ]
                        }
                        data.timestamp = res.data.data.timestamp;
                        data.nonceStr = res.data.data.nonceStr;
                        data.signature = res.data.data.signature;
                        wx.config(data);
                        console.log(data);
                    })
                    .then(function () {
                        wx.ready(function () {
                            wx.onMenuShareTimeline(window.g.shareOptions);
                            wx.onMenuShareAppMessage(window.g.shareOptions);
                            wx.onMenuShareQQ(window.g.shareOptions);
                            wx.onMenuShareWeibo(window.g.shareOptions);
                            wx.onMenuShareQZone(window.g.shareOptions);
                        })
                        wx.error(function (res) {
                            console.log(res);
                        })
                    })
            } else {
                window.location.href = "https://wx.idsbllp.cn/cetsearch/login/redirect/query";
            } 
            if (!localStorage.getItem('data')) {
                if (!this.info.isAutoVerified) {
                    this.axios.post(`${window.g.apiUrl}cetsearch/message/search/no_verify`)
                        .then(res => {
                            if (res.data.info === 'success') {
                                for(let key in this.info.data) {
                                    this.info.data[key] = res.data.data[key];
                                }
                                localStorage.setItem('data', JSON.stringify(this.info.data));
                                this.info.isQueryed = true;
                            } else if(res.data.info == 'has no preset message'){
                                alert('请先完善自己的个人信息');
                                window.location.href = 'https://wx.idsbllp.cn/cetsearch/login/redirect/preset';
                            } else {
                                alert('服务器忙，请稍后重试');
                            }
                        })
                        .catch(err => {
                            if(err.response.status === 403) {
                                alert('当前查询人数过多，请稍后重试');
                            } else if(err.response.status === 500) {
                                alert('服务器繁忙，查询失败');
                            } else {
                                alert('服务器忙，请稍后重试');
                            }
                            console.log(err.response);
                        })
                } 
            } else {
                let data = JSON.parse(localStorage.getItem('data'));
                for(let key in data) {
                    this.info.data[key] = data[key];
                }
                this.info.isQueryed = true;
            }
        }
    }
</script>

<style lang="less" scoped>
    @designWidth: 7.5;
    @keyframes load {
        0% {
            transform: translate(calc(0vw / @designWidth), 0) rotate(0deg);
        }
        50% {
            transform: translate(calc(45vw / @designWidth), 0) rotate(20deg);
        }
        100% {
            transform: translate(calc(0vw / @designWidth), 0) rotate(0deg);
        }
    }
    #querying {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .banner {
            width: 100vw;
            height: calc(390vw / @designWidth);
            border-bottom: calc(1vw / @designWidth) solid #073b79;
            display: block;
        }
        .progress {
            margin-top: calc(150vw / @designWidth);
            text-align: center;
            .pencil {
                width: calc(110vw / @designWidth);
                height: calc(126vw / @designWidth);
                position: relative;
                top: calc(9vw / @designWidth);
                right: calc(37.5vw / @designWidth);
                animation-name: load;
                animation-duration: 1s;
                animation-iteration-count: infinite;
            }
            .border {
                width: calc(48vw / @designWidth);
                height: calc(4vw / @designWidth);
                background-color: #92b5ea;
                border-radius: calc(2vw / @designWidth);
                margin: 0 auto;
            }
            div {
                &:nth-last-child(1){
                    width: calc(322vw / @designWidth);
                    height: calc(59vw / @designWidth);
                    background-color: #76acff;
                    border-radius: calc(10vw / @designWidth);
                    border: calc(2vw / @designWidth) solid #073b79;
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: calc(207vw / @designWidth);
                    font-size: calc(30vw / @designWidth);
                    font-family: tiaotiao;
                    color: #eaf4ff;
                    text-align: center;
                    line-height: calc(59vw / @designWidth);
                }
            }
            p {
                font-family: tiaotiao;
                font-size: calc(34.56vw / @designWidth);
                color: #073b79;
                text-align: center;
                margin-bottom: 0;
            }
        }
        .content {
            width: calc(690vw / @designWidth);
            height: calc(608vw / @designWidth);
            box-sizing: border-box;
            border: calc(2vw / @designWidth) solid #073b79;
            border-radius: calc(10vw / @designWidth);
            background-color: #fbfdff;
            padding-left: calc(56vw / @designWidth);
            padding-right: calc(56vw / @designWidth);
            padding-top: calc(20vw / @designWidth);
            margin-top: calc(20vw / @designWidth);
            div {
                border-bottom: calc(2vw / @designWidth) solid #cad6e4;
                padding-bottom: calc(5vw / @designWidth);
                margin-top: calc(26vw / @designWidth);
                p {
                    font-family: tiaotiao;
                    margin: 0;
                    padding: 0;
                    font-size: calc(30vw / @designWidth);
                    color: #073b79;
                    strong {
                        font-weight: normal;
                        font-size: calc(34vw / @designWidth);
                        width: calc(175vw / @designWidth);
                        display: inline-block;
                    }
                    span {
                        font-size: calc(28vw / @designWidth);
                        font-family: "PingFangSC-Regular", sans-serif;
                        color: #f8822b;
                        letter-spacing: 0.3vw;
                    }
                }
                &:nth-child(6) {
                    width: calc(500vw / @designWidth);
                }
                &:nth-child(7) {
                    width: calc(338vw / @designWidth);
                    margin-top: calc(75vw / @designWidth);
                    position: relative;
                    img {
                        border: none;
                        &:nth-child(1) {
                            width: calc(52vw / @designWidth);
                            height: calc(71vw / @designWidth);
                            position: absolute;
                            left: calc(-40vw / @designWidth);
                            top: calc(-35vw / @designWidth);
                            margin: 0;
                        }
                        &:nth-child(2) {
                            width: calc(286vw / @designWidth);
                            height: calc(144vw / @designWidth);
                            position: absolute;
                            right: calc(-305vw / @designWidth);
                            top: calc(-115vw / @designWidth);
                            margin: 0;
                        }
                    }
                }
            }
        }
    }
</style>
