import Vue from 'vue'

import AV from 'leancloud-storage' 

var APP_ID = 'RsCkEEr3iYDb1AM9M8d2mHhS-gzGzoHsz';  //leancould身份秘钥
var APP_KEY = 'FQURk1V4kTmklYV5rlkdfnF6';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    actionType: 'signUp',  //切换界面，默认显示注册界面，当用户点击登录界面时，值变为login
    formData:{
      username:'',
      password:''
    },
    tipMessage:'',
    currentUser:null  //令当前用户为空
  },
  methods: {
    addTodo: function(){  //增加代办事项
      let date = Date().substr(0,Date().length-18)
      this.todoList.push({
        title:this.newTodo,
        createdAt: date,
        done: false  //事项状态 未完成/已完成
      })
      this.newTodo = '' //添加事项之后，令输入框为空
      //this.saveTodo() //时时保存数据 每次保存都会获得一个新的对象，不是想要的
      this.saveOrUpdate() //是执行 添加新的事项 到列表 或者更新事项状态，只对当前用户的todo对象保存或更新。
    },
    tipMessageEvent: function(){
      this.tipMessage = ''
    },
    removeTodo: function(todo){  //已完成的事项可以选择删除
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index,1)
      //this.saveTodo()
      this.saveOrUpdate()
    },
    signUp: function(){
      let user = new AV.User() //AV.User 是用来描述一个用户的特殊对象
      user.setUsername(this.formData.username)
      user.setPassword(this.formData.password)
      user.signUp().then((loginedUser)=>{
        this.currentUser = this.getCurrentUser()
      },(error)=>{
        this.tipMessage = this.getErrorMessage(error.code)
        console.log(this.tipMessage)
        console.log('注册失败')
      })
    },
    login: function(){
      AV.User.logIn(this.formData.username,this.formData.password).then((loginedUser)=>{
        this.currentUser = this.getCurrentUser()
        this.fetchTodos()
      },(error)=> { //注意this的指向
        this.tipMessage = this.getErrorMessage(error.code)
        console.log(this.tipMessage)
        console.log('登录失败')
      })
    },
    getErrorMessage: function(code){
      const map = {
        202:  '用户名已被注册',
        210: '用户名和密码不匹配',
        211: '该用户未注册',
        217:  '无效的用户名',
        unknown:  '请求失败，请稍后再试'
      }
      return map[code] || map.unknown
    },
    logout: function(){
      AV.User.logOut()
      this.currentUser = AV.User.current() //登出后，SDK自动清除数据
      window.location.reload() //刷新页面，清除输入框的用户名和密码
    },
    getCurrentUser: function(){
      let current = AV.User.current() //AV.User.current()判断当前用户是否为空
      //console.log(current,4444444444)
      if(current){
        let {id,attributes:{username}} = current
        return {id,username}
      }else{
        return null
      }
    },
    saveTodos: function(){  //保存todo到云端
      let dataString = JSON.stringify(this.todoList)
      let Todo = AV.Object.extend('Todo') //声明一个 Todo 类型
      let todo = new Todo()  // 新建一个 Todo 对象,输入的内容（this.newTodo）都在这个对象里
      var acl = new AV.ACL()  //新建一个权限
      acl.setReadAccess(AV.User.current(),true) //只有当前用户能读
      acl.setWriteAccess(AV.User.current(),true) //只有当前用户能写
      todo.set('content',dataString) //在todo对象里增加输入的内容
      todo.setACL(acl) //设置权限
      //console.log(todo.id,222)
      todo.save().then((todo)=>{  //保存到云端
        //console.log(todo.id,333) 保存成功后才有id
        this.todoList.id = todo.id
        console.log('save succeed')
      },function(error){
        console.log('save fail')
      })
    },
    updateTodos: function(){ //更新todo，保存到云端
      let dataString = JSON.stringify(this.todoList)
      let avTodos = AV.Object.createWithoutData('Todo',this.todoList.id) //通过接口和 objectId 把数据从云端拉取到本地
      avTodos.set('content',dataString)
      avTodos.save().then(()=>{  //保存到云端
        console.log('undate succeed')
      },()=>{
        console.log('update fail')
      })
    },
    saveOrUpdate: function(){ //如果事项列表已经存在，就更新，如果不存在就保存
      if(this.todoList.id){ //第一次添加到云端的时候，还没有id
        this.updateTodos()
      }else{
        this.saveTodos()
      }
    },
    fetchTodos: function(){  //获取存在云端的用户数据
      if(this.currentUser){
        var query = new AV.Query('Todo') //创建Todo对象的查询实例
        //console.log(query,555555555)
        query.find().then((todos)=>{
          //console.log(todos,66666)
          let avTodo = todos[0] //todos[0]就是一堆包含attribute和id的对象
          let id = avTodo.id
          this.todoList = JSON.parse(avTodo.attributes.content)
          this.todoList.id = id
          //console.log(this.todoList,777777777)
        },function(error){
          console.log(error)
        })
      }
    }
  },
  created: function(){
      this.currentUser = this.getCurrentUser() //检查用户是否登录
      this.fetchTodos()
  }
}) 