/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
      this.update();
    } else {
      throw new Error("Невалидное значение");
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener("click", (event) => {
      let target = event.target;

      while (target && target !== this.element) {
        ///код не работает без условия while, клик на элемент с классом "account" не происходит
        if (target.classList.contains("account")) {
          event.preventDefault();
          this.onSelectAccount(target);
          return;
        }
        target = target.parentElement;
      }
    });

    const accountBtn = this.element.querySelector(".create-account");

    accountBtn.addEventListener("click", () => {
      const accountWindow = App.getModal("createAccount");
      accountWindow.open();
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response.success === true) {
          this.clear();
          this.renderItem(response.data);
        } else {
          console.log(err);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.querySelectorAll(".account");
    accounts.forEach((e) => {
      e.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const accounts = this.element.querySelectorAll(".account");
    accounts.forEach((e) => {
      e.classList.remove("active");
    });
    element.classList.add("active");
    App.showPage("transactions", {
      account_id: element.getAttribute("data-id"),
    });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const account = document.createElement("li");
    account.className = "account";
    account.setAttribute("data-id", item.id);

    const name = document.createElement("span");
    name.textContent = item.name;

    const sum = document.createElement("span");
    sum.textContent = " / " + item.sum + "₽";

    const container = document.createElement("a");
    container.href = "#";

    container.appendChild(name);
    container.appendChild(sum);
    account.appendChild(container);

    return account;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const accountConteiner = this.element;
    data.forEach((item) => {
      accountConteiner.appendChild(this.getAccountHTML(item));
    });
  }
}
