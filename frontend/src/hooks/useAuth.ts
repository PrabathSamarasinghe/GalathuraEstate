import { useMutation, useQuery } from '@apollo/client';
import {
  LOGIN,
  REGISTER,
  ME,
} from '../graphql/queries';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

interface LoginResponse {
  login: AuthPayload;
}

interface RegisterResponse {
  register: AuthPayload;
}

interface MeResponse {
  me: User;
}

export const useLogin = () => {
  const [loginMutation, { loading, error }] = useMutation<LoginResponse>(LOGIN);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { username, password },
      });

      if (data?.login.token) {
        localStorage.setItem('galathura_token', data.login.token);
        localStorage.setItem('galathura_user', JSON.stringify(data.login.user));
      }

      return data?.login;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  return { login, loading, error };
};

export const useRegister = () => {
  const [registerMutation, { loading, error }] = useMutation<RegisterResponse>(REGISTER);

  const register = async (username: string, email: string, password: string, fullName: string) => {
    try {
      const { data } = await registerMutation({
        variables: { username, email, password, fullName },
      });

      if (data?.register.token) {
        localStorage.setItem('galathura_token', data.register.token);
        localStorage.setItem('galathura_user', JSON.stringify(data.register.user));
      }

      return data?.register;
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  return { register, loading, error };
};

export const useCurrentUser = () => {
  const { data, loading, error, refetch } = useQuery<MeResponse>(ME, {
    fetchPolicy: 'network-only',
    skip: !localStorage.getItem('galathura_token'),
  });

  return {
    user: data?.me || null,
    loading,
    error,
    refetch,
    isAuthenticated: !!data?.me,
  };
};

export const logout = () => {
  localStorage.removeItem('galathura_token');
  localStorage.removeItem('galathura_user');
  window.location.href = '/';
};
