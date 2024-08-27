import React, { useState, useEffect, createContext, useContext } from "react";
import Auth0 from "react-native-auth0";
import SInfo from "react-native-sensitive-info";
import server from "../services/server";
import settings from "../settings";

const auth0 = new Auth0({
  domain: settings.AUTH_DOMAIN,
  clientId: settings.AUTN_CLIENT_ID,
});

type IAuthContext = {
  login: () => Promise<void>
  getAccessToken: () => Promise<string>
  logout: () => void
  loggedIn: boolean;
  loading: boolean;
  userData: any;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  const getUserData = async (access_token?: any) => {
    const accessToken = access_token
      ? access_token
      : await SInfo.getItem("accessToken", {});

    if (!accessToken) throw new Error("user not authenticated")

    server.defaults.headers['Authorization'] = `bearer ${accessToken}`;
    
    const data = await auth0.auth.userInfo({ token: accessToken });
    return data;
  };

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
      } catch (err) {
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

  const logout = () => {
    try {
      auth0.webAuth.clearSession()
        .then(async success => {
          await SInfo.deleteItem("accessToken", {});
          await SInfo.deleteItem("refreshToken", {});

          setLoggedIn(false);
          setUserData(null);
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
    login,
    logout,
    userData,
    getAccessToken,
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