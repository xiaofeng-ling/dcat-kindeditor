# Dcat Admin Extension

扩展表单字段: **kindeditor**

## kindeditor 

此版本kindeditor为个人分支，其中上传组件已删除flash，改为plupload.js
作为核心上传组件，并进行一定程度的精简

## 默认使用

```
$form->kindeditor('description');
# 重置展示项
$form->kindeditor('description')
    ->options([
    'items'=>[
    'source','insertimages','fontsize'
]
]);
```

## 上传回调

允许上传文件后对回调数据格式化，适配现有第三方上传结构返回的数据结构。

自定义图片上传回调
```php
       $afterUploadedCallback=JavaScript::make(
            <<<JS
function(data)
{
    var result = {};
    if (data.code === 0){
        result.error = 0;
        result.url = data.data.url;
    }else{
        result.error = data.code;
        result.message = data.msg;
    }
    return result;
}
JS
        );
        $custom_upload_url = 'http://upload.baidu.com/';
        $form->kindeditor('editor')->options(['afterUploaded'=>$afterUploadedCallback])->url($custom_upload_url);'


```

## 只读模式

```php

$form->kindeditor('desc')->url($custom_upload_url)->readonly();
```

## 新增全局js变量window.editors 对象

可通过表单name值获取对应的kindeditor实例,实现跨作用域调用编辑器的方法
例如:
```html
<textarea name="content" >
```

```js
var editor = window.editors.content;
```



