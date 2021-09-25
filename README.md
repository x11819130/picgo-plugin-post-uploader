## picgo-plugin-post-uploader

post-uploader

```yaml
上传接口地址: post请求的地址
文件字段名: 文件内容所在字段
图片URL获取: 填JSON路径(eg: data.url)或eval表达式(eg: $"https://xxx/"+JSON.parse(response).data.uri)
扩展配置: {"extendForm":{"token":"..."},"extendHeader":{"TOKEN":"..."}}

扩展配置说明:
    extendForm: 扩展表单, object类型, 默认{}. 这个对象里的参数将和文件一起作为post请求的参数
    extendHeader: 扩展请求头, object类型, 默认{}. 这里附加一些需要的请求头, 比如cookie/TOKEN/referer之类
    enableImageMask: 上传指定后缀以外的文件, 是否启用伪装头部, 布尔类型, 默认true. 启用后, 上传指定后缀以外的文件, 会将headBase64转字节后,拼接在要上传的文件的头部, 再上传. 用于突破一些比如不能上传图片以外文件的接口的限制
    imageSuffixList: 启用enableImageMask后,指定的文件后缀, 数组类型, 默认['jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico']
    maskImageName: 启用enableImageMask后,上传的文件名, string类型, 默认1.gif
    headBase64: 启用enableImageMask后, 用于拼接的头部文件, string类型, 默认R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs
```


