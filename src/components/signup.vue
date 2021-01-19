<template>
  <div class="register-wrapper border border-light" v-if="!user">
    <form class="form-register" @submit.prevent="signup">
      <h4 class="form-register-heading">Registration form</h4>
      <label for="exampleInputEmail1" class="sr-only">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Enter email"
        v-model="email"
        autofocus
        required
      />
      <br />
      <label for="exampleUsername" class="sr-only">Username</label>
      <input
        type="text"
        class="form-control"
        id="exampleUsername"
        placeholder="Username"
        v-model="username"
        required
      />
      <br />
      <label for="exampleInputPassword1" class="sr-only">Password</label>
      <input
        type="password"
        v-model="password"
        class="form-control"
        id="exampleInputPassword1"
        placeholder="Password"
        required
      />
      <br />
      <button class="btn btn-lg btn-secondary btn-block" @click="signup()">
        Register
      </button>
      <small id="emailHelp" class="form-text text-muted"
        >Already registred <a href="login"> Login </a></small
      >
      <h4>{{ message }}</h4>
    </form>
  </div>
  <div v-else>
    <h4>You are already logged in !</h4>

    <button class="btn btn-success" @click="confirm()">
      Continue shopping
    </button>
  </div>
</template>
<script>
const crypto = require("crypto");
import userDataService from "../services/userDataService";

export default {
  name: "Signup",
  data() {
    return {
      username: "",
      email: "",
      hashed_password: "",
      user: null,
      password: "",
      message: "",
      OK: true,
    };
  },
  methods: {
    convertPassword() {
      let salt = crypto.randomBytes(6).toString("hex");
      let iterations = 216000;

      crypto.pbkdf2(
        this.password,
        salt,
        iterations,
        32,
        "sha256",
        (err, derivedKey) => {
          if (err) throw err;
          this.hashed_password =
            "pbkdf2_sha256$" +
            iterations +
            "$" +
            salt +
            "$" +
            derivedKey.toString("base64");
          console.log(this.hashed_password);
        }
      );
    },

    // confirmUser() {
        
    //   userDataService
    //     .get(this.username)
    //     .then(() => {
    //       this.OK = false;
    //       this.message = "Username already exists";
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       this.OK = true;
    //     });
     
      
    // },
    
    confirm() {
      this.$router.push("products");
    },

    signup() {
        this.convertPassword();

      setTimeout(() => {
        this.user = {
          username: this.username,
          email: this.email,
          is_superuser: false,
          password: this.hashed_password,
        };
        console.log(this.user);
        userDataService
          .create(this.user)
          .then((response) => {
            this.user = response.data;
            console.log(response.data);
            this.$router.go();
          })
          .catch((e) => {
            console.log(e);
          });
      }, 1000);
    },
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
.form-register {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-register .form-register-heading,
.form-register .checkbox {
  margin-bottom: 10px;
}
.form-register .checkbox {
  font-weight: normal;
}
.form-register .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-register .form-control:focus {
  z-index: 2;
}
.form-register input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-register input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>