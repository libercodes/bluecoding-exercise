import { HttpStatus } from '@nestjs/common'

const {
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
} = HttpStatus


export const errorsCatalogs = {
  EMAIL_OR_PASSWORD_INVALID: {
    message: 'Email or password invalid',
    code: 'EMAIL_OR_PASSWORD_INVALID',
    httpStatus: UNAUTHORIZED
  },
  PASSWORD_INVALID: {
    message: 'password invalid',
    code: 'PASSWORD_INVALID',
    httpStatus: UNAUTHORIZED
  },
  LOG_NOT_FOUND: {
    message: 'The log was not found',
    code: 'LOG_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  USER_NOT_FOUND: {
    message: 'User was not found',
    code: 'USER_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  USER_EMAIL_NOT_FOUND: {
    message: 'Could not find a user with that email',
    code: 'USER_EMAIL_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  USER_EMAIL_ALREADY_EXISTS: {
    message: 'That user email is already taken',
    code: 'USER_EMAIL_ALREADY_EXISTS',
    httpStatus: BAD_REQUEST
  },
  NOT_AUTHENTICATED: {
    message: 'User not authenticated',
    code: 'NOT_AUTHENTICATED',
    httpStatus: UNAUTHORIZED
  },
  CATEGORY_NOT_FOUND: {
    message: 'Category was not found',
    code: 'CATEGORY_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  COURSE_NOT_FOUND: {
    message: 'Course was not found',
    code: 'COURSE_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  COURSE_SECTION_NOT_FOUND: {
    message: 'Course section was not found',
    code: 'COURSE_SECTION_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  LESSON_NOT_FOUND: {
    message: 'Lesson was not found',
    code: 'LESSON_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  COURSE_INSTANCE_NOT_FOUND: {
    message: 'Course instance was not found',
    code: 'COURSE_INSTANCE_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  IMAGE_NOT_FOUND: {
    message: 'Image was not found',
    code: 'IMAGE_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
}
