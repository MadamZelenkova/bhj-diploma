/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsSelect = document.getElementById("expense-accounts-list");
    const accountsSelectIncome = document.getElementById(
      "income-accounts-list"
    );

    Account.list(User.current(), (err, response) => {
      if (response.success) {
        accountsSelect.innerHTML = "";
        accountsSelectIncome.innerHTML = "";
        response.data.forEach((account) => {
          const option = document.createElement("option");
          option.value = account.id;
          option.textContent = account.name;
          const optionIncome = option.cloneNode(true);

          accountsSelect.appendChild(option);
          accountsSelectIncome.appendChild(optionIncome);
        });
      } else {
        console.log(err);
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        this.element.reset();
        if (
          document.getElementById("modal-new-income").style.display === "block"
        ) {
          const incomeModal = App.getModal("newIncome");
          if (incomeModal) {
            incomeModal.close();
          }
        } else if (
          document.getElementById("modal-new-expense").style.display === "block"
        ) {
          const expenseModal = App.getModal("newExpense");
          if (expenseModal) {
            expenseModal.close();
          }
        }
        App.update();
      } else {
        console.log(err);
      }
    });
  }
}
