export const ErrorMessages = {
    AUTH: {
      REQUIRED: 'This field is required',
      EMAIL: {
        REQUIRED: 'Email is required',
        INVALID: 'Please enter a valid email address',
        IN_USE: 'This email is already in use'
      },
      NAME: {
        REQUIRED: 'Name is required',
        MIN_LENGTH: 'Name must be at least 3 characters'
      },
      DATE_OF_BIRTH: {
        REQUIRED: 'Date of birth is required',
        MAX: 'You must be at least 16 years old',
        MIN: 'Please enter a valid date of birth.',
        FORMAT: 'Date of birth must be in the format YYYY.MM.DD.'
      },
      PASSWORD: {
        REQUIRED: 'Password is required',
        REQUIREMENTS: 'Password requirements are not met'
      },
      GENERIC: {
        EMPTY_FIELDS: 'One or more fields are empty',
        NOT_VALID: 'One or more fields are filled incorrectly'
      }
    },
    GENERIC: {
      UNKNOWN: 'An unexpected error occurred'
    }
  } as const;