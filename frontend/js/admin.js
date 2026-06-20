const API_URL = 'https://job-portal-8lb8.onrender.com/api/v1';

const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Navigation logic
const navStats = document.getElementById('nav-stats');
const navUsers = document.getElementById('nav-users');
const navJobs = document.getElementById('nav-jobs');

const statsSection = document.getElementById('stats-section');
const usersSection = document.getElementById('users-section');
const jobsSection = document.getElementById('jobs-section');

const hideAll = () => {
  statsSection.style.display = 'none';
  usersSection.style.display = 'none';
  jobsSection.style.display = 'none';
  navStats.classList.remove('active');
  navUsers.classList.remove('active');
  navJobs.classList.remove('active');
};

navStats.addEventListener('click', () => { hideAll(); statsSection.style.display = 'block'; navStats.classList.add('active'); loadStats(); });
navUsers.addEventListener('click', () => { hideAll(); usersSection.style.display = 'block'; navUsers.classList.add('active'); loadUsers(); });
navJobs.addEventListener('click', () => { hideAll(); jobsSection.style.display = 'block'; navJobs.classList.add('active'); loadJobs(); });

// Load Data
const loadStats = async () => {
  try {
    const stats = await fetchWithToken('/admin/stats');
    document.getElementById('stat-seekers').textContent = stats.totalUsers;
    document.getElementById('stat-recruiters').textContent = stats.totalRecruiters;
    document.getElementById('stat-jobs').textContent = stats.totalJobs;
    document.getElementById('stat-apps').textContent = stats.totalApplications;
  } catch (error) {
    showToast(error.message, 'error');
  }
};

const loadUsers = async () => {
  try {
    const response = await fetchWithToken('/admin/users');
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    if (response.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No users found.</td></tr>';
      return;
    }

    response.data.forEach(user => {
      tbody.innerHTML += `
        <tr>
          <td><strong>${user.name}</strong></td>
          <td>${user.email}</td>
          <td><span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color);">${user.role}</span></td>
          <td>
            <span class="badge ${user.isBlocked ? 'badge-rejected' : 'badge-shortlisted'}">
              ${user.isBlocked ? 'Blocked' : 'Active'}
            </span>
          </td>
          <td>
            <button onclick="toggleBlock('${user._id}')" class="btn ${user.isBlocked ? 'btn-primary' : 'btn-danger'}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">
              ${user.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    showToast(error.message, 'error');
  }
};

const loadJobs = async () => {
  try {
    const response = await fetchWithToken('/admin/jobs');
    const tbody = document.getElementById('jobs-table-body');
    tbody.innerHTML = '';

    if (response.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No jobs found.</td></tr>';
      return;
    }

    response.data.forEach(job => {
      tbody.innerHTML += `
        <tr>
          <td><strong>${job.title}</strong></td>
          <td>${job.companyId?.name || 'Unknown'}</td>
          <td>${job.recruiterId?.name || 'Unknown'} (${job.recruiterId?.email || ''})</td>
          <td><span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color);">${job.status}</span></td>
          <td>
            <button onclick="deleteJob('${job._id}')" class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">
              Delete (Fraud)
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    showToast(error.message, 'error');
  }
};

// Actions
window.toggleBlock = async (id) => {
  if (confirm('Are you sure you want to change the block status for this user?')) {
    try {
      const res = await fetchWithToken(`/admin/users/${id}/block`, { method: 'PATCH' });
      showToast(res.message);
      loadUsers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
};

window.deleteJob = async (id) => {
  if (confirm('Are you sure you want to delete this job for fraud?')) {
    try {
      const res = await fetchWithToken(`/admin/jobs/${id}`, { method: 'DELETE' });
      showToast(res.message);
      loadJobs();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
});
