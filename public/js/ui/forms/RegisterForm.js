/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, response) => {
      //console.log(data)
      if (response.success === true) {
        this.element.reset();
        const registerWindow = App.getModal("register");
        registerWindow.close();
        App.setState("user-logged");
      } else {
        console.log(err);
      }
    });
  }
}
