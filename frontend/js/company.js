// Company Management Logic for Recruiter Dashboard

document.addEventListener('DOMContentLoaded', () => {
  const navCompanies = document.getElementById('nav-companies');
  const companiesSection = document.getElementById('companies-section');
  const showCompanyFormBtn = document.getElementById('showCompanyFormBtn');
  const companyFormContainer = document.getElementById('companyFormContainer');
  const companyForm = document.getElementById('companyForm');
  const companiesList = document.getElementById('companiesList');

  if (navCompanies) {
    navCompanies.addEventListener('click', (e) => {
      e.preventDefault();
      // Hide others (assume jobs.js handles its own display, but here we just toggle visibility)
      document.querySelectorAll('.main-content > div').forEach(el => el.style.display = 'none');
      companiesSection.style.display = 'block';
      
      // Update nav active state
      document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));
      navCompanies.classList.add('active');

      loadCompanies();
    });
  }

  if (showCompanyFormBtn) {
    showCompanyFormBtn.addEventListener('click', () => {
      companyFormContainer.style.display = companyFormContainer.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (companyForm) {
    companyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('companyName').value;
      const website = document.getElementById('companyWebsite').value;
      const description = document.getElementById('companyDescription').value;

      try {
        const response = await fetch('http://localhost:5000/api/company', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ name, website, description })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to create company');
        
        showToast('Company created successfully!');
        companyForm.reset();
        companyFormContainer.style.display = 'none';
        loadCompanies();
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }

  window.loadCompanies = async () => {
    if (!companiesList) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/company/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch companies');

      companiesList.innerHTML = '';
      if (data.length === 0) {
        companiesList.innerHTML = '<p class="text-muted">You have not created any companies yet.</p>';
        return;
      }

      data.forEach(company => {
        const avatarUrl = company.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random&color=fff&rounded=true&bold=true`;
        companiesList.innerHTML += `
          <div class="card">
            <div class="flex align-center gap-1 mb-1">
              <img src="${avatarUrl}" alt="logo" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
              <div>
                <h3 style="margin: 0;">${company.name}</h3>
                <a href="${company.website}" target="_blank" style="font-size: 0.8rem;">${company.website || 'No website'}</a>
              </div>
            </div>
            <p class="text-muted mb-1" style="font-size: 0.9rem;">${company.description || 'No description provided.'}</p>
          </div>
        `;
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  };
});
