// Applications API helpers

const applyForJob = async (jobId, coverLetter) => {
  return await authFetch(`/applications/apply/${jobId}`, {
    method: 'POST',
    body: JSON.stringify({ coverLetter })
  });
};

const getMyApplications = async () => {
  return await authFetch('/applications/my-applications');
};

const getJobApplicants = async (jobId) => {
  return await authFetch(`/applications/job/${jobId}`);
};

const updateApplicationStatus = async (id, status) => {
  return await authFetch(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};
