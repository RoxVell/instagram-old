<template>
  <header>
    <div class="header main-container">
      <div class="logo">q</div>
      <nav>
        <ul class="header-menu">
          <li class="header-menu__item">
            <span class="icon icon-home"></span>
          </li>
          <li class="header-menu__item">Second</li>
          <li class="header-menu__item">Third</li>
          <li class="header-menu__item">4</li>
        </ul>
      </nav>
      <div>здесь аватар</div>
    </div>
  </header>
</template>

<script>
export default {
  
}
</script>


<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  background-color: red;
}

.header-menu {
  display: flex;
}

span.icon {
  display: block;
}

span.icon-home {
  background-image: url('~/assets/images/icons/home.svg');
}

</style>
