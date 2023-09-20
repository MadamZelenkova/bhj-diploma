/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, response) => {
      if (response.success === true) {
        this.element.reset();
        const loginWindow = App.getModal("login");
        loginWindow.close();
        App.setState("user-logged");
      } else {
        console.log(err);
      }
    });
  }
}
