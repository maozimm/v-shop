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
// 获取角色列表
const getRolesList = function () {
  return axios.get('/roles')
}
// 删除角色权限
const deleRolesPower = function (rolesId, powerId) {
  return axios.delete(`roles/${rolesId}/rights/${powerId}`)
}
// 获取所有权限列表
const allPower = function (type) {
  return axios.get('/rights/' + type)
}
// 根据id获取角色
const getRoleById = function (id) {
  return axios.get('/roles/' + id)
}
// 分配权限按钮
const setPowerbtn = function (id, str) {
  return axios.post(`roles/${id}/rights`, {
    rids: str
  })
}
// 分配权限请求
const putRoleReq = function (userid, roleid) {
  return axios.put(`users/${userid}/role`, {
    rid: roleid
  })
}
// 添加角色
const addRoleReq = function (params) {
  return axios.post('/roles', params)
}
// 修改角色
const modifyRoleReq = function (id, params) {
  return axios.put('roles/' + id, params)
}
// 删除角色
const deleteRoleReq = function (id) {
  return axios.delete('/roles/' + id)
}
// 获取商品分类列表
const getCategoriesReq = function (num) {
  return axios.get('/categories', {
    params: {
      pagenum: num,
      pagesize: 5
    }
  })
}
// 添加商品分类
const addCategoriesReq = function (params) {
  return axios.post('/categories', params)
}
// 修改商品分类
const modifyCategoriesReq = function (id, params) {
  return axios.put('/categories/' + id, params)
}
// 删除商品分类
const deleteCategoriesReq = function (id) {
  return axios.delete('/categories/' + id)
}
export {
  usersdata,
  statechange,
  adduser,
  modifyuser,
  deleteUser,
  rigthsList,
  getRolesList,
  deleRolesPower,
  allPower,
  getRoleById,
  setPowerbtn,
  putRoleReq,
  addRoleReq,
  modifyRoleReq,
  deleteRoleReq,
  getCategoriesReq,
  addCategoriesReq,
  modifyCategoriesReq,
  deleteCategoriesReq
}
