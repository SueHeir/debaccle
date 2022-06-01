declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      SESSION_SECRET: string;
      CORS_ORIGIN: string;
      GCP_PROJECT_ID: string;
      GCP_CLIENT_EMAIL: string;
      GCP_PRIVATE_KEY: string;
      ONESIGNAL_APP_KEY: string;
      ONESIGNAL_USER_KEY: string;
      ONESIGNAL_APP_ID: string;
      EMAIL_PASSWORD: string;
    }
  }
}

export {}
