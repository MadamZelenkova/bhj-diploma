/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
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
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const accRemoveBtn = this.element.querySelector(".remove-account");

    accRemoveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    this.element.addEventListener("click", (e) => {
      if (e.target.classList.contains("transaction__remove")) {
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        this.removeTransaction(id);
      } else if (e.target.classList.contains("fa-trash")) {
        e.preventDefault();
        const id = e.target.parentNode.getAttribute("data-id");
        this.removeTransaction(id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }

    const confirmed = confirm("Вы уверены, что хотите удалить этот счет?");

    if (confirmed) {
      Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
        if (response.success) {
          this.clear();
          App.updateWidgets();
          App.updateForms();
        } else {
          console.log(err);
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const confirmed = confirm(
      "Вы действительно хотите удалить эту транзакцию?"
    );
    if (confirmed) {
      Transaction.remove({ id: id }, (err, response) => {
        if (response.success) {
          App.update();
        } else {
          console.log(err);
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }
    this.lastOptions = options;
    Account.get(options.account_id, (err, response) => {
      if (response.success) {
        response.data.forEach((el) => {
          if (el.id === this.lastOptions.account_id) {
            this.renderTitle(el.name);
          }
        });
        const content = this.element.querySelector(".content");
        content.innerHTML = "";
        Transaction.list(options, (err, response) => {
          if (response.success) {
            this.renderTransactions(response.data);
          } else {
            console.log(err);
          }
        });
      } else {
        console.log(err);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    const content = this.element.querySelector(".content");
    content.innerHTML = "";
    this.renderTransactions([]);
    this.renderTitle("Название счета");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const contentTitle = this.element.querySelector(".content-title");
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = new Date(date).toLocaleString("ru-RU", options);
    return `${formattedDate}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const time = this.formatDate(item.created_at);

    const transactions = document.createElement("div");
    transactions.className = `transaction transaction_${item.type.toLowerCase()} row`;

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "col-md-7 transaction__details";
    const iconDiv = document.createElement("div");
    iconDiv.className = "transaction__icon";
    const iconSpan = document.createElement("span");
    iconSpan.className = "fa fa-money fa-2x";

    iconDiv.appendChild(iconSpan);

    const infoDiv = document.createElement("div");
    infoDiv.className = "transaction__info";
    const transactionTitle = document.createElement("h4");
    transactionTitle.className = "transaction__title";
    transactionTitle.textContent = item.name;
    const transactionDate = document.createElement("div");
    transactionDate.className = "transaction__date";
    transactionDate.textContent = time;

    infoDiv.appendChild(transactionTitle);
    infoDiv.appendChild(transactionDate);

    detailsDiv.appendChild(iconDiv);
    detailsDiv.appendChild(infoDiv);

    const summContainer = document.createElement("div");
    summContainer.className = "col-md-3";
    const summDiv = document.createElement("div");
    summDiv.className = "transaction__summ";
    summDiv.textContent = item.sum;
    const currency = document.createElement("span");
    currency.className = "currency";
    currency.textContent = "₽";

    summDiv.appendChild(currency);
    summContainer.appendChild(summDiv);

    const transactionControl = document.createElement("div");
    transactionControl.className = "col-md-2 transaction__controls";
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger transaction__remove";
    removeBtn.setAttribute("data-id", item.id);
    const iElement = document.createElement("i");
    iElement.className = "fa fa-trash";

    removeBtn.appendChild(iElement);
    transactionControl.appendChild(removeBtn);

    transactions.appendChild(detailsDiv);
    transactions.appendChild(summContainer);
    transactions.appendChild(transactionControl);

    return transactions;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = this.element.querySelector(".content");
    data.forEach((item) => {
      content.appendChild(this.getTransactionHTML(item));
    });
  }
}
