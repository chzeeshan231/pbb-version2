/**
 * Public Bank (PBB) UI Flow & Interactions
 * Reusable Loading Effect, Timers, Modal Controls, and Flow Simulations
 */

const PBB = (function () {
  'use strict';

  let loadingOverlayEl = null;

  // All HTML files are now at root level — asset prefix is always './'
  function getAssetPrefix() {
    return './';
  }

  // Initialize or ensure Loading Overlay element exists
  function ensureLoadingElement() {
    if (!loadingOverlayEl) {
      loadingOverlayEl = document.getElementById('pbbLoadingOverlay');
    }
    if (!loadingOverlayEl) {
      const prefix = getAssetPrefix();
      loadingOverlayEl = document.createElement('div');
      loadingOverlayEl.id = 'pbbLoadingOverlay';
      loadingOverlayEl.className = 'pbb-loading-overlay';
      loadingOverlayEl.innerHTML = `
        <div class="pbb-loading-card">
          <img src="${prefix}images/page_load.gif" alt="Loading..." class="pbb-loading-gif" onerror="this.style.display='none'; document.getElementById('pbbFallbackSpinner').style.display='block';">
          <div id="pbbFallbackSpinner" class="pbb-spinner-circle" style="display: none;"></div>
          <div class="pbb-loading-text" id="pbbLoadingMessage">Please wait...</div>
          <div class="pbb-loading-subtext" id="pbbLoadingSubtext">Processing your request securely</div>
        </div>
      `;
      document.body.appendChild(loadingOverlayEl);
    }
  }

  /**
   * Reusable Loading: Show full screen blocking loading overlay
   * @param {string} message - Primary title
   * @param {string} subtext - Secondary subtext
   */
  function showLoading(message = 'Please wait...', subtext = 'Processing your request securely') {
    ensureLoadingElement();
    const msgEl = document.getElementById('pbbLoadingMessage');
    const subEl = document.getElementById('pbbLoadingSubtext');
    if (msgEl) msgEl.textContent = message;
    if (subEl) subEl.textContent = subtext;
    loadingOverlayEl.classList.add('active');
  }

  /**
   * Reusable Loading: Hide loading overlay
   */
  function hideLoading() {
    if (loadingOverlayEl) {
      loadingOverlayEl.classList.remove('active');
    }
  }

  /**
   * Navigate to next page with smooth loading transition
   * @param {string} url - Target URL
   * @param {number} delay - Milliseconds to delay
   * @param {string} message - Loading message
   * @param {string} subtext - Loading subtext
   */
  function navigateWithLoading(url, delay = 1200, message = 'Processing...', subtext = 'Please do not refresh or close this window') {
    showLoading(message, subtext);
    setTimeout(() => {
      window.location.href = url;
    }, delay);
  }

  /**
   * Initialize Session Countdown Timer (MM:SS)
   * @param {string} elementId - ID of timer element
   * @param {number} totalSeconds - Initial seconds
   * @param {function} onExpire - Callback when timer hits 0
   */
  function startCountdownTimer(elementId, totalSeconds, onExpire) {
    const el = document.getElementById(elementId);
    if (!el) return null;

    let secondsLeft = totalSeconds;

    function formatTime(secs) {
      const mins = Math.floor(secs / 60);
      const remSecs = secs % 60;
      return `00:${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
    }

    function update() {
      if (secondsLeft <= 0) {
        el.textContent = `[00:00:00]`;
        if (typeof onExpire === 'function') onExpire();
        clearInterval(timerInterval);
        return;
      }
      el.textContent = `[${formatTime(secondsLeft)}]`;
      secondsLeft--;
    }

    update();
    const timerInterval = setInterval(update, 1000);
    return timerInterval;
  }

  return {
    showLoading,
    hideLoading,
    navigateWithLoading,
    startCountdownTimer,
    ensureLoadingElement,
    getAssetPrefix
  };
})();

// Initialize Global Handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  PBB.ensureLoadingElement();

  // ==========================================
  // 1. LOGIN PAGE CONTROLLER
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // Start session timer (e.g. 04:36)
    PBB.startCountdownTimer('sessionTimer', 276, function () {
      alert('Your login session has expired. Please refresh the page.');
    });

    // Handle Form Submit
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      let isValid = true;

      if (!usernameInput.value.trim()) {
        usernameInput.classList.add('input-error');
        isValid = false;
      } else {
        usernameInput.classList.remove('input-error');
      }

      if (!passwordInput.value.trim()) {
        passwordInput.classList.add('input-error');
        isValid = false;
      } else {
        passwordInput.classList.remove('input-error');
      }

      if (!isValid) {
        alert('Please enter both User ID and Password.');
        return;
      }

      // Transition to Details page with loading effect
      PBB.navigateWithLoading('confirmdetails.html', 1500, 'Verifying Credentials...', 'Please wait while we log you into PBe');
    });

    // Clear error states on input
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => input.classList.remove('input-error'));
    });
  }

  // ==========================================
  // 1.1 LOGIN WITH PASSWORD CONTROLLER
  // ==========================================
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const pwdInput = document.getElementById('password');
      const confirmPwdInput = document.getElementById('confirmPassword');
      if (!pwdInput.value.trim()) {
        pwdInput.classList.add('input-error');
        alert('Please enter your password.');
        return;
      }
      if (confirmPwdInput && !confirmPwdInput.value.trim()) {
        confirmPwdInput.classList.add('input-error');
        alert('Please confirm your password.');
        return;
      }
      if (confirmPwdInput && pwdInput.value !== confirmPwdInput.value) {
        confirmPwdInput.classList.add('input-error');
        alert('The passwords do not match.');
        return;
      }
      PBB.navigateWithLoading('confirmdetails.html', 1500, 'Verifying Password...', 'Please wait while we log you into PBe');
    });

    [document.getElementById('password'), document.getElementById('confirmPassword')]
      .filter(Boolean)
      .forEach(input => {
        input.addEventListener('input', () => input.classList.remove('input-error'));
      });
  }

  // ==========================================
  // 2. TRANSACTION DETAILS PAGE CONTROLLER
  // ==========================================
  const sendPushBtn = document.getElementById('sendPushBtn');
  const pbSecureSignModal = document.getElementById('pbSecureSignModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const viewMoreBtn = document.getElementById('viewMoreBtn');
  const viewMoreContent = document.getElementById('viewMoreContent');
  const viewMoreArrow = document.getElementById('viewMoreArrow');

  let modalTimer = null;
  let modalTotalSeconds = 120;
  let modalSecondsRemaining = 120;

  if (sendPushBtn && pbSecureSignModal) {
    // Open PB SecureSign Popup Modal
    sendPushBtn.addEventListener('click', function () {
      PBB.showLoading('Sending Push Notification...', 'Requesting PB SecureSign authentication');
      
      setTimeout(() => {
        PBB.hideLoading();
        openSecureSignModal();
      }, 900);
    });

    // Close PB SecureSign Modal
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function () {
        closeSecureSignModal();
      });
    }

    // Toggle "Did not Receive?" accordion
    if (viewMoreBtn && viewMoreContent) {
      viewMoreBtn.addEventListener('click', function () {
        viewMoreContent.classList.toggle('open');
      });
    }

    // Function to Open Modal and Start Countdown
    function openSecureSignModal() {
      pbSecureSignModal.classList.add('active');
      modalSecondsRemaining = 120;
      updateModalTimer();

      if (modalTimer) clearInterval(modalTimer);
      modalTimer = setInterval(function () {
        modalSecondsRemaining--;
        updateModalTimer();

        if (modalSecondsRemaining <= 0) {
          clearInterval(modalTimer);
          // Timed out -> Redirect to Rejected status
          PBB.navigateWithLoading('Status.html', 1200, 'Session Expired', 'PB SecureSign request timed out');
        }
      }, 1000);
    }

    // Function to Close Modal
    function closeSecureSignModal() {
      if (modalTimer) clearInterval(modalTimer);
      pbSecureSignModal.classList.remove('active');
    }

    // Update Countdown text and progress bar fill
    function updateModalTimer() {
      const countdownEl = document.getElementById('modalRemainingSeconds');
      const progressFillEl = document.getElementById('modalProgressFill');

      if (countdownEl) {
        countdownEl.textContent = modalSecondsRemaining;
      }
      if (progressFillEl) {
        const percent = Math.max(0, Math.min(100, (modalSecondsRemaining / modalTotalSeconds) * 100));
        progressFillEl.style.width = percent + '%';
      }
    }

    // Auto-open PB SecureSign Modal if requested on page load (New Version or ?auto=1)
    const urlParams = new URLSearchParams(window.location.search);
    if (
      pbSecureSignModal.dataset.autoOpen === 'true' ||
      pbSecureSignModal.classList.contains('active') ||
      urlParams.get('auto') === 'true' ||
      urlParams.get('auto') === '1' ||
      urlParams.get('popup') === 'true'
    ) {
      openSecureSignModal();
    }

    // Simulation Trigger: User Approves Push Notification on Phone
    const simApproveBtn = document.getElementById('simApproveBtn');
    if (simApproveBtn) {
      simApproveBtn.addEventListener('click', function () {
        closeSecureSignModal();
        PBB.navigateWithLoading('Status.html', 1500, 'Processing Approval...', 'PB SecureSign approved on OnePlus 8T TMO');
      });
    }

    // Simulation Trigger: User Rejects Push Notification on Phone
    const simRejectBtn = document.getElementById('simRejectBtn');
    if (simRejectBtn) {
      simRejectBtn.addEventListener('click', function () {
        closeSecureSignModal();
        PBB.navigateWithLoading('Status.html', 1500, 'Cancelling Transaction...', 'PB SecureSign rejected by user');
      });
    }

    // Cancel Button on Details Page
    const cancelDetailsBtn = document.getElementById('cancelDetailsBtn');
    if (cancelDetailsBtn) {
      cancelDetailsBtn.addEventListener('click', function () {
        PBB.navigateWithLoading('Status.html', 1000, 'Cancelling...', 'Returning to merchant');
      });
    }

    // Details Page Remaining Timer (01:32)
    const detailsTimerEl = document.getElementById('detailsRemainingTimer');
    if (detailsTimerEl) {
      let dSeconds = 92; // 1 min 32 sec
      setInterval(function () {
        if (dSeconds > 0) {
          dSeconds--;
          const m = String(Math.floor(dSeconds / 60)).padStart(2, '0');
          const s = String(dSeconds % 60).padStart(2, '0');
          detailsTimerEl.textContent = `${m} : ${s}`;
        }
      }, 1000);
    }
  }

  // ==========================================
  // 3. STATUS PAGE CONTROLLER (Countdown & Redirect)
  // ==========================================
  const statusContinueBtn = document.getElementById('statusContinueBtn');
  const countdownSpan = document.getElementById('statusCountdown');

  if (statusContinueBtn && countdownSpan) {
    let countdownSec = 5;
    const interval = setInterval(function () {
      countdownSec--;
      countdownSpan.textContent = countdownSec;

      if (countdownSec <= 0) {
        clearInterval(interval);
        PBB.navigateWithLoading('login.html', 1000, 'Redirecting...', 'Returning to merchant');
      }
    }, 1000);

    statusContinueBtn.addEventListener('click', function () {
      clearInterval(interval);
      PBB.navigateWithLoading('login.html', 1000, 'Redirecting...', 'Returning to merchant');
    });
  }
});
