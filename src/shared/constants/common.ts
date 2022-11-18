export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

export const VALIDATION_PIPE_OPTIONS = { transform: true, whitelist: true };

export const DEFAULT_TOKEN_DECIMAL = 18;
export const OTP_NUMBER_LENGTH = 6;

export const QUEUE_NAME = {
  DEFAULT: 'queue',
  VERIFIER: 'verifier',
  SOCKET: 'socket',
};

export const QUEUE_JOB = {
  MAIL_OTP: 'mail-otp',
  TRANSFER_TOKEN_TO_EXTERNAL_WALLET: 'transfer-token-to-external-wallet',
  TRANSFER_NFT_TO_EXTERNAL_WALLET: 'transfer-nft-to-external-wallet',
};

export const MAXIMUM_CONDITION = 100;
export const MAXIMUM_MINTING_TIME = 7;
export const MAX_NUMBER_OF_DIGITS_OF_TOKEN_ID = 9;
export const MAX_LEVEl_OF_CONTROLLER_BUTTON = 9;
export const MAX_LUCKY_BOX_USER_CAN_HAVE = 4;
