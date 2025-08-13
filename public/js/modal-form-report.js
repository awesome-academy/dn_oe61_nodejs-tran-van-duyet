document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;

    async function reloadReportData(page = 1, limit = 5) {
    const res = await fetch(`/report/json?page=${page}&limit=${limit}`);
    const data = await res.json();
    currentPage = data.currentPage;

    if (currentPage > data.totalPages && data.totalPages > 0) {
        currentPage = data.totalPages;
        return reloadReportData(currentPage, limit);
    }

    const reports = data.data; // array from backend
    const t = data.t || {};
    const tableBody = document.querySelector('#reportTableBody');
    const paginationWrapper = document.querySelector('#paginationWrapper');

    tableBody.innerHTML = ''; // Clear old rows

    reports.forEach((report, index) => {
        const row = document.createElement('tr');

        // Map type to badge
        let typeBadge = '';
        if (report.type === 1) {
        typeBadge = `<span class="badge bg-secondary px-3 py-2">${t.typeReport}</span>`;
        } else {
        typeBadge = `<span class="badge bg-info text-dark px-3 py-2">${t.typeFeedback}</span>`;
        }

        // Map status to badge
        let statusBadge = '';
        if (report.status === 0) {
        statusBadge = `<span class="badge bg-danger-subtle text-danger px-3 py-2">${t.statusPending}</span>`;
        } else if (report.status === 1) {
        statusBadge = `<span class="badge bg-warning text-dark px-3 py-2">${t.statusProcessing}</span>`;
        } else {
        statusBadge = `<span class="badge bg-success px-3 py-2">${t.statusResolved}</span>`;
        }

        row.innerHTML = `
        <td class="text-center">${(currentPage - 1) * limit + index + 1}</td>
        <td class="text-center">${report.user_name}</td>
        <td class="text-center">${typeBadge}</td>
        <td>${report.content}</td>
        <td class="text-center">${statusBadge}</td>
        <td>${report.response || ''}</td>
        <td class="text-center">${new Date(report.created_at).toLocaleString()}</td>
        <td class="text-center text-nowrap">
            <button class="btn btn-sm btn-primary me-1"
            data-bs-toggle="modal" data-bs-target="#update"
            data-id="${report.id}"
            data-status="${report.status}"
            data-response="${report.response || ''}">
            ${t.update}
            </button>
            <button class="btn btn-sm btn-danger"
            data-bs-toggle="modal" data-bs-target="#delete"
            data-id="${report.id}">
            ${t.delete}
            </button>
        </td>
        `;

        tableBody.appendChild(row);
    });

    // Pagination
    paginationWrapper.innerHTML = '';
    const totalPages = data.totalPages;

    function createPageItem(page, isActive = false, label = null) {
        const li = document.createElement('li');
        li.className = `page-item ${isActive ? 'active' : ''}`;

        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = label || page;
        a.addEventListener('click', (e) => {
        e.preventDefault();
        reloadReportData(page, limit);
        });

        li.appendChild(a);
        return li;
    }

    // Previous
    if (currentPage > 1) paginationWrapper.appendChild(createPageItem(currentPage - 1, false, '«'));

    // First page
    paginationWrapper.appendChild(createPageItem(1, currentPage === 1));

    if (currentPage > 3) {
        const li = document.createElement('li');
        li.className = 'page-item disabled';
        li.innerHTML = '<span class="page-link">...</span>';
        paginationWrapper.appendChild(li);
    }

    // Previous page
    if (currentPage - 1 > 1) paginationWrapper.appendChild(createPageItem(currentPage - 1));

    // Current page
    if (currentPage !== 1 && currentPage !== totalPages) paginationWrapper.appendChild(createPageItem(currentPage, true));

    // Next page
    if (currentPage + 1 < totalPages) paginationWrapper.appendChild(createPageItem(currentPage + 1));

    if (currentPage < totalPages - 2) {
        const li = document.createElement('li');
        li.className = 'page-item disabled';
        li.innerHTML = '<span class="page-link">...</span>';
        paginationWrapper.appendChild(li);
    }

    // Last page
    if (totalPages > 1) paginationWrapper.appendChild(createPageItem(totalPages, currentPage === totalPages));

    // Next
    if (currentPage < totalPages) paginationWrapper.appendChild(createPageItem(currentPage + 1, false, '»'));
    }

  reloadReportData();

  document.querySelectorAll('.modal-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      const method = form.dataset.method;
      let url = form.dataset.url + `/${data.id}`;
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok) {
          toastr.success(result.message || 'Thành công');
          const modalElement = form.closest('.modal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) 
                              || bootstrap.Modal.getOrCreateInstance(modalElement);
            modalInstance.hide();
          }

          await reloadReportData(currentPage);
        } else {
          toastr.error(result.message || 'Đã có lỗi xảy ra');
        }
      } catch (err) {
        toastr.error('Lỗi máy chủ');
        console.error(err);
      }
    });
  });
});

