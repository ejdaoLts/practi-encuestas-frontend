import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;

export const END_POINTS = {
  V1: {
    AUTH: {
      LOGIN: `${apiUrl}/api/v1/login`,
    },
  },
};
