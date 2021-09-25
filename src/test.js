let fs = require('fs');

//Buffer测试
fs.readFile('C:\\Users\\cgz\\Pictures\\chu-logo.png', function (err, originBuffer) {
    console.log(Buffer.isBuffer(originBuffer));

    // 生成图片2(把buffer写入到图片文件)
    fs.writeFile('C:\\Users\\cgz\\Pictures\\chu-logo2.png', originBuffer, function (err) {
        if (err) {
            console.log(err)
        }
    });

    let base64Img = originBuffer.toString('base64');  // base64图片编码字符串

    console.log(base64Img);

    let decodeImg = new Buffer(base64Img, 'base64');  // new Buffer(string, encoding)

    console.log(Buffer.compare(originBuffer, decodeImg));  // 0 表示一样

    // 生成图片3(把base64位图片编码写入到图片文件)
    fs.writeFile('C:\\Users\\cgz\\Pictures\\chu-logo3.png', decodeImg, function (err) {
        if (err) {
            console.log(err)
        }
    });
});