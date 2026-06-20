class Toast {
  static init() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }
  }

  static show(message, type = 'info') {
    this.init();
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    let bgColor = '#333';
    if (type === 'success') bgColor = '#28a745';
    if (type === 'error') bgColor = '#dc3545';
    if (type === 'warning') bgColor = '#ffc107';

    toast.style.cssText = `
      background-color: ${bgColor};
      color: #fff;
      padding: 12px 24px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-family: sans-serif;
      animation: slideIn 0.3s ease-out;
      opacity: 0.9;
    `;
    toast.textContent = message;
    
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-in';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

class Skeleton {
  static createCard() {
    return `
      <div class="skeleton-card" style="padding:20px; border:1px solid #eee; border-radius:8px; margin-bottom:15px; animation: pulse 1.5s infinite ease-in-out;">
        <div style="width: 60%; height: 20px; background: #e0e0e0; margin-bottom: 10px; border-radius: 4px;"></div>
        <div style="width: 40%; height: 15px; background: #e0e0e0; margin-bottom: 15px; border-radius: 4px;"></div>
        <div style="width: 100%; height: 10px; background: #e0e0e0; margin-bottom: 8px; border-radius: 4px;"></div>
        <div style="width: 90%; height: 10px; background: #e0e0e0; margin-bottom: 20px; border-radius: 4px;"></div>
        <div style="width: 80px; height: 30px; background: #e0e0e0; border-radius: 4px;"></div>
      </div>
    `;
  }
}

class InfiniteScroll {
  constructor(containerId, loadCallback) {
    this.container = document.getElementById(containerId);
    this.loadCallback = loadCallback;
    this.page = 1;
    this.isLoading = false;
    this.hasMore = true;

    window.addEventListener('scroll', () => {
      if (this.isLoading || !this.hasMore) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        this.loadMore();
      }
    });
  }

  async loadMore() {
    this.isLoading = true;
    this.page++;
    
    const skeletonHTML = Array(3).fill(Skeleton.createCard()).join('');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = skeletonHTML;
    this.container.appendChild(tempDiv);

    try {
      const data = await this.loadCallback(this.page);
      tempDiv.remove();
      if (!data || data.length === 0) {
        this.hasMore = false;
      }
    } catch (e) {
      tempDiv.remove();
      Toast.show('Error loading more data', 'error');
    }
    
    this.isLoading = false;
  }
}

// Global CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 0.9; } }
  @keyframes fadeOut { from { opacity: 0.9; } to { opacity: 0; } }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
`;
document.head.appendChild(style);

window.UIUtils = { Toast, Skeleton, InfiniteScroll };
