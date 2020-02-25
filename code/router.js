/**
 * router.js 路由模块
 * 职责：
 *   处理路由
 *   根据不同的请求方法+请求路径设置具体的请求处理函数
 * 模块职责要单一，不要乱写
 * 我们划分模块的目的就是为了增强项目代码的可维护性
 * 提升开发效率
 */

var fs = require('fs');
var Student = require('./student');


// Express 提供了一种更好的方式
// 专门用来包装路由的

var express = require('express');

// 1、创建一个路由容器
var router = express.Router();

//2.把路由挂载到router路由中


router.get('/', function(req, res) {
    if (req.query.name != null && req.query.name != undefined && req.query.name != '') {
        Student.findOneByName(req.query.name, function(err, students) {
            if (err) {
                return res.status(500).send('Server error');
            }
            console.log(students.toString())
            if (students.toString().length == 0) {
                res.render('index.html', {
                    count: 0,
                })
            } else {
                res.render('index.html', {
                    students: students
                })
            }
        })
    } else {
        Student.find(function(err, students) {
            if (err) {
                return res.status(500).send('Server error');
            }
            // if (students.length >= 3) {
            //     var top = [
            //         students[0],
            //         students[1],
            //         students[2],
            //     ]
            // }
            res.render('index.html', {
                // top: top,
                students: students
            })
        })
    }
})


/*
渲染学生列表界面
 */
router.get('/students', function(req, res) {
        if (req.query.name != null && req.query.name != undefined && req.query.name != '') {
            Student.findOneByName(req.query.name, function(err, students) {
                if (err) {
                    return res.status(500).send('Server error');
                }
                console.log(students.toString())
                if (students.toString().length == 0) {
                    res.render('index.html', {
                        count: 0,
                    })
                } else {
                    res.render('index.html', {
                        students: students
                    })
                }
            })
        } else {
            Student.find(function(err, students) {
                if (err) {
                    return res.status(500).send('Server error');
                }
                // if (students.length >= 3) {
                //     var top = [
                //         students[0],
                //         students[1],
                //         students[2],
                //     ]
                // }
                res.render('index.html', {
                    // top: top,
                    students: students
                })
            })
        }
    })
    /**
     * 渲染添加学生的页面
     */
router.get('/students/new', function(req, res) {
    res.render('new.html');
});

/*
 * 处理添加学生
 */

//此处使用了promise来处理添加学生的操作
//接收到前端请求后，后端调用函数相关的请求处理函数，从而实现数据库的具体操作
//使用promise来判断是否调用处理函数是否完美执行了操作数据库的功能，在不同时候执行resolve或者reject去触发下一个动作，执行then方法或者catch方法里的函数
router.post('/students/new', function(req, res) {
        Student.add(req.body, function(err) {
            let p = new Promise(function(resolve, reject) {
                if (err) {
                    resolve("trouble!");
                } else {
                    reject("well");
                }

            })
            p.then(function() {
                return res.status(500).send('Server error');
            }, function() {

            })

            p.catch(function() {
                res.redirect('/students');
            }, function() {

            })
        })
    })
    /*
     * 渲染编辑学生页面
     */
router.get('/students/edit', function(req, res) {
    // 1. 在客户端的列表页中处理链接问题（需要有 id 参数）
    // 2. 获取要编辑的学生 id
    //
    // 3. 渲染编辑页面
    //    根据 id 把学生信息查出来
    //    使用模板引擎渲染页面


    //此处使用了闭包函数，在findById函数中定义了一个匿名函数构成一个闭包函数，同时这个函数也是一个回调函数
    //该匿名函数将在主程序执行完之后执行，用于根据操作数据库的函数返回的不同结果触发不同的方法
    Student.findById(req.query.id, function(err, student) {
        if (err) {
            console.log(err)
            return res.status(500).send('Server error.');
        }
        res.render('edit.html', {
            student: student
        })
    })
})

/*
 * 处理编辑学生
 */
router.post('/students/edit', function(req, res) {
    // 1. 获取表单数据
    //    req.body
    // 2. 更新
    //    Student.updateById()
    // 3. 发送响应
    var id = req.body.id
    Student.findByIdAndUpdate(id, req.body, function(err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/students')
    })
})

/*
 * 处理删除学生
 */
router.get('/students/delete', function(req, res) {
    // 1. 获取要删除的 id
    // 2. 根据 id 执行删除操作
    // 3. 根据操作结果发送响应数据
    var id = req.query.id
    Student.findByIdAndRemove(id, function(err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/students')
    })
})

/*
 * 渲染查看学生页面
 */
router.get('/students/show', function(req, res) {
    // 1. 在客户端的列表页中处理链接问题（需要有 id 参数）
    // 2. 获取要查看的学生 id
    //
    // 3. 渲染详情页面
    //    根据 id 把学生信息查出来
    //    使用模板引擎渲染页面
    Student.findById(req.query.id, function(err, student) {
        if (err) {
            console.log(err)
            return res.status(500).send('Server error.');
        }
        res.render('show.html', {
            student: student
        })
    })
})


// 3. 把 router 导出
module.exports = router;