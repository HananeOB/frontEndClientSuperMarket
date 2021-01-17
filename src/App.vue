<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">Shop Market</router-link>
      <div class="navbar-nav mr-auto" v-if="user">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Products</router-link>
        </li>
        <li v-if="user.is_superuser" class="nav-item">
          <router-link to="/add"  class="nav-link">Add</router-link>
        </li>
        <li v-if="!user.is_superuser" class="nav-item">
          <router-link to="/cart"  class="nav-link">Cart</router-link>
        </li>
        <li  class="nav-item">
          <router-link to="/products" @click.native="logout"  class="nav-link">Logout</router-link>
        </li>
        
      </div>
      
      <div class="navbar-nav mr-auto" v-if="!user">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Products</router-link>
        </li>
        <li  class="nav-item">
          <router-link to="/login"  class="nav-link">Login</router-link>
        </li>
        <li  class="nav-item">
          <router-link to="/signup"  class="nav-link">Sign up</router-link>
        </li>
        
      </div>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      cart:[],
      user: null,
    };
  },
  methods :{
    logout(){
      this.user = null;
      this.cart = [];
      alert("logged out successfully !");
      this.$router.go();
    }
  },
  mounted() {

    
    if (localStorage.cart) {
      this.cart = JSON.parse(localStorage.cart);
    }
    if (localStorage.user) {
      this.user = JSON.parse(localStorage.user);
    }
  },
  watch: {
    user: {
      handler(newUser) {
        localStorage.user = JSON.stringify(newUser);
      },
      deep: true,
    },
    cart: {
      handler(newCart) {
        localStorage.cart = JSON.stringify(newCart);
      },
      deep: true,
    },
  },
};
</script>