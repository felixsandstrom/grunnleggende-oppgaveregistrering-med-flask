let sortAscendingDate = true;
let sortAscendingName = true;
let sortAscendingType = true;
let sortAscendingDescription = true;
let sortAscendingPriority = true;

// Add click event listeners to the column headers
document.querySelectorAll('.date-column, .name-column, .type-column, .description-column, .priority-column').forEach((column) => {
    column.addEventListener('click', () => {
        resetSortClasses();

        if (column.classList.contains('date-column')) {
            sortByDateColumn(sortAscendingDate);
            toggleSortClasses(column, sortAscendingDate);
            sortAscendingDate = !sortAscendingDate;
        } else if (column.classList.contains('name-column')) {
            sortByNameColumn(sortAscendingName);
            toggleSortClasses(column, sortAscendingName);
            sortAscendingName = !sortAscendingName;
        } else if (column.classList.contains('type-column')) {
            sortByTypeColumn(sortAscendingType);
            toggleSortClasses(column, sortAscendingType);
            sortAscendingType = !sortAscendingType;
        } else if (column.classList.contains('description-column')) {
            sortByDescriptionColumn(sortAscendingDescription);
            toggleSortClasses(column, sortAscendingDescription);
            sortAscendingDescription = !sortAscendingDescription;
        } else if (column.classList.contains('priority-column')) {
            sortByPriorityColumn(sortAscendingPriority);
            toggleSortClasses(column, sortAscendingPriority);
            sortAscendingPriority = !sortAscendingPriority;
        }
    });
});

// Reset sorting classes for all columns
function resetSortClasses() {
    document.querySelectorAll('.date-column, .name-column, .type-column, .description-column, .priority-column').forEach((column) => {
        column.classList.remove('sorted-asc', 'sorted-desc');
    });
}

// Toggle sorting classes for the active column
function toggleSortClasses(column, asc) {
    column.classList.add(asc ? 'sorted-asc' : 'sorted-desc');
}

// Sorting functions
function sortByDateColumn(asc = true) {
    const tbody = document.querySelector('#contactTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const dateA = new Date(a.cells[1].textContent.trim());
        const dateB = new Date(b.cells[1].textContent.trim());

        return asc ? dateA - dateB : dateB - dateA;
    });

    rows.forEach((row) => tbody.appendChild(row));
}

function sortByNameColumn(asc = true) {
    const tbody = document.querySelector('#contactTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const nameA = a.cells[2].textContent.trim().toUpperCase();
        const nameB = b.cells[2].textContent.trim().toUpperCase();

        return asc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    rows.forEach((row) => tbody.appendChild(row));
}

function sortByTypeColumn(asc = true) {
    const tbody = document.querySelector('#contactTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const typeA = a.cells[3].textContent.trim().toUpperCase();
        const typeB = b.cells[3].textContent.trim().toUpperCase();

        return asc ? typeA.localeCompare(typeB) : typeB.localeCompare(typeA);
    });

    rows.forEach((row) => tbody.appendChild(row));
}

function sortByDescriptionColumn(asc = true) {
    const tbody = document.querySelector('#contactTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const descA = a.cells[4].textContent.trim().toUpperCase();
        const descB = b.cells[4].textContent.trim().toUpperCase();

        return asc ? descA.localeCompare(descB) : descB.localeCompare(descA);
    });

    rows.forEach((row) => tbody.appendChild(row));
}

function sortByPriorityColumn(asc = true) {
    const tbody = document.querySelector('#contactTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const priorityOrder = { 'HØY': 1, 'MIDDELS': 2, 'LAV': 3 };

    rows.sort((a, b) => {
        const priorityA = a.cells[5].textContent.trim().toUpperCase();
        const priorityB = b.cells[5].textContent.trim().toUpperCase();

        const priorityAValue = priorityOrder[priorityA] || 4;
        const priorityBValue = priorityOrder[priorityB] || 4; 

        return asc ? priorityAValue - priorityBValue : priorityBValue - priorityAValue;
    });

    rows.forEach((row) => tbody.appendChild(row));
}





