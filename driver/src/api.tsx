import axios from 'axios';
import { Platform } from 'react-native';

const instance = axios.create({
  baseURL: 'http://192.168.35.177:3000',
  timeout: 10000,
});

export default {
  login(id: string, pw: string, fcmToken: string) {
    return instance.post('/driver/login', {
      userId: id,
      userPw: pw,
      fcmToken: fcmToken,
    });
  },
  register(id: string, pw: string, fcmToken: string) {
    return instance.post('/driver/register', {
      userId: id,
      userPw: pw,
      fcmToken: fcmToken,
    });
  },
  list(id: string) {
    return instance.post('/driver/list', { userId: id });
  },
  accept(driverId: string, callId: string, userId: string) {
    return instance.post('/driver/accept', {
      driverId: driverId,
      callId: callId,
      userId: userId,
    });
  },
};
