const jsonRes = {
  // 01xxx - Tài khoản
  REGISTERED_SUCCESSFULLY: {
    statusCode: '01000',
    message: 'Register successfully !!!'
  },
  REGISTRATION_FAILED: {
    statusCode: '01001',
    message: 'Register failed !!!'
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: '01002',
    message: 'Email exited !!!'
  },
  LOGIN_SUCCESSFUL: {
    statusCode: '01003',
    message: 'Login successfully !!!'
  },
  LOGIN_FAILED: {
    statusCode: '01004',
    message: 'Login failed !!!'
  },
  ACCOUNT_NOT_ACTIVATED: {
    statusCode: '01005',
    message: 'Account has not been active yet'
  },
  ACCOUNT_NOT_REGISTERED: {
    statusCode: '01006',
    message: 'Account has not been registered'
  },
  PASSWORD_INCORRECT: {
    statusCode: '01007',
    message: 'Password incorrect'
  },
  //   PHONE_ALREADY_EXISTS: {
  //     statusCode: '01008',
  //     message: 'Số điện thoại đã tồn tại'
  //   },
  USERNAME_ALREADY_EXISTS: {
    statusCode: '01009',
    message: 'Username exited'
  },
  RESET_PASSWORD_SUCCESSFUL: {
    statusCode: '01010',
    message: 'Change password successfully'
  },
  RESET_PASSWORD_FAILED: {
    statusCode: '01011',
    message: 'Change password failed'
  },
  INVALID_TOKEN: {
    statusCode: '01012',
    message: 'Invalid token'
  },
  ACCESS_DENIED: {
    statusCode: '01013',
    message: 'Truy cập bị từ chối'
  },
  ACCOUNT_WAS_DELETED: {
    statusCode: '01014',
    message: 'Tài khoản đã bị vô hiệu hóa'
  },
  OTP_IS_INCORRECT: {
    statusCode: '01015',
    message: 'OTP không đúng'
  },
  OTP_EXPIRED: {
    statusCode: '01016',
    message: 'OTP hết hạn'
  },
  ACTIVE_SUCCESSFULLY: {
    statusCode: '01017',
    message: 'Kích hoạt tài khoản thành công'
  },
  ACCOUNT_WAS_ACTIVED: {
    statusCode: '01018',
    message: 'Tài khoản đã kích hoạt'
  },
  LOGOUT_SUCCESSFULLY: {
    statusCode: '01019',
    message: 'Đăng xuất thành công'
  },
  REFRESH_TOKEN_DOES_NOT_EXIST: {
    statusCode: '01020',
    message: 'Refresh Token không tồn tại'
  },
  REFRESH_SUCCESSFULLY: {
    statusCode: '01021',
    message: 'Refresh Token thành công'
  },
  SEND_OTP_SUCCESSFULLY: {
    statusCode: '01022',
    message: 'Gửi OTP thành công'
  },
  VERIFY_OTP_SUCCESSFULLY: {
    statusCode: '01023',
    message: 'Verify OTP thành công'
  },
  PASSWORD_CHANGE_SUCCESSFULLY: {
    statusCode: '01022',
    message: 'Thay đổi password thành công'
  },
  USERS_TO_FOLLOW: {
    statusCode: '01025',
    message: 'Người dùng để theo dõi'
  },
  FRIEND_LIST: {
    statusCode: '01026',
    message: 'Danh sách bạn bè'
  },
  MUTUAL_FRIENDS_LIST: {
    statusCode: '01027',
    message: 'Danh sách bạn chung'
  },
  FRIEND_REQUESTS: {
    statusCode: '01028',
    message: 'Yêu cầu kết bạn'
  },
  USERS_FOLLOWING: {
    statusCode: '01029',
    message: 'Người dùng đang theo dõi'
  },
  FRIEND_REQUESTS_RECEIVED: {
    statusCode: '01030',
    message: 'Yêu cầu kết bạn đã nhận'
  },
  USER_BLOCKED: {
    statusCode: '01031',
    message: 'Người dùng đã bị chặn'
  },
  USER_FOLLOWED: {
    statusCode: '01032',
    message: 'Người dùng đã theo dõi'
  },
  USER_UNFOLLOWED: {
    statusCode: '01033',
    message: 'Người dùng đã bỏ theo dõi'
  },
  FRIENDSHIP_VERIFIED: {
    statusCode: '01034',
    message: 'Kết bạn đã được xác nhận'
  },
  USER_UNBLOCKED: {
    statusCode: '01035',
    message: 'Người dùng đã được mở chặn'
  },
  BEST_FRIEND_MARKED: {
    statusCode: '01036',
    message: 'Đã đánh dấu là bạn thân nhất'
  },
  BEST_FRIEND_LEFT: {
    statusCode: '01037',
    message: 'Đã bỏ đánh dấu là bạn thân nhất'
  },
  INVITATION_DELETED: {
    statusCode: '01038',
    message: 'Lời mời đã bị xóa'
  },
  FRIEND_REQUEST_SENT: {
    statusCode: '01039',
    message: 'Gửi lời mời kết bạn'
  },
  USER_NOT_BLOCKED: {
    statusCode: '01040',
    message: 'Người dùng chưa bị chặn'
  },
  FRIENDSHIP_DELETED: {
    statusCode: '01041',
    message: 'Kết bạn đã bị xóa'
  },
  FRIEND_SUGGEST: {
    statusCode: '01042',
    message: 'Đề xuất bạn bè'
  },
  BLOCK_LIST: {
    statusCode: '01043',
    message: 'Danh sách người dùng đã chặn'
  },
  RECENT_CONVERSATIONS_RETRIEVED: {
    statusCode: '01044',
    message: 'Đã lấy được các cuộc trò chuyện gần đây'
  },
  CONVERSATION_RETRIEVED: {
    statusCode: '01045',
    message: 'Đã lấy được cuộc trò chuyện'
  },
  CONVERSATION_CREATED: {
    statusCode: '01046',
    message: 'Đã tạo cuộc trò chuyện'
  },
  NICKNAME_CHANGED: {
    statusCode: '01047',
    message: 'Đã thay đổi biệt danh'
  },
  CONVERSATION_RENAMED: {
    statusCode: '01048',
    message: 'Đã đổi tên cuộc trò chuyện'
  },
  CONVERSATION_PHOTO_CHANGED: {
    statusCode: '01049',
    message: 'Đã thay đổi ảnh cuộc trò chuyện'
  },
  CONVERSATION_MEMBERS_RETRIEVED: {
    statusCode: '01050',
    message: 'Đã lấy được thành viên cuộc trò chuyện'
  },
  MEMBERS_ADDED_TO_CONVERSATION: {
    statusCode: '01051',
    message: 'Đã thêm thành viên vào cuộc trò chuyện'
  },
  CONVERSATION_MEMBERS_DELETED: {
    statusCode: '01052',
    message: 'Đã xóa thành viên khỏi cuộc trò chuyện'
  },
  LEFT_CONVERSATION: {
    statusCode: '01053',
    message: 'Đã rời khỏi cuộc trò chuyện'
  },
  CONVERSATION_DELETED: {
    statusCode: '01054',
    message: 'Đã xóa cuộc trò chuyện'
  },
  ALL_MESSAGES_IN_CONVERSATION_DELETED: {
    statusCode: '01055',
    message: 'Đã xóa tất cả tin nhắn trong cuộc trò chuyện'
  },
  JOIN_LINK_CREATED: {
    statusCode: '01056',
    message: 'Đã tạo liên kết tham gia'
  },
  JOIN_INFO_RETRIEVED: {
    statusCode: '01057',
    message: 'Đã lấy được thông tin tham gia'
  },
  CONVERSATION_ADMIN_ADDED: {
    statusCode: '01058',
    message: 'Đã thêm quản trị viên cuộc trò chuyện'
  },
  CONVERSATION_ADMIN_DELETED: {
    statusCode: '01059',
    message: 'Đã xóa quản trị viên cuộc trò chuyện'
  },
  JOIN_LINKS_RETRIEVED: {
    statusCode: '01060',
    message: 'Đã lấy được liên kết tham gia'
  },
  JOIN_LINK_UPDATED: {
    statusCode: '01061',
    message: 'Đã cập nhật liên kết tham gia'
  },
  JOIN_LINK_DELETED: {
    statusCode: '01062',
    message: 'Đã xóa liên kết tham gia'
  },
  JOINED_CONVERSATION: {
    statusCode: '01063',
    message: 'Đã tham gia cuộc trò chuyện'
  },

  // code 400
  USER_NOT_FOUND: {
    statusCode: '04001',
    message: 'Không tìm thấy người dùng'
  },
  CONFLICT: {
    statusCode: '04002',
    message: 'Xung đột đã xảy ra'
  },
  UNPROCESSABLE_ENTITY: {
    statusCode: '04003',
    message: 'Dữ liệu được cung cấp không hợp lệ'
  },
  WRONG_TARGET_USER: {
    statusCode: '04004',
    message: 'Người dùng mục tiêu không đúng'
  },
  FRIEND_REQUESTS_EXIST: {
    statusCode: '04005',
    message: 'Yêu cầu kết bạn đã tồn tại'
  },
  USERS_ALREADY_FRIEND: {
    statusCode: '04006',
    message: 'Người dùng đã là bạn bè'
  },
  FRIEND_REQUESTS_NOT_FOUND: {
    statusCode: '04007',
    message: 'Không tìm thấy yêu cầu kết bạn'
  },
  USERS_NOT_FRIEND: {
    statusCode: '04008',
    message: 'Người dùng không phải là bạn bè'
  },
  USER_ALREADY_FOLLOWED: {
    statusCode: '04009',
    message: 'Người dùng đã theo dõi'
  },
  USER_NOT_FOLLOWED: {
    statusCode: '04010',
    message: 'Người dùng không theo dõi'
  },
  USERS_ALREADY_BEST_FRIEND: {
    statusCode: '01044',
    message: 'Người dùng đã là bạn thân nhất'
  },
  USERS_NOT_BEST_FRIEND: {
    statusCode: '04011',
    message: 'Người dùng không phải là bạn thân nhất'
  },
  INVITATION_NOT_FOUND: {
    statusCode: '04012',
    message: 'Không tìm thấy lời mời'
  },
  CONVERSATION_NOT_FOUND: {
    statusCode: '04013',
    message: 'Không tìm thấy cuộc trò chuyện'
  },
  CANNOT_RENAME_DIRECT_ROOM: {
    statusCode: '04014',
    message: 'Không thể đổi tên phòng trực tiếp'
  },
  YOU_ARE_NOT_ADMIN: {
    statusCode: '04015',
    message: 'Bạn không phải là quản trị viên'
  },
  CANT_DELETE_GROUP_AUTHOR: {
    statusCode: '04016',
    message: 'Không thể xóa tác giả nhóm'
  },
  CONVERSATION_ALREADY_EXISTS: {
    statusCode: '04017',
    message: 'Hội thoại cá nhân đã tồn tại'
  },
  JOIN_LINK_NOT_FOUND: {
    statusCode: '04018',
    message: 'Không tìm thấy liên kết tham gia'
  },

  // code 500
  INTERNAL_SERVER_ERROR: {
    statusCode: '05014',
    message: 'Lỗi máy chủ nội bộ'
  },
  //   Common
  INVALID_INFORMATION: {
    statusCode: '00001',
    message: 'Dữ liệu không hợp lệ'
  },
  GET_LIST_SUCCESSFULLY: {
    statusCode: '01000',
    message: 'Lấy danh sách thành công'
  },
  GET_LIST_FAILED: {
    statusCode: '01004',
    message: 'Lấy danh sách không thành công'
  }
}

export { jsonRes }
