document.addEventListener('click', function (event) {
  if (event.target.closest('.btn-delete')) {
    const row = event.target.closest('tr'); // Get the row to delete
    const reportingId = row.dataset.id; // Get the ID

    if (reportingId) {
      const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModalMain'));
      deleteModal.show();

      document.getElementById('confirmDeleteBtnMain').onclick = function () {
        fetch(`/delete_reporting/${reportingId}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            if (data.message === 'Success') {
              const nextRow = row.nextElementSibling || row.previousElementSibling; // Row below or above

              row.remove(); // Remove the deleted row

              if (nextRow) {
                nextRow.classList.add('active'); // Make the next/previous row active
                handleRowClick(nextRow); // Trigger the row click logic for the new active row
              } else {
                document.querySelector('.reporting-container').style.display = 'none'; // Hide reporting container
              }

              console.log(`Reporting ID ${reportingId} deleted successfully`);
            } else {
              alert(`Error: ${data.details || 'Failed to delete reporting.'}`);
            }
          })
          .catch((error) => {
            console.error(`Error deleting reporting ID ${reportingId}:`, error);
            alert('An error occurred while deleting the reporting.');
          });

        deleteModal.hide();
      };
    }
  }
});
