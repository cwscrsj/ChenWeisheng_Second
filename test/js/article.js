// 写文章的页面
let that = null;
class article {
    constructor(obj) {
        // that代表原始函数的this
        that = this;
        // 绑定节点
        this.url = 'http://175.178.193.182:8080';
        this.index = document.querySelector('#index');
        this.articleindex = document.querySelector('#article');
        //打开页面的按钮
        this.startArticleBtn = document.querySelector('#article-icon');



        this.fileBtn = document.querySelector('#file-btn');
        this.inputFiles = document.querySelector('.input-files');
        // 存放图片的地址
        this.list = this.inputFiles.querySelector('ul');

        //获取弹窗
        this.tagunique = document.querySelector('#tag-unique');
        //获取点击弹窗的按钮
        this.tagbtn = document.querySelector('#tag-btn');
        this.expInfo = document.querySelector('#exo-tag');

        //发布文章按钮
        this.submitbtn = document.querySelector('#article-submit-btn');
        //获取所有内容
        this.images = [];
        this.tags = [];
        this.input = this.tagunique.querySelector('input');
        // 获取弹窗
        this.init();
    }

    init() {
        this.updata();
        this.fileBtn.onchange = this.showimg.bind(this);
        for (let i = 0; i < this.deletebtn.length; i++) {
            this.deletebtn[i].onclick = this.deleteimg;
            // 给被点击的选项添加属性
            this.deletebtn[i].index = i;
        }
        this.tagbtn.onclick = this.unique.bind(this);
        this.submitbtn.onclick = this.submit.bind(this);
        this.startArticleBtn.onclick = this.articleInit.bind(this);
    }
    // 更新数据的盒子
    updata() {
        this.deletebtn = this.list.querySelectorAll('i');
        this.title = document.querySelector('#article-title').value;
        this.content = document.querySelector('#article-info').value;
        this.expTag = document.querySelector('#exp-tag');
    }

    showimg() {
        let formimg = document.querySelector('#form-img');
        let files = formimg.querySelector('input').files;
        // 确保有选择文件才开始
        if (files.length != 0) {
            ajax({
                type: 'formdata',
                method: 'post',
                url: this.url + '/upload/image',
                data: formimg,
                success: (res) => {
                    let { url } = res;
                    this.images.push(url);
                    this.newimg(url);
                    console.log(this.images);
                    this.init();
                }
            })

        }
    }
    newimg(url) {
        let li = document.createElement("li");
        this.list.appendChild(li);
        let img = document.createElement("img");
        let i = document.createElement('i');
        img.src = url;
        li.appendChild(img);
        li.appendChild(i);
    }
    // 删除图片
    deleteimg(e) {
        // 删除节点
        let index = this.index;
        this.parentNode.remove();
        //删除需要提交到网络的图片
        that.images.splice(this.index, 1);
    }
    articleInit() {
        this.clear();
        newindex('index', 'article');
    }
    // 显示弹窗并预览话题内容
    unique() {
        this.tagunique.style.display = 'block';
        let uniquebox = this.tagunique.querySelector('.unique-box');
        let btn = this.tagunique.querySelector('button');
        //鼠标自动聚焦
        this.input.focus();
        // 点击外部区域退出
        this.tagunique.onclick = (e) => {
            this.tagunique.style.display = 'none';
        }
        uniquebox.onclick = (e) => {
            e.stopPropagation();//阻止冒泡
        }
        btn.onclick = () => {
            this.tagunique.style.display = 'none';
            // 将输入内容放到下方
            let str = this.input.value;
            let chars = str.split(' ');
            this.tags = chars;
            this.expTag.innerHTML = '';
            for (let i = 0; i < chars.length; i++) {
                let span = document.createElement('span');
                span.innerText = '#' + chars[i];
                this.expTag.appendChild(span);
            }

        }
        this.input.onkeyup = function (e) {
            if (e.keyCode === 13)
                btn.click();
        }
    }

    // 清除页面内的所有数据（若要保存草稿不执行该函数）
    clear() {
        // 存放照片的地方
        this.init();
        this.list.innerHTML = '';
        this.images = [];
        this.expTag.innerHTML = '';
        this.input.value = '';
        this.tags = [];
    }
    //发布笔记
    submit() {
        // 获取相关信息
        this.init();
        if (this.tilte != '' && this.content != '') {
            ajax({
                type: 'json',
                method: 'post',
                url: this.url + '/article',
                data: {
                    userId: localStorage.getItem('MyuserId'),
                    title: this.title,
                    content: this.content,
                    tags: this.tags,
                    images: this.images,
                },
                success: (res) => {
                    let { status, msg } = res;
                    if (status == 200) {
                        alert('发布成功', () => {
                           indexinit();
                        })
                    }
                    else {
                        alert('发布失败，请检查是否填写标题与正文');
                    }
                }
            })
        }

        else
            alert('请填写标题与正文');
    }
}

new article()