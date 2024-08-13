import passport from "passport"
import GithubStrategy from 'passport-github2'
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { hashedPassword, isValidPassword } from '../utils.js';


const LocalStrategy = local.Strategy;

const initializePassport = () => {

    // Estrategia de GitHub
    passport.use('github', new GithubStrategy({
        clientID: "Iv23li7LB2WQbFJHzX5l",
        clientSecret: "d544b98a7019d19c3ae2722c7470d5bbdd74d881",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    },async(accessToken, refreshTokken, profile, done)=>{
        try {
            console.log(profile)
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    nombre: profile._json.name || profile.username || 'GitHub User',
                    apellido: "",
                    email: profile._json.email || `${profile.username}@github.com`,
                    password: "",
                    role: 'user',
                    githubId: profile.id 
                }
                let result = await userModel.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    // Estrategia de Registro Local
    passport.use('register',new LocalStrategy(
        {passReqToCallback:true,usernameField:'email'},async(req,username,password,done)=>{
            const {nombre, apellido, email, role } = req.body
            try {
                let user = await userModel.findOne({email:username})
                if(user){
                    console.log("El usuario ya existe")
                    return done(null,false)
                }
                const newUser={
                    nombre,
                    apellido,
                    email,
                    role,
                    password:hashedPassword(password)
                }
                let result =await userModel.create(newUser)
                return done (null,result)
            } catch (error) {
                return done ("error al obtener el usuario" + error)
            }
        }
    ))
    
    // Estrategia de Login Local
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                console.log("El usuario no existe")
                return done(null, user)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))    

    // Serialización y Deserialización del Usuario
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport;