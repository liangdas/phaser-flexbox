# phaser-flexbox

[项目github地址](https://github.com/liangdas/phaser-flexbox)

phaser-flexbox使用的是facebook开源的yoga作为flexbox计算库

### yoga地址

[getting-started](https://facebook.github.io/yoga/docs/getting-started/)

[flexbox设置函数](https://github.com/facebook/yoga/blob/master/javascript/sources/Node.hh)

[flexbox样式枚举](https://github.com/facebook/yoga/blob/master/javascript/sources/YGEnums.js)

### 文件说明

> 由于yoga默认只支持es6以上,在部分浏览器上会出现不兼容,目测UC浏览器就不支持。

> 因此我编译了一个es5版本

### es5版本

    lib/yoga.bundle.js

    <script src="/static/js/lib/yoga.bundle.js"></script>

yoga就被加载到环境中来了

var yoga=window.yoga;

### phaser-yoga工具

由于yoga需要对每一个元素进行设置，操作起来相对复杂，因此我写了一个类来自动化这一步操作

    lib/yoga-layout.js

### 使用用法

    DialogState.js

### 库大小

    yoga库是用c++版本通过asm.js编译而成的,包体比较大 700k左右。使用的时候可以通过gzip方式压缩
    gzip压缩后为120k

![phaser-flexbox](https://github.com/liangdas/phaser-flexbox/blob/master/demo.png)

### 优化

    目前这个库还不是很完善，有一些功能可以优化，例如如果使用js特性更方便的设置flexbox,用接近css原生配置的方式完成设置等