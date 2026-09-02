import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import StorageManager from '../services/StorageManager';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export async function openParentDrawer() {
  if (!navigationRef.isReady()) {
    return;
  }

  const currentRoute = navigationRef.getCurrentRoute()?.name;
  const drawerRoute = (await StorageManager.isLoggedInStudent())
    ? 'StudentDrawer'
    : 'ParentDrawer';

  if (currentRoute === drawerRoute) {
    return;
  }

  navigationRef.navigate(drawerRoute);
}
