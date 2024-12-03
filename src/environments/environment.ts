import * as dotenv from 'dotenv';

dotenv.config();


export const environment = {
  production: false,
  openAiKey: process.env['openAiKey'] || '',
};
