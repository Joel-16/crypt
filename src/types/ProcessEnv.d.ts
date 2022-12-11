declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    USER_JWT_SECRET: string;
    STAFF_JWT_SECRET: string;
    API_SECRET: string;
    API_KEY: string;
    CLOUD_NAME: string;
    PAYSTACK_SECRET_KEY: string;
    QPAYSECRET: string;
    LIVE_KEY: string;
  }
}
