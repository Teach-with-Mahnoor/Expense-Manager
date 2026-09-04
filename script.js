// ==========================================
// GIRL'S EXPENSE TRACKER
// Made with love by Nooryy 💗
// ==========================================


// Get HTML elements
const expenseForm = document.getElementById("expenseForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const noteInput = document.getElementById("note");

const expenseList = document.getElementById("expenseList");

const totalSpent = document.getElementById("totalSpent");
const expenseCount = document.getElementById("expenseCount");
const averageSpent = document.getElementById("averageSpent");
const biggestExpense = document.getElementById("biggestExpense");

const categorySummary = document.getElementById("categorySummary");

const filterCategory = document.getElementById("filterCategory");
const sortExpenses = document.getElementById("sortExpenses");

const clearAllBtn = document.getElementById("clearAllBtn");

const toast = document.getElementById("toast");


// ==========================================
// DATA
// ==========================================

let expenses = JSON.parse(
    localStorage.getItem("nooryyExpenses")
) || [];


// ==========================================
// CATEGORY EMOJIS
// ==========================================

const categoryEmojis = {

    Food: "🍕",

    Shopping: "🛍️",

    Transport: "🚗",

    Education: "📚",

    Beauty: "💄",

    Entertainment: "🎬",

    Bills: "🧾",

    Other: "✨"

};


// ==========================================
// SET TODAY'S DATE
// ==========================================

function setTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    dateInput.value = `${year}-${month}-${day}`;
}


setTodayDate();


// ==========================================
// SAVE DATA
// ==========================================

function saveExpenses() {

    localStorage.setItem(
        "nooryyExpenses",
        JSON.stringify(expenses)
    );

}


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(amount) {

    return "Rs " + Number(amount).toLocaleString(
        "en-PK",
        {
            maximumFractionDigits: 2
        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// SHOW TOAST
// ==========================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ==========================================
// ADD EXPENSE
// ==========================================

expenseForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title = titleInput.value.trim();

        const amount = Number(
            amountInput.value
        );

        const category = categoryInput.value;

        const date = dateInput.value;

        const note = noteInput.value.trim();


        if (
            !title ||
            !amount ||
            amount <= 0 ||
            !category ||
            !date
        ) {

            showToast(
                "Please fill all required fields 💗"
            );

            return;

        }


        const expense = {

            id: Date.now(),

            title: title,

            amount: amount,

            category: category,

            date: date,

            note: note

        };


        expenses.push(expense);


        saveExpenses();

        renderEverything();


        expenseForm.reset();

        setTodayDate();


        showToast(
            "Expense added successfully! 💕"
        );

    }
);


// ==========================================
// DELETE EXPENSE
// ==========================================

function deleteExpense(id) {

    expenses = expenses.filter(
        expense => expense.id !== id
    );


    saveExpenses();

    renderEverything();

    showToast(
        "Expense removed 🗑️"
    );

}


// ==========================================
// CLEAR ALL
// ==========================================

clearAllBtn.addEventListener(
    "click",
    function() {

        if (expenses.length === 0) {

            showToast(
                "There are no expenses to clear 💗"
            );

            return;

        }


        const confirmed = confirm(
            "Are you sure you want to delete all expenses?"
        );


        if (!confirmed) {

            return;

        }


        expenses = [];

        saveExpenses();

        renderEverything();


        showToast(
            "All expenses cleared ✨"
        );

    }
);


// ==========================================
// FILTER + SORT
// ==========================================

filterCategory.addEventListener(
    "change",
    renderExpenses
);


sortExpenses.addEventListener(
    "change",
    renderExpenses
);


// ==========================================
// GET FILTERED EXPENSES
// ==========================================

function getFilteredExpenses() {

    let result = [...expenses];


    const selectedCategory =
        filterCategory.value;


    if (selectedCategory !== "All") {

        result = result.filter(
            expense =>
                expense.category === selectedCategory
        );

    }


    const selectedSort =
        sortExpenses.value;


    if (selectedSort === "newest") {

        result.sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );

    }


    else if (selectedSort === "oldest") {

        result.sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );

    }


    else if (selectedSort === "highest") {

        result.sort(
            (a, b) =>
                b.amount - a.amount
        );

    }


    else if (selectedSort === "lowest") {

        result.sort(
            (a, b) =>
                a.amount - b.amount
        );

    }


    return result;

}


// ==========================================
// RENDER EXPENSES
// ==========================================

function renderExpenses() {

    const filteredExpenses =
        getFilteredExpenses();


    if (filteredExpenses.length === 0) {

        expenseList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🧸
                </div>

                <h3>No expenses found!</h3>

                <p>
                    Try another filter or add a new expense 💕
                </p>

            </div>

        `;

        return;

    }


    expenseList.innerHTML =
        filteredExpenses.map(
            expense => {

                const emoji =
                    categoryEmojis[
                        expense.category
                    ] || "✨";


                const formattedDate =
                    formatDate(expense.date);


                return `

                    <div class="expense-item">

                        <div class="expense-icon">
                            ${emoji}
                        </div>


                        <div class="expense-info">

                            <h3>
                                ${escapeHTML(
                                    expense.title
                                )}
                            </h3>

                            <p>
                                ${formattedDate}

                                ${
                                    expense.note
                                    ? " • " +
                                      escapeHTML(
                                          expense.note
                                      )
                                    : ""
                                }
                            </p>

                        </div>


                        <div class="expense-category">

                            ${emoji}
                            ${escapeHTML(
                                expense.category
                            )}

                        </div>


                        <div class="expense-amount">

                            ${formatMoney(
                                expense.amount
                            )}

                        </div>


                        <button
                            class="delete-btn"
                            onclick="deleteExpense(${expense.id})"
                            title="Delete expense"
                        >
                            🗑️
                        </button>

                    </div>

                `;

            }
        ).join("");

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStats() {

    const count =
        expenses.length;


    const total =
        expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );


    const average =
        count > 0
        ? total / count
        : 0;


    const biggest =
        count > 0
        ? Math.max(
            ...expenses.map(
                expense =>
                    Number(expense.amount)
            )
        )
        : 0;


    totalSpent.textContent =
        formatMoney(total);


    expenseCount.textContent =
        count;


    averageSpent.textContent =
        formatMoney(average);


    biggestExpense.textContent =
        formatMoney(biggest);

}


// ==========================================
// CATEGORY SUMMARY
// ==========================================

function updateCategorySummary() {

    if (expenses.length === 0) {

        categorySummary.innerHTML = `

            <div class="empty-summary">

                Add some expenses to see
                your spending summary 💗

            </div>

        `;

        return;

    }


    const categoryTotals = {};


    expenses.forEach(
        expense => {

            if (!categoryTotals[
                expense.category
            ]) {

                categoryTotals[
                    expense.category
                ] = 0;

            }


            categoryTotals[
                expense.category
            ] += Number(expense.amount);

        }
    );


    const total =
        expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );


    const sortedCategories =
        Object.entries(
            categoryTotals
        ).sort(
            (a, b) =>
                b[1] - a[1]
        );


    categorySummary.innerHTML =
        sortedCategories.map(
            ([category, amount]) => {

                const percentage =
                    total > 0
                    ? (amount / total) * 100
                    : 0;


                const emoji =
                    categoryEmojis[
                        category
                    ] || "✨";


                return `

                    <div class="summary-row">

                        <div class="category-name">

                            ${emoji}
                            ${escapeHTML(
                                category
                            )}

                        </div>


                        <div class="progress-container">

                            <div
                                class="progress-bar"
                                style="width: ${percentage}%"
                            ></div>

                        </div>


                        <div class="summary-amount">

                            ${formatMoney(amount)}

                        </div>

                    </div>

                `;

            }
        ).join("");

}


// ==========================================
// RENDER EVERYTHING
// ==========================================

function renderEverything() {

    updateStats();

    updateCategorySummary();

    renderExpenses();

}


// ==========================================
// START APP
// ==========================================

renderEverything();