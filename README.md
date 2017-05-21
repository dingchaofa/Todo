#### 预览：  
https://dingchaofa.github.io/Todo/dist/

#### 源码：
https://github.com/dingchaofa/Todo/tree/master/dist  
注：由于使用webpack压缩过*.js文件，app模块即是源码，又是入口文件。


## 编译说明

#### 需求：
1. 设计一个动态页面
2. 有注册、登录、退出机制
3. 页面功能相当于一个记事本，数据是存储在云端的web应用
4. 每位用户只能读写自己的账户
5. 用户可以增加、删除、修改各个事项的状态  

    - 新增代办事项
    - 删除已完成的或者是未完成的事项
    - 已完成的标记为已完成
    - 未完成的标记为未完成

#### 设计思路：
1. 利用[Vue.js](https://cn.vuejs.org/)实现事件绑定、双向绑定的功能，实现动态绑定
2. 利用[leancloud](https://leancloud.cn/)云储存，存放用户数据

#### 实现过程：
1. 首页默认显示注册界面
    - 如果用户之前已登录，就直接显示用户登录状态界面
    - 如果登录后，存有用户数据，就显示用户数据

2. 监听用户鼠标点击事件  
    - 点击注册/登录按钮，切换注册/登录界面（登录前）
    - 点击删除事项（登录后）

3. 监听用户键盘事件（登录后）  
    用户输入代办事项，按回车键 (enter)即可将输入内容添加到代办事项列表。

4. 保存数据到服务器
    用户每一次添加、修改、删除即修改事项列表，都向服务器发送一次保存在服务器的请求，以防用户随时断网或者切换网页打开而导致数据无法保存的问题。

#### 其它：
1. 依赖leancloud的SDK提供的[API](https://leancloud.cn/docs/leanstorage_guide-js.html)  
2. 注意，热带重载命令 npm run webserver  
3. 每次修改结束，记得生成最终的build.js文件，使用webpack命令。
4. 可以克隆我的项目，在对应的文件目录下，命令行 npm i，即可安装所有依赖。

#### 安装相关：
1. 运行 npm config set loglevel http，让你知道 npm 发的每一个请求.<br>
2. 运行 npm config set progress false，关闭那个进度条<br>
3. 安装速度变快，运行 npm config set registry https://registry.npm.taobao.org/<br>
这会让你在运行 npm adduser 的时候出问题，想要恢复成原样，只需要 npm config delete registry 即可


#### 进阶问题：
1. 用正则表达式设置用户名和密码的格式或者搞一些验证码之类的
2. 用户可以利用这个web应用做更多的事，例如：没想出来···

未完待续···
