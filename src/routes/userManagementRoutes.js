import React from 'react';
const AllRoles = React.lazy(() => import('../views/roles/AllRoles'))
const CreateRole = React.lazy(() => import('../views/roles/CreateRole'))
const AddUser = React.lazy(() => import('../views/users/AddUser'))
const UsersList = React.lazy(() => import('../views/users/UsersList'))
const BufferList = React.lazy(() => import('../views/buffer/BufferList'))
const ManagerDeviation = React.lazy(() => import('../views/users/ManagerDeviation'))
export const userManagementRoutes = [
    { path:'/roles/all-role', name:'All Roles', element:AllRoles},
    { path:'/roles/update-role/:id', name:'Update Role', element:CreateRole},
    { path:'/roles/create-role', name:'Create Role', element:CreateRole},
    { path:'/users/add-user', name:'Add User', element:AddUser},
    { path:'/users/update-user/:id', name:'Update User', element:AddUser},
    { path:'/users/users-list', name:'Users List', element:UsersList},
    { path:'/buffer/buffer-list', name:'Buffer List', element:BufferList},
    { path:'/users/manager-deviation', name:'Manager Deviation', element:ManagerDeviation},
];