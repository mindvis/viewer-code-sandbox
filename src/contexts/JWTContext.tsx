import { createContext, useEffect, useReducer, ReactElement } from "react";

// third-party
import { Chance } from "chance";
import jwtDecode from "jwt-decode";
// reducer - state management
import { LOGIN, LOGOUT } from "store/reducers/actions";
import authReducer from "store/reducers/auth";

// project-imports
import Loader from "components/Loader";
import axios from "utils/axios";
import { KeyedObject } from "types/root";
import { AuthProps, JWTContextType } from "types/auth";
import { useUser } from "../pages/user//UserContext";
const chance = new Chance();

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem("serviceToken", serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem("serviceToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);
export const JWTProvider = ({ children }: { children: ReactElement }) => {
  const { userData, setUserData } = useUser();
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem("serviceToken");
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          // const response = await axios.get('/api/account/me');
          const user = null;

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user,
            },
          });
        } else {
          dispatch({
            type: LOGOUT,
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT,
        });
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    console.log(process.env.REACT_APP_API_URL);
    const response = await axios.post(
      process.env.REACT_APP_API_URL + "/api/auth/login",
      { email, password }
    );
    const { serviceToken, user } = response.data;
    setSession(serviceToken);
    localStorage.setItem("role", user.role);
    setUserData(user);
    console.log(userData);

    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user,
      },
    });
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post("/api/account/register", {
      id,
      email,
      password,
      firstName,
      lastName,
    });
    let users = response.data;

    if (
      window.localStorage.getItem("users") !== undefined &&
      window.localStorage.getItem("users") !== null
    ) {
      const localUsers = window.localStorage.getItem("users");
      users = [
        ...JSON.parse(localUsers!),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`,
        },
      ];
    }

    window.localStorage.setItem("users", JSON.stringify(users));
  };

  const addModel = async (
    name: string,
    description: string,
    tags: any,
    file: string,
    thumbnail: string
  ) => {
    // todo: this flow need to be recode as it not verified
    const serviceToken = retrieveServiceToken();
    const id = chance.bb_pin();
    const response = await axios.post(
      process.env.REACT_APP_API_URL + "/api/model/add",
      {
        id,
        name,
        description,
        tags,
        file,
        thumbnail,
      },
      {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      }
    );
    let model = response.data;
    console.log(model);
  };

  const updateModel = async (
    modelId: string,
    name: string,
    description: string,
    tags: any,
    file: string,
    thumbnail: string
  ) => {
    // todo: this flow need to be recode as it not verified
    const serviceToken = retrieveServiceToken();
    const id = chance.bb_pin();
    const response = await axios.post(
      process.env.REACT_APP_API_URL + "/api/model/update/" + modelId,
      {
        id,
        name,
        description,
        tags,
        file,
        thumbnail,
      },
      {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      }
    );
    let model = response.data;
    console.log(model);
  };

  const updateUser = async (
    name: string,
    email: string,
    designation: string,
    phone: any,
    phone_ext: string
  ): Promise<void> => {
    try {
      const serviceToken = retrieveServiceToken();
      await axios
        .post(
          process.env.REACT_APP_API_URL + "/api/auth/profile/update",
          {
            name,
            email,
            designation,
            phone,
            phone_ext,
          },
          {
            headers: {
              Authorization: `Bearer ${serviceToken}`,
            },
          }
        )
        .then((response) => {
          return response;
        });
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle the error, perhaps throw it again or log it
      throw error;
    }
  };

  const createUser = async (
    name: string,
    email: string,
    designation: string,
    phone: any,
    phone_ext: string,
    role: string,
    password: string,
    confirm: string
  ): Promise<void> => {
    try {
      const serviceToken = retrieveServiceToken();
      await axios
        .post(
          process.env.REACT_APP_API_URL + "/api/user/admin/create",
          {
            name,
            email,
            designation,
            phone,
            phone_ext,
            role,
            password,
            confirm,
          },
          {
            headers: {
              Authorization: `Bearer ${serviceToken}`,
            },
          }
        )
        .then((response) => {
          return response;
        });
    } catch (error) {
      console.log(error);
      // Handle the error, perhaps throw it again or log it
      throw error;
    }
  };

  const userUpdate = async (
    id: string,
    name: string,
    email: string,
    designation: string,
    phone: any,
    phone_ext: string,
    role: string,
    password: string,
    confirm: string
  ): Promise<void> => {
    try {
      const serviceToken = retrieveServiceToken();
      await axios
        .post(
          process.env.REACT_APP_API_URL + "/api/user/admin/update",
          {
            id,
            name,
            email,
            designation,
            phone,
            phone_ext,
            role,
            password,
            confirm,
          },
          {
            headers: {
              Authorization: `Bearer ${serviceToken}`,
            },
          }
        )
        .then((response) => {
          return response;
        });
    } catch (error) {
      console.log(error);
      // Handle the error, perhaps throw it again or log it
      throw error;
    }
  };

  const changePassword = async (
    old: string,
    password: string,
    confirm: string
  ): Promise<any> => {
    try {
      const serviceToken = retrieveServiceToken();
      await axios
        .post(
          process.env.REACT_APP_API_URL + "/api/auth/change-password",
          {
            old,
            password,
            confirm,
          },
          {
            headers: {
              Authorization: `Bearer ${serviceToken}`,
            },
          }
        )
        .then((response) => {
          return response;
        });
    } catch (error) {
      return error;
    }
  };

  const getModels = async () => {
    // todo: this flow need to be recode as it not verified
    const serviceToken = retrieveServiceToken();
    await axios
      .get(process.env.REACT_APP_API_URL + "/api/model/get", {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      })
      .then((response) => {
        return response.data;
      });

    // const response = axios.get(process.env.REACT_APP_API_URL+'/api/model/get',{
    //   headers:{
    //     "Authorization": `Bearer ${serviceToken}`
    //   }
    // });
    //   resolve(response);
  };

  const retrieveServiceToken = () => {
    const storedToken = localStorage.getItem("serviceToken");
    if (storedToken) {
      return storedToken;
    }
    return null;
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("role");
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email: string) => {};

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider
      value={{
        ...state,
        login,
        retrieveServiceToken,
        logout,
        addModel,
        updateModel,
        getModels,
        changePassword,
        register,
        resetPassword,
        updateUser,
        updateProfile,
        createUser,
        userUpdate,
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
