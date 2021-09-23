import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { Button, Platform, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const useProxy = Platform.select({ web: false, default: true });

export default function App() {
  // Endpoint
  const discovery = useAutoDiscovery('https://dev-52145880.okta.com/oauth2/default');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '0oa1flxvrsX3uPkcL5d7',
      scopes: ['openid', 'profile'],
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: 'com.okta.dev-52145880:/callback',
        useProxy,
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      }
  }, [response]);

  return (
    <View style={{marginTop:100}}>
      <Button
            disabled={!request}
            title="Login"
            onPress={() => {
              promptAsync({ useProxy });
              }}
          />
    </View>
    
  );
}