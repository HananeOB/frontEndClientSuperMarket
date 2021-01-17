<template>
  <div class="login-wrapper border border-light" v-if="!user">
    <form class="form-signin" @submit.prevent="login">
      <h4 class="form-signin-heading">Please sign in</h4>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input
        v-model="email"
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="Email address"
        required
        autofocus
      />
      <br />
      <label for="username" class="sr-only">Username</label>
      <input
        v-model="username"
        type="text"
        id="username"
        class="form-control"
        placeholder="Username"
        required
      />
      <br />
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        v-model="password"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required
      />
      <br />
      <button class="btn btn-lg btn-secondary btn-block" @click="login()">
        Sign in
      </button>
      {{ message }}
    </form>
  </div>
  <div v-else>
    <h4>You have logged in successfully!</h4>

    <button class="btn btn-success" @click="confirm()" >Continue shopping</button> 
  </div>
</template>

<script>
// import { user } from '../store.js'

import userDataService from "../services/userDataService";
const crypto = require("crypto");

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      username: "",
      user: null,
      message: "",
      hashkey: "",
    };
  },
  methods: {
    login() {
      userDataService
        .get(this.username)
        .then((response) => {
          this.user = response.data;
          
          let parts = this.user.password.split("$");
          crypto.pbkdf2(this.password, parts[2], parseInt(parts[1]), 32, "sha256",
              (err, derivedKey) => {
                if (err) throw err;
                this.hashkey = derivedKey.toString("base64");
              }
          );

          setTimeout(() => {
            if (
              this.user.email === this.email &&
              this.user.password.split("$")[3] === this.hashkey
            ) {
              this.$router.go();
            } else {
              this.message = "Your informations are inaccurate !";
            }
          }, 1000);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    confirm(){
      this.$router.push("products");
    }
  },
  mounted() {
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
  },
};
</script>

<style lang="css">
.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>