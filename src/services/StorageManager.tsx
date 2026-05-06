import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../Model/Login/User';

class StorageManager {
  // 🔑 Keys (centralized)
  private static KEYS = {
    TOKEN: 'token',
    USER: 'user',
  };

  // ✅ Save Token
  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.TOKEN, token);
    } catch (error) {
      console.log('Error saving token:', error);
    }
  }

  // ✅ Get Token
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.KEYS.TOKEN);
    } catch (error) {
      console.log('Error getting token:', error);
      return null;
    }
  }

  // ✅ Save User Object
  static async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.KEYS.USER,
        JSON.stringify(user)
      );
    } catch (error) {
      console.log('Error saving user:', error);
    }
  }

  // ✅ Get User Object
  static async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log('Error getting user:', error);
      return null;
    }
  }

  // ✅ Remove Token
  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.TOKEN);
    } catch (error) {
      console.log('Error removing token:', error);
    }
  }

  // ✅ Clear All Storage (Logout)
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log('Error clearing storage:', error);
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return typeof token === 'string' && token.trim().length > 0;
 }
}


export default StorageManager;