/**
 * Defind special codes for our api errors.
 */
export enum AppErrorCode {
  ACCOUNT_NOT_EXIST = 29605, // account not exist when login
  ACCOUNT_IS_BANNED = 29606, // account is banned by admin
  ACCOUNT_IS_REJECTED = 29607, // account is rejected by admin
  USER_NOT_ACTIVE = 29609, // user not active
}
