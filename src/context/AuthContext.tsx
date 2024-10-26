import React, { useState, useEffect, createContext, useContext } from "react";
import Auth0 from "react-native-auth0";
import SInfo from "react-native-sensitive-info";
import server from "../services/server";
import settings from "../settings";
import { useOrganizations } from "../hooks/useOrganizations";
import { Organization } from "../services/types";
import { usePostHog, useFeatureFlag } from "posthog-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AppState, Linking, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { OneSignal } from "react-native-onesignal";

const auth0 = new Auth0({
  domain: settings.AUTH_DOMAIN,
  clientId: settings.AUTN_CLIENT_ID,
});

type IAuthContext = {
  login: () => Promise<void>
  getAccessToken: () => Promise<string>
  saveAdInfoVisibility: () => Promise<void>
  saveOrderInfoVisibility: () => Promise<void>
  logout: (callback?: () => void) => void

  loggedIn: boolean;
  loading: boolean;
  adInfoVisibility: boolean;
  orderInfoVisibility: boolean;
  isFetchingOrganizations: boolean;
  organizations: Organization[] | undefined
  userData: any;
  currentOrg: Organization | undefined
  deviceVersion: DeviceVersion | undefined
  onDeprecatedNotification: (url: string) => void
  onVerifyAppVersion: () => void
}

type DeviceVersion = { platform: "ios" | "android", isDeprecated: boolean, storeUrl: string }

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [adInfoVisibility, setAdInfoVisibility] = useState<boolean>(true);
  const [orderInfoVisibility, setOrderInfoVisibility] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);
  const { organizations, isLoading: isFetchingOrganizations } = useOrganizations({ userID: userData?.sub, enabled: !!userData })
  const queryClient = useQueryClient();
  const posthog = usePostHog()

  const deviceVersion = DeviceInfo.getVersion() + "." + DeviceInfo.getBuildNumber()
  const [deviceVersionDeprecated, setDeviceVersionDeprecated] = useState<DeviceVersion | undefined>()

  const getUserData = async (access_token?: any) => {
    const accessToken = access_token
      ? access_token
      : await SInfo.getItem("accessToken", {});

    if (!accessToken) throw new Error("user not authenticated")

    server.defaults.headers['Authorization'] = `bearer ${accessToken}`;

    const data = await auth0.auth.userInfo({ token: accessToken });

    posthog.identify(data.sub,
      {
        email: data.email,
        name: data.name
      }
    )

    return data;
  };

  const saveAdInfoVisibility = async () => {
    setAdInfoVisibility((value) => !value)
    await SInfo.setItem("ad_visibility", String(!adInfoVisibility), {});
  }

  const getAdInfoVisibility = async () => {
    const value = await SInfo.getItem("ad_visibility", {});
    return value == 'true' || value == ''
  }

  const saveOrderInfoVisibility = async () => {
    setOrderInfoVisibility((value) => !value)
    await SInfo.setItem("order_visibility", String(!orderInfoVisibility), {});
  }

  const getOrderInfoVisibility = async () => {
    const value = await SInfo.getItem("order_visibility", {});
    return value == 'true' || value == ''
  }

  const getAccessToken = async () => {
    const accessToken = await SInfo.getItem("accessToken", {});
    return accessToken
  }

  const deviceFlag = posthog.getFeatureFlagPayload('app-version-control')

  const onVerifyAppVersion = () => {
    const deviceFlagPayload = posthog.getFeatureFlagPayload('app-version-control')
    if (deviceFlagPayload) {
      const deviceFlag = JSON.parse(JSON.stringify(deviceFlagPayload)) as { android: string, ios: string }
      const currentVersion = parseInt(deviceVersion.replace(/\./g, ""))
      const iosTargetVersion = parseInt(deviceFlag.ios.replace(/\./g, ""))
      const androidTargetVersion = parseInt(deviceFlag.ios.replace(/\./g, ""))

      if (Platform.OS == "ios") {
        if (deviceVersionDeprecated?.isDeprecated != currentVersion < iosTargetVersion) {
          setDeviceVersionDeprecated({
            isDeprecated: currentVersion < iosTargetVersion,
            platform: Platform.OS,
            storeUrl: ""
          })
        }
      }
      else {
        if (deviceVersionDeprecated?.isDeprecated != currentVersion < androidTargetVersion) {
          setDeviceVersionDeprecated({
            isDeprecated: currentVersion < androidTargetVersion,
            platform: "android",
            storeUrl: "http://play.google.com/store/apps/details?id=com.melitricsapp"
          })
        }
      }
    }
  }

  const onDeprecatedNotification = (url: string) => {
    Alert.alert("Atenção", "Melitrics tem uma nova versão obrigatória, atualize seu aplicativo", [
      {
        text: "sair",
        style: 'cancel',
        onPress: () => {

        },
      },
      {
        text: "continuar",
        style: "default",
        onPress: () => {
          if (url) {
            Linking.openURL(url)
          }
        },
      }], { cancelable: false })
  }


  useEffect(() => {
    if (deviceFlag) {
      onVerifyAppVersion()
    }
  }, [deviceFlag])

  useEffect(() => {
    if (userData && organizations?.length) {
      posthog.identify(userData.sub,
        {
          organization_id: organizations[0].organization_id,
          member_type: organizations[0].type,
          subscription_type: organizations[0].subscription_type,
          subscription_expires_at: organizations[0].subscription_expires_at,
        }
      )

      OneSignal.login(userData.sub)
      OneSignal.User.addEmail(userData.email)
      OneSignal.User.addTags({
        organization_id: String(organizations[0].organization_id),
        organization_name: String(organizations[0].name),
        subscription_type: String(organizations[0].subscription_type)
      })
    }
  }, [organizations, userData])

  // executed on first app load
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserData();

        setUserData(data);
        setLoading(false)

        const adVisibility = await getAdInfoVisibility()
        setAdInfoVisibility(adVisibility)

        const oderVisibility = await getOrderInfoVisibility()
        setOrderInfoVisibility(oderVisibility)

        setLoggedIn(true);
      } catch (err) {
        setLoading(false)
        try {
          const refreshToken = await SInfo.getItem("refreshToken", {});
          const newAccessTokenResponse = await auth0.auth.refreshToken({
            refreshToken,
          });

          await SInfo.setItem(
            "accessToken",
            newAccessTokenResponse.accessToken,
            {}
          );

          const userData = getUserData(newAccessTokenResponse.accessToken);

          setUserData(userData);
          setLoggedIn(true);
        } catch (err) {
          setLoggedIn(false);
        }
      }
    })();
  }, []);

  // executed when user just logged in
  useEffect(() => {
    (async () => {
      try {
        if (loggedIn) {
          const data = await getUserData();
          setUserData(data);
        }
      } catch (err) {
        console.log("error logging in: ", err);
      }
    })();
  }, [loggedIn]);

  const login = async () => {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: "openid offline_access profile email",
        audience: 'melitrics-api',
      });

      await SInfo.setItem("accessToken", credentials.accessToken, {});
      await SInfo.setItem("refreshToken", credentials.refreshToken || "", {})
      setLoggedIn(true);
    } catch (err) {
      console.log("error logging in..", err);
    }
  };

  const logout = (callback?: () => void) => {
    try {
      auth0.webAuth.clearSession()
        .then(async success => {
          await SInfo.deleteItem("accessToken", {});
          await SInfo.deleteItem("refreshToken", {});

          setLoggedIn(false);
          setUserData(null);
          setAdInfoVisibility(true)
          setOrderInfoVisibility(true)

          await queryClient.invalidateQueries({
            queryKey: ['user', 'orders', 'tax', 'ads', 'indicators-shipping-type', 'indicators', 'indicators-month']
          })

          if (callback) {
            callback()
          }
        })
        .catch(error => {
          console.log('Log out cancelled');
        });
    } catch (err) {
      console.log("error logging out..", err);
    }
  };

  const value: IAuthContext = {
    loading,
    loggedIn,
    currentOrg: organizations && organizations.length > 0 ? organizations[0] : undefined,
    userData,
    adInfoVisibility,
    orderInfoVisibility,
    login,
    logout,
    getAccessToken,
    saveAdInfoVisibility,
    saveOrderInfoVisibility,
    isFetchingOrganizations,
    organizations: organizations,
    deviceVersion: deviceVersionDeprecated,
    onDeprecatedNotification: onDeprecatedNotification,
    onVerifyAppVersion: onVerifyAppVersion,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;

};

export { useAuth, AuthContextProvider };