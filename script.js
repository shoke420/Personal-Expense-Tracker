// ==========================================
// PERSONAL EXPENSE TRACKER
// ==========================================

// ==========================================
// LOAD SAVED TRANSACTIONS
// ==========================================

let transactions = [];

try {
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    if (!Array.isArray(transactions)) {
        transactions = [];
    }

} catch (error) {
    console.error("Could not load saved transactions:", error);
    transactions = [];
}

let editingIndex = null;
let importedTransactions = [];

// ==========================================
// GET HTML ELEMENTS
// ==========================================

const expenseNameInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const addExpenseButton = document.getElementById("addTransaction");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transactionList");
const dateInput = document.getElementById("date");

const totalExpensesDisplay = document.getElementById("totalExpenses");
const totalIncomeDisplay = document.getElementById("totalIncome");
const balanceDisplay = document.getElementById("balance");

const reportTotalIncomeDisplay = document.getElementById("reportTotalIncome");
const reportTotalExpensesDisplay = document.getElementById("reportTotalExpenses");
const reportBalanceDisplay = document.getElementById("reportBalance");

const incomePageTotal = document.getElementById("incomePageTotal");
const incomePageCount = document.getElementById("incomePageCount");
const incomePageList = document.getElementById("incomePageList");

const expensesPageTotal = document.getElementById("expensesPageTotal");
const expensesPageCount = document.getElementById("expensesPageCount");
const expensesPageList = document.getElementById("expensesPageList");

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatNaira(amount) {
    return Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ==========================================
// INCOME AND EXPENSES PAGES
// ==========================================

function updateIncomeExpensePages() {

    const incomeTransactions = transactions.filter(
        transaction => transaction.type === "income"
    );

    const expenseTransactions = transactions.filter(
        transaction => transaction.type === "expense"
    );

    const incomeTotal = incomeTransactions.reduce(
        (total, transaction) => total + Number(transaction.amount), 0
    );

    const expensesTotal = expenseTransactions.reduce(
        (total, transaction) => total + Number(transaction.amount), 0
    );

    if (incomePageTotal) {
        incomePageTotal.textContent = formatNaira(incomeTotal);
    }

    if (incomePageCount) {
        incomePageCount.textContent = incomeTransactions.length;
    }

    if (expensesPageTotal) {
        expensesPageTotal.textContent = formatNaira(expensesTotal);
    }

    if (expensesPageCount) {
        expensesPageCount.textContent = expenseTransactions.length;
    }

    if (incomePageList) {
        incomePageList.innerHTML = "";

        if (incomeTransactions.length === 0) {
            incomePageList.innerHTML =
                '<tr><td colspan="3" class="text-center text-muted">No income transactions yet.</td></tr>';
        } else {
            incomeTransactions.forEach(transaction => {
                const row = document.createElement("tr");
                const dateCell = document.createElement("td");
                const descriptionCell = document.createElement("td");
                const amountCell = document.createElement("td");

                dateCell.textContent = transaction.date || "";
                descriptionCell.textContent = transaction.description || "";
                amountCell.textContent = "₦" + formatNaira(transaction.amount);
                amountCell.className = "text-success fw-bold";

                row.appendChild(dateCell);
                row.appendChild(descriptionCell);
                row.appendChild(amountCell);

                incomePageList.appendChild(row);
            });
        }
    }

    if (expensesPageList) {
        expensesPageList.innerHTML = "";

        if (expenseTransactions.length === 0) {
            expensesPageList.innerHTML =
                '<tr><td colspan="3" class="text-center text-muted">No expense transactions yet.</td></tr>';
        } else {
            expenseTransactions.forEach(transaction => {
                const row = document.createElement("tr");
                const dateCell = document.createElement("td");
                const descriptionCell = document.createElement("td");
                const amountCell = document.createElement("td");

                dateCell.textContent = transaction.date || "";
                descriptionCell.textContent = transaction.description || "";
                amountCell.textContent = "₦" + formatNaira(transaction.amount);
                amountCell.className = "text-danger fw-bold";

                row.appendChild(dateCell);
                row.appendChild(descriptionCell);
                row.appendChild(amountCell);

                expensesPageList.appendChild(row);
            });
        }
    }
}

// ==========================================
// UPDATE DASHBOARD AND REPORTS
// ==========================================

function updateDashboard() {

    const totalIncome = transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const totalExpenses = transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const balance = totalIncome - totalExpenses;

    if (totalIncomeDisplay) totalIncomeDisplay.textContent = formatNaira(totalIncome);
    if (totalExpensesDisplay) totalExpensesDisplay.textContent = formatNaira(totalExpenses);
    if (balanceDisplay) balanceDisplay.textContent = formatNaira(balance);
    if (reportTotalIncomeDisplay) reportTotalIncomeDisplay.textContent = formatNaira(totalIncome);
    if (reportTotalExpensesDisplay) reportTotalExpensesDisplay.textContent = formatNaira(totalExpenses);
    if (reportBalanceDisplay) reportBalanceDisplay.textContent = formatNaira(balance);

    updateIncomeExpensePages();
}
// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions() {

    if (!transactionList) return;

    transactionList.innerHTML = "";

    transactions.forEach((transaction, index) => {

        const newTransaction = document.createElement("tr");

        const dateCell = document.createElement("td");
        const descriptionCell = document.createElement("td");
        const typeCell = document.createElement("td");
        const amountCell = document.createElement("td");
        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");
        const editButton = document.createElement("button");

        dateCell.textContent = transaction.date || "";
        descriptionCell.textContent = transaction.description || "";

        typeCell.textContent =
            transaction.type === "income" ? "Credit" : "Debit";

        amountCell.textContent = "₦" + formatNaira(transaction.amount);

        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger btn-sm me-2";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {

            if (confirm("Are you sure you want to delete this transaction?")) {

                transactions.splice(index, 1);

                saveTransactions();
                updateDashboard();
                displayTransactions();
            }
        });

        editButton.textContent = "Edit";
        editButton.className = "btn btn-warning btn-sm";
        editButton.type = "button";

        editButton.addEventListener("click", function() {

            editingIndex = index;

            if (expenseNameInput) expenseNameInput.value = transaction.description;
            if (amountInput) amountInput.value = transaction.amount;
            if (typeInput) typeInput.value = transaction.type;
            if (dateInput) dateInput.value = transaction.date;

            if (addExpenseButton) {
                addExpenseButton.textContent = "Update Transaction";
            }

            const dashboardPage = document.getElementById("dashboard");

            if (dashboardPage) {
                dashboardPage.classList.add("active");

                document.querySelectorAll(".app-page").forEach(page => {
                    if (page !== dashboardPage) {
                        page.classList.remove("active");
                    }
                });

                document.querySelectorAll(".page-link").forEach(link => {
                    link.classList.toggle("active", link.dataset.page === "dashboard");
                });
            }

            if (expenseNameInput) {
                expenseNameInput.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });

        actionCell.appendChild(deleteButton);
        actionCell.appendChild(editButton);

        newTransaction.appendChild(dateCell);
        newTransaction.appendChild(descriptionCell);
        newTransaction.appendChild(typeCell);
        newTransaction.appendChild(amountCell);
        newTransaction.appendChild(actionCell);

        transactionList.appendChild(newTransaction);

    });
}

// ==========================================
// ADD OR EDIT TRANSACTION
// ==========================================

if (addExpenseButton) {

    addExpenseButton.addEventListener("click", function() {

        const expenseName = expenseNameInput.value.trim();
        const amount = Number(amountInput.value);
        const type = typeInput.value;
        const date = dateInput.value;

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (expenseName === "") {
            alert("Please enter a description.");
            return;
        }

        if (date === "") {
            alert("Please enter a date.");
            return;
        }

        if (!["income", "expense"].includes(type)) {
            alert("Please select a valid transaction type.");
            return;
        }

        const transactionData = {
            description: expenseName,
            amount: amount,
            type: type,
            date: date
        };

        if (editingIndex === null) {
            transactions.push(transactionData);
        } else {
            transactions[editingIndex] = transactionData;
            editingIndex = null;
        }

        saveTransactions();
        displayTransactions();
        updateDashboard();

        expenseNameInput.value = "";
        amountInput.value = "";
        dateInput.value = "";

        addExpenseButton.textContent = "Add Transaction";

    });
}

// ==========================================
// CSV DELIMITER DETECTION & READER
// ==========================================

function detectDelimiter(content) {

    const possibleDelimiters = [",", ";", "\t", "|"];
    let bestDelimiter = ",";
    let highestCount = -1;

    for (const delimiter of possibleDelimiters) {

        let count = 0;
        let insideQuotes = false;

        for (let i = 0; i < content.length; i++) {

            const character = content[i];

            if (character === '"') {
                if (insideQuotes && content[i + 1] === '"') {
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (character === delimiter && !insideQuotes) {
                count++;
            } else if ((character === "\n" || character === "\r") && !insideQuotes) {
                break;
            }
        }

        if (count > highestCount) {
            highestCount = count;
            bestDelimiter = delimiter;
        }
    }

    return bestDelimiter;
}

function parseCSV(content, delimiter) {

    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;

    content = content.replace(/^\uFEFF/, "");

    for (let i = 0; i < content.length; i++) {

        const character = content[i];

        if (character === '"') {
            if (insideQuotes && content[i + 1] === '"') {
                value += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (character === delimiter && !insideQuotes) {
            row.push(value.trim());
            value = "";
        } else if ((character === "\n" || character === "\r") && !insideQuotes) {
            if (character === "\r" && content[i + 1] === "\n") {
                i++;
            }
            row.push(value.trim());
            if (row.some(cell => cell !== "")) {
                rows.push(row);
            }
            row = [];
            value = "";
        } else {
            value += character;
        }
    }

    row.push(value.trim());

    if (row.some(cell => cell !== "")) {
        rows.push(row);
    }

    return rows;
}
// ==========================================
// UNIVERSAL BANK PARSER HELPERS
// ==========================================

function normalizeHeader(header) {
    return String(header || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, "");
}

const BANK_HEADERS = {
    date: [
        "date", "transactiondate", "transdate",
        "valuedate", "postingdate", "entrydate", "txndate"
    ],
    description: [
        "description", "details", "narration",
        "transactiondescription", "transactiondetails",
        "particulars", "remarks", "narrative",
        "paymentdetails", "beneficiarydetails", "name"
    ],
    amount: [
        "amount", "transactionamount", "txnamount",
        "value", "amountngn", "localamount"
    ],
    credit: [
        "credit", "credits", "creditamount", "deposit",
        "deposits", "moneyin", "paidin", "lodgement",
        "lodgment", "cr", "creditngn", "depositamount"
    ],
    debit: [
        "debit", "debits", "debitamount", "withdrawal",
        "withdrawals", "moneyout", "paidout", "payment",
        "dr", "debitngn", "withdrawalamount"
    ],
    type: [
        "type", "transactiontype", "category",
        "drcr", "debitcredit", "transactionindicator", "crdr"
    ]
};

function findColumn(headers, possibleNames) {
    return headers.findIndex(header =>
        possibleNames.includes(normalizeHeader(header))
    );
}

function detectHeaderRow(rows) {
    const headerTypes = Object.values(BANK_HEADERS);
    const searchLimit = Math.min(rows.length, 10);

    for (let i = 0; i < searchLimit; i++) {
        const headers = rows[i].map(normalizeHeader);
        let matches = 0;

        for (const aliases of headerTypes) {
            if (headers.some(header => aliases.includes(header))) {
                matches++;
            }
        }

        if (matches >= 2) {
            return i;
        }
    }

    return -1;
}

function parseAmount(value) {
    if (value === null || value === undefined) return null;

    let text = String(value).trim();
    if (text === "") return null;

    const upperText = text.toUpperCase();
    let isNegative = false;

    if (text.startsWith("(") && text.endsWith(")")) {
        isNegative = true;
        text = text.slice(1, -1);
    }

    if (/\bDR\b/.test(upperText)) {
        isNegative = true;
    }

    text = text
        .replace(/NGN/gi, "")
        .replace(/[₦$£€,\s]/g, "")
        .replace(/\b(DR|CR)\b/gi, "")
        .replace(/[^\d.-]/g, "");

    if (text === "" || text === "-" || text === ".") return null;

    let amount = Number(text);
    if (!Number.isFinite(amount)) return null;

    if (isNegative) {
        amount = -Math.abs(amount);
    }

    return amount;
}

function makeISODate(year, month, day) {
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return "";
    }

    return [
        year,
        String(month).padStart(2, "0"),
        String(day).padStart(2, "0")
    ].join("-");
}

function normalizeDate(value) {
    if (!value) return "";

    const text = String(value).trim();

    let match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (match) {
        return makeISODate(Number(match[1]), Number(match[2]), Number(match[3]));
    }

    match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
    if (match) {
        let year = Number(match[3]);
        if (year < 100) {
            year += year < 50 ? 2000 : 1900;
        }
        return makeISODate(year, Number(match[2]), Number(match[1]));
    }

    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) {
        return [
            parsed.getFullYear(),
            String(parsed.getMonth() + 1).padStart(2, "0"),
            String(parsed.getDate()).padStart(2, "0")
        ].join("-");
    }

    return "";
}

function classifyTransaction(rawType, signedAmount) {
    const type = String(rawType || "").trim().toLowerCase();

    const incomeWords = [
        "credit", "income", "cr", "c",
        "deposit", "lodgement", "lodgment",
        "paid in", "money in", "received"
    ];

    const expenseWords = [
        "debit", "expense", "dr", "d",
        "withdrawal", "payment",
        "paid out", "money out", "sent"
    ];

    if (incomeWords.includes(type)) return "income";
    if (expenseWords.includes(type)) return "expense";
    if (signedAmount < 0) return "expense";

    return "";
}

function mapBankColumns(headers) {
    return {
        date: findColumn(headers, BANK_HEADERS.date),
        description: findColumn(headers, BANK_HEADERS.description),
        amount: findColumn(headers, BANK_HEADERS.amount),
        credit: findColumn(headers, BANK_HEADERS.credit),
        debit: findColumn(headers, BANK_HEADERS.debit),
        type: findColumn(headers, BANK_HEADERS.type)
    };
}

function transactionKey(transaction) {
    return [
        transaction.date,
        transaction.description.toLowerCase().trim(),
        Number(transaction.amount).toFixed(2),
        transaction.type
    ].join("|");
}

// ==========================================
// IMPORT CSV FILE
// ==========================================

function loadFile(event) {

    const file = event.target.files[0];

    if (!file) {
        alert("Please select a CSV file.");
        return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Please upload a CSV file.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(loadEvent) {

        try {
            const content = loadEvent.target.result;
            const delimiter = detectDelimiter(content);
            const rows = parseCSV(content, delimiter);

            if (rows.length === 0) {
                alert("The CSV file is empty.");
                return;
            }

            const headerRowIndex = detectHeaderRow(rows);
            let columns;
            let startIndex;

            if (headerRowIndex !== -1) {
                const headers = rows[headerRowIndex];
                columns = mapBankColumns(headers);
                startIndex = headerRowIndex + 1;
            } else {
                columns = {
                    description: 0,
                    amount: 1,
                    type: 2,
                    date: 3,
                    credit: -1,
                    debit: -1
                };
                startIndex = 0;
            }

            const hasSeparateCreditDebit = columns.credit !== -1 || columns.debit !== -1;
            const hasAmountColumn = columns.amount !== -1;

            if (
                columns.description === -1 ||
                columns.date === -1 ||
                (!hasSeparateCreditDebit && !hasAmountColumn)
            ) {
                alert(
                    "I could not recognise the required columns.\n\n" +
                    "Your file needs a date, description and amount, " +
                    "or separate credit and debit columns."
                );
                return;
            }

            let successfulImports = 0;
            let failedImports = 0;
            let duplicateImports = 0;

            importedTransactions = [];
            const existingKeys = new Set(transactions.map(transactionKey));

            for (let i = startIndex; i < rows.length; i++) {
                const currentRow = rows[i];
                const description = currentRow[columns.description]?.trim() || "";
                const date = normalizeDate(currentRow[columns.date]);

                let amount = null;
                let type = "";

                if (hasSeparateCreditDebit) {
                    const credit = columns.credit !== -1 ? parseAmount(currentRow[columns.credit]) : null;
                    const debit = columns.debit !== -1 ? parseAmount(currentRow[columns.debit]) : null;

                    const creditAmount = credit === null ? 0 : Math.abs(credit);
                    const debitAmount = debit === null ? 0 : Math.abs(debit);

                    if (creditAmount > 0 && debitAmount === 0) {
                        amount = creditAmount;
                        type = "income";
                    } else if (debitAmount > 0 && creditAmount === 0) {
                        amount = debitAmount;
                        type = "expense";
                    } else {
                        failedImports++;
                        continue;
                    }
                } else {
                    const signedAmount = parseAmount(currentRow[columns.amount]);
                    if (signedAmount === null || signedAmount === 0) {
                        failedImports++;
                        continue;
                    }

                    const rawType = columns.type !== -1 ? currentRow[columns.type] : "";
                    type = classifyTransaction(rawType, signedAmount);

                    if (!type) {
                        failedImports++;
                        continue;
                    }

                    amount = Math.abs(signedAmount);
                }

                if (!description || !date || amount === null || amount <= 0 || !type) {
                    failedImports++;
                    continue;
                }

                const transactionData = {
                    description: description,
                    amount: amount,
                    type: type,
                    date: date
                };

                const key = transactionKey(transactionData);

                if (existingKeys.has(key)) {
                    duplicateImports++;
                    continue;
                }

               existingKeys.add(key);
                importedTransactions.push(transactionData);
                successfulImports++;
            }
                        if (successfulImports === 0) {
                alert(
                    "No new valid transactions were imported.\n\n" +
                    "Invalid rows: " + failedImports +
                    "\nDuplicates skipped: " + duplicateImports
                );
                return;
            }

            transactions.push(...importedTransactions);

            saveTransactions();
            updateDashboard();
            displayTransactions();

            alert(
                successfulImports + " transactions imported successfully!\n\n" +
                failedImports + " invalid rows skipped.\n" +
                duplicateImports + " duplicates skipped."
            );

        } catch (error) {
            console.error("CSV Import Error:", error);
            alert("Something went wrong while importing the CSV file. Please check that it is a valid CSV file.");
        }

        event.target.value = "";
    };

    reader.onerror = function() {
        alert("The file could not be read. Please try again.");
        event.target.value = "";
    };

    reader.readAsText(file);
}

// ==========================================
// THEME SETTINGS
// ==========================================

const themeSelector = document.getElementById("themeSelector");

function applyTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    localStorage.setItem("selectedTheme", theme);
}

const savedTheme = localStorage.getItem("selectedTheme") || "light";

applyTheme(savedTheme);

if (themeSelector) {

    themeSelector.value = savedTheme;

    themeSelector.addEventListener("change", function() {
        applyTheme(themeSelector.value);
    });

}


// ==========================================
// EXPORT BACKUP
// ==========================================

const exportBackupButton = document.getElementById("exportBackup");

if (exportBackupButton) {

    exportBackupButton.addEventListener("click", function() {

        const backupData = JSON.stringify(transactions, null, 2);

        const blob = new Blob([backupData], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");

        downloadLink.href = url;
        downloadLink.download = "expense-tracker-backup.json";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(url);

    });

}


// ==========================================
// IMPORT BACKUP
// ==========================================

const importBackupButton = document.getElementById("importBackupButton");
const backupFileInput = document.getElementById("backupFile");

if (importBackupButton && backupFileInput) {

    importBackupButton.addEventListener("click", function() {
        backupFileInput.click();
    });

    backupFileInput.addEventListener("change", function(event) {

        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function(loadEvent) {

            try {

                const backupTransactions = JSON.parse(loadEvent.target.result);

                if (!Array.isArray(backupTransactions)) {
                    throw new Error("Invalid backup format.");
                }

                const validTransactions = backupTransactions.every(transaction => {

                    return (
                        transaction &&
                        typeof transaction.description === "string" &&
                        Number.isFinite(Number(transaction.amount)) &&
                        Number(transaction.amount) > 0 &&
                        ["income", "expense"].includes(transaction.type) &&
                        typeof transaction.date === "string"
                    );

                });

                if (!validTransactions) {
                    throw new Error("Some transactions in the backup are invalid.");
                }

                if (confirm("Importing this backup will replace your current transactions. Continue?")) {

                    transactions = backupTransactions;

                    saveTransactions();
                    updateDashboard();
                    displayTransactions();

                    editingIndex = null;

                    alert("Backup imported successfully!");
                }

            } catch (error) {

                console.error("Backup import error:", error);
                alert("Invalid backup file. Please select a valid expense tracker backup.");

            }

            event.target.value = "";

        };

        reader.onerror = function() {
            alert("The backup file could not be read.");
            event.target.value = "";
        };

        reader.readAsText(file);

    });

}


// ==========================================
// CLEAR ALL TRANSACTIONS
// ==========================================

const clearAllDataButton = document.getElementById("clearAllData");

if (clearAllDataButton) {

    clearAllDataButton.addEventListener("click", function() {

        if (confirm("Are you sure you want to delete ALL transactions? This cannot be undone unless you have a backup.")) {

            transactions = [];
            editingIndex = null;

            saveTransactions();
            updateDashboard();
            displayTransactions();

            alert("All transactions have been cleared.");

        }

    });

}


// ==========================================
// PAGE NAVIGATION & MOBILE MENU
// ==========================================

const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("openSidebar");
const closeSidebarBtn = document.getElementById("closeSidebar");

if (openSidebarBtn && sidebar) {
    openSidebarBtn.addEventListener("click", function() {
        sidebar.classList.add("open");
    });
}

if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener("click", function() {
        sidebar.classList.remove("open");
    });
}

const pageLinks = document.querySelectorAll(".page-link");
const appPages = document.querySelectorAll(".app-page");

pageLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const selectedPage = link.dataset.page;

        appPages.forEach(function(page) {
            page.classList.remove("active");
        });

        const pageToShow = document.getElementById(selectedPage);

        if (pageToShow) {
            pageToShow.classList.add("active");
        }

        pageLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        link.classList.add("active");

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


// ==========================================
// START THE EXPENSE TRACKER
// ==========================================

updateDashboard();
displayTransactions();
    
