require("dotenv").config()
const express = require('express')
const app = express()
const path = require("path")
const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { CheckForAuthenticationCookie } = require('./middlewares/authentication')
const Blog = require('./models/blog')
const PORT = process.env.PORT || 3000
MONGO_URL = 'mongodb+srv://admin:admin@cluster0.fgp03zd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(MONGO_URL).then((e)=>console.log("MongoDB Connected"));

app.set('view engine','ejs')
app.set('views',path.resolve("./views"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(CheckForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

app.get('/',async(req,res)=>{
    const allBlogs = await (await Blog.find({}))
    res.render("home",{
        user: req.user,
        blogs: allBlogs
    }) 
})
app.use('/user', userRoutes)
app.use('/blog', blogRoutes)

app.listen(PORT,()=> console.log(`Server started at port ${PORT}`)
)
