import Joi from 'joi'

interface RegisterSchema {
  fullName: string
  email: string
  password: string
}

const registerSchema = Joi.object<RegisterSchema>({
  fullName: Joi.string()
    .required()
    .regex(/^[a-zA-ZÀ-ỹ]+( [a-zA-ZÀ-ỹ0-9]+){1,}$/),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(50)
})

interface ActiveSchema {
  otp: string
  email: string
}

const activeSchema = Joi.object<ActiveSchema>({
  otp: Joi.string().length(6).required(),
  email: Joi.string().email().required()
})

interface LoginSchema {
  email: string
  password: string
}

const loginSchema = Joi.object<LoginSchema>({
  email: Joi.alternatives()
    .try(Joi.string().regex(/^(03|05|07|08|09)+([0-9]{8})$/), Joi.string().email())
    .required(),
  password: Joi.string().required().min(6).max(50)
})

interface LogoutSchema {
  refreshToken: string
}

const logoutSchema = Joi.object<LogoutSchema>({
  refreshToken: Joi.string().required()
})

interface RefreshTokenSchema {
  refreshToken: string
}

const refreshTokenSchema = Joi.object<RefreshTokenSchema>({
  refreshToken: Joi.string().required()
})

interface EmailSchema {
  email: string
}

const emailSchema = Joi.object<EmailSchema>({
  email: Joi.string().email().required()
})

interface ForgotSchema {
  otp: string
  email: string
  password: string
}

const forGotSchema = Joi.object<ForgotSchema>({
  otp: Joi.string().length(6).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(50)
})

interface ResetPasswordSchema {
  email: string
  password: string
  newPassword: string
}

const resetPasswordSchema = Joi.object<ResetPasswordSchema>({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(50),
  newPassword: Joi.string().required().min(6).max(50)
})

export {
  registerSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  emailSchema,
  activeSchema,
  forGotSchema,
  resetPasswordSchema
}
