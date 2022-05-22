
//返回到主界面
let secondbtn = document.querySelectorAll('.back-previous');
for (let i = 0; i < secondbtn.length; i++) {
    secondbtn[i].onclick = () => {
        returnto();
    }
}

function makearticles(origin, son, father) {
    let itemavatar = origin.avatar;
    let itemName = origin.nickname;
    son.forEach((value) => {
        if (value.avatar && value.authorName) {
            itemavatar = value.avatar;
            itemName = value.authorName;
        }
        let itemImg = value.images[0];
        let itemtitle = value.title;
        let itemlikes = value.likes;
        let articleId = value.articleId;
        let itemsum = item1(itemImg, itemName, itemtitle, itemavatar, itemlikes, articleId);
        father.insertAdjacentHTML('beforeend', itemsum);
    })
}
// 封装一个函数，传输过来的数据放到对应节点
function pushInfor(origin, avatar, nickname, foller, fans, agree) {
    avatar.src = origin.avatar;
    nickname.innerHTML = origin.nickname;
    foller.innerHTML = origin.follows.length;
    fans.innerHTML = origin.fans.length;
}


let bottomNavbtn = document.querySelector('#index-bottom-nav').querySelectorAll('li');
let bottomResult = document.querySelectorAll('.index-navchange');
Clickchage(bottomNavbtn, bottomResult);

let manBtn = document.querySelector('#man-nav-ul').querySelectorAll('li');
let manResult = document.querySelector('#man-list').querySelectorAll('.main-list');
Clickchage(manBtn, manResult);


let agreeStarBtn = document.querySelector('.agreeStar-content').querySelector('.view-nav-ul').querySelectorAll('li');
let agreeStarResult = document.querySelector('.agreeStar-result').querySelectorAll('.normal-list');
Clickchage(agreeStarBtn, agreeStarResult);

// tab栏切换
let navBtn = document.querySelector('.view-nav-ul').querySelectorAll('li');
let navResult = document.querySelector('.index-content').querySelectorAll('.main-list');
Clickchage(navBtn, navResult);

let otheruserBtn = document.querySelector('#otheruser-nav-ul').querySelectorAll('li');
let otheruserResult = document.querySelector('#otheruser-list').querySelectorAll('.main-list');
Clickchage(otheruserBtn, otheruserResult);
// 登录-注册-将登录后的结果传到个人主页
class loginfull {
    constructor() {
        this.url = 'http://175.178.193.182:8080';
        // 获取节点

        //获取点击就旋转盒子的按钮
        this.changeReg = document.querySelector('#reg-tag');
        this.changelogin = document.querySelector('#login-tag');

        //获取登录按钮和注册按钮
        this.loginbtn = document.querySelector('.btn-login');
        this.regbtn = document.querySelector('.btn-reg');
        //获取确认密码的区域
        this.surepsd = document.querySelector('.surepassword');
        this.regpwd = document.querySelector('.regpassword');

        //获取旋转的盒子
        this.loRebox = document.querySelector('.loRe-box');


        //获取表单里的数据
        this.regForm = document.querySelector('#register-form');
        this.loginForm = document.querySelector('#login-form');

        //提示性文本
        this.regFormError = document.querySelector('.regform-tips');
        this.loginFormError = document.querySelector('.loginform-tips');


        //用来判断两次密码是否相同的参数
        this.flag = false;
        // pushInfor(item, avatar, nickname, foller, fans);

        // 执行绑定操作
        this.init();
    }
    // 初始化操作，让事件和节点绑定起来
    init() {
        this.changeReg.onclick = this.rotebox.bind(this);
        this.changelogin.onclick = this.rotebox.bind(this);
        // 注册事件
        this.regbtn.onclick = this.toregister.bind(this);

        // 如果本地存储没有用户登录则执行登录事件
        if (!localStorage.getItem('MyuserId')) {
            newindex('index', 'login');
        }
        else {
            // 页面初始化函数
            pageAuthorid = localStorage.getItem('MyuserId');
            indexinit('index');

        }
        // 绑定登录事件
        this.loginbtn.onclick = this.tologin.bind(this);

        // 确认密码事件
        this.surepsd.onblur = this.checkpsd.bind(this);

    }
    // 点击按钮后旋转盒子
    rotebox() {
        this.clearinput(this.regForm);
        this.clearinput(this.loginForm);
        this.loRebox.classList.toggle('rotateY');
    }

    // 登录操作
    tologin() {
        ajax({
            type: 'formdata',
            method: 'post',
            url: this.url + '/login',
            data: this.loginForm,
            dataType: 'form',
            //成功后执行回调函数
            success: (res) => {
                if (res.status === 200 || res.status === 406) {
                    // 将用户id放到本地存储里
                    localStorage.setItem('MyuserId', res.userId);
                    pageAuthorid = localStorage.getItem('MyuserId');
                    //显示登录情况和回退到首页
                    alert(res.msg, () => {
                        returnto();
                    });
                    // 将个人数据传输到个人中心
                    indexinit('index');
                }
                else
                    this.tips(this.loginFormError, res.msg, false);
            },
        });

        // console.log(1);

    }

    //注册操作
    toregister() {
        if (this.flag === true) {
            ajax({
                type: 'formdata',
                method: 'post',
                url: this.url + '/register',
                data: this.regForm,
                //成功后执行回调函数
                success: (res) => {
                    if (res.status === 200 || res.status === 406) {
                        this.tips(this.regFormError, res.msg, true);
                    }
                    else {
                        this.tips(this.regFormError, res.msg, false);
                    }
                },
            });



        }

    }

    // 检查确认密码和密码是否相同
    checkpsd() {
        if (this.surepsd.value != this.regpwd.value && this.surepsd.value != '') {
            this.tips(this.regFormError, '两次密码输入不一致', false);
            this.flag = false;
        }
        else {
            this.tips(this.regFormError, '', true);
            this.flag = true;
        }

    }

    // 清除表单数据
    clearinput(options) {
        this.regFormError.innerHTML = '';
        this.loginFormError.innerHTML = '';
        for (let i = 0; i < options.children.length; i++) {
            if (options.children[i].children[0] == undefined) {
                return;
            }
            if (options.children[i].children[0].type == "text") {
                options.children[i].children[0].value = "";
            }
            else if (options.children[i].children[0].type == "password") {
                options.children[i].children[0].value = "";
            }
        }

    }
    // 显示账号密码是否错误的文本
    tips(obj, str, judge) {
        if (judge) {
            obj.innerHTML = `<div class="form-success">${str}</div>`;
        }
        else {
            obj.innerHTML = `<div class="form-error">${str}</div>`;
        }

    }

}

new loginfull();

