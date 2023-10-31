/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const mobileSidebar = document.querySelector(".sidebar-mini");
    const sidebarBtn = document.querySelector(".sidebar-toggle");

    sidebarBtn.addEventListener("click", () => {
      mobileSidebar.classList.toggle("sidebar-open");
      mobileSidebar.classList.toggle("sidebar-collapse");
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const registerBtn = document.querySelector(".menu-item_register");
    registerBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const registerWindow = App.getModal("register");
      registerWindow.open();
    });

    const enterBtn = document.querySelector(".menu-item_login");
    enterBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const loginWindow = App.getModal("login");
      loginWindow.open();
    });

    const logoutBtn = document.querySelector(".menu-item_logout");
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      User.logout((err, response) => {
        if (response.success === true) {
          App.setState("init");
        } else {
          console.log(err);
        }
      });
    });
  }
}
