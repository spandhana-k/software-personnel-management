
document.querySelector("button").addEventListener("click", function () {
    let inputs = document.querySelectorAll("input");

    let id = inputs[0].value.trim();
    let name = inputs[1].value.trim();
    let department = inputs[2].value.trim();
    let designation = inputs[3].value.trim();

    if (id === "" || name === "" || department === "" || designation === "") {
        alert("Please fill all employee details");
        return;
    }

    let table = document.getElementById("employeeList");
    let row = table.insertRow();

    row.insertCell(0).textContent = id;
    row.insertCell(1).textContent = name;
    row.insertCell(2).textContent = department;
    row.insertCell(3).textContent = designation;
    let actionCell = row.insertCell(4);
let deleteButton = document.createElement("button");

deleteButton.textContent = "Delete";

deleteButton.addEventListener("click", function () {
    row.remove();
    saveRecords();
    updateDashboard();
});

actionCell.appendChild(deleteButton);
saveRecords();
updateDashboard();

    alert("Employee added successfully!");

    for (let input of inputs) {
        input.value = "";
    }
});
document.getElementById("markAttendance").addEventListener("click", function () {
    let id = document.getElementById("attendanceId").value.trim();
    let date = document.getElementById("attendanceDate").value;
    let status = document.getElementById("attendanceStatus").value;

    if (id === "" || date === "") {
        alert("Please enter Employee ID and date");
        return;
    }

    let employeeRows = document.querySelectorAll("#employeeList tr");
    let found = false;

    for (let row of employeeRows) {
        if (row.cells[0].textContent === id) {
            found = true;
            break;
        }
    }

    if (!found) {
        alert("Employee ID not found. Please register the employee first.");
        return;
    }

    let table = document.getElementById("attendanceList");
    let row = table.insertRow();

    row.insertCell(0).textContent = id;
    row.insertCell(1).textContent = date;
    row.insertCell(2).textContent = status;

    alert("Attendance marked successfully!");
});
document.getElementById("applyLeave").addEventListener("click", function () {
    let id = document.getElementById("leaveEmployeeId").value.trim();
    let type = document.getElementById("leaveType").value;
    let from = document.getElementById("leaveFrom").value;
    let to = document.getElementById("leaveTo").value;

    if (id === "" || from === "" || to === "") {
        alert("Please fill all leave details");
        return;
    }

    if (to < from) {
        alert("End date cannot be before start date");
        return;
    }

    let employees = document.querySelectorAll("#employeeList tr");
    let found = false;

    for (let employee of employees) {
        if (employee.cells[0].textContent === id) {
            found = true;
            break;
        }
    }

    if (!found) {
        alert("Employee ID not found. Register the employee first.");
        return;
    }

    let table = document.getElementById("leaveList");
    let row = table.insertRow();

    row.insertCell(0).textContent = id;
    row.insertCell(1).textContent = type;
    row.insertCell(2).textContent = from;
    row.insertCell(3).textContent = to;
    row.insertCell(4).textContent = "Pending";
    saveRecords();
    updateDashboard();

    alert("Leave request submitted successfully!");

    document.getElementById("leaveEmployeeId").value = "";
    document.getElementById("leaveFrom").value = "";
    document.getElementById("leaveTo").value = "";
});
document.getElementById("calculateSalary").addEventListener("click", function () {
    let id = document.getElementById("salaryEmployeeId").value.trim();
    let basic = document.getElementById("basicSalary").value;
    let allowances = document.getElementById("allowances").value;
    let deductions = document.getElementById("deductions").value;

    if (id === "" || basic === "" || allowances === "" || deductions === "") {
        alert("Please fill all salary details");
        return;
    }

    basic = Number(basic);
    allowances = Number(allowances);
    deductions = Number(deductions);

    if (basic < 0 || allowances < 0 || deductions < 0 || !Number.isFinite(basic + allowances + deductions)) {
        alert("Please enter valid non-negative amounts");
        return;
    }

    let employees = document.querySelectorAll("#employeeList tr");
    let found = false;

    for (let employee of employees) {
        if (employee.cells[0].textContent === id) {
            found = true;
            break;
        }
    }

    if (!found) {
        alert("Employee ID not found. Register the employee first.");
        return;
    }

    let netSalary = basic + allowances - deductions;
    let table = document.getElementById("salaryList");
    let row = table.insertRow();

    row.insertCell(0).textContent = id;
    row.insertCell(1).textContent = basic.toFixed(2);
    row.insertCell(2).textContent = allowances.toFixed(2);
    row.insertCell(3).textContent = deductions.toFixed(2);
    row.insertCell(4).textContent = netSalary.toFixed(2);
    saveRecords();
    updateDashboard();

    alert("Salary calculated successfully!");
});
function saveRecords() {
    localStorage.setItem("employees", document.getElementById("employeeList").innerHTML);
    localStorage.setItem("attendance", document.getElementById("attendanceList").innerHTML);
    localStorage.setItem("leaves", document.getElementById("leaveList").innerHTML);
    localStorage.setItem("salaries", document.getElementById("salaryList").innerHTML);
}
function loadRecords() {
    document.getElementById("employeeList").innerHTML =
        localStorage.getItem("employees") || "";

    document.getElementById("attendanceList").innerHTML =
        localStorage.getItem("attendance") || "";

    document.getElementById("leaveList").innerHTML =
        localStorage.getItem("leaves") || "";

    document.getElementById("salaryList").innerHTML =
        localStorage.getItem("salaries") || "";
updateDashboard();
}

loadRecords();
document.getElementById("employeeList").addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON" &&
        event.target.textContent.trim() === "Delete") {

        const row = event.target.closest("tr");

        if (row) {
            row.remove();
            saveRecords();
            updateDashboard();
        }
    }
});
if (typeof Chart !== "undefined") {

    new Chart(document.getElementById("departmentChart"), {
        type: "bar",
        data: {
            labels: ["IT", "HR", "Finance", "Marketing"],
            datasets: [{
                label: "Number of Employees",
                data: [4, 3, 2, 5],
                backgroundColor: [
                    "#6366f1",
                    "#06b6d4",
                    "#f59e0b",
                    "#10b981"
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAsepectRatio:false,
            animation: {
                duration: 1800,
                easing: "easeOutBounce"
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    new Chart(document.getElementById("attendanceChart"), {
        type: "doughnut",
        data: {
            labels: ["Present", "Absent", "Late"],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: [
                    "#10b981",
                    "#ef4444",
                    "#f59e0b"
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateRotate: true,
                duration: 1800
            }
        }
    });

}
function updateDashboard() {
    document.getElementById("totalEmployees").textContent =
        document.getElementById("employeeList").rows.length;

    const today = new Date().toISOString().split("T")[0];
    let present = 0;

    document.querySelectorAll("#attendanceList tr").forEach(row => {
        const cells = row.cells;

        if (cells.length >= 3 &&
            cells[1].textContent.trim() === today &&
            cells[2].textContent.trim().toLowerCase() === "present") {
            present++;
        }
    });

    document.getElementById("presentToday").textContent = present;

    let pending = 0;

    document.querySelectorAll("#leaveList tr").forEach(row => {
        if (row.cells.length >= 4 &&
            row.cells[row.cells.length - 1].textContent.trim() === "Pending") {
            pending++;
        }
    });

    document.getElementById("leaveRequests").textContent = pending;

    document.getElementById("salaryRecords").textContent =
        document.getElementById("salaryList").rows.length;
}

updateDashboard();
