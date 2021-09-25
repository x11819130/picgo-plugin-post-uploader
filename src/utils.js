/**
 * 35字节 1像素黑点
 */
const minGifImage = Buffer.from([71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 5, 4, 4, 0,
    0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59])

/**
 * 分析文件头获取文件后缀, 不识别的将返回空
 * @param fileBuffer 文件数据Buffer 可以只要开头部分 比如10位
 * @returns string
 */
const getSuffixFromBuffer = fileBuffer => {
    const imageBufferHeaders = [
        {bufBegin: Buffer.from([0xff, 0xd8]), suffix: 'jpg'},
        {bufBegin: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), suffix: 'png'},
        {bufBegin: Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]), suffix: 'gif'},
        {bufBegin: Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]), suffix: 'gif'},
        {bufBegin: Buffer.from([0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x20, 0x20]), suffix: 'ico'},
        {bufBegin: Buffer.from([0x42, 0x4d]), suffix: 'bmp'}
        // {bufBegin: [0x00, 0x00, 0x02, 0x00, 0x00], suffix: 'tga'},
        // {bufBegin: [0x00, 0x00, 0x10, 0x00, 0x00], suffix: 'rle'},
        // {bufBegin: [0x0a], suffix: 'pcx'},
        // {bufBegin: [0x49, 0x49], suffix: 'tif'},
        // {bufBegin: [0x4d, 0x4d], suffix: 'tif'},
        // {bufBegin: [0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x20, 0x20],suffix: 'cur'},
        // {bufBegin: [0x46, 0x4f, 0x52, 0x4d], suffix: 'iff'},
        // {bufBegin: [0x52, 0x49, 0x46, 0x46], suffix: 'ani'}
    ];
    for (const imageBufferHeader of imageBufferHeaders) {
        let isEqual;
        // 判断标识头前缀
        if (imageBufferHeader.bufBegin) {
            isEqual = imageBufferHeader.bufBegin.equals(fileBuffer.slice(0, imageBufferHeader.bufBegin.length));
        }
        if (isEqual) {
            return imageBufferHeader.suffix;
        }
    }
    // 未能识别到该文件类型
    return '';
}

/**
 * 直接返回文件后缀
 * @param fileName
 * @returns string
 */
const getSuffix = fileName => {
    let index = fileName.lastIndexOf('.');
    return index === -1 ? '' : fileName.substring(index + 1);
}

const notBlank = value => {
    if (!value) {
        throw new Error('无效数据');
    }
    return value;
}

module.exports = {
    minGifImage,
    getSuffix,
    getSuffixFromBuffer,
    notBlank
}