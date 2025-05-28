import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// Google Auth Configuration
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({
      scheme: 'your-app-scheme',
      path: 'redirect',
    }),
  });

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${result.authentication?.accessToken}`,
          {
            headers: { Authorization: `Bearer ${result.authentication?.accessToken}` },
          }
        );
        
        const userInfo = await userInfoResponse.json();
        
        return {
          success: true,
          user: userInfo,
          accessToken: result.authentication?.accessToken,
        };
      } else {
        return {
          success: false,
          error: 'Authentication cancelled or failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred during authentication',
      };
    }
  };

  return {
    signInWithGoogle,
    request,
    response,
  };
};

// Example usage in your login/signup components:
/*
import { useGoogleAuth } from './google-auth';

const { signInWithGoogle } = useGoogleAuth();

const handleGoogleLogin = async () => {
  setIsLoading(true);
  
  const result = await signInWithGoogle();
  
  if (result.success) {
    // Handle successful login
    console.log('User info:', result.user);
    // Navigate to main app or save user data
  } else {
    Alert.alert('Error', result.error);
  }
  
  setIsLoading(false);
};
*/