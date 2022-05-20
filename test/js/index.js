
let quitlogin_btn = document.querySelector('#quit-login');
let index = document.querySelector('#index');
let login_index = document.querySelector('#login');
let follow_index = document.querySelector('#follow');
let fan_index = document.querySelector('#fans');
let agreeStar_index = document.querySelector('#agreeStar');
let page = document.querySelector('#page');

// 获得首页文章
function indexArticle() {
    let mainlist = document.querySelector('.index-content').querySelectorAll('.main-list');
    getHomePage((res) => {
        console.log(res);
        let { pages } = res;
        let arr = [];
        let i = 0;
        for (let value in pages) {
            let list = pages[value];
            let ul = document.createElement('ul');
            const fragment = document.createDocumentFragment();
            list.forEach((value) => {
                // console.log(value);
                let { avatar, title, images, likes, authorName, articleId, authorId } = value;
                // img, authorName, title, avatar, like, articleId, authorId
                let itemsum = item1(images[0], authorName, title, avatar, likes, articleId, authorId);
                // console.log(ul.nodeType);
                ul.insertAdjacentHTML('beforeend', itemsum);
            })
            fragment.appendChild(ul);
            mainlist[i].appendChild(fragment);

            current(mainlist[i]);
            i++;
        }
    })
}

indexArticle();

// 个人中心页面初始化
function indexinit() {
    // 清除原先的所有数据
    //获取存放个人文章的节点
    // 个人页面的接口
    let avatarBtn = document.querySelector('#man-avatar');
    let nicknameBtn = document.querySelector('#man-userName');
    let follerBtn = document.querySelector('#man-follower');
    let fansBtn = document.querySelector('#man-fans');
    // 退出登录的按钮
    // 取存放文章item的地方
    let noteArticles = document.querySelector('.man-list').querySelectorAll('.main-list')
    let NoteUser = document.querySelector('#user-note-item');
    let NoteStar = document.querySelector('#user-star-item');
    let NoteAgree = document.querySelector('#user-agree-item');

    let followlengthBtn = document.querySelector('#man-follower');
    let fanlengthBtn = document.querySelector('#man-fans');
    let agreeStarLengthBtn = document.querySelector('#man-agree');

    let id = localStorage.getItem('MyuserId');
    // 获取用户基本信息与笔记内容

    // 清除个人中心所有数据
    noteArticles = [...noteArticles];
    noteArticles.forEach((value) => {
        value.innerHTML = '';
    })
    avatarBtn.src = '';
    nicknameBtn.innerText = '';
    follerBtn.innerText = 0;
    fansBtn.innerText = 0;
    agreeStarLengthBtn.innerText = 0;
    let i = 0;
    // 退出登录的按钮

    //把数据传输到个人中心
    userBase(id, (res) => {
        let { avatar, fans, follows, nickname } = res.user;
        avatarBtn.src = avatar;
        nicknameBtn.innerText = nickname;
        follerBtn = follows.length;
        fansBtn = fans.length;

        userArticles(id, (res) => {
            let { articles } = res;
            let ul = document.createElement('ul');
            ul.id = 'ul-note';
            articles.forEach((value) => {
                let { likes, images, title, articleId } = value;
                let nickname = nicknameBtn.innerText;
                let avatar = avatarBtn.src;
                // img, authorName, title, avatar, like, articleId
                let item = item1(images[0], nickname, title, avatar, likes, articleId, id)
                ul.insertAdjacentHTML('beforeend', item);
            })
            NoteUser.appendChild(ul);
            current(NoteUser);
        })

    })

    //获取用户收藏的文章
    userStar(id, (res) => {
        let { staredArticles } = res;
        let ul = document.createElement('ul');
        ul.id = 'ul-Star';
        for (let i = 0; i < staredArticles.length; i++) {
            let { likes, images, title, articleId, authorId } = staredArticles[i];
            // 根据查询的authorid查询用户信息
            userBase(authorId, (res) => {
                let { nickname, avatar } = res.user;
                let item = item1(images[0], nickname, title, avatar, likes, articleId, authorId)
                ul.insertAdjacentHTML('beforeend', item);
                if (i + 1 == staredArticles.length)
                    NoteStar.appendChild(ul);
                current(NoteStar);
            })
        }


    })

    //获取用户赞过的文章
    userliked(id, (res) => {
        let { likedArticles } = res;
        let ul = document.createElement('ul');
        ul.id = 'ul-Agree';
        for (let i = 0; i < likedArticles.length; i++) {
            let { likes, images, title, articleId, authorId } = likedArticles[i];
            userBase(authorId, (res) => {
                let { nickname, avatar } = res.user;
                let item = item1(images[0], nickname, title, avatar, likes, articleId, authorId);

                ul.insertAdjacentHTML('beforeend', item);

                if (i + 1 == likedArticles.length) {
                    NoteAgree.appendChild(ul);
                }
                current(NoteAgree);
            })
        }
    })
    //获取用户关注的数目
    userfollow(id, (res) => {
        let length = res.followsList.length;
        followlengthBtn.innerText = length;
    })

    //获取用户粉丝数目
    userfan(id, (res) => {
        let length = res.fansList.length;
        fanlengthBtn.innerHTML = length;
    })

    //获取用户点赞数和收藏数
    getstar(id, (res) => {
        i += res.star.length;
        agreeStarLengthBtn.innerHTML = i;
    })
    getlike(id, (res) => {
        i += res.like.length;
        agreeStarLengthBtn.innerHTML = i;
    })

}

// 点击某个item进入文章详情页
function current(father) {
    let item = father.getElementsByClassName('item');
    for (let i = 0; i < item.length; i++) {
        item[i].onclick = function (e) {
            let authorId = this.getAttribute('authorid');
            let articleId = this.getAttribute('articleId');
            console.log('用户' + authorId, '文章' + articleId);
            localStorage.removeItem('articleId', 'authorId');
            window.localStorage.setItem('articleId', articleId);
            window.localStorage.setItem('authorId', authorId);
            newindex(index, page);
            articleDetail();
            articleReview();
        };
    }
}

// 退出登录事件
quitlogin_btn.addEventListener('click', function () {
    let userId = localStorage.getItem('MyuserId');
    logout(userId, (res) => {
        // 阻止原页面的滑动
        index.classList.add("hidden");
        alert(res.msg, (res) => {
            newindex(index, login_index);
            localStorage.clear();

        })
    })

})

// 点击关注或粉丝列表获取对应数据
let userId = localStorage.getItem('MyuserId');
console.log(userId);

// 关注详情页
function followerDetail(MyuserId = localStorage.getItem('MyuserId')) {
    // 每次打开关注列表都会清空之前数据
    let list = document.getElementById('follow-list');

    list.innerHTML = '';
    userfollow(MyuserId, (res) => {
        const fragment = document.createDocumentFragment();
        res.followsList.forEach(value => {
            let { avatar, nickname, userId: Id } = value;
            let li = document.createElement('li');
            // 初始化li的类目和自定义属性
            li.className = 'newitem';
            li.setAttribute('userId', userId);

            //利用模板字符串将数据放到里面
            let itemsum = followitem(Id, avatar, nickname);
            li.innerHTML = itemsum;

            //获取关注的盒子
            let box = li.children[0].children[1];

            //获取粉丝名单
            userfan(MyuserId, (res) => {
                let arr = [];
                res.fansList.forEach(value => {
                    arr.push(value.userId);
                })

                // 这一步确认是否互相关注
                if (arr.some(value => value === Id)) {
                    box.innerText = '互相关注';
                    box.classList.add('concern');
                }

                else {
                    box.innerText = '已关注';
                }

            })
            fragment.appendChild(li);
        })
        list.append(fragment);
        // 进入点击的监听事件
        followOrNot(list, 'follow');
    })


}
// 粉丝详情页面
function fansDetail(MyuserId = localStorage.getItem('MyuserId')) {
    let list = document.getElementById('fans-list');

    list.innerHTML = '';
    userfan(MyuserId, (res) => {
        const fragment = document.createDocumentFragment();
        res.fansList.forEach(value => {
            let { avatar, nickname, userId: Id } = value;
            let li = document.createElement('li');
            // 初始化li的类目和自定义属性
            li.className = 'newitem';
            li.setAttribute('userId', userId);

            //利用模板字符串将数据放到里面
            let itemsum = followitem(Id, avatar, nickname);
            li.innerHTML = itemsum;

            //获取粉丝的盒子
            let box = li.children[0].children[1];

            //获取关注名单
            userfollow(MyuserId, (res) => {
                let arr = [];
                res.followsList.forEach(value => {
                    arr.push(value.userId);
                })

                // 这一步确认是否互相关注
                if (arr.some(value => value === Id)) {
                    box.innerText = '互相关注';
                    box.classList.add('concern');
                }

                else {
                    box.innerText = '未关注';
                }

            })
            fragment.appendChild(li);
        })
        list.append(fragment);
        followOrNot(list, 'fan');
    })

}
//用于取关和关注的函数
function followOrNot(parentNode, judge) {
    let item = parentNode.getElementsByClassName('eachfollow');
    for (let i = 0; i < item.length; i++) {
        if (judge == 'follow')
            item[i].onclick = clickFollow;
        else
            item[i].onclick = clickFan;
    }

}

// 关注页面的点击按钮
function clickFollow() {
    let manId = this.getAttribute('userid');
    let userId = localStorage.getItem('MyuserId');
    // 获取父节点，取关时才能删除
    let father = this.parentNode.parentNode;
    nofollowother(userId, manId, (res) => {
        alert('取消关注成功', () => {
            father.remove();
        });
    })

}

//粉丝页面的点击按钮
function clickFan() {
    let manId = this.getAttribute('userid');
    let userId = localStorage.getItem('MyuserId');
    // 获取父节点，取关时才能删除
    let father = this.parentNode.parentNode;
    if (this.classList.contains('concern')) {
        nofollowother(userId, manId, (res) => {
            console.log(res);
            alert('取消关注成功', () => {
                this.innerText = '未关注';
                this.classList.remove('concern');
            })
        })
    }
    else {
        followother(userId, manId, (res) => {
            console.log(res);
            alert('关注成功', () => {
                this.innerText = '互相关注';
                this.classList.add('concern');
            })
        })
    }
}

// 打开关注详情页
let followbtn = document.getElementById('followbtn');
followbtn.addEventListener('click', () => {
    followerDetail();
    newindex(index, follow_index);
});
//打开粉丝详情页
let fansbtn = document.getElementById('fansbtn');
fansbtn.addEventListener('click', () => {
    fansDetail();
    newindex(index, fan_index);

})

// 打开点赞与收藏详情页
let agreeStarbtn = document.getElementById('agreeStarbtn');
agreeStarbtn.addEventListener('click', () => {
    newindex(index, agreeStar_index)
    agreeStarDetail();
})


// 点赞与收藏详情页
function agreeStarDetail(MyuserId = localStorage.getItem('MyuserId')) {
    let agreeList = document.getElementById('agree-list');
    let starList = document.getElementById('star-list');

    agreeList.innerHTML = '';
    starList.innerHTML = '';
    // 获取点赞列表
    getlike(MyuserId, (res) => {
        const fragment = document.createDocumentFragment();
        let { like } = res;
        like.forEach(value => {

            const { articleId, images } = value.articleInfo;
            const { nickname, avatar } = value.userInfo;
            let li = document.createElement('li');
            li.setAttribute('articleId', articleId);
            li.innerHTML = agreeStarItem(avatar, nickname, '赞了你的笔记', images[0]);
            console.log(li);
            fragment.appendChild(li);
        })
        agreeList.append(fragment);
        // console.log(res);
    })

    //获取收藏列表
    getstar(MyuserId, (res) => {
        const fragment = document.createDocumentFragment();
        let { star } = res;
        star.forEach(value => {

            const { articleId, images } = value.articleInfo;
            const { nickname, avatar } = value.userInfo;
            let li = document.createElement('li');
            li.setAttribute('articleId', articleId);
            li.innerHTML = agreeStarItem(avatar, nickname, '收藏了你的笔记', images[0]);
            console.log(li);
            fragment.appendChild(li);
        })
        starList.append(fragment);
        // console.log(res);

    })
}
// agreeStarDetail();
// fansDetail();

// let arr = [];
// arr.push(fan_index);
// console.log(arr[length]);
// newindex(index,arr[length])