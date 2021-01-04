import { combineReducers } from 'redux'

import socketReducer from './socket/socket.reducer'
import frameReducer from './frame/frame.reducer'
import authReducer from './auth/auth.reducer'
import faceReducer from './face/face.reducer'
import notificationReducer from './notification/notification.reducer'
import userReducer from './user/user.reducer'
import roleReducer from './role/role.reducer'
import universityReducer from './university/university.reducer'
import roomReducer from './room/room.reducer'
import buildingReducer from './building/building.reducer'
import policyReducer from './policy/policy.reducer'
import caseReducer from './case/case.reducer'
import studentReducer from './student/student.reducer'
import cameraReducer from './camera/camera.reducer'
import relativeReducer from './relative/relative.reducer'



const rootReducer = combineReducers({
    socket: socketReducer,
    auth: authReducer,
    frame: frameReducer,
    face: faceReducer,
    notification: notificationReducer,
    user: userReducer,
    role: roleReducer,
    university: universityReducer,
    room: roomReducer,
    building: buildingReducer,
    policy: policyReducer,
    case: caseReducer,
    student: studentReducer,
    camera: cameraReducer,
    relative: relativeReducer
})

export default rootReducer