// 文章详情页和评论
// 打开文章详情页
// let user = 7;
// let art = 99;
// articleDetail(44, 222);
// articleDetail();
// articleReview();
function articleDetail() {

    // 获取文章基本信息
    const authorId = pageAuthorid;
    const articleId = pageArticleid;
    //获取评论信息
    articleReview(articleId);
    // 获取当前用户的信息
    let userId = localStorage.getItem('MyuserId');
    //获取页面信息
    let pageAuthorAvatar = document.querySelector('#page-userAva-author');
    let pageAuthorName = document.querySelector('#page-userNick');
    let pageFollow = document.querySelector('#page-followbtn');
    let pageTitle = document.querySelector('#page-title');
    let pageContent = document.querySelector('#page-content');
    let pageTags = document.querySelector('#page-tag');
    let pageDate = document.querySelector('#page-date');
    let padeDislike = document.querySelector('#page-dislike');
    //获取关于轮播图的模块
    let pageImages = document.getElementById('page-content-img');
    let pageImagesCircle = document.getElementById('page-circle');
    let pageReviewNum = document.querySelectorAll('.page-review-num');

    let pageStarBtn = document.getElementById('page-star-btn');
    let pageLikeBtn = document.getElementById('page-like-btn');

    let pageLikeNum = document.getElementById('page-like-num');
    let pageStarNum = document.getElementById('page-star-num');

    let pageReviewBtn = document.querySelector('.page-review-btn');
    let pageUserInfo = document.getElementById('page-userbtn');

    // 清空一下页面信息
    pageImages.innerHTML = '';
    pageTags.innerHTML = '';
    pageImagesCircle.innerHTML = '';
    pageLikeBtn.classList.remove('current');
    pageStarBtn.classList.remove('current');
    // 把文章信息导入到页面当中
    articlebyId(articleId, res => {
        let { content, available, images, likes, postDate, reviews, stars, tags, title, likerList, starerList } = res.article;
        pageTitle.innerText = title;
        pageContent.innerText = content;

        console.log(reviews);
        // 把tag丢进盒子里
        pageTags.innerHTML = '';
        const tag_fragment = document.createDocumentFragment();
        tags.forEach(value => {
            let span = document.createElement('span');
            span.innerHTML = '#' + value;
            tag_fragment.appendChild(span);
        });
        pageTags.appendChild(tag_fragment);

        // 处理一下日期格式然后给丢进去
        let str = postDate.split("T");
        pageDate.innerText = str[0];

        //收藏数和点赞数，评论数
        for (let i = 0; i < pageReviewNum.length; i++) {
            pageReviewNum[i].innerText = reviews;
        }
        pageLikeNum.innerText = likes;
        pageStarNum.innerText = stars;

        //把照片丢进去
        const img_fragment = document.createDocumentFragment();
        images.forEach(value => {
            let li = document.createElement('li');
            let img = document.createElement('img');
            img.src = value;
            li.appendChild(img);
            img_fragment.appendChild(li);
        })
        pageImages.appendChild(img_fragment);
        //实现轮播图
        carousel(pageImages, pageImagesCircle, false);

        // 如果有点赞或收藏则颜色变红
        if (likerList.some(value => value == userId)) {
            pageLikeBtn.classList.add('current');
        }

        if (starerList.some(value => value == userId)) {
            pageStarBtn.classList.add('current');
        }


    })
    userBase(authorId, res => {
        //判断关注情况按钮
        let judge = 0;
        let { userId, avatar, nickname, fans } = res.user;
        pageUserInfo.setAttribute('authorId', userId);
        // 查询是否关注该用户   
        if (fans.some(value => value == userId)) {
            pageFollow.className = 'follow';
            pageFollow.innerText = '已关注';
            judge = 1;
        }
        else {
            pageFollow.className = 'nofollow';
            pageFollow.innerText = '未关注';
            judge = 0;
        }
        //关注和取消关注
        // 节流按钮 
        let followflag = true;
        pageFollow.onclick = () => {
            // 获取表单数据
            // let form = pageFollow.nextElementSibling;
            let userId = localStorage.getItem('MyuserId');
            let otheruser = localStorage.getItem('authorId');
            let inputs = pageFollow.nextElementSibling.getElementsByTagName('input')

            inputs[1].value = authorId;
            inputs[0].value = userId;
            if (judge == 1) {
                if (followflag) {
                    followflag = false;
                    nofollowother(userId, otheruser, (res) => {
                        console.log(res);
                        pageFollow.className = 'nofollow';
                        pageFollow.innerText = '未关注';
                        judge = 0;
                        followflag = true;
                    })
                }

            }

            else {
                if (followflag) {
                    followflag = false;
                    followother(userId, otheruser, (res) => {
                        console.log(res);
                        pageFollow.className = 'follow';
                        pageFollow.innerText = '已关注';
                        judge = 1;
                        followflag = true;
                    })
                }
            }
        }


        // 将头像和昵称放到页面
        pageAuthorAvatar.src = avatar;
        pageAuthorName.innerText = nickname;

    })
}

// 文章评论内容
// 把评论内容的父亲获取过来

function reviewitem(avatar, nickname, content, postDate) {
    let item = `
                 <li>
                    <img src="${avatar}" alt="">
                     <h3>${nickname}</h3>
                     <p>${content}</p>
                     <div>${postDate}</div>
                 </li>`;
    return item;

}
function articleReview(articleId) {

    let pageReview = document.getElementById('page-review-content');
    pageReview.innerHTML = '';
    reviewbyArticle(articleId, 0, (res) => {
        let { reviews } = res;
        console.log(res);
        let ul = document.createElement('ul');
        // 获取一下评论列表
        reviews.forEach(value => {
            let { authorId, content, likes, postDate, replyToArticleId, replyToUserId, reviewList } = value;
            userBase(authorId, (res) => {
                let { avatar, nickname } = res.user;
                let item = reviewitem(avatar, nickname, content, postDate.split('T')[0])
                ul.insertAdjacentHTML('beforeend', item);
                if (reviewList.length) {
                    let ulsecond = document.createElement('ul');
                    reviewList.forEach(value => {
                        let { authorId, content, likes, postDate, replyToArticleId, replyToUserId, reviewList } = value;
                        userBase(authorId, (res) => {
                            let { avatar, nickname } = res.user;
                            let item = reviewitem(avatar, nickname, content, postDate.split('T')[0])
                            ulsecond.insertAdjacentHTML('beforeend', item);
                        })
                    })

                    ul.appendChild(ulsecond);
                }
            })

        })
        pageReview.appendChild(ul);


    });
}

// 点击事件
let starbtn = document.getElementById('page-star-btn');
let likebtn = document.getElementById('page-like-btn');

// throttle是节流函数，点击500ms后才能再次点击
likebtn.addEventListener('click', throttle(() => {
    console.log(1);
    // 代表点赞的数目
    let num = likebtn.children[1];
    // console.log(localStorage.getItem('authorId'));
    let userId = localStorage.getItem('MyuserId');
    let articleId = pageArticleid;
    // 节流按钮

    if (likebtn.classList.contains('current')) {
        articleUnlike(userId, articleId, (res) => {
            likebtn.classList.remove('current');
            num.innerText--;

        })
    }
    else {
        articleLike(userId, articleId, (res) => {
            likebtn.classList.add('current');
            num.innerText++;
        })
    }
}, 500))

starbtn.addEventListener('click', throttle(() => {
    let num = starbtn.children[1];
    // console.log(localStorage.getItem('authorId'));
    let userId = localStorage.getItem('MyuserId');
    let articleId = pageArticleid;
    // 节流按钮
    if (starbtn.classList.contains('current')) {
        articleUnstar(userId, articleId, (res) => {
            starbtn.classList.remove('current');
            num.innerText--;
        })
    }
    else {
        articleStar(userId, articleId, (res) => {
            starbtn.classList.add('current');
            num.innerText++;

        })
    }
}, 500))

let pageUserInfo = document.getElementById('page-userbtn');
pageUserInfo.addEventListener('click', function (e) {
    pageAuthorid = this.getAttribute('authorid');
    indexinit('user');
    newindex('user');
})
// 366