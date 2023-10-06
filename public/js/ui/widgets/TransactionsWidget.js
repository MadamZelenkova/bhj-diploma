/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error("Невалидное значение");
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeBtn = document.querySelector(".create-income-button");
    const expenseBtn = document.querySelector(".create-expense-button");

    incomeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const incomeWindow = App.getModal("newIncome");
      incomeWindow.open();
    });

    expenseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      //console.log(App.getModal("newExpense"))  ////////////для CreateTransactionForm
      const expenseWindow = App.getModal("newExpense");
      expenseWindow.open();
    });
  }
}
