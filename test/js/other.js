function agree(str, name, avatar, background) {
    let item = `    <li class="newitem">
                        <div class="newitem-content">
                            <div class="otheruser">
                                <div class="otheruser-avatarbox">
                                    <img src="${avatar}" alt="" id="otheruser-avatar" class="otheruser-avatar">
                                </div>

                                <div class="otheruser-infor">
                                    <h4 class="otheruser-name">${name}</h4>
                                    <p class="agreecontent">${str}</p>
                                </div>

                            </div>
                            <div class="otheruser-bg">
                                <img src="${background}" alt="" class="otheruser-bgimage" id="otheruser-bgimage">
                            </div>
                        </div>
                    </li>
                `
    return item;

}
// 编辑资料界面
class editfull {
    constructor(obj) {
        this.url = 'http://175.178.193.182:8080';
        // 声明变量
        this.edit = document.querySelector(obj);
        //首页
        this.index = document.querySelector('#index');
        // 编辑资料按钮
        this.editbtn = document.querySelector('#user-edit');

        // 返回按钮
        this.backbtn = this.edit.querySelector('.back-previous');

        //存放用户信息的地方
        this.avatar = document.querySelector('#avatar-img');
        this.nickname = document.querySelector('#edit-name');
        this.gender = document.querySelector('#edit-gender');
        this.description = document.querySelector('#edit-desc');
        this.area = document.querySelector('#edit-area');
        this.birthday = document.querySelector('#edit-birth');
        // 保存修改按钮
        this.editSubmit = document.querySelector('#edit-submit');

        //绑定保存修改按钮
        this.editInput = document.querySelectorAll('.edit-right')
        //绑定修改性别的按钮
        this.editGenderBtn = document.querySelector('.edit-right-gender');
        this.editGenderInput = document.querySelectorAll('.gender-input');

        //绑定头像的按钮
        this.avatarinput = document.querySelector('#file-btn-img');
        // 表单
        this.formBase = document.querySelector('#editBase');
        this.formImages = document.querySelector('#formImages');
        this.nameInput = document.querySelector('#editInput-nickn');
        this.birthInput = document.querySelector('#editInput-birth');
        this.areaInput = document.querySelector('#editInput-area');
        this.descInput = document.querySelector('#editInput-desc');

        //上传成功后的提示性文本
        // this.genderInput = document.querySelectorAll('')
        this.init();
    }
    // 绑定事件
    init() {
        this.editbtn.onclick = this.begin.bind(this);
        // 循环绑定点击事件
        for (let i = 0; i < this.editInput.length; i++) {
            this.editInput[i].onclick = this.editUnique;
        }
        this.editGenderBtn.onclick = this.editGender;
        this.editSubmit.onclick = this.changeInfor.bind(this);
        this.avatarinput.onchange = this.showavatar.bind(this);
        // 保存编辑信息
    }
    //打开编辑资料界面
    begin() {
        let id = localStorage.getItem('MyuserId');
        window.URL.revokeObjectURL(this.avatar.src);
        // 获取信息
        // 如果能找到信息则不用向接口查找
        //第一个括号内保证：只有第一次点击编辑资料才会向网络获取信息
        // 第二个括号内保证，当用户id发生改变时重新向网络发送信息
        if ((this.editinfor == '' || !this.editinfor) || (!this.changeid || this.changeid != id)) {
            ajax({
                type: 'query',
                method: 'GET',
                url: this.url + '/user/baseInfo',
                data: {
                    userId: id,
                },
                success: (res) => {
                    this.changeid = id;
                    this.baseinfor(res.user);
                    this.editinfor = res.user;
                    //初始化编辑资料页面的内容
                    this.editinit(this.editinfor);
                    //初始化编辑资料里性别的内容
                    this.genderinit(this.editinfor);

                    newindex(this.index, this.edit);
                },
            })

        }
        else {
            this.baseinfor(this.editinfor);
            newindex(this.index, this.edit);
        }
    }
    // 资料页内容的初始化
    editinit(res) {
        this.nameInput.value = res.nickname;
        this.birthInput.value = res.birthday;
        this.areaInput.value = res.area;
        this.descInput.value = res.description;
    }
    genderinit(res) {
        for (let i = 0; i < this.editGenderInput.length; i++) {
            let label = this.editGenderInput[i].nextElementSibling;
            if (res.gender == this.editGenderInput[i].value) {
                this.gender.innerHTML = label.innerHTML;
            }
        }

    }
    // 将传输过来的数据放到对应位置
    baseinfor(res) {
        this.avatar.src = res.avatar;
        this.birthday.innerHTML = res.birthday;
        this.description.innerHTML = res.description;
        this.area.innerHTML = res.area;
        this.nickname.innerHTML = res.nickname;
        if (res.gender)
            this.gender.innerHTML = '男';
        else
            this.gender.innerHTML = '女';
    }

    // 点击按钮后弹出修改界面
    editUnique() {
        let str = this.innerHTML;
        // 获取里面存放的节点
        let unique = this.nextElementSibling;
        let uniquebox = unique.children[0];
        let input = unique.querySelector('input');
        let btn = unique.querySelector('button');
        // 让修改界面出现
        unique.style.display = 'block';
        //鼠标自动聚焦
        input.focus();
        // 点击外部区域退出
        unique.onclick = (e) => {
            unique.style.display = 'none';
            input.value = str;
        }
        uniquebox.onclick = (e) => {
            e.stopPropagation();//阻止冒泡
        }
        btn.onclick = () => {
            this.innerHTML = input.value;
            unique.style.display = 'none';

        }
        input.onkeyup = function (e) {
            if (e.keyCode === 13)
                btn.click();
        }

    }

    //修改性别
    editGender() {
        let str = this.innerHTML;
        // 获取里面存放的节点
        let unique = this.nextElementSibling;
        let uniquebox = unique.children[0];
        let input = unique.querySelectorAll('input');

        for (let i = 0; i < input.length; i++) {
            if (str == input[i].nextElementSibling.innerHTML)
                input[i].checked = 'check';
        }
        // 获取被选中的选项

        // 让修改界面出现
        unique.style.display = 'block';
        // 点击外部区域退出
        unique.onclick = (e) => {
            for (let i = 0; i < input.length; i++) {
                let check;
                if (input[i].checked) {
                    check = input[i].nextElementSibling.innerHTML;
                    this.innerHTML = check;
                }
            }

            unique.style.display = 'none';
        }
        uniquebox.onclick = (e) => {
            e.stopPropagation();//阻止冒泡
        }

        // 关闭盒子时,将选中的值赋给页面

    }

    // 上传头像后显示头像信息
    showavatar() {
        let file = this.avatarinput.files;
        console.log(file);
        for (let i = 0; i < file.length; i++) {
            this.avatar.src = window.URL.createObjectURL(file[i]);
            this.avatar.onload = function () {
                window.URL.revokeObjectURL(this.src);
            }
        }
    }

    //上传数据到接口
    changeInfor() {
        // 获取隐藏的input传递userid给他
        let disappear = document.querySelectorAll('.disappear');
        for (let i = 0; i < disappear.length; i++) {
            disappear[i].value = localStorage.getItem('MyuserId');
        }

        // 确保有上传头像才上传数据
        if (this.avatarinput.files.length != 0) {
            ajax({
                type: 'formdata',
                method: 'post',
                url: this.url + '/user/upload',
                data: this.formImages,
                dataType:'form',
                success: (res) => {
                    // 这一步的目的是让下一次点击编辑资料可以更新数据
                    this.editinfor = '';
                    disappear.value = '';
                    indexinit();
                }
            })

        }
        ajax({
            type: 'formdata',
            method: 'post',
            url: this.url + '/user/edit',
            data: this.formBase,
            dataType:'form',
            success: (res) => {
                // 这一步的目的是让下一次点击编辑资料可以更新数据
                let { status, msg } = res;
                if (status == 200 || status == 400) {
                    this.editinfor = '';
                    disappear.value = '';
                    alert('保存成功');
                    indexinit();
                }
                else
                    alert('保存出错，请检查数据');
            }
        })

    }

}
new editfull('#edit');
