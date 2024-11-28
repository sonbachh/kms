
export const setSession = (name, value) => {
    sessionStorage.setItem(name, JSON.stringify(value)); // Lưu giá trị dưới dạng chuỗi JSON
  };
  
  // Get a session item by name
  export const getSession = (name) => {
    const sessionValue = sessionStorage.getItem(name);
    return sessionValue ? JSON.parse(sessionValue) : null; // Parse giá trị nếu tồn tại, trả về null nếu không
  };
  
  // Clear a session item by name
  export const clearSession = (name) => {
    sessionStorage.removeItem(name);
  };
