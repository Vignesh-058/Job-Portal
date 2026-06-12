// Job API helpers

const getJobs = async () => {
  return await authFetch('/jobs');
};

const getJobById = async (id) => {
  return await authFetch(`/jobs/${id}`);
};

const getMyJobs = async () => {
  return await authFetch('/jobs/my-jobs');
};

const createJob = async (jobData) => {
  return await authFetch('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData)
  });
};

const updateJob = async (id, jobData) => {
  return await authFetch(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData)
  });
};

const deleteJob = async (id) => {
  return await authFetch(`/jobs/${id}`, {
    method: 'DELETE'
  });
};
