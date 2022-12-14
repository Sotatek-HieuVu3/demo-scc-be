export enum ErrorCode {
  UNKNOWN = 999,
  USER_BALANCE_NOT_ENOUGH = 1,
  AUTH_INVALID_EMAIL = 2,
  USER_WALLET_NO_WALLET_CONNECTED = 3,
  USER_WALLET_USER_WALLET_NOT_FOUND = 4,
  USER_WALLET_INVALID_WALLET_ADDRESS = 5,
  USER_WALLET_ALREADY_CONNECTED_WALLET_ADDRESS = 6,
  TOKEN_INVALID_TOKEN = 7,
  AUTH_TOKEN_INVALID_REFRESH_TOKEN = 8,
  AUTH_TOKEN_INVALID_ACCESS_TOKEN = 9,
  AUTH_ROLE_INVALID = 10,
  USER_ID_NOT_FOUND = 11,
  AUTH_INVALID_BASIC_AUTH_CREDENTIALS = 12,
}
