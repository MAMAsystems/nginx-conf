const notificationLifetimeMs = 15_000;

document.querySelectorAll('[data-notification]').forEach((notification) => {
  const expiresAt = Date.parse(notification.dataset.finishedAt) + notificationLifetimeMs;
  const timer = window.setTimeout(() => notification.remove(), Math.max(0, expiresAt - Date.now()));
  const keepVisible = () => window.clearTimeout(timer);

  notification.addEventListener('pointerenter', keepVisible, {once: true});
  notification.addEventListener('focusin', keepVisible, {once: true});
  if (notification.matches(':hover')) keepVisible();

  notification.addEventListener('submit', async (event) => {
    event.preventDefault();
    keepVisible();
    const button = notification.querySelector('button');
    const error = notification.querySelector('[role="alert"]');
    button.disabled = true;
    error.hidden = true;
    try {
      const response = await fetch(notification.action, {method: 'POST', headers: {Accept: 'application/json'}});
      if (response.status !== 204) throw new Error('Notification acknowledgement failed');
      notification.remove();
    } catch {
      error.hidden = false;
      button.disabled = false;
    }
  });
});
