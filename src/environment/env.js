export const environment = {
  // endpoint: "http://192.168.1.21:8888",
  endpoint: "http://localhost:8888",
  apiPath: {
    category: {
      main: "/api/category",
    },
    auth: {
      main: "/api/Auth",
      login: "/api/Auth/Token",
      logout: "/api/Auth/LogOut",
      resetCode: "/api/Auth/ResetCode",
      checkCode: "/api/Auth/CheckResetCode",
      resetPassword: "/api/Auth/ResetPassword",
    },
    deviceToken: {
      main: "/api/DeviceToken",
    },
    dashboard: {
      main: "/api/Dashboard",
      DangerousCaseGroupByPolicy: '/DangerousCaseGroupByPolicy',
      NumberOfDangerousCaseByMonth: '/NumberOfDangerousCaseByMonth',
      NumberOfStudentGroupByBuilding: '/NumberOfStudentGroupByBuilding',
      NumberOfCaseGroupByBuilding: '/NumberOfCaseGroupByBuilding',
      NumberOfStudentGroupByUniversity: '/NumberOfStudentGroupByUniversity',
      RegisterStudentStatus: '/RegisterStudentStatus',
      NumberOfStudentGroupByUniversityByBuilding: '/NumberOfStudentGroupByUniversityByBuilding',
      RegisterGuardStatus: '/RegisterGuardStatus'
    },
    user: {
      main: "/api/User",
      getByCode: "/Code",
      toggleActive: "SwitchActive",
    },
    dangerousCase: {
      main: "/api/DangerousCase",
      student: "/api/DangerousCaseByStudent",
    },
    caseHistoryStatus: {
      main: "/api/CaseHistoryStatus",
    },
    policyLevel: {
      main: "/api/PolicyLevel",
    },
    policy: {
      main: "/api/Policy",
    },
    role: {
      main: "/api/Role",
    },
    configuration: {
      main: "/api/Configuration",
    },
    relative: {
      main: "/api/relative",
      checkOut: "CheckOut",
    },
    student: {
      main: "/api/Student",
      toggleActive: "SwitchActive",
    },
    university: {
      main: "/api/University",
      toggleActive: "SwitchActive",
    },
    notification: {
      main: "/api/Notification",
    },
    securityMan: {
      main: "/api/SecurityGuard",
      building_guard: "/buildingGuard",
      toggleActive: "SwitchActive",
    },
    camera: {
      main: "/api/Camera",
      enable: "/Enable",
      disable: "/Disable",
    },

    building: {
      main: "/api/Building",
      image: "/Image",
    },
    room: {
      main: "/api/Room",
    },
  },
  ai_endpoint: "http://localhost:5000",
  ai_apiPath: {
    // checkYPR: '/faceregister'
    checkYPR: "/faceregisterV2",
  },
  default_avatar_image:
    "https://previews.123rf.com/images/salamatik/salamatik1801/salamatik180100019/92979836-profile-anonymous-face-icon-gray-silhouette-person-male-default-avatar-photo-placeholder-isolated-on.jpg",
  default_image:
    "https://www.tribloo.com/themes/tribloo/assets/images/default-img.gif",
  loading_image:
    "https://assets.motherjones.com/interactives/projects/features/koch-network/shell19/img/loading.gif",
  //Type accepted by input
  SheetJSFT: [
    "xlsx",
    // "xlsb",
    // "xlsm",
    "xls",
    // "xml",
    // "csv",
    // "txt",
    // "ods",
    // "fods",
    // "uos",
    // "sylk",
    // "dif",
    // "dbf",
    // "prn",
    // "qpw",
    // "123",
    // "wb*",
    // "wq*",
    // "html",
    // "htm",
  ]
    .map(function (x) {
      return "." + x;
    })
    .join(","),
  constant_data: {
    error_of_face_angle: 4,
  },
  key: {
    weirdHour: "WEIRD_HOURS_CONFIG",
  },
  process_step : {
    pending: {
      name: "pending",
      color_tag: "default",
      color_timeline :"gray",
      before_action: "none"
    },
    considering: {
      name: "considering",
      color_tag: "processing",
      color_timeline: "blue",
      before_action: "Approve"
    },
    processing: {
      name: "processing",
      color_tag: "processing",
      color_timeline: "blue",
      before_action: "Approve",
      before_action_type: "primary"
    },
    skipping: {
      name: "skipping",
      color_tag: "gold",
      color_timeline: "gold",
      before_action: "Skip"
    },
    rejection: {
      name: "rejection",
      color_tag: "red",
      color_timeline: "red",
      before_action: "Deny",
      before_action_type: "danger"
    },
    close: {
      name: "close",
      color_tag: "default",
      color_timeline: "gray",
      before_action: "Save",
      before_action_type: "primary"
    },
    saving: {
      name: "saving",
      color_tag: "success",
      color_timeline: "green",
      before_action: "Done"
    }
  },
};
