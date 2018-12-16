<template>
  <div class="signup">
    <p class="form-title">Зарегистрируйтесь</p>
    <div class="form-element">
      <label class="required" for="signup-mail">E-mail</label>
      <input id="signup-mail" type="email">
    </div>
    
    <div class="form-element">
      <label class="required" for="signup-password">Пароль</label>
      <input id="signup-password" type="text">
    </div>

    <div class="form-element">
      <label class="required" for="signup-password-repeat">Подтвердите пароль</label>
      <input id="signup-password-repeat" type="text">
    </div>
   
    <div class="form-element">
      <button class="btn btn-primary">Регистрация</button>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>
