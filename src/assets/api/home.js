// 获取users表
import axios from 'axios'
const usersdata = function(parmas) {
  return axios.get('/users', {
    params: parmas
  })
}
// 修改用户状态
const statechange = function (parmas) {
  return axios.put(parmas)
}
// 添加用户
const adduser = function (parmas) {
  return axios.post('/users', parmas)
}
// 修改用户
const modifyuser = function (params, data) {
  return axios.put('/users/' + params, data)
}
// 删除用户
const deleteUser = function (params) {
  return axios.delete('/users/' + params)
}
export {
  usersdata,
  statechange,
  adduser,
  modifyuser,
  deleteUser
}
