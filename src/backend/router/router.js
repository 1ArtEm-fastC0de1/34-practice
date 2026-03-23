const authMidleware = require('../midelwares/authMidleware');
const noteServise = require('../services/noteServise');
const userService = require('../services/userService');

const routs = require('express').Router()

const stub = (req, res) => res.send('В розробці');

/**
 * @swagger
 * /auth/registration:
 *   post:
 *     summary: Реєстрація користувача, відправка активаційного листа на віддаленому сервері не працює
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                type: string
 *               email:
 *                type: string
 *               password:
 *                type: string
 *               device:
 *                type: string
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *
 *       400:
 *          description: Помилка валідації
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Bad Request"
 *                  message:
 *                    type: string
 *                    example: "Неправильний формат email"
 *       409:
 *          description: Користувач вже існує
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Conflict"
 *                  message:
 *                    type: string
 *                    example: "Користувач з таким email або username вже існує"
 *
 */
routs.post('/auth/registration', (req, res) => userService.registration(req, res))
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вхід користувача в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - device
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@mail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secret123"
 *               device:
 *                 type: string
 *                 example: "Chrome Windows"
 *     responses:
 *       200:
 *         description: Успішний вхід, отримано токени та дані користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Помилка валідації або невірні дані
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 message:
 *                   type: string
 *                   enum: ["Неправильний формат email", "Користувача не знайдено", "Неправильний пароль"]
 *                   example: "Неправильний пароль"
 */
routs.post('/auth/login', (req, res) => userService.login(req, res))
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Вихід із системи (деавторизація)
 *     tags: [Auth]
 *     description: Видаляє Refresh токен із бази даних та очищує куки браузера.
 *     responses:
 *       200:
 *         description: Успішний вихід. Повертає статистику видалення з БД.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                   example: true
 *                 deletedCount:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Помилка сервера
 */
routs.post('/auth/logout', (req, res) => userService.logout(req, res))
/**
 * @swagger
 * /auth/activate/{link}:
 *   get:
 *     summary: Активація акаунту через email, не працює під час використання віддаленого сервера
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *         description: Унікальне UUID посилання з листа
 *     responses:
 *       200:
 *         description: Успішна активація. Повертає HTML-сторінку з підтвердженням.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body><h1>Акаунт активовано!</h1></body></html>"
 *       400:
 *         description: Помилка активації (посилання недійсне). Повертає HTML з описом помилки.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
routs.get('/auth/activate/:link', (req, res) => userService.activation(req, res))

/**
 * @swagger
 * /note/create:
 *   post:
 *     summary: Створення нової нотатки
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Список покупок"
 *               content:
 *                 type: string
 *                 example: "Молоко, хліб, сир"
 *     responses:
 *       201:
 *         description: Нотатку успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "note created!"
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Неавторизований (відсутній або невірний токен)
 *       500:
 *         description: Помилка сервера
 */
routs.post('/note/create', authMidleware, noteServise.createNote)
/**
 * @swagger
 * /note/update:
 *   patch:
 *     summary: Оновлення існуючої нотатки
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: note updated!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "note updated!"
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Нотатку не знайдено або у вас немає прав на її зміну
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Нотатку не знайдено або у вас немає прав на її зміну"
 *       500:
 *         description: Помилка оновлення нотатки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Помилка оновлення нотатки"
 */
routs.patch('/note/update', authMidleware, noteServise.updateNote)
/**
 * @swagger
 * /note/pin/{id}/{pin}:
 *   patch:
 *     summary: Закріплення або відкріплення нотатки
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID нотатки
 *       - in: path
 *         name: pin
 *         required: true
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Статус закріплення (true або false)
 *     responses:
 *       201:
 *         description: Успішна зміна статусу
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "note pinned!"
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Нотатку не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Нотатку не знайдено"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка при закріпленні нотатки"
 */
routs.patch('/note/pin/:id/:pin', authMidleware, noteServise.pinNote)
/**
 * @swagger
 * /note/getAll:
 *   get:
 *     summary: Отримання всіх нотаток користувача з пагінацією
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *         description: Кількість нотаток на сторінку
 *     responses:
 *       200:
 *         description: Список нотаток успішно отримано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 total:
 *                   type: integer
 *                   example: 45
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка при отриманні нотаток"
 */
routs.get('/note/getAll', authMidleware, noteServise.getAllNote)
/**
 * @swagger
 * /note/getOne/{id}:
 *   get:
 *     summary: Отримання однієї конкретної нотатки за ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID нотатки
 *     responses:
 *       200:
 *         description: Нотатку знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Нотатку не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "нотатку не знайдено"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка при отриманні нотатки"
 */
routs.get('/note/getOne/:id', authMidleware, noteServise.getNote)
/**
 * @swagger
 * /note/search:
 *   get:
 *     summary: Пошук нотаток за заголовком
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         description: Текст для пошуку в заголовках нотаток
 *     responses:
 *       200:
 *         description: Результати пошуку отримано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка пошуку нотатки"
 */
routs.get('/note/search', authMidleware, noteServise.searchNote)

/**
 * @swagger
 * /token/refresh:
 *   get:
 *     summary: Оновлення Access токена
 *     tags: [Auth]
 *     description: Метод зчитує refreshToken з кук, перевіряє його та видає нову пару токенів.
 *     responses:
 *       200:
 *         description: Токени успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Користувач не авторизований або токен недійсний
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "unauthoraize"
 *                 message:
 *                   type: string
 *                   example: "користувач не авторизован"
 */
routs.get('/token/refresh', (req, res) => userService.refresh(req, res))

/**
 * @swagger
 * /trash/add/{id}:
 *   post:
 *     summary: Перенесення нотатки до смітника
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID нотатки, яку потрібно видалити
 *     responses:
 *       201:
 *         description: Нотатку успішно перенесено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Нотатку перенесено до смітника"
 *                 note:
 *                   $ref: '#/components/schemas/Trash'
 *       404:
 *         description: Нотатку не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Нотатку не знайдено"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка при перенесенні нотатки у смітник"
 */
routs.post('/trash/add/:id', authMidleware, noteServise.toTrash)
/**
 * @swagger
 * /trash/backtonotes/{id}:
 *   post:
 *     summary: Відновлення нотатки зі смітника
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID запису у смітнику, який потрібно відновити
 *     responses:
 *       200:
 *         description: Нотатку успішно відновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Нотатку відновлено!"
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Запис не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Запис у смітнику не знайдено"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Помилка при відновленні нотатки"
 */
routs.post('/trash/backtonotes/:id', authMidleware, noteServise.backToNotes)
/**
 * @swagger
 * /trash/getAll:
 *   get:
 *     summary: Отримання всіх нотаток зі смітника з пагінацією
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *         description: Кількість нотаток на сторінку
 *     responses:
 *       200:
 *         description: Список видалених нотаток успішно отримано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trash'
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка при отриманні нотаток"
 */
routs.get('/trash/getAll', authMidleware, noteServise.getAllNoteTrash)
/**
 * @swagger
 * /trash/getOne/{id}:
 *   get:
 *     summary: Отримання однієї нотатки зі смітника
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID запису у смітнику
 *     responses:
 *       200:
 *         description: Нотатку знайдено в смітнику
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Trash'
 *       404:
 *         description: Нотатку не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "нотатку не знайдено"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка при отриманні нотатки"
 */
routs.get('/trash/getOne/:id', authMidleware, noteServise.getTrashNote)
/**
 * @swagger
 * /trash/search:
 *   get:
 *     summary: Пошук нотаток у смітнику
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         description: Текст для пошуку в заголовках видалених нотаток
 *     responses:
 *       200:
 *         description: Результати пошуку в смітнику отримано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trash'
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка пошуку нотатки"
 */
routs.get('/trash/search', authMidleware, noteServise.searchTrashNote)
/**
 * @swagger
 * /trash/deleteNote/{id}:
 *   delete:
 *     summary: Остаточне видалення нотатки з кошика
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID запису у кошику, який потрібно видалити назавжди
 *     responses:
 *       200:
 *         description: Нотатку видалено назавжди
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "нотатку видалено"
 *                 noteData:
 *                   type: object
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                     deletedCount:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Нотатку не знайдено або доступ заборонено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Нотатку не знайдено або у вас немає прав на її видалення"
 *       500:
 *         description: Помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "помилка при видаленні нотатки"
 */
routs.delete('/trash/deleteNote/:id', authMidleware, noteServise.deleteNote)

/**
 * @swagger
 * /auth/updateUser:
 *   patch:
 *     summary: Оновлення даних профілю користувача
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "new_email@gmail.com"
 *                 description: Новий email (якщо порожньо, залишиться старий)
 *               username:
 *                 type: string
 *                 example: "_new_username"
 *                 description: Нове ім'я користувача (якщо порожньо, залишиться старе)
 *     responses:
 *       200:
 *         description: Дані профілю успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Помилка валідації (неправильний формат email)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 message:
 *                   type: string
 *                   example: "Неправильний формат email"
 *       401:
 *         description: Користувач не авторизований
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "unauthoraize"
 *                 message:
 *                   type: string
 *                   example: "користувач не авторизован"
 *       409:
 *         description: Конфлікт (Email або Username вже зайняті іншим користувачем)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conflict"
 *                 message:
 *                   type: string
 *                   example: "Користувач з таким email або username вже існує"
 *       500:
 *         description: Помилка сервера
 */
routs.patch('/user/update', authMidleware, userService.updateUserData)


module.exports = routs
