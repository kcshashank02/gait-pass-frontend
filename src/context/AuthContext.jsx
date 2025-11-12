import { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED LOGIN FUNCTION
  const login = async (credentials, isAdmin = false) => {
  try {
    const data = isAdmin 
      ? await authApi.adminLogin(credentials)
      : await authApi.login(credentials);

    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    // ✅ Combine first_name and last_name from backend
    const firstName = data.user.firstname || data.user.first_name || '';
    const lastName = data.user.lastname || data.user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || data.user.email?.split('@')[0] || 'User';
    
    const userData = {
      id: data.user.id,
      email: data.user.email,
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,  // ✅ Properly combined
      phone: data.user.phone,
      role: data.user.role
    };
    
    console.log('Logged in user data:', userData);  // ✅ Debug log
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);

    return data;
  } catch (error) {
    throw error;
  }
};



  const register = async (userData) => {
    const data = await authApi.register(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
















// import { createContext, useState, useEffect } from 'react';
// import { authApi } from '../api/authApi';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => 
//     {
//         const [user, setUser] = useState(null);
//         const [loading, setLoading] = useState(true);
//         const [isAuthenticated, setIsAuthenticated] = useState(false);

//         useEffect(() => {
//             checkAuth();
//         }, []);

//         const checkAuth = async () => {
//             try {
//             const token = localStorage.getItem('accessToken');
//             const storedUser = localStorage.getItem('user');

//             if (token && storedUser) {
//                 setUser(JSON.parse(storedUser));
//                 setIsAuthenticated(true);
//             }
//             } catch (error) {
//             console.error('Auth check failed:', error);
//             logout();
//             } finally {
//             setLoading(false);
//             }
//         };

//         const login = async (credentials, isAdmin = false) => {
//             const data = isAdmin 
//                 ? await authApi.adminLogin(credentials)
//                 : await authApi.login(credentials);

//             localStorage.setItem('accessToken', data.access_token);
//             localStorage.setItem('refreshToken', data.refresh_token);
            
//             const userData = {
//                 id: data.user_id,
//                 email: credentials.email,
//                 role: data.role || (isAdmin ? 'admin' : 'user')
//             };
            
//             localStorage.setItem('user', JSON.stringify(userData));
//             setUser(userData);
//             setIsAuthenticated(true);

//             return data;
//         };

//         const register = async (userData) => {
//             const data = await authApi.register(userData);
//             return data;
//         }
       

//         const logout = () => {
//             localStorage.removeItem('accessToken');
//             localStorage.removeItem('refreshToken');
//             localStorage.removeItem('user');
//             setUser(null);
//             setIsAuthenticated(false);
//         };

//         const value = {
//             user,
//             loading,
//             isAuthenticated,
//             login,
//             register,
//             logout,
//             checkAuth
//         };
        
//         return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    
//     };


