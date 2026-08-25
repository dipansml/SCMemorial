// components/common/FullScreenLoader.tsx

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import Colors from '../theme/colors';
import { CommonStyles } from '../style/CommonStyles';
type Props = {
  visible: boolean;
  text?: string;
};

const FullScreenLoader = ({
  visible,
  text = 'Loading...',
}: Props) => {
  if (!visible) return null;

  return (
    <View style={CommonStyles.loaderOverlay}>

        <ActivityIndicator size="large" color={Colors.loaderColor} />
        <Text style={CommonStyles.loaderText}>
          {text}
        </Text>
    </View>
  );
};

export default FullScreenLoader;

const styles = StyleSheet.create({
  
});