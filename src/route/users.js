// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

//отримання даних з сервера та робота з ними

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateByID = (id, data) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

//=======================================

// router.get Створює нам один ентпоінт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: 'Користувача створено',
  })
  // ↑↑ сюди вводимо JSON дані
})

//====================================

router.get('/user-delete', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query
  User.deleteById(Number(id))

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: 'Користувача видалено',
  })
  // ↑↑ сюди вводимо JSON дані
})

//====================================

router.post('/user-update', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: result
      ? 'Пошту (email) користувача оновлено'
      : 'Сталася помилка',
  })
  // ↑↑ сюди вводимо JSON дані
})

// Підключаємо роутер до бек-енду
module.exports = router
