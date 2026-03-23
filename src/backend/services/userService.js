const bcrypt = require('bcrypt')
const uuid = require('uuid')

const validateEmail = require("../midelwares/validateEmail")
const userModel = require("../models/userModel")
const UserDTO = require('../dtos/userDTO')
const mailService = require('./mailService')
const tokenService = require('./tokenService')

class UserService {
    async registration(req, res) {
        try {
            const {username, email, password, device} = req.body
            if(!validateEmail(email)) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Неправильний формат email'
                });
            }

            const candidate = await userModel.findOne({
                $or: [{ userName: username }, { email: email }]
            })
            if(candidate) {
                return res.status(409).json({
                    error: 'Conflict',
                    message: 'Користувач з таким email або username вже існує'
                });
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const activationLink = uuid.v4()
            // не працюе під час використаня віддаленого сервера
            // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)

            const user = await userModel.create({
                userName: username,
                email: email,
                password: hashPassword,
                activationLink: activationLink
            })

            const userDTO = new UserDTO(user)
            const tokens = tokenService.generateTokens({...userDTO})

            await tokenService.saveToken(userDTO.id, device, tokens.refreshToken)

            res.cookie(
                'refreshToken',
                tokens.refreshToken, 
                {
                    maxAge: 30*24*60*60*1000,
                    httpOnly: true
                }
            )

            return res.json({
                accesToken: tokens.accessToken,
                user: userDTO
            })
        } catch (error) {
            console.error(error)
        }
    }
    
    async login(req, res) {
        try {
            const {email, password, device} = req.body
            if(!validateEmail(email)) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Неправильний формат email'
                });
            }

            const user = await userModel.findOne({email: email})
            if(!user) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Користувача не знайдено'
                })
            }

            const isPasswordEqual = await bcrypt.compare(password, user.password)

            if(!isPasswordEqual) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Неправельний пароль'
                })
            }

            const userDTO = new UserDTO(user)
            const tokens = tokenService.generateTokens({...userDTO})

            await tokenService.saveToken(userDTO.id, device, tokens.refreshToken)

            res.cookie(
                'refreshToken',
                tokens.refreshToken, 
                {
                    maxAge: 30*24*60*60*1000,
                    httpOnly: true
                }
            )

            return res.json({
                accesToken: tokens.accessToken,
                user: userDTO
            })
        } catch (error) {
            console.error(error)
        }
    }

    async logout(req, res) {
        try {
            const {refreshToken} = req.cookies
            const token =  await tokenService.removeToken(refreshToken)

            console.log(refreshToken)

            res.clearCookie('refreshToken')
            return res.status(200).json({
                ...token
            })
        } catch (error) {
            console.error(error)
        }
    }

    async activation(req, res) {
        try {
            const link = req.params.link

            const user = await userModel.findOne({activationLink: link})
            if(!user) {
                return res.status(400).send(`
                    <html>
                        <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                            <h1 style="color: red;">Помилка активації</h1>
                            <p>спробуйте ще раз зареєструватися</p>
                        </body>
                    </html>
                `);
            }

            user.isActivated = true

            await user.save()

            return res.send(`
                <html>
                    <body style="font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #f4f7f6;">
                        <div style="display: inline-block; background: white; padding: 40px; border-radius: 10px; shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <h1 style="color: #2ecc71;">Акаунт активовано! ✅</h1>
                            <p>Тепер ви можете увійти у свій профіль.</p>
                        </div>
                    </body>
                </html>
            `);
        } catch (error) {
            console.error(error)
        }
    }

    async refresh(req, res) {
        try {
            const {refreshToken} = req.cookies
            if(!refreshToken) {
                return res.status(401).json({
                    error: "unauthoraize",
                    message: "користувач не авторизован"
                })
            }

            const userData = tokenService.validateRefresh(refreshToken)
            const tokenFromDB = await tokenService.findToken(refreshToken)

            if(!userData || !tokenFromDB) {
                return res.status(401).json({
                    error: "unauthoraize",
                    message: "користувач не авторизован"
                })
            }

            const user = await userModel.findById(userData.id)
            const userDTO = new UserDTO(user)
            const tokens = tokenService.generateTokens({...userDTO})

            await tokenService.saveToken(userDTO.id, tokenFromDB.device, tokens.refreshToken)

            res.cookie(
                'refreshToken',
                tokens.refreshToken, 
                {
                    maxAge: 30*24*60*60*1000,
                    httpOnly: true
                }
            )

            return res.json({
                accessToken: tokens.accessToken,
                user: userDTO
            })
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = new UserService()
