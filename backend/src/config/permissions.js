const roles = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  JOBSEEKER: 'jobseeker'
};

const permissions = {
  // Admin permissions
  MANAGE_USERS: 'MANAGE_USERS',
  MANAGE_ALL_JOBS: 'MANAGE_ALL_JOBS',
  MANAGE_COMPANIES: 'MANAGE_COMPANIES',
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',

  // Recruiter permissions
  MANAGE_OWN_JOBS: 'MANAGE_OWN_JOBS',
  MANAGE_APPLICANTS: 'MANAGE_APPLICANTS',
  MANAGE_OWN_COMPANY: 'MANAGE_OWN_COMPANY',

  // JobSeeker permissions
  SEARCH_JOBS: 'SEARCH_JOBS',
  APPLY_JOBS: 'APPLY_JOBS',
  SAVE_JOBS: 'SAVE_JOBS',
  MANAGE_OWN_PROFILE: 'MANAGE_OWN_PROFILE'
};

const rolePermissions = {
  [roles.ADMIN]: [
    permissions.MANAGE_USERS,
    permissions.MANAGE_ALL_JOBS,
    permissions.MANAGE_COMPANIES,
    permissions.VIEW_ANALYTICS
  ],
  [roles.RECRUITER]: [
    permissions.MANAGE_OWN_JOBS,
    permissions.MANAGE_APPLICANTS,
    permissions.MANAGE_OWN_COMPANY,
    permissions.VIEW_ANALYTICS
  ],
  [roles.JOBSEEKER]: [
    permissions.SEARCH_JOBS,
    permissions.APPLY_JOBS,
    permissions.SAVE_JOBS,
    permissions.MANAGE_OWN_PROFILE
  ]
};

module.exports = {
  roles,
  permissions,
  rolePermissions
};
