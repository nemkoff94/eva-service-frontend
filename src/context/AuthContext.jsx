// ~/eva-service-frontend/src/context/AuthContext.jsx
const loginWithPassword = async (phone, password) => {
  try {
    const response = await axios.post('/api/auth/login-password', {
      phone,
      password
    });
    
    console.log('Login response:', response.data); // Добавим логирование
    
    const { token, user: userData } = response.data;
    
    // Сохраняем токен и настраиваем axios
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Login error:', error.response?.data);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Ошибка входа' 
    };
  }
};