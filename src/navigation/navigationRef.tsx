import { createNavigationContainerRef } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function openParentDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push('ParentDrawer'));
    //navigationRef.dispatch(StackActions.push('StudentDrawer'));
  }
}