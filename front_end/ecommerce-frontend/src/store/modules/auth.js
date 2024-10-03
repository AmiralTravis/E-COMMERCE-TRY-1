import api from '@/services/api';

const state = {
  token: localStorage.getItem('authToken') || null,
  user: null,
  authStatus: {
    status: null,
    lastUpdated: Date.now()
  },
};

try {
  state.user = JSON.parse(localStorage.getItem('user'));
} catch (e) {
  console.error('Failed to parse user data from localStorage');
  localStorage.removeItem('user');
}

const mutations = {
  SET_AUTH(state, { token, user }) {
    state.token = token;
    state.user = user;
    state.authStatus = {
      status: 'authenticated',
      lastUpdated: Date.now()
    };
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('User data stored in Vuex:', user);
  },
  CLEAR_AUTH(state) {
    state.token = null;
    state.user = null;
    state.authStatus = {
      status: 'unauthenticated',
      lastUpdated: Date.now()
    };
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },
  UPDATE_AUTH_STATE(state) {
    // This mutation triggers a reactive update by creating a new object
    state.authStatus = {
      status: state.token ? 'authenticated' : 'unauthenticated',
      lastUpdated: Date.now()
    };
  }
};


const actions = {
  async register({ commit }, credentials) {
    try {
      const response = await api.post('/auth/register', credentials);
      commit('SET_AUTH', { token: response.data.token, user: response.data.user });
      console.log('Registration successful:', response.data); // Log successful registration
      return response;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },
  async login({ commit }, credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data); // Log response data
      commit('SET_AUTH', { token: response.data.token, user: response.data.user });
      console.log('Login successful:', response.data.user); // Log user data after login
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  logout({ commit }) {
    console.log('Logging out...'); // Log when logging out
    commit('CLEAR_AUTH');
    console.log('User logged out'); // Confirm logout
  },
};


const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  authStatus: state => state.authStatus.status,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};










































// import api from '@/services/api';

// const state = {
//   token: localStorage.getItem('authToken') || null,
//   user: null,
//   authStatus: {
//     status: null,
//     lastUpdated: Date.now()
//   },
// };

// try {
//   const storedUser = localStorage.getItem('user');
//   state.user = storedUser ? JSON.parse(storedUser) : null;
//   state.authStatus.status = state.token && state.user ? 'authenticated' : 'unauthenticated';
// } catch (e) {
//   console.error('Failed to parse user data from localStorage');
//   localStorage.removeItem('user');
//   state.authStatus.status = 'unauthenticated';
// }

// const mutations = {
//   SET_AUTH(state, { token, user }) {
//     state.token = token;
//     state.user = user;
//     state.authStatus = {
//       status: 'authenticated',
//       lastUpdated: Date.now()
//     };
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     console.log('User data stored in Vuex:', user);
//   },
//   CLEAR_AUTH(state) {
//     state.token = null;
//     state.user = null;
//     state.authStatus = {
//       status: 'unauthenticated',
//       lastUpdated: Date.now()
//     };
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     delete api.defaults.headers.common['Authorization'];
//   },
//   UPDATE_AUTH_STATE(state) {
//     state.authStatus = {
//       status: state.token && state.user ? 'authenticated' : 'unauthenticated',
//       lastUpdated: Date.now()
//     };
//   }
// };

// const actions = {
//   async register({ commit }, credentials) {
//     try {
//       const response = await api.post('/auth/register', credentials);
//       commit('SET_AUTH', { token: response.data.token, user: response.data.user });
//       console.log('Registration successful:', response.data);
//       return response;
//     } catch (error) {
//       console.error('Registration error:', error.response?.data || error.message);
//       throw error;
//     }
//   },
//   async login({ commit }, credentials) {
//     try {
//       const response = await api.post('/auth/login', credentials);
//       console.log('Login response:', response.data);
//       commit('SET_AUTH', { token: response.data.token, user: response.data.user });
//       console.log('Login successful:', response.data.user);
//       return response;
//     } catch (error) {
//       console.error('Login error:', error.response?.data || error.message);
//       throw error;
//     }
//   },
//   logout({ commit }) {
//     console.log('Logging out...');
//     commit('CLEAR_AUTH');
//     console.log('User logged out');
//   },
//   checkAuth({ commit, state }) {
//     if (state.token && state.user) {
//       commit('UPDATE_AUTH_STATE');
//     } else {
//       commit('CLEAR_AUTH');
//     }
//   }
// };

// const getters = {
//   isAuthenticated: state => !!state.token && !!state.user,
//   currentUser: state => state.user,
//   authStatus: state => state.authStatus.status,
// };

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// };


// import api from '@/services/api';

// const state = {
//   token: localStorage.getItem('authToken') || null,
//   user: null,
//   authStatus: {
//     status: 'unauthenticated',
//     lastUpdated: Date.now()
//   },
// };

// const mutations = {
//   SET_AUTH(state, { token, user }) {
//     state.token = token;
//     state.user = user;
//     state.authStatus = {
//       status: 'authenticated',
//       lastUpdated: Date.now()
//     };
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     console.log('Auth state updated:', { token, user });
//   },
//   CLEAR_AUTH(state) {
//     state.token = null;
//     state.user = null;
//     state.authStatus = {
//       status: 'unauthenticated',
//       lastUpdated: Date.now()
//     };
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     delete api.defaults.headers.common['Authorization'];
//     console.log('Auth state cleared');
//   },
// };

// const actions = {
//   async register({ commit }, credentials) {
//     try {
//       const response = await api.post('/auth/register', credentials);
//       const { token, user } = response.data;
//       commit('SET_AUTH', { token, user });
//       console.log('Registration successful:', user);
//       return response;
//     } catch (error) {
//       console.error('Registration error:', error.response?.data || error.message);
//       throw error;
//     }
//   },
//   async login({ commit }, credentials) {
//     try {
//       const response = await api.post('/auth/login', credentials);
//       const { token, user } = response.data;
//       if (!token || !user) {
//         throw new Error('Invalid response from server');
//       }
//       commit('SET_AUTH', { token, user });
//       console.log('Login successful:', user);
//       return response;
//     } catch (error) {
//       console.error('Login error:', error.response?.data || error.message);
//       throw error;
//     }
//   },
//   logout({ commit }) {
//     commit('CLEAR_AUTH');
//     console.log('User logged out');
//   },
//   checkAuth({ commit, state }) {
//     const token = localStorage.getItem('authToken');
//     const userStr = localStorage.getItem('user');
//     console.log('Checking auth state:', { token, userStr });
//     if (token && userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         commit('SET_AUTH', { token, user });
//       } catch (error) {
//         console.error('Error parsing stored user data:', error);
//         commit('CLEAR_AUTH');
//       }
//     } else {
//       commit('CLEAR_AUTH');
//     }
//   }
// };

// const getters = {
//   isAuthenticated: state => !!state.token && !!state.user,
//   currentUser: state => state.user,
//   authStatus: state => state.authStatus.status,
// };

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// };