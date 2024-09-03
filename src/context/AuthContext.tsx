import React, { useState, useEffect, createContext, useContext } from "react";
import Auth0 from "react-native-auth0";
import SInfo from "react-native-sensitive-info";
import server from "../services/server";
import settings from "../settings";
import { useOrganizations } from "../hooks/useOrganizations";
import { Organization } from "../services/types";

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
  currentOrg: string
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [adInfoVisibility, setAdInfoVisibility] = useState<boolean>(true);
  const [orderInfoVisibility, setOrderInfoVisibility] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);
  const { organizations, isLoading: isFetchingOrganizations } = useOrganizations({ userID: userData?.sub, enabled: !!userData })

  const [currentOrg, setCurrentOrg] = useState<string>('cb2a3984-1d36-4435-94b0-32c5cbc2b8fc');

  const getUserData = async (access_token?: any) => {
    const accessToken = access_token
      ? access_token
      : await SInfo.getItem("accessToken", {});

    if (!accessToken) throw new Error("user not authenticated")

    server.defaults.headers['Authorization'] = `bearer ${accessToken}`;

    const data = await auth0.auth.userInfo({ token: accessToken });
    return data;
  };


  const saveAdInfoVisibility = async () => {
    setAdInfoVisibility((value) => !value)
    await SInfo.setItem("ad_visibility", String(!adInfoVisibility), {});
  }

  const getAdInfoVisibility = async () => {
    const value = await SInfo.getItem("ad_visibility", {});
    return value == 'true'
  }

  const saveOrderInfoVisibility = async () => {
    setOrderInfoVisibility((value) => !value)
    await SInfo.setItem("order_visibility", String(!orderInfoVisibility), {});
  }

  const getOrderInfoVisibility = async () => {
    const value = await SInfo.getItem("order_visibility", {});
    return value == 'true'
  }

  const getAccessToken = async () => {
    const accessToken = await SInfo.getItem("accessToken", {});
    return accessToken
  }

  // executed on first app load
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserData();
        setLoggedIn(true);
        setUserData(data);
        setLoading(false)

        const adVisibility = await getAdInfoVisibility()
        setAdInfoVisibility(adVisibility)


        const oderVisibility = await getOrderInfoVisibility()
        setOrderInfoVisibility(oderVisibility)

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
    currentOrg,
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