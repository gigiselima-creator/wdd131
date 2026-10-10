
"use strict";

const KEYS = {
  transactions: "financasEmDiaTransactions",
  goals: "financasEmDiaGoals",
  budget: "financasEmDiaBudget"
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatMoney(value) {
  return money.format(Number(value) || 0);
}

function readData(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error("Erro ao ler dados:", error);
    return fallback;
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    return false;
  }
}

function escapeHTML(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return String(value).replace(/[&<>"']/g, character => entities[character]);
}

function totals() {
  return readData(KEYS.transactions).reduce((result, item) => {
    if (item.type === "income") {
      result.income += Number(item.amount);
    } else {
      result.expenses += Number(item.amount);
    }

    return result;
  }, { income: 0, expenses: 0 });
}

function updateSummary(prefix) {
  const values = totals();
  const income = document.querySelector(`#${prefix}-income`);
  const expenses = document.querySelector(`#${prefix}-expenses`);
  const balance = document.querySelector(`#${prefix}-balance`);

  if (income && expenses && balance) {
    income.textContent = formatMoney(values.income);
    expenses.textContent = formatMoney(values.expenses);
    balance.textContent = formatMoney(values.income - values.expenses);
  }
}

function updateHome() {
  updateSummary("home");
}

function updatePlanning() {
  updateSummary("planning");
}

function renderTransactions() {
  const list = document.querySelector("#transactions-list");
  if (!list) return;

  const transactions = readData(KEYS.transactions)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (transactions.length === 0) {
    list.innerHTML = `<tr><td colspan="4">Nenhuma movimentação cadastrada.</td></tr>`;
  } else {
    list.innerHTML = transactions.map(item => {
      const isIncome = item.type === "income";
      const label = isIncome ? "Receita" : "Despesa";
      const className = isIncome ? "type-income" : "type-expense";

      return `<tr>
        <td>${escapeHTML(item.description)}<br>
        <small>${escapeHTML(item.category)} · ${escapeHTML(item.date)}</small></td>
        <td class="${className}">${label}</td>
        <td>${formatMoney(item.amount)}</td>
        <td><button class="delete-button" type="button"
          data-delete="${escapeHTML(item.id)}">Excluir</button></td>
      </tr>`;
    }).join("");
  }

  updatePlanning();
  updateHome();
}

function setupTransactions() {
  const form = document.querySelector("#transaction-form");
  if (!form) return;

  const dateInput = document.querySelector("#date");
  const message = document.querySelector("#transaction-message");

  if (dateInput && !dateInput.value) {
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    dateInput.value = localDate;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(form);
    const description = String(data.get("description")).trim();
    const amount = Number(data.get("amount"));

    if (!description || !Number.isFinite(amount) || amount <= 0) {
      message.textContent = "Informe uma descrição e um valor válido.";
      return;
    }

    const transactions = readData(KEYS.transactions);
    transactions.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      description,
      amount,
      type: String(data.get("type")),
      category: String(data.get("category")),
      date: String(data.get("date"))
    });

    if (saveData(KEYS.transactions, transactions)) {
      form.reset();
      dateInput.value = new Date().toISOString().slice(0, 10);
      message.textContent = "Movimentação salva com sucesso.";
      renderTransactions();
    } else {
      message.textContent = "Não foi possível salvar os dados.";
    }
  });

  document.querySelector("#transactions-list").addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;

    const updated = readData(KEYS.transactions)
      .filter(item => item.id !== button.dataset.delete);

    saveData(KEYS.transactions, updated);
    renderTransactions();
    message.textContent = "Movimentação excluída.";
  });

  document.querySelector("#clear-transactions").addEventListener("click", () => {
    if (readData(KEYS.transactions).length === 0) {
      message.textContent = "Não existem movimentações para apagar.";
      return;
    }

    if (confirm("Deseja apagar todas as movimentações?")) {
      saveData(KEYS.transactions, []);
      renderTransactions();
      message.textContent = "Movimentações apagadas.";
    }
  });

  renderTransactions();
}

function setupCalculator() {
  const form = document.querySelector("#budget-form");
  if (!form) return;

  const fields = ["income", "housing", "food", "transport", "debts", "other"];
  const saved = readData(KEYS.budget, null);

  if (saved) {
    fields.forEach(field => {
      form.elements[field].value = saved[field] ?? 0;
    });
    calculateBudget(saved);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const values = {};
    fields.forEach(field => {
      values[field] = Number(form.elements[field].value);
    });

    const invalid = fields.some(field =>
      !Number.isFinite(values[field]) || values[field] < 0
    );

    if (invalid || values.income <= 0) {
      document.querySelector("#budget-advice").textContent =
        "Informe uma renda positiva e valores de despesas válidos.";
      return;
    }

    saveData(KEYS.budget, values);
    calculateBudget(values);
  });
}

function calculateBudget(values) {
  const expenses = values.housing + values.food +
    values.transport + values.debts + values.other;
  const balance = values.income - expenses;
  const percentage = values.income > 0
    ? Math.round(expenses / values.income * 100)
    : 0;

  document.querySelector("#budget-balance").textContent = formatMoney(balance);
  document.querySelector("#budget-total-expenses").textContent = formatMoney(expenses);
  document.querySelector("#budget-percent").textContent = `${percentage}%`;

  const progress = document.querySelector("#budget-progress");
  const bar = document.querySelector("#budget-progress-bar");

  bar.style.width = `${Math.min(percentage, 100)}%`;
  progress.setAttribute("aria-valuenow", String(Math.min(percentage, 100)));

  const advice = document.querySelector("#budget-advice");

  if (balance < 0) {
    advice.textContent = "Atenção: seus gastos superam sua renda. Revise as despesas.";
  } else if (percentage >= 90) {
    advice.textContent = "Sua renda está bastante comprometida. Avalie os gastos e imprevistos.";
  } else if (percentage >= 70) {
    advice.textContent = "Revise suas categorias e procure reservar parte da renda.";
  } else {
    advice.textContent = "Seu orçamento tem saldo positivo. Considere criar uma reserva.";
  }
}

function setupGoals() {
  const form = document.querySelector("#goal-form");
  if (!form) return;

  const message = document.querySelector("#goal-message");
  const list = document.querySelector("#goals-list");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const target = Number(data.get("target"));
    const saved = Number(data.get("saved"));

    if (!name || !Number.isFinite(target) || target <= 0 ||
        !Number.isFinite(saved) || saved < 0) {
      message.textContent = "Confira o nome e os valores informados.";
      return;
    }

    const goals = readData(KEYS.goals);
    goals.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      target,
      saved: Math.min(saved, target),
      date: String(data.get("date"))
    });

    if (saveData(KEYS.goals, goals)) {
      form.reset();
      document.querySelector("#goal-saved").value = "0";
      message.textContent = "Meta adicionada com sucesso.";
      renderGoals();
    } else {
      message.textContent = "Não foi possível salvar a meta.";
    }
  });

  list.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    let goals = readData(KEYS.goals);
    const goal = goals.find(item => item.id === button.dataset.id);
    if (!goal) return;

    if (button.dataset.action === "delete") {
      goals = goals.filter(item => item.id !== goal.id);
      saveData(KEYS.goals, goals);
      renderGoals();
      message.textContent = "Meta excluída.";
    } else if (button.dataset.action === "add") {
      const input = prompt("Quanto deseja adicionar em reais?");
      if (input === null) return;

      const amount = Number(input.replace(",", "."));
      if (!Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Digite um valor maior que zero.";
        return;
      }

      goal.saved = Math.min(goal.target, goal.saved + amount);
      saveData(KEYS.goals, goals);
      renderGoals();
      message.textContent = "Progresso atualizado.";
    }
  });

  document.querySelector("#clear-goals").addEventListener("click", () => {
    if (readData(KEYS.goals).length === 0) {
      message.textContent = "Não há metas para apagar.";
      return;
    }

    if (confirm("Deseja apagar todas as metas?")) {
      saveData(KEYS.goals, []);
      renderGoals();
      message.textContent = "Todas as metas foram apagadas.";
    }
  });

  renderGoals();
}

function renderGoals() {
  const list = document.querySelector("#goals-list");
  if (!list) return;

  const goals = readData(KEYS.goals);

  if (goals.length === 0) {
    list.innerHTML = `<p>Você ainda não cadastrou metas.</p>`;
    return;
  }

  list.innerHTML = goals.map(goal => {
    const percentage = Math.min(
      100, Math.round(goal.saved / goal.target * 100)
    );
    const remaining = Math.max(0, goal.target - goal.saved);
    const deadline = goal.date
      ? `Prazo: ${escapeHTML(goal.date)}`
      : "Sem prazo definido";

    return `<article class="goal-card">
      <h3>${escapeHTML(goal.name)}</h3>
      <p>${deadline}</p>
      <p>Progresso: ${percentage}%</p>
      <div class="progress-track" role="progressbar"
        aria-label="Progresso da meta ${escapeHTML(goal.name)}"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentage}">
        <span style="width: ${percentage}%"></span>
      </div>
      <p>Guardado: ${formatMoney(goal.saved)}</p>
      <p>Objetivo: ${formatMoney(goal.target)}</p>
      <p>${remaining === 0
        ? "Meta concluída! Parabéns."
        : `Faltam ${formatMoney(remaining)} para alcançar a meta.`}</p>
      <div class="goal-actions">
        <button type="button" data-action="add" data-id="${goal.id}">Adicionar valor</button>
        <button type="button" data-action="delete" data-id="${goal.id}">Excluir meta</button>
      </div>
    </article>`;
  }).join("");
}

function setupMenu() {
  const button = document.querySelector("#menu-button");
  const menu = document.querySelector("#menu");

  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });
}

function setYear() {
  document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setYear();
  updateHome();
  setupTransactions();
  setupCalculator();
  setupGoals();
});
