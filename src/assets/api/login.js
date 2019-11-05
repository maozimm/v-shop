import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
const login = function (data) {
  return axios.post('/login', data)
}
export {
  login
}
