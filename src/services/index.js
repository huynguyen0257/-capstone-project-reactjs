export * from './auth.service'
export * from './face.service'
export * from './localstorage.service'
export * from './firebase.service'
export * from './user.service'
export * from './role.service'
export * from './university.service'
export * from './notification.service'
export * from './student.service'
export * from './security.man.service'
export * from './room.service'
export * from './building.service'
export * from './device.token.service'
export * from './dangerous.case.service'
export * from './camera.service'
export * from './policy.service'
export * from './relative.service'
export * from './configuration.service'
export * from './dashboard.service'
export * from './image.service'

export const serialize = (obj) => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p) && obj[p] != null) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }