export interface JsonResponse {
  statusCode: string
  message: string
}

const jsonRes: { [key: string]: JsonResponse } = {
  // 01xxx - Tài khoản
  REGISTERED_SUCCESSFULLY: {
    statusCode: '1000',
    message: 'Register successfully !!!'
  },
  REGISTRATION_FAILED: {
    statusCode: '1001',
    message: 'Register failed !!!'
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: '1002',
    message: 'Email exited !!!'
  },
  LOGIN_SUCCESSFUL: {
    statusCode: '1003',
    message: 'Login successfully !!!'
  },
  LOGIN_FAILED: {
    statusCode: '1004',
    message: 'Login failed !!!'
  },
  ACCOUNT_NOT_ACTIVATED: {
    statusCode: '1005',
    message: 'Account has not been active'
  },
  ACCOUNT_NOT_REGISTERED: {
    statusCode: '1006',
    message: 'Account has not been registered'
  },
  PASSWORD_INCORRECT: {
    statusCode: '1007',
    message: 'Password incorrect'
  },
  //   PHONE_ALREADY_EXISTS: {
  //     statusCode: '01008',
  //     message: 'Số điện thoại đã tồn tại'
  //   },
  USERNAME_ALREADY_EXISTS: {
    statusCode: '1008',
    message: 'Username exited'
  },
  RESET_PASSWORD_SUCCESSFUL: {
    statusCode: '1010',
    message: 'Change password successfully'
  },
  RESET_PASSWORD_FAILED: {
    statusCode: '1011',
    message: 'Change password failed'
  },
  INVALID_TOKEN: {
    statusCode: '1012',
    message: 'Invalid token'
  },
  ACCOUNT_WAS_DELETED: {
    statusCode: '1014',
    message: 'Account was deleted'
  },
  OTP_IS_INCORRECT: {
    statusCode: '1015',
    message: 'Incorrect OTP'
  },
  OTP_EXPIRED: {
    statusCode: '1016',
    message: 'Expired OTP'
  },
  ACTIVE_SUCCESSFULLY: {
    statusCode: '1017',
    message: 'Activate account successfully'
  },
  ACCOUNT_WAS_ACTIVED: {
    statusCode: '1018',
    message: 'Account was activated'
  },
  LOGOUT_SUCCESSFULLY: {
    statusCode: '1019',
    message: 'Logout successfully'
  },
  REFRESH_TOKEN_DOES_NOT_EXIST: {
    statusCode: '1020',
    message: 'Refresh Token does not exist'
  },
  REFRESH_SUCCESSFULLY: {
    statusCode: '1021',
    message: 'Refresh Token Successfully'
  },
  SEND_OTP_SUCCESSFULLY: {
    statusCode: '1022',
    message: 'Send OTP successfully'
  },
  VERIFY_OTP_SUCCESSFULLY: {
    statusCode: '1023',
    message: 'Verify OTP successfully'
  },
  PASSWORD_CHANGE_SUCCESSFULLY: {
    statusCode: '1022',
    message: 'Change password successfully'
  },
  GET_USER_INFO: {
    statusCode: '01064',
    message: 'Get user info successfully'
  },
  UPDATE_USER_INFO: {
    statusCode: '01065',
    message: 'Update user info successfully'
  },
  // code 400
  USER_NOT_FOUND: {
    statusCode: '4001',
    message: 'User info not found'
  },
  CONFLICT: {
    statusCode: '4002',
    message: 'Conflict happen'
  },
  UNPROCESSABLE_ENTITY: {
    statusCode: '4003',
    message: 'The provided data is invalid'
  },
  WRONG_TARGET_USER: {
    statusCode: '4004',
    message: 'Incorrect target user'
  },
  YOU_ARE_NOT_ADMIN: {
    statusCode: '4015',
    message: 'You are not admin'
  },
  UNAUTHORIZED: {
    statusCode: '4011',
    message: 'Unauthorized!!!'
  },
  INVALID_OR_EXPIRED_TOKEN: {
    statusCode: '4012',
    message: 'Invalid or expired token!!!'
  },
  ACCESS_DENIED: {
    statusCode: '4013',
    message: 'Access denied'
  },

  // code 500
  INTERNAL_SERVER_ERROR: {
    statusCode: '5014',
    message: 'Internal server error'
  },
  //   Common
  INVALID_INFORMATION: {
    statusCode: '0001',
    message: 'Invalid data'
  },
  GET_LIST_SUCCESSFULLY: {
    statusCode: '1100',
    message: 'Get list data successfully'
  },
  GET_LIST_FAILED: {
    statusCode: '1104',
    message: 'Get list data unsuccessfully'
  }
}

export default jsonRes
