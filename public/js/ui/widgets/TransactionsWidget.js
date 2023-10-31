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
    this.element.addEventListener("click", (e) => {
      if (e.target.classList.contains("create-income-button")) {
        e.preventDefault();
        const incomeWindow = App.getModal("newIncome");
        incomeWindow.open();
      } else if (e.target.classList.contains("create-expense-button")) {
        e.preventDefault();
        const expenseWindow = App.getModal("newExpense");
        expenseWindow.open();
      }
    });
  }
}
