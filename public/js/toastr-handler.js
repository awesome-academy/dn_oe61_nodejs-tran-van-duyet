window.addEventListener('DOMContentLoaded', () => {
  const message = document.body.dataset.message;
  const messageType = document.body.dataset.messageType;

  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: '2000'
  };

  if (message) {
    switch (messageType) {
      case 'success':
        toastr.success(message);
        break;
      case 'warning':
        toastr.warning(message);
        break;
      case 'error':
        toastr.error(message);
        break;
    }
  }
});
