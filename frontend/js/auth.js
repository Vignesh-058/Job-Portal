const API_URL = 'https://job-portal-8lb8.onrender.com/api/v1';

// Utility for fetching with Auth token
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });

  const responseData = await response.json();

  if (!response.ok || (responseData && responseData.success === false)) {
    throw new Error(responseData.message || 'Something went wrong');
  }

  // Return the unwrapped data payload
  return responseData.data !== undefined ? responseData.data : responseData;
};

// Check Auth state and redirect if needed
const checkAuth = () => {
  let token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  const currentPath = window.location.pathname;

  // Fix for bad tokens from previous bugs
  if (token === 'undefined' || token === 'null') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    token = null;
    role = null;
  }

  // Public pages
  const publicPages = ['/index.html', '/login.html', '/register.html', '/', '/login', '/register', '/forgot-password.html', '/forgot-password', '/reset-password.html', '/reset-password'];
  
  if (!token && !publicPages.some(page => currentPath.endsWith(page))) {
    window.location.href = '/frontend/login.html';
    return;
  }

  if (token && ['/login.html', '/register.html', '/login', '/register'].some(page => currentPath.endsWith(page))) {
    if (role === 'recruiter') {
      window.location.href = '/frontend/recruiter/dashboard.html';
    } else {
      window.location.href = '/frontend/jobseeker/dashboard.html';
    }
  }

  // Role guards
  if (token && currentPath.includes('/recruiter/') && role !== 'recruiter') {
    window.location.href = '/frontend/jobseeker/dashboard.html';
  }
  if (token && currentPath.includes('/jobseeker/') && role !== 'jobseeker') {
    window.location.href = '/frontend/recruiter/dashboard.html';
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  window.location.href = '/frontend/login.html';
};

// Toast notification helper
const showToast = (message, type = 'success') => {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = message;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Form live validation utility
const attachFormValidation = () => {
  const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.checkValidity()) {
        input.classList.remove('invalid');
        input.classList.add('valid');
      } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
      }
    });
    input.addEventListener('blur', () => {
      if (!input.checkValidity()) {
        input.classList.add('invalid');
      }
    });
  });
};

// Run checkAuth immediately on script load
checkAuth();

// Attach listeners
document.addEventListener('DOMContentLoaded', () => {
  attachFormValidation();
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
