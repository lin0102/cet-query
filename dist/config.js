window.g = {
    apiUrl: "https://wx.idsbllp.cn/",
    appId: "wx81a4a4b77ec98ff4",
    shareOptions: {
        title: "这是一个示例",
        link: window.location.href,
        imgUrl: '',
        desc: '这是一个示例',
        type: '',
        success: function() {
            console.log('分享成功');
        },
        cancel: function() {
            console.log('取消分享');
        }
    }
}