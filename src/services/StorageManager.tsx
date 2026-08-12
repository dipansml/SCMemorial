import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../Model/Login/User';

class StorageManager {
  // 🔑 Keys (centralized)
  private static KEYS = {
    TOKEN: 'token',
    ROLE: 'role',
    USER: 'user',
    LOGIN_DATA_STUDENT: 'login_data_student',
    LOGIN_DATA_PARENTS: 'login_data_parents',
    STUDENT_ID: 'student_id',
    PARENT_ID: 'parent_id',
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

  // ✅ Save Role
  static async setRole(role: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.ROLE, role);
    } catch (error) {
      console.log('Error saving role:', error);
    }
  }

  // ✅ Get Role
  static async getRole(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.KEYS.ROLE);
    } catch (error) {
      console.log('Error getting role:', error);
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
  static async clearLoginData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.TOKEN);
      await AsyncStorage.removeItem(this.KEYS.USER);
      await AsyncStorage.removeItem(this.KEYS.STUDENT_ID);
      await AsyncStorage.removeItem(this.KEYS.PARENT_ID);
    } catch (error) {
      console.log('Error clearing login data:', error);
    }
  }

 static async isLoggedIn(): Promise<boolean> {
  try {

    const token = await this.getToken();

    const studentId =
      await this.getStudentId();

    return (
      typeof token === 'string' &&
      token.trim().length > 0 &&
      typeof studentId === 'string' &&
      studentId.trim().length > 0
    );

  } catch (error) {
    console.log('Error checking login:', error);
    return false;
  }
}


  static async isLoggedInStudent(): Promise<boolean> {
    const role = await this.getRole();
    return role === 'Student';
  }

  static async saveLoginDataStudent(
    username: string,
    password: string,
    rememberMe: boolean, 
  ): Promise<void> {
    try {
      const data = {
        username,
        password,
        rememberMe,
      };

      await AsyncStorage.setItem(
        this.KEYS.LOGIN_DATA_STUDENT,
        JSON.stringify(data)
      );
    } catch (error) {
      console.log('Error saving login data:', error);
    }
  }


  static async getLoginDataStudent(): Promise<{
    username: string;
    password: string;
    rememberMe: boolean;
  }> {
    try {
      const data = await AsyncStorage.getItem(
        this.KEYS.LOGIN_DATA_STUDENT
      );

      if (data) {
        return JSON.parse(data);
      }

      return {
        username: '',
        password: '',
        rememberMe: false,
      };
    } catch (error) {
      console.log('Error getting login data:', error);

      return {
        username: '',
        password: '',
        rememberMe: false,
      };
    }
  }


   static async saveLoginDataParents(
    username: string,
    password: string,
    rememberMe: boolean, 
  ): Promise<void> {
    try {
      const data = {
        username,
        password,
        rememberMe,
      };

      await AsyncStorage.setItem(
        this.KEYS.LOGIN_DATA_PARENTS,
        JSON.stringify(data)
      );
    } catch (error) {
      console.log('Error saving login data:', error);
    }
  }


  static async getLoginDataParents(): Promise<{
    username: string;
    password: string;
    rememberMe: boolean;
  }> {
    try {
      const data = await AsyncStorage.getItem(
        this.KEYS.LOGIN_DATA_PARENTS
      );

      if (data) {
        return JSON.parse(data);
      }

      return {
        username: '',
        password: '',
        rememberMe: false,
      };
    } catch (error) {
      console.log('Error getting login data:', error);

      return {
        username: '',
        password: '',
        rememberMe: false,
      };
    }
  }

  // Remove remember me login data student
  static async removeLoginDataStudent(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.LOGIN_DATA_STUDENT);
    } catch (error) {
      console.log('Error removing login data:', error);
    }
  }

  // Remove remember me login data Parent
  static async removeLoginDataParents(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.LOGIN_DATA_PARENTS);
    } catch (error) {
      console.log('Error removing login data:', error);
    }
  }

    static async setStudentId(


    studentId: string
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.KEYS.STUDENT_ID,
        studentId
      );
    } catch (error) {
      console.log('Error saving student ID:', error);
    }
  }

  

  static async getStudentId(): Promise<string> {
    try {
      const studentId =
        await AsyncStorage.getItem(
          this.KEYS.STUDENT_ID
        );

      return studentId || '';

    } catch (error) {
      console.log('Error getting student ID:', error);
      return '';
    }
  }

  static async setParentId(
    parentId: string
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.KEYS.PARENT_ID,
        parentId
      );
    } catch (error) {
      console.log('Error saving parent ID:', error);
    }
  }

  
  static async getParentId(): Promise<string> {
    try {
      const parentId =
        await AsyncStorage.getItem(
          this.KEYS.PARENT_ID
        );

      return parentId || '';

    } catch (error) {
      console.log('Error getting parent ID:', error);
      return '';
    }
  }
}


export default StorageManager;