import { ResponseType } from "expo-auth-session";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = "0oa1flxvrsX3uPkcL5d7";

export default function App() {
  const [user, setUser] = React.useState(null);
  // Request
  const authorizationEndpoint = 'https://dev-52145880.okta.com/';
  // const authorizationEndpoint = 'https://dev-52145880.okta.com/oauth2/default';
  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: FB_APP_ID,
    // NOTICE: Please do not actually request the token on the client (see:
    // response_type=token in the authUrl), it is not secure. Request a code
    // instead, and use this flow:
    // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
    // The code here is simplified for the sake of demonstration. If you are
    // just prototyping then you don't need to concern yourself with this and
    // can copy this example, but be aware that this is not safe in production.
    responseType: ResponseType.Token,
    redirectUri: 'com.okta.dev-52145880:/callback'
    // redirectUri: 'com.okta.dev-52145880:/'
  },
    {
      authorizationEndpoint,
    } as AuthSession.DiscoveryDocument
  );

  if (request) {
    console.log(
      "You need to add this url to your authorized redirect urls on your Facebook app: " +
      request.redirectUri
    );
  }

  // React.useEffect(() => {
  //   if (response && response.type === "success" && response.authentication) {
  //     (async () => {
  //       const userInfoResponse = await fetch(
  //         `https://graph.facebook.com/me?access_token=${response?.authentication?.accessToken}&fields=id,name,picture.type(large)`
  //       );
  //       const userInfo = await userInfoResponse.json();
  //       setUser(userInfo);
  //     })();
  //   }
  // }, [response]);

  // const useProxy = Platform.select({ web: false, default: true });


  React.useEffect(() => {
    if (response?.type === 'success') {
      console.log("Login Successful!")
      const { code } = response.params;
    }
  }, [response]);

  const handlePressAsync = async () => {
    const result = await promptAsync();
    if (result.type !== "success") {
      console.log("res:", result)
      alert("Uh oh, something went wrong");
      return;
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <Profile user={user} />
      ) : (
        <Button
          disabled={!request}
          title="Open Okta Login"
          onPress={handlePressAsync}
        />
      )}
    </View>
  );
}

function Profile({ user }: any) {
  return (
    <View style={styles.profile}>
      <Image source={{ uri: user.picture.data.url }} style={styles.image} />
      <Text style={styles.name}>{user.name}</Text>
      <Text>ID: {user.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profile: {
    alignItems: "center",
  },
  name: {
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

// import * as React from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
// import { Button, Platform, View } from 'react-native';

// WebBrowser.maybeCompleteAuthSession();

// const useProxy = Platform.select({ web: false, default: true });

// export default function App() {
//   // Endpoint
//   // const discovery = useAutoDiscovery('https://dev-52145880.okta.com/oauth2/default');
//   const discovery = useAutoDiscovery('https://dev-52145880.okta.com');
//   // Request
//   const [request, response, promptAsync] = useAuthRequest(
//     {
//       clientId: '0oa1flxvrsX3uPkcL5d7',
//       scopes: ['openid', 'profile'],
//       // For usage in managed apps using the proxy
//       redirectUri: makeRedirectUri({
//         // For usage in bare and standalone
//         native: 'com.okta.dev-52145880:/callback',
//         useProxy,
//       }),
//     },
//     discovery
//   );

//   React.useEffect(() => {
//     if (response?.type === 'success') {
//       const { code } = response.params;
//       }
//   }, [response]);

//   return (
//     <View style={{marginTop:100}}>
//       <Button
//             disabled={!request}
//             title="Login"
//             onPress={() => {
//               promptAsync({ useProxy });
//               }}
//           />
//     </View>

//   );
// }

