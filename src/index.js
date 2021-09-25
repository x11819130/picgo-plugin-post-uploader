const {minGifImage, getSuffix, notBlank, getSuffixFromBuffer} = require('./utils')

module.exports = (ctx) => {
    const register = () => {
        ctx.helper.uploader.register('post-uploader', {
            handle,
            name: 'Post图床',
            config: config
        });
    }

    const handle = async function (ctx) {
        let userConfig = ctx.getConfig('picBed.post-uploader');
        if (!userConfig) {
            throw new Error('Can\'t find uploader config');
        }

        //初始化配置
        const url = userConfig.url;
        const paramName = userConfig.paramName;
        const urlFetcher = userConfig.urlFetcher;
        const extendConfig = JSON.parse(userConfig.extendConfig);

        try {
            let imgList = ctx.output;
            for (let i in imgList) {
                let img = imgList[i];
                let image = img.buffer;
                if (!image && img.base64Image) {
                    image = Buffer.from(img.base64Image, 'base64');
                } else if (extendConfig.enableImageMask !== false) {
                    // let suffix = getSuffixFromBuffer(image);
                    let suffix = getSuffix(img.fileName);
                    if (extendConfig.imageSuffixList === undefined) {
                        extendConfig.imageSuffixList = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico']
                    }
                    //非指定后缀
                    if (extendConfig.imageSuffixList.indexOf(suffix) === -1) {
                        if (extendConfig.headBase64 === undefined) {
                            extendConfig.headBase64 = minGifImage;
                        } else {
                            extendConfig.headBase64 = Buffer.from(extendConfig.headBase64, 'base64');
                        }
                        image = Buffer.concat([extendConfig.headBase64, image]);
                        ctx.log.info('>>>', '非图片上传, 头部新增');
                        img.fileName = extendConfig.maskImageName || '1.gif';
                    }
                }
                const postConfig = postOptions(image, url, paramName, img.fileName, extendConfig)
                let response = await ctx.Request.request(postConfig)

                delete img.base64Image
                delete img.buffer
                if (!urlFetcher) {
                    img['imgUrl'] = response
                } else {
                    try {
                        if (urlFetcher[0] === '$') {
                            // eslint-disable-next-line no-eval
                            img['imgUrl'] = eval(urlFetcher.slice(1))
                        } else {
                            // eslint-disable-next-line no-eval
                            img['imgUrl'] = eval('JSON.parse(response).' + urlFetcher)
                        }
                    } catch (e) {
                        ctx.emit('notification', {
                            title: '返回解析失败,请检查urlFetcher设置',
                            body: e + '\n' + response
                        })
                    }
                }
            }
        } catch (err) {
            ctx.emit('notification', {
                title: '上传失败',
                body: JSON.stringify(err)
            })
        }
    }

    const postOptions = (image, url, paramName, fileName, extendConfig) => {
        let headers = {
            contentType: 'multipart/form-data',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
        }
        if (extendConfig.extendHeader) {
            headers = Object.assign(headers, extendConfig.extendHeader)
        }
        let formData = {}
        if (extendConfig.extendForm) {
            formData = Object.assign(formData, extendConfig.extendForm)
        }
        const opts = {
            method: 'POST',
            url: url,
            headers: headers,
            formData: formData
        }
        opts.formData[paramName] = {}
        opts.formData[paramName].value = image
        opts.formData[paramName].options = {
            filename: fileName
        }
        return opts
    }

    const config = ctx => {
        let userConfig = ctx.getConfig('picBed.post-uploader')
        if (!userConfig) {
            userConfig = {}
        }
        return [
            {
                name: 'url',
                type: 'input',
                default: userConfig.url,
                required: true,
                message: '上传接口地址',
                alias: '上传接口地址'
            },
            {
                name: 'paramName',
                type: 'input',
                default: userConfig.paramName,
                required: true,
                message: '文件字段名',
                alias: '文件字段名'
            },
            {
                name: 'urlFetcher',
                type: 'input',
                default: userConfig.urlFetcher,
                required: false,
                message: '图片URL获取 填JSON路径(eg: data.url)或eval表达式(eg: $"https://xxx/"+JSON.parse(response).data.uri)',
                alias: '图片URL获取'
            },
            {
                name: 'extendConfig',
                type: 'input',
                default: '{}',
                required: false,
                message: '扩展配置 标准JSON(eg: {"key":"value"})',
                alias: '扩展配置'
            }
        ]
    }
    return {
        uploader: 'post-uploader',
        register
    }
}
