# Public Bank (PBB) - Web Banking UI Flow

This repository contains the front-end implementation of the Public Bank (PBB) FPX banking payment flow, faithfully designed according to the official Public Bank Berhad UI/UX references.

---

## 🚀 Key Features Implemented

1. **Combined Login Page (`index.html` / `login.html`)**:
   - Both **User ID** and **Password** are combined into a single unified step, eliminating the traditional 2-step process.
   - Includes official layout with security notice, **Kill Switch** alert, on-screen keyboard indicator, and session countdown timer.
   - Exact side banners ("Keep Your Card Safe While Travelling!" and "WIN A BMW i5!") based on official PBB campaign creative assets.

2. **Reusable Loading Effect**:
   - Full-screen modal overlay that freezes user interaction (clicks, typing, keyboard inputs) during asynchronous actions or transitions.
   - Animated loader gif (`images/page_load.gif`) with customizable title and subtext.
   - Accessible anywhere via clean JavaScript methods:
     - `PBB.showLoading(message, subtext)`
     - `PBB.hideLoading()`
     - `PBB.navigateWithLoading(targetUrl, delayMs, message, subtext)`

3. **Transaction Details Page (`details.html`)**:
   - Official FPX Payment details with account selector, Transaction ID, Merchant ID, Merchant Description, Order No, and Amount.
   - **PB SecureSign Push Notification Action Box** with "Send Push Notification" button.

4. **PB SecureSign Popup Modal (Step 2.1)**:
   - Built as an in-page modal dialog directly inside `details.html`.
   - Displays official animated mobile phone illustration (`images/animation_500_kugn1p08.gif`).
   - Live 120-second countdown timer and synchronized animated progress bar.
   - "Did not Receive?" accordion toggle with help link.
   - Simulation buttons (`Simulate Mobile Approval` and `Simulate Mobile Rejection`) for instant flow testing and client demonstration.

5. **Dual Status Pages**:
   - **`status-rejected.html`**: Recreated from official sample screenshot with red cancellation icon, error code `(E00042.301.7075104717)`, and 5-second auto-redirect countdown.
   - **`status-success.html`**: Built using the exact same PBB design system with green checkmark badge, approval code `(S00000.200.7075104718)`, transaction receipt table, and 5-second auto-redirect countdown.

---

## 📁 Directory Structure

```text
PBBBank/
├── css/
│   └── style.css            # Unified stylesheet (PBB brand tokens, layouts, modal, loading effect)
├── images/
│   ├── animation_500_kugn1p08.gif  # PB SecureSign phone animation
│   ├── banner_bmw.jpg              # BMW campaign promo banner
│   ├── banner_travel.jpg           # Travel card safety banner
│   ├── fpx2.png                    # FPX logo (payment page)
│   ├── fpxLogo.png                 # FPX logo (login page)
│   ├── mypb_100h.png               # MyPB logo
│   ├── page_load.gif               # PBB loading spinner
│   ├── pb_logo.png                 # Public Bank header logo
│   ├── pushNotification.png        # Push notification icon
│   └── ...                         # Other supporting icons and tokens
├── js/
│   └── app.js               # Reusable loading function, modal logic, and timers
├── index.html               # Combined Login Page (Default)
├── login.html               # Combined Login Page (Alias)
├── details.html             # Transaction Details + PB SecureSign Modal
├── status-rejected.html     # Rejected Status Page
├── status-success.html      # Successful Status Page
└── README.md                # Documentation & Integration Guide
```

---

## 💻 Technical Team Integration Guide

### Triggering the Loading Screen
```javascript
// Show loading with custom messages
PBB.showLoading("Processing Transaction...", "Connecting to Public Bank secure server");

// Hide loading
PBB.hideLoading();

// Navigate with automatic loading transition
PBB.navigateWithLoading("details.html", 1500, "Logging in...", "Verifying credentials");
```

---

## 🌐 Testing the Flow Locally

Open any of the HTML files directly in your modern web browser (Chrome, Edge, Firefox, Safari) or use any local static server:
```bash
# Using Python
python -m http.server 8000

# Using Node / npx
npx serve .
```
