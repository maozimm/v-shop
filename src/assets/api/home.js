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
// 获取列表权限
const rigthsList = function (params) {
  return axios.get('/rights/' + params)
}
const getRolesList = function () {
  return axios.get('/roles')
}
// 获取角色列表
export {
  usersdata,
  statechange,
  adduser,
  modifyuser,
  deleteUser,
  rigthsList,
  getRolesList
}
