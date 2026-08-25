import React, {useState, useEffect, useRef} from 'react';
import {View, ActivityIndicator, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';

const CCAvenuePayment = ({route, navigation}: any) => {
  const {paymentUrl} = route.params;

  // Use any here because of the WebView typing issue
  const webViewRef = useRef<any>(null);

  const [canGoBack, setCanGoBack] = useState(false);

  const handleNavigation = (navState: any) => {
    const {url} = navState;

    console.log('WebView URL:', url);

    // CCAvenue success/failure handling
    // if (url.includes('/payment/success')) {
    //   navigation.replace('PaymentSuccess');
    // }

    // if (url.includes('/payment/failure')) {
    //   navigation.replace('PaymentFailed');
    // }
  };

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }

      // Let React Navigation handle the back
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => {
      subscription.remove();
    };
  }, [canGoBack]);

  return (
    <View style={{flex: 1}}>
      {/* <WebView
        ref={webViewRef}
        source={{uri: paymentUrl}}
        onNavigationStateChange={navState => {
          setCanGoBack(navState.canGoBack);
          handleNavigation(navState);
        }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            style={{flex: 1}}
          />
        )}
      /> */}

       <WebView
        source={{uri: paymentUrl}}
        onNavigationStateChange={handleNavigation}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            style={{flex: 1}}
          />
        )}
      />
    </View>
  );
};

export default CCAvenuePayment;