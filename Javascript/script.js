// 1. GET HTML ELEMENTS


var employeeForm = document.getElementById("employeeForm");
var empId = document.getElementById("empId");
var empName = document.getElementById("empName");
var empEmail = document.getElementById("empEmail");
var empDepartment = document.getElementById("empDepartment");
var empSalary = document.getElementById("empSalary");

var employeeTableBody = document.getElementById("employeeTableBody");
var searchInput = document.getElementById("searchInput");
var departmentFilter = document.getElementById("departmentFilter");
var employeeCount = document.getElementById("employeeCount");

var submitBtn = document.getElementById("submitBtn");
var cancelBtn = document.getElementById("cancelBtn");
var formTitle = document.getElementById("formTitle");


// 2. LOAD EMPLOYEES FROM LOCAL STORAGE


var employees = [];

try {
var savedEmployees = JSON.parse(
localStorage.getItem("employees")
);


if (Array.isArray(savedEmployees)) {
    employees = savedEmployees;
}


} catch (error) {
employees = [];
}

var editIndex = -1;


// 3. SAVE EMPLOYEES


function saveEmployees() {
localStorage.setItem("employees", JSON.stringify(employees));
}


// 4. DISPLAY EMPLOYEES


function displayEmployees() {


// Remove the previous table rows
employeeTableBody.innerHTML = "";

var searchText = searchInput.value.trim().toLowerCase();
var selectedDepartment = departmentFilter.value;

var filteredEmployees = employees.filter(function(employee) {

    var matchesSearch =
        employee.id.toLowerCase().includes(searchText) ||
        employee.name.toLowerCase().includes(searchText);

    var matchesDepartment =
        selectedDepartment === "" ||
        employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
});

// Display matching employee records
filteredEmployees.forEach(function(employee) {

    var row = document.createElement("tr");

    // Create table cells safely using textContent
    var idCell = document.createElement("td");
    idCell.textContent = employee.id;

    var nameCell = document.createElement("td");
    nameCell.textContent = employee.name;

    var emailCell = document.createElement("td");
    emailCell.textContent = employee.email;

    var departmentCell = document.createElement("td");
    departmentCell.textContent = employee.department;

    var salaryCell = document.createElement("td");
    salaryCell.textContent = Number(employee.salary).toLocaleString(
        "en-IN",
        {
            style: "currency",
            currency: "INR"
        }
    );

    var actionCell = document.createElement("td");

    var actionButtons = document.createElement("div");
    actionButtons.className = "action-buttons";

    var editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.type = "button";

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";

    // Find the current employee when Edit is clicked
    editButton.onclick = function() {
        editEmployee(employee.id);
    };

    // Delete the current employee
    deleteButton.onclick = function() {
        deleteEmployee(employee.id);
    };

    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);

    actionCell.appendChild(actionButtons);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(departmentCell);
    row.appendChild(salaryCell);
    row.appendChild(actionCell);

    employeeTableBody.appendChild(row);
});

// Show a message when there are no matching employees
if (filteredEmployees.length === 0) {

    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");

    emptyCell.colSpan = 6;
    emptyCell.className = "empty-message";
    emptyCell.textContent = "No employees found.";

    emptyRow.appendChild(emptyCell);
    employeeTableBody.appendChild(emptyRow);
}

employeeCount.textContent =
    "Showing " + filteredEmployees.length +
    " of " + employees.length + " employees";


}


// 5. ADD OR UPDATE EMPLOYEE


employeeForm.onsubmit = function(event) {


event.preventDefault();

var id = empId.value.trim();
var name = empName.value.trim();
var email = empEmail.value.trim();
var department = empDepartment.value;
var salary = Number(empSalary.value);

if (
    !id ||
    !name ||
    !email ||
    !department ||
    !Number.isFinite(salary) ||
    salary <= 0
) {
    alert("Please enter valid employee details.");
    return;
}

// Check whether the employee ID already exists
var duplicateEmployee = employees.some(function(employee) {
    return employee.id.toLowerCase() === id.toLowerCase() &&
           employee.id !== (editIndex === -1
               ? ""
               : employees[editIndex].id);
});

if (duplicateEmployee) {
    alert("Employee ID already exists. Please use a different ID.");
    return;
}

var employee = {
    id: id,
    name: name,
    email: email,
    department: department,
    salary: salary
};

if (editIndex === -1) {

    // Add a new employee
    employees.push(employee);

    alert("Employee added successfully!");

} else {

    // Update an existing employee
    employees[editIndex] = employee;

    alert("Employee updated successfully!");
}

saveEmployees();

employeeForm.reset();

editIndex = -1;

submitBtn.textContent = "Add Employee";
formTitle.textContent = "Add New Employee";
cancelBtn.hidden = true;

displayEmployees();


};

// 6. EDIT EMPLOYEE


function editEmployee(id) {


editIndex = employees.findIndex(function(employee) {
    return employee.id === id;
});

if (editIndex === -1) {
    return;
}

var employee = employees[editIndex];

empId.value = employee.id;
empName.value = employee.name;
empEmail.value = employee.email;
empDepartment.value = employee.department;
empSalary.value = employee.salary;

submitBtn.textContent = "Update Employee";
formTitle.textContent = "Update Employee Details";
cancelBtn.hidden = false;

// Scroll to the form
document.getElementById("employeeForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
});


}


// 7. DELETE EMPLOYEE


function deleteEmployee(id) {


var confirmation = confirm(
    "Are you sure you want to delete this employee?"
);

if (!confirmation) {
    return;
}

employees = employees.filter(function(employee) {
    return employee.id !== id;
});

// Cancel editing if the employee being edited is deleted
if (editIndex !== -1 && employees[editIndex] === undefined) {
    editIndex = -1;
    employeeForm.reset();
    submitBtn.textContent = "Add Employee";
    formTitle.textContent = "Add New Employee";
    cancelBtn.hidden = true;
} else if (editIndex !== -1) {
    // Recalculate the index because deletion can shift array positions
    editIndex = employees.findIndex(function(employee) {
        return employee.id === empId.value;
    });
}

saveEmployees();
displayEmployees();


}


// 8. CANCEL EDITING


cancelBtn.onclick = function() {


employeeForm.reset();

editIndex = -1;

submitBtn.textContent = "Add Employee";
formTitle.textContent = "Add New Employee";
cancelBtn.hidden = true;


};


// 9. SEARCH EMPLOYEES


searchInput.oninput = function() {
displayEmployees();
};

// 10. FILTER BY DEPARTMENT


departmentFilter.onchange = function() {
displayEmployees();
};


// 11. INITIAL DISPLAY


displayEmployees();
