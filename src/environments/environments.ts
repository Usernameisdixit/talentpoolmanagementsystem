export const environment = {

    production : false ,
    apiUrl : 'http://localhost:9999/tpms',
    attendenceUrl:  'http://localhost:9999/tpms/attendance',

    //Role URL
    saveRole : 'http://localhost:9999/tpms/saveRoles',
    viewRole : 'http://localhost:9999/tpms/getRoles',
    editRole : 'http://localhost:9999/tpms/editRole/',
    updateRole : 'http://localhost:9999/tpms/updateRole/',

    //login URL
    getLoginUsers : 'http://localhost:9999/tpms/getAllUsers',
    saveLoginUser : 'http://localhost:9999/tpms/login',
    getLoginEmail : 'http://localhost:9999/tpms/getEmail',
    resetPassword : 'http://localhost:9999/tpms/resetPassword',

    //User URL
    addUserUrl: 'http://localhost:9999/tpms/addUser',
    viewUserUrl: 'http://localhost:9999/tpms/userList',
    editUserUrl: 'http://localhost:9999/tpms/getUserById/',
    getRoleUrl: 'http://localhost:9999/tpms/getRoleDetails',
    deleteUserUrl: 'http://localhost:9999/tpms/deleteUser/',
    duplicateUserCheckUrl: 'http://localhost:9999/tpms/duplicateCheck/',

    //contact URL
    contactUrl : 'http://localhost:9999/tpms/emp/uploadedData',
    findContactNo : 'http://localhost:9999/tpms/emp/talent/${id}',
    createTalentUrl : 'http://localhost:9999/tpms/emp/hello',


    //Attendance URL
    platformUrl : 'http://localhost:9999/tpms/getplatform',
    attendanceSaveUrl : 'http://localhost:9999/tpms/submitAttendance',
    reportData : 'http://localhost:9999/tpms',

    //Activity Report
    activityReportData : 'http://localhost:9999/tpms/activityReportData',

};