document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault(); // Prevent default form submission

      const formData = new FormData(form);
      const plainObject = Object.fromEntries(formData.entries()); // Chuyển FormData thành object
      const jsonData = JSON.stringify(plainObject); // Chuyển thành JSON

      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: jsonData,
      });

      const errorDiv = document.getElementById('loginError');

      const data = await response.json();

      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        timeOut: '2000',
      };

      if (response.ok) {
          window.location.href = '/';
      } else {
        toastr.error(data.message || 'Email hoặc mật khẩu không đúng');
        if (errorDiv) {
          errorDiv.textContent = data.message;
          errorDiv.style.display = 'block';
        }
      }
    });
  }
});
