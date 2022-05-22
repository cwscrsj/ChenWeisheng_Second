// 存放一些直接引用的函数
// ajax
let url = 'http://175.178.193.182:8080';
let changeIndex = [];
let pageAuthorid=null;
let pageArticleid=null;

changeIndex.push('index');
console.log(changeIndex);


// 做一个节流函数
function throttle(callback, delay) {
    let flag = true;
    return () => {
        if (flag) {
            flag = false;
            callback();
            setTimeout(() => {
                flag = true;
            }, delay);
        }
    }
}
function followitem(userId, avatar, nickname) {
    let item = ` 
                        <div class="newitem-content">
                            <div class="otheruser">
                                <div class="otheruser-avatarbox">
                                    <img src="${avatar}" alt="" id="otheruser-avatar" class="otheruser-avatar">
                                </div>

                                <div class="otheruser-infor">
                                    <h4 class="otheruser-name">${nickname}</h4>

                                </div>
                            </div>

                            <div class="eachfollow" userId="${userId}">
                            </div>
                        </div>
                `
    return item;
}

// 利用模板字符串造一个函数存放item
function item1(img, authorName, title, avatar, like, articleId, authorId) {
    let item = `<li class="item" authorId="${authorId}" articleId=${articleId}>
                            <div class="content-box">
                                <div class="exp-img">
                                    <img src="${img}" class="picture" alt="" style="width: 100%;">
                                </div>
                                <h2 class="exp-title">
                                ${title}
                                </h2>
                                <div class="exp-author">
                                    <div class="name">
                                        <i class="avatar">
                                           <img src="${avatar}" alt="" id="avatar-img">
                                        </i>
                                        <span class="username">${authorName}</span>
                                    </div>
                                    <div class="like">
                                        <i class="iconfont like-ico">&#xe753;</i>
                                        <span class="like-num">${like}</span>
                                    </div>
                                </div>
                            </div>
                        </li>`;

    return item;
}

function agreeStarItem(avatar, name, str, img, articleId) {
    let item = `                   
    <div class="agreeStar-user" >
        <img src="${avatar}" alt="">
        <div>
            <h3>${name}<h4>
            <p>${str}</p>

        </div>
    </div>
    <div class="agreeStar-exp">
        <img src="${img}" alt="">
        <i class="iconfont">&#xe665;</i>
    </div>
`
    return item;
}
//获取首页文章
function getHomePage(success) {
    ajax({
        type: '',
        method: 'GET',
        url: url + '/article/getHomePage',
        data: '',
        success: success,
    });
}
// 获取基本信息
function userBase(id, success) {
    ajax({
        type: 'query',
        method: 'GET',
        url: url + '/user/fullInfo',
        data: {
            userId: id,
        },
        success: success,
    });

}
// 获取作者写过的文章
function userArticles(id, success) {
    //  judge变量用来判断是否需要执行其他函数
    ajax({
        type: 'number',
        method: 'GET',
        url: url + '/article/byAuthor',
        data: {
            authorId: id,
        },
        success: success,
    })

}
//获取用户收藏的文章
function userStar(id, success) {
    ajax({
        type: 'query',
        method: 'GET',
        url: url + '/article/getStar',
        data: {
            userId: id,
        },
        success: success,
    })
}
//获取用户点赞的文章
function userliked(id, success) {
    ajax({
        type: 'query',
        method: 'GET',
        url: url + '/article/getLike',
        data: {
            userId: id,
        },
        success: success,
    })
}

//获取用户关注的名单
function userfollow(id, success) {
    ajax({
        type: 'query',
        method: 'get',
        url: url + '/user/followerList',
        data: {
            userId: id,
        },
        success: success,
    })
}
// 获取用户粉丝名单
function userfan(id, success) {
    ajax({
        type: 'query',
        method: 'get',
        url: url + '/user/fanList',
        data: {
            userId: id,
        },
        success: success

    })
}

//根据文章id获取到文章作者
function otheruser(id, success) {
    ajax({
        type: 'query',
        method: 'get',
        url: url + '/article/byId',
        data: {
            articleId: id,
        },
        success: success,
    })
}

//获取用户被点赞和被收藏
function getlike(id, success) {
    ajax({
        type: 'query',
        method: 'get',
        url: url + '/notice/article/like',
        data: {
            userId: id,
        },
        success: success,
    })
}
function getstar(id, success) {
    ajax({
        type: 'query',
        method: 'get',
        url: url + '/notice/article/star',
        data: {
            userId: id,
        },
        success: success,
    })
}
//登出事件
function logout(userId, success) {
    ajax({
        type: 'formdata',
        method: 'post',
        url: url + '/logout',
        data: {
            userId: userId,
        },
        success: success,
    })
}
// 关注别人
function followother(userId, followerId, success) {
    ajax({
        type: 'formdata',
        method: 'post',
        url: url + '/user/follow',
        data: {
            userId: userId,
            followerId: followerId,
        },
        success: success,
    })
}
// 取关别人
function nofollowother(userId, followerId, success) {
    ajax({
        type: 'formdata',
        method: 'post',
        url: url + '/user/cancelFollow',
        data: {
            userId: userId,
            followerId: followerId,
        },
        success: success,
    })

}

// 喜欢文章
function articleLike(userId, articleId, success) {
    ajax({
        type: 'JSON',
        method: 'post',
        url: url + '/article/like',
        data: {
            userId: userId,
            articleId: articleId,
        },
        success: success,
    })

}
// 取消喜欢文章
function articleUnlike(userId, articleId, success) {
    ajax({
        type: 'JSON',
        method: 'post',
        url: url + '/article/unlike',
        data: {
            userId: userId,
            articleId: articleId,
        },
        success: success,
    })

}

//收藏文章
function articleStar(userId, articleId, success) {
    ajax({
        type: 'JSON',
        method: 'post',
        url: url + '/article/star',
        data: {
            userId: userId,
            articleId: articleId,
        },
        success: success,
    })


}

// 取消收藏文章
function articleUnstar(userId, articleId, success) {
    ajax({
        type: 'JSON',
        method: 'post',
        url: url + '/article/unstar',
        data: {
            userId: userId,
            articleId: articleId,
        },
        success: success,
    })

}

//根据文章id查找文章
function articlebyId(id, success) {
    ajax({
        type: 'query',
        method: 'get',
        url: url + '/article/byId',
        data: {
            articleId: id,
        },
        success: success,
    })

}
//根据文章id查找评论
function reviewbyArticle(id, pages, success) {
    ajax({
        type: 'query',
        method: 'get',
        url: url + '/review/byArticle',
        data: {
            articleId: id,
            pages: pages,
        },
        success: success,
    })

}
//瀑布流布局 
function waterFall() {
    // 设置container盒子的宽度
    // let container = document.getElementById(fatherbox);
    // 2. 设置每一个item元素的排列位置，暂定为2个
    // 存每一行盒子的高度
    let fatherbox = document.getElementsByClassName('main-list');
    let hrr = [];
    for (let j = 0; j < fatherbox.length; j++) {
        let item = fatherbox[j].getElementsByClassName('item');
        console.log(item);
        for (let i = 0; i < item.length; i++) {
            // 一行只放两个盒子
            if (i < 2) {
                item[i].style.top = "0px";
                item[i].style.left = i * item[0].offsetWidth + "px";
                hrr.push(item[i].offsetHeight);
            } else {
                // 第一行之后的
                let min = Math.min(...hrr);
                // 找到最小值的下标
                let index = hrr.indexOf(min);
                item[i].style.top = min + "px";
                item[i].style.left = index * item[0].offsetWidth + "px";
                // 每次添加完后就加上该盒子的高度，更新最小数值
                hrr[index] += item[i].offsetHeight;
                // 给父盒子添加高度
                if (i + 1 == item.length)
                    fatherbox[j].style.height = hrr[index] + "px";
            }
        }
    }
}

// 清除表单内的数据
function clearinput(options) {
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

//弹出操作成功或失败的函数
function alert(str, callback) {
    let unique = document.querySelector('#unique');
    let show = document.querySelector('#showhtml');

    show.innerText = str;
    unique.style.display = 'block';
    setTimeout(() => {
        unique.style.display = 'none';
        callback && callback();
    }, 1000)
}
//变透明函数
function opacitybox(obj, callback) {
    // 先清除以前的定时器，只保留当前的一个定时器执行
    clearInterval(obj.timer);
    obj.style.opacity = 0;
    let c = 0;
    let g = 100;
    //设置一个初始值100，每隔5ms减小以加快速度
    // var num = 0;
    obj.timer = setInterval(() => {
        let step = 1 / g;
        if (g > 10)
            g = g--;
        if (c >= 1) {
            // 停止动画
            clearInterval(obj.timer);
            callback && callback();
        }
        obj.style.opacity = c + step;
        c += step;
    }, 2);
}
//切换tab栏
function Clickchage(circle, tab) {
    for (let i = 0; i < circle.length; i++) {
        // 获取按钮,并给他添加一个自定义属性index,按顺序赋值
        circle[i].addEventListener('click', function () {
            // 获取到点击的是第几个按钮
            for (let j = 0; j < circle.length; j++) {
                tab[j].style.display = 'none';
                circle[j].className = '';
                // 利用排他思想先将按钮和对应盒子样式清空
            }
            opacitybox(tab[i]);
            tab[i].style.display = 'block';
            circle[i].className = 'current';
            // 让对应序号的盒子变成block,且给点击的按钮添加一个current属性
        });
    }
}
//点击相应的按钮后让首页限制在高度100vh,跳转到对应界面
function newindex(targetstr) {
    let ed = changeIndex.length - 1;
    let now = document.getElementById(changeIndex[ed]);
    let target = document.getElementById(targetstr);
    changeIndex.push(targetstr);

    now.classList.add("hidden");
    target.style.display = 'block';
}
// 实现点击能回退的功能
function returnto() {
    let ed = changeIndex.length - 1;
    let nowstr = document.getElementById(changeIndex[ed]);
    let targetstr = document.getElementById(changeIndex[ed - 1]);
    targetstr.classList.remove("hidden");
    nowstr.style.display = 'none';

    changeIndex.pop();
}

//轮播图函数
function carousel(obj, circle, autoplay) {
    // 给obj设置宽度
    let cwidth = obj.parentNode.offsetWidth;
    let width_obj = (obj.children.length + 1) * cwidth;
    obj.style.width = width_obj + 'px';
    let index = 0, num = 0, choose = 0;
    // obj.style.width=width_obj+1
    for (let i = 0; i < obj.children.length; i++) {
        // 创建一个小li 
        let li = document.createElement('li');
        // 记录当前小圆圈的索引号 通过自定义属性来做 
        li.setAttribute('index', i);
        // 把小li插入到ol
        circle.appendChild(li);
        //  小圆圈的排他思想
        circle.children[0].className = 'current';
        // 先给第一个圆点做current处理
        li.onclick = function () {
            for (let i = 0; i < circle.children.length; i++) {
                circle.children[i].className = '';
            }
            this.className = 'current';
            index = this.getAttribute('index');
            // 保证点击小图标后也不影响自动播放顺序
            num = index;
            choose = index;
            //保证每一次点击都让图片有过渡效果
            obj.style.transition = '0.5s ease';
            obj.style.left = -index * cwidth + 'px';
        }

    }

    // 这个函数让图片往右走，完成自动播放模块
    function arrow_right() {
        num++;
        choose++;
        // choose变量代表小圆点
        if (choose == obj.children.length - 1)
            choose = 0;
        obj.style.left = -num * cwidth + 'px';
        obj.style.transition = "0.5s ease";
        //加过渡的原因是切换到最后一张图的时候会把过渡取消掉
        for (let i = 0; i < circle.children.length; i++) {
            circle.children[i].className = '';
        }
        circle.children[choose].className = 'current';
        if (num == obj.children.length - 1) {
            num = 0;
            //添加定时器的原因是等待上次播放的动画结束
            setTimeout(function () {
                // 取消过渡 500毫秒之后切换第一张
                obj.style.transition = "none";
                obj.style.left = 0;
            }, 500);

        }

    }
    // 如果传递过来的值是true表明需要自动播放
    if (autoplay) {
        let first = obj.children[0].cloneNode(true);
        obj.appendChild(first);
        timer = setInterval(arrow_right, 2000);
        obj.addEventListener('mouseenter', function () {
            clearInterval(timer);
            timer = null;

        })
        // 保证鼠标经过按钮时也不会重启定时器
        circle.addEventListener('mouseenter', function () {
            clearInterval(timer);
            timer = null;
        })
        obj.addEventListener('mouseleave', function () {
            // 先关掉定时器！！！！！！
            clearInterval(timer);
            timer = setInterval(arrow_right, 2000);
        })
    }

}
