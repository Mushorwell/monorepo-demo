import { makeFetchCall } from '@monorepo-demo/utilities';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface Props {
  userProfileUrl: string;
  children: any;
  userProfilePicUrl?: string;
}

interface IContext {
  currentUserProfile?: { [key: string]: any };
  currentUserProfilePic?: { [key: string]: any };
  isAdmin?: boolean;
  validUser?: boolean;
}

const AuthenticationContext = createContext<IContext>(null!);

export function AuthenticationProvider({
  userProfileUrl,
  userProfilePicUrl,
  children,
}: Props): ReactNode {
  const [currentUserProfile, setCurrentUserProfile] = useState<{
    [key: string]: any;
  }>();
  const [currentUserProfilePic, setCurrentUserProfilePic] =
    useState<Record<string, any>>();
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState();
  const { keycloak } = useSpaKeycloak();
  const setState = useAppStore((state: any) => state.setState);

  useEffect(() => {
    const getCurrentUserProfile = async (token: string) => {
      return await makeFetchCall(userProfileUrl, { token });
    };

    const getCurrentUserProfileImage = async (token: string) => {
      if (!userProfilePicUrl) return;
      return await makeFetchCall(
        userProfilePicUrl,
        { token },
        { file_id: currentUserProfile?.profile_pic }
      );
    };

    if (keycloak) {
      getCurrentUserProfile((keycloak as any).token).then((profile) => {
        const ADMIN_ROLE = 43;
        setCurrentUserProfile((profile as any).payload);
        const isAdmin = (profile as any).payload?.roles?.some(
          (role: number) => role === ADMIN_ROLE
        );
        setCurrentUserIsAdmin(isAdmin);
        setState({ my_profile: (profile as any).payload, isAdmin });
      });
      getCurrentUserProfileImage((keycloak as any).token).then((proPic) => {
        setCurrentUserProfilePic((proPic as any).payload);
        setState({ my_profile_picture: (proPic as any).payload });
      });
    } else {
      console.warn('Not logged in');
    }
  }, [
    userProfileUrl,
    userProfilePicUrl,
    keycloak,
    currentUserProfile?.profile_pic,
    setState,
  ]);

  const validUser = useMemo(() => {
    const STAFF_ROLES = [43, 9, 10];
    return (currentUserProfile as any)?.roles?.every((role: number) =>
      STAFF_ROLES.includes(role)
    );
  }, [currentUserProfile]);

  const contextValue = useMemo(
    () => ({
      currentUserProfile,
      currentUserProfilePic,
      isAdmin: currentUserIsAdmin,
      validUser,
    }),
    [currentUserProfile, currentUserProfilePic, currentUserIsAdmin, validUser]
  );

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {keycloak ? children : <SplashScreenLoader transparent={true} />}
    </AuthenticationContext.Provider>
  );
}

export function useAuthorisation() {
  const context = useContext<IContext>(AuthenticationContext);
  if (!context) {
    throw new Error(
      'useAuthorisation must be used within an AuthorisationProvider'
    );
  }
  return context;
}
