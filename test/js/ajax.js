// 将传递过来的对象转换成字符串
function resolveData(obj) {
    let arr = [];
    for (let k in obj) {
        let str = k + '=' + obj[k];
        arr.push(str);
    }
    return arr.join('&');
}
//对象转化为formdata数据
function objToFormdata(obj) {
    let formdata = new FormData();
    for (let k in obj) {
        formdata.append(k, obj[k]);
    }
    return formdata;
}



function ajax(options) {
    let qs = null;
    isSending = true;
    let xhr = new XMLHttpRequest();
    //将要发送的对象转化为查询字符串
    if (options.type.toUpperCase() == 'FORMDATA') {
        // qs = new FormData(options.data);
        // 如果传入表单则直接生成
        if (options.dataType && options.dataType == 'form')
            qs = new FormData(options.data);

        else
            qs = objToFormdata(options.data);



    }
    else if (options.type.toUpperCase() == 'JSON') {
        qs = JSON.stringify(options.data);

    }
    else
        qs = resolveData(options.data);


    if (options.method.toUpperCase() === 'GET') {
        // 发起GET请求
        xhr.open(options.method, options.url + '?' + qs);
        xhr.send();
    } else if (options.method.toUpperCase() === 'POST') {
        // 发起POST请求
        xhr.open(options.method, options.url);
        if (options.type.toUpperCase() == 'JSON')
            xhr.setRequestHeader('Content-Type', 'application/json'); xhr.send(qs);
    }
    xhr.onreadystatechange = function () {
        // xhr.timeout = 300;
        // xhr.ontimeout = function () {
        //     console.log('请求超时');
        // }
        if (xhr.readyState === 4 && xhr.status === 200) {
            // if (isSending) xhr.abort();
            let result = JSON.parse(xhr.responseText);
            options.success(result);
        }
        // else {
        //     let result = JSON.parse(xhr.responseText);
        //     options.error(result);
        // }
    }

}



// 封装一个登录查询的函数