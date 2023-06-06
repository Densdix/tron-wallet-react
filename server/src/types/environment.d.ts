export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DB_NAME: string
      DB_USER: string
      DB_PASSWORD: string
      DB_HOST: string
      CORS: string
      SECRET_KEY: string
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}