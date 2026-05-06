import { createNavigationContainerRef } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import StorageManager from '../services/StorageManager';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export async function openParentDrawer() {
  if (navigationRef.isReady()) {
    const userDetail = await StorageManager.getUser();
    if (userDetail?.user_role === 'Student') {
      navigationRef.dispatch(StackActions.push('StudentDrawer'));
    } else{
      navigationRef.dispatch(StackActions.push('ParentDrawer'));
    }
  }
}