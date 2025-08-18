document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;

    async function reloadCategoryData(page = 1, limit = 5) {
        const res = await fetch(`/category/json?page=${page}&limit=${limit}`);
        const data = await res.json();
        currentPage = data.currentPage;
        if (currentPage > data.totalPages && data.totalPages > 0) {
            currentPage = data.totalPages;
            return reloadCategoryData(currentPage, limit);
        }

        const categories = data.categories;
        const t = data.t || {};
        const tableBody = document.querySelector('#categoryTableBody');
        const paginationWrapper = document.querySelector('#paginationWrapper');

        tableBody.innerHTML = ''; // Clear old rows

        categories.forEach((cat, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td class="text-center align-middle">${(data.currentPage - 1) * data.limit + index + 1}</td>
        <td class="text-center align-middle">${cat.name}</td>
        <td class="text-center align-middle">
          <span class="badge bg-${cat.type ? 'info text-dark' : 'secondary'} px-3 py-2">
            ${cat.type ? t.inc : t.exp}
          </span>
        </td>
        <td class="align-middle">${cat.description || ''}</td>
        <td class="text-center align-middle">
          <button type="button" class="btn btn-warning btn-sm"
            data-bs-toggle="modal" data-bs-target="#edit"
            data-id="${cat.id}"
            data-name="${cat.name}"
            data-type="${cat.type}"
            data-description="${(cat.description && cat.description !== 'null') ? cat.description : ''}">
            ${t.edit}
          </button>
          <button type="button" class="btn btn-danger btn-sm"
            data-bs-toggle="modal" data-bs-target="#deleteModal"
            data-id="${cat.id}">
            ${t.del}
          </button>
        </td>
      `;
            tableBody.appendChild(row);
        });

        // Update pagination
    paginationWrapper.innerHTML = '';

    const totalPages = data.totalPages;

    // Helper: create pagination button
    function createPageItem(page, isActive = false, label = null) {
      const li = document.createElement('li');
      li.className = `page-item ${isActive ? 'active' : ''}`;

      const a = document.createElement('a');
      a.className = 'page-link';
      a.href = '#';
      a.textContent = label || page;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        reloadCategoryData(page, data.limit);
      });

      li.appendChild(a);
      return li;
    }

    // Previous
    if (currentPage > 1) {
      paginationWrapper.appendChild(createPageItem(currentPage - 1, false, '«'));
    }

    // Always show page 1
    paginationWrapper.appendChild(createPageItem(1, currentPage === 1));

    if (currentPage > 3) {
      const li = document.createElement('li');
      li.className = 'page-item disabled';
      li.innerHTML = '<span class="page-link">...</span>';
      paginationWrapper.appendChild(li);
    }

    // Previous page
    if (currentPage - 1 > 1) {
      paginationWrapper.appendChild(createPageItem(currentPage - 1));
    }

    // Current page
    if (currentPage !== 1 && currentPage !== totalPages) {
      paginationWrapper.appendChild(createPageItem(currentPage, true));
    }

    // The next page follows
    if (currentPage + 1 < totalPages) {
      paginationWrapper.appendChild(createPageItem(currentPage + 1));
    }

    // If you need to insert a "..." between the next adjacent page and the last page
    if (currentPage < totalPages - 2) {
      const li = document.createElement('li');
      li.className = 'page-item disabled';
      li.innerHTML = '<span class="page-link">...</span>';
      paginationWrapper.appendChild(li);
    }

    // Always show last page
    if (totalPages > 1) {
      paginationWrapper.appendChild(createPageItem(totalPages, currentPage === totalPages));
    }

    // Next
    if (currentPage < totalPages) {
      paginationWrapper.appendChild(createPageItem(currentPage + 1, false, '»'));
    }
    }

    reloadCategoryData();

    async function handleFormSubmit(form, hideModal = false) {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        let url = form.dataset.url;
        const method = form.dataset.method || 'POST';

        if (method === 'PUT' && data.id) {
          url += `/${data.id}`;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                toastr.success(result.message || 'Thành công');

                if (hideModal) {
                    const modalElement = form.closest('.modal');
                    if (modalElement) {
                        const modalInstance = bootstrap.Modal.getInstance(modalElement)
                            || bootstrap.Modal.getOrCreateInstance(modalElement);
                        modalInstance.hide();
                        if (modalElement.id === 'add') form.reset();
                    }
                } else {
                    form.reset();
                }

                await reloadCategoryData(currentPage);
            } else {
                toastr.error(result.message || 'Đã có lỗi xảy ra');
            }
        } catch (err) {
            toastr.error('Lỗi máy chủ. Vui lòng thử lại sau!');
            console.error('Chi tiết lỗi:', err);
        }
    }

    document.querySelectorAll('.modal-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(form, true);
        });
    });

    // Handle AJAX-form outside modal
    document.querySelectorAll('.ajax-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(form, false);
        });
    });

    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('show.bs.modal', event => {
            const trigger = event.relatedTarget;
            if (!trigger) return;

            const id = trigger.dataset.id;
            const form = deleteModal.querySelector('.modal-form');
            if (form && id) {
                form.dataset.url = `/category/${id}`;
            }
        });
    }

});
