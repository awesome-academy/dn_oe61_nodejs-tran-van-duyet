document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('show.bs.modal', event => {
      const trigger = event.relatedTarget;
      if (!trigger) return;

      const dataset = trigger.dataset;

      Object.keys(dataset).forEach(key => {
        const input = modal.querySelector(`#${modal.id}-${key}`);
        if (input) input.value = dataset[key];
      });
    });
  });

});
