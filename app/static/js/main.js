var currentRow;
var newUploadFile = null;
var pictureRemoved
let pendingRowClick = null;
var tempId


function handleRowClick(clickedElement) {
  document.getElementById('saveTaskBtn').disabled = true;

  const id = clickedElement.dataset.id;
  const type = clickedElement.dataset.type;
  const createdBy = clickedElement.dataset.createdBy;
  const priority = clickedElement.dataset.priority;
  const status = clickedElement.dataset.status;
  const imageUrl = clickedElement.dataset.imageUrl;
  const description = clickedElement.dataset.description;

  console.debug('Handling row click:', { id, type, createdBy, priority, status, imageUrl, description });

  // Set the ID in the hidden field
  document.getElementById('SuggestionBugId').value = id;
  document.getElementById('TypeInput').value = type || '';
  document.getElementById('ReportedByInput').value = createdBy || '';
  document.getElementById('DescriptionInput').value = description || '';
  document.getElementById('PriorityInput').value = priority || '';
  document.getElementById('StatusInput').value = status || '';

  const jobImage = document.querySelector('.jobImage');
  const profileImageIcon = document.getElementById('profileImageIcon');

  if (imageUrl && imageUrl !== 'None') {
    jobImage.src = imageUrl;
    jobImage.style.display = 'block';
    profileImageIcon.style.display = 'none';
  } else {
    jobImage.style.display = 'none';
    profileImageIcon.style.display = 'block';
  }

  document.querySelectorAll('.clickable-row').forEach(row => row.classList.remove('active'));
  clickedElement.classList.add('active');

  document.querySelectorAll(".indicator-column-client i").forEach(icon => {
    icon.style.display = 'none';
  });
  const indicatorColumn = clickedElement.querySelector(".indicator-column-client");
  if (indicatorColumn) {
    indicatorColumn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

document.addEventListener('click', function (event) {
  if (event.target.closest('.clickable-row')) {
    const table = document.querySelector('#contactTable tbody');
    const lastRowWithEmptyId = Array.from(table.querySelectorAll('tr.clickable-row')).find(row => row.dataset.id.startsWith("temp-"));

    // Show reporting container and hide loader
    document.querySelector('.reporting-container').style.display = 'block';
    document.querySelector('.loaderWrapperPicture').style.display = 'none';

    const currentRow = event.target.closest('.clickable-row');

    // Check if all inputs are empty
    const areInputsEmpty = Array.from(document.querySelectorAll('#TypeInput, #ReportedByInput, #DescriptionInput, #PriorityInput, #StatusInput'))
      .every(input => input.value.trim() === "");
      debugger;

    // If there's an unsaved row and all inputs are empty, remove it
    if (lastRowWithEmptyId && areInputsEmpty) {
      lastRowWithEmptyId.remove();
    } else if (lastRowWithEmptyId) {
      console.debug('Unsaved row exists, showing modal.');
      pendingRowClick = currentRow; // Store reference to the clicked row
      const modal = new bootstrap.Modal(document.getElementById('discardCreateContactModal'));
      modal.show();
    } else {
      console.debug('No unsaved row, checking save state.');
      const saveButton = document.getElementById('saveTaskBtn');
      if (!saveButton.disabled) {
        pendingRowClick = currentRow; // Store reference to the clicked row
        const modal = new bootstrap.Modal(document.getElementById('changesUnsavedModal'));
        modal.show();
      } else {
        handleRowClick(currentRow);
      }
    }
  }
});


document.getElementById('continueWithoutSavingButton').addEventListener('click', function () {
  const modal = bootstrap.Modal.getInstance(document.getElementById('changesUnsavedModal'));
  if (modal) {
    modal.hide();
  }
  if (pendingRowClick) {
    handleRowClick(pendingRowClick); 
    pendingRowClick = null; 
  }
});


document.querySelectorAll('.reporting-container input, .reporting-container select, .reporting-container textarea').forEach(element => {
  element.addEventListener('input', function () {
    document.getElementById('saveTaskBtn').disabled = false;
  });
});


/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// New task button click /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


document.getElementById('newReportingBtn').addEventListener('click', function () {
  document.querySelector('.reporting-container').style.display = 'block';

  // Clear form fields
  document.getElementById('SuggestionBugId').value = '';
  document.getElementById('TypeInput').value = '';
  document.getElementById('ReportedByInput').value = '';
  document.getElementById('DescriptionInput').value = '';
  document.getElementById('PriorityInput').value = '';
  document.getElementById('StatusInput').value = '';

  // Hide all indicator icons
  document.querySelectorAll(".indicator-column-client i").forEach(function (icon) {
    icon.style.display = 'none';
  });

  // Reset the image section
  const profilePictureContainer = document.getElementById('profilePictureContainer');
  const profileImage = profilePictureContainer.querySelector('.jobImage');
  const profileImageIcon = profilePictureContainer.querySelector('#profileImageIcon');
  
  // Hide the image and show the placeholder icon
  profileImage.style.display = 'none';
  profileImage.src = ''; // Reset the image source
  profileImageIcon.style.display = 'block';

  // Reset input file (if necessary)
  document.getElementById('imageUpload').value = '';

  // Add new empty row with a temporary ID
  tempId = 'temp-' + new Date().getTime(); // Generate a unique temporary ID
  var newRow = document.createElement('tr');
  newRow.classList.add('clickable-row', 'active');
  newRow.setAttribute('data-id', tempId);
  newRow.setAttribute('data-created-date', '');
  newRow.setAttribute('data-created-by', '');
  newRow.setAttribute('data-type', '');
  newRow.setAttribute('data-description', '');

  newRow.innerHTML = `
      <td class="indicator-col indicator-column-client"><i class="fas fa-play"></i></td>
      <td></td>
      <td></td>
      <td></td>
      <td class="limited-text-container">
          <div class="limited-text"></div>
      </td>
      <td></td>
      <td class="delete-col">
          <button class="btn-delete">
              <i class="fas fa-trash"></i>
          </button>
      </td>
  `;

  // Remove the 'active' class from all other rows
  document.querySelectorAll('#contactTable tbody .clickable-row').forEach(function (row) {
    row.classList.remove('active');
  });

  // Prepend the new row to the table body
  var tableBody = document.querySelector('#contactTable tbody');
  tableBody.insertBefore(newRow, tableBody.firstChild);

  // Scroll to the top of the table
  document.querySelector('.common-scrollsection').scrollTop = 0;
});


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////  Save task button click  /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

document.getElementById('saveTaskBtn').addEventListener('click', function () {
  // Collect form inputs
  const id = document.getElementById('SuggestionBugId').value;
  const type = document.getElementById('TypeInput').value || 'Unknown'; // Default to 'Unknown' if empty
  const createdBy = document.getElementById('ReportedByInput').value || 'Anonymous'; // Default to 'Anonymous'
  const description = document.getElementById('DescriptionInput').value || 'No description provided'; // Default description
  const priority = document.getElementById('PriorityInput').value || 'Low'; // Default to 'Low'
  const status = document.getElementById('StatusInput').value || 'Pending'; // Default to 'Pending'

  // File upload and flags
  const newUploadFile = document.getElementById('imageUpload').files[0]; // Get the selected file
  const pictureRemoved = document.getElementById('PictureRemovedInput')?.checked || false; // Default to false

  // Prepare form data
  const formData = new FormData();
  formData.append('type', type);
  formData.append('created_by', createdBy);
  formData.append('description', description);
  formData.append('priority', priority);
  formData.append('status', status);
  formData.append('picture_removed', pictureRemoved.toString());

  if (newUploadFile) {
    formData.append('image', newUploadFile);
  } else {
    formData.append('image', '');
  }

  // Only include the ID if it's not a temporary ID
  if (id && !id.startsWith('temp-')) {
    formData.append('id', id);
  }

  // Get URL from meta tag
  const url = document.querySelector('meta[name="save-suggestion-url"]').getAttribute('content');

  // Perform the fetch POST request
  fetch(url, {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      if (response.message === 'Success') {
        document.getElementById('saveTaskBtn').disabled = true;
        const suggestionId = response.id;
        const createdDate = response.created_date;
        const imageUrl = response.image_url;

        let tempRow = document.querySelector(`#contactTable tr[data-id="${tempId}"]`);
        debugger;
        if (tempRow) {
          // Update the temporary row with the new ID and data
          tempRow.setAttribute('data-id', suggestionId);
          tempRow.dataset.type = type;
          tempRow.dataset.createdBy = createdBy;
          tempRow.dataset.description = description;
          tempRow.dataset.imageUrl = imageUrl;
          tempRow.dataset.status = status;

          tempRow.children[1].textContent = createdDate;
          tempRow.children[2].textContent = createdBy;
          tempRow.children[3].textContent = type;
          tempRow.querySelector('.limited-text').textContent = description;
          tempRow.children[5].textContent = priority;

          // Update background class based on status
          tempRow.classList.remove('green-background', 'blue-background', 'red-background');
          if (status === 'Completed') {
            tempRow.classList.add('green-background');
          } else if (status === 'Ready to test') {
            tempRow.classList.add('blue-background');
          } else if (status === 'Still problem') {
            tempRow.classList.add('red-background');
          }
        } else {
          console.warn('No temporary row found. Something might be wrong with the ID handling.');
        }

        // Update the hidden input field with the new suggestion ID
        document.getElementById('SuggestionBugId').value = suggestionId;
      } else {
        alert('An error occurred while reporting. Please try again.');
      }
    })
    .catch((error) => {
      console.error(error);
      alert('An error occurred while reporting. Please try again.');
    });
});



/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Image //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


// Handle delete icon click
document.addEventListener('click', function (e) {
  if (e.target.id === 'profileDeleteIcon') {
    e.stopPropagation(); // Prevent triggering the container's click event
    console.log('Delete icon clicked');
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModalPicture'));
    modal.show();
  }
});

// Handle add image icon click
document.addEventListener('click', function (e) {
  if (e.target.id === 'addImageIcon') {
    document.getElementById('imageUpload').click();
  }
});

// Handle confirm delete button click
document.addEventListener('click', function (e) {
  if (e.target.id === 'confirmDeleteBtnPicture') {
    // Hide the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModalPicture'));
    if (modal) {
      modal.hide();
    }

    // Clear the image source and hide the image
    const jobImage = document.querySelector('#imageContentWrapper .jobImage');
    if (jobImage) {
      jobImage.src = '';
      jobImage.style.display = 'none';
    }

    // Show the image icon
    const profileImageIcon = document.getElementById('profileImageIcon');
    if (profileImageIcon) {
      profileImageIcon.style.display = 'block';
    }

    // Enable the save button
    document.getElementById('saveTaskBtn').disabled = false;

    // Reset the profilePicture variable
    window.pictureRemoved = true;
  }
});


document.getElementById('imageUpload').addEventListener('change', function (event) {
  const saveButton = document.getElementById('saveTaskBtn');
  if (saveButton) {
    saveButton.disabled = false; 
  }
  window.pictureRemoved = false;

  const files = event.target.files;
  if (files && files[0]) {
    // Store the current file in the global variable
    window.newUploadFile = files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      // Update the src attribute of the existing image element
      const imgElement = document.querySelector('#imageContentWrapper .jobImage');
      if (imgElement) {
        imgElement.src = e.target.result; // Set the preview image
        imgElement.style.display = 'block';
      }

      // Hide the profile image icon
      const profileImageIcon = document.getElementById('profileImageIcon');
      if (profileImageIcon) {
        profileImageIcon.style.display = 'none';
      }

      // Show delete and add icons
      const deleteIcon = document.getElementById('profileDeleteIcon');
      if (deleteIcon) {
        deleteIcon.style.display = 'block';
      }

      const addIcon = document.getElementById('addImageIcon');
      if (addIcon) {
        addIcon.style.display = 'block';
      }
    };

    // Read the file as Data URL (base64 encoded string)
    reader.readAsDataURL(window.newUploadFile);
  }
});


// Handle image upload from clipboard
document.addEventListener('paste', function (event) {
  console.log('Paste event triggered');
  const clipboardData = event.clipboardData || window.clipboardData;
  const items = clipboardData.items;

  console.log('Clipboard Data:', clipboardData);
  console.log('Items:', items);

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      const reader = new FileReader();

      reader.onload = function (e) {
        const imgElement = document.querySelector('#imageContentWrapper .jobImage');
        if (imgElement) {
          imgElement.src = e.target.result;
          imgElement.style.display = 'block';
        }

        // Hide the profile image icon
        const profileImageIcon = document.getElementById('profileImageIcon');
        if (profileImageIcon) {
          profileImageIcon.style.display = 'none';
        }

        // Store the blob as the new upload file
        window.newUploadFile = blob;

        // Enable the save button
        const saveButton = document.getElementById('saveTaskBtn');
        if (saveButton) {
          saveButton.disabled = false;
        }
      };

      reader.readAsDataURL(blob);
      break;
    }
  }
});


const firstRow = document.querySelector('.clickable-row');
if (firstRow) {
  firstRow.click();
}






