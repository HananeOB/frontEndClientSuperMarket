<template>
  <div class="list row">
    
    <div class="col-md-6">
      <h4>Products List</h4>
      <ul class="list-group">
        <li
          class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(product, index) in products"
          :key="index"
          @click="setActiveProduct(product, index)"
          
        >
          {{ product.name }}
        </li>
      </ul>

      <button v-if="user && user.is_superuser" class="m-3 btn btn-sm btn-danger" @click="removeAllProducts">
        Remove All
      </button>
      <button class="m-3 btn btn-sm btn-primary" @click="$router.push('cart')">
        Show cart
      </button>
    </div>
    <div class="col-md-6">
      <div v-if="currentProduct">
        <h4>Product</h4>
        <router-link v-if="user && user.is_superuser"
          :to="'/products/' + currentProduct.id"
          class="badge badge-warning"
          >Edit</router-link
        >
        <div>
          <label><strong>Name:</strong></label> {{ currentProduct.name }}
        </div>
        <div>
          <label><strong>Price:</strong></label> {{ currentProduct.price }}
        </div>
        <div>
          <label><strong>Available quantity :</strong></label> {{ currentProduct.available_quantity }}
        </div>
        <div v-if="currentProduct.discounts==='a'">
          <label><strong>50 % discount on product</strong></label> 
        </div>
        <div v-if="currentProduct.discounts==='b'">
          <label><strong>1 free for two products bought</strong></label> 
        </div>
      
        <div class="input-group mb-3">
          <div class="input-group-append">
            <button
              class="btn btn-outline-primary"
              type="button"
              @click="addToCart"
            >
              Add to cart
            </button>
          </div>
          <input
            type="number" min="0" :max="currentProduct.available_quantity" :disabled="currentProduct.available_quantity===0"
            class="form-control"
            v-model="currentProduct.quantity"
          />
        </div>
     
      </div>
      <div v-else>
        <br />
        <p>Please click on a Product ...</p>
      </div>
      <div v-if="!cart.length">Your cart is empty</div>
    </div>
  </div>
</template>

<script>
import productDataService from "../services/productDataService";
export default {
  name: "product-list",
  data() {
    return {
      cart: [],
      user: null,
      products: [],
      currentProduct: null,
      currentIndex: -1,
      name: "",
    };
  },
  methods: {
    addToCart() {
      
      let name = this.currentProduct.name;
      let obj = this.cart.find((product) => product.name === name);
      console.log(obj);
      if (obj === undefined) {
        this.cart.push(this.currentProduct);
      }
      else
      {
        console.log(this.cart.indexOf(obj));
        this.cart[this.cart.indexOf(obj)] = this.currentProduct;
      }
      this.cart = this.cart.filter((product) => product.quantity > 0);
    },

    retrieveProducts() {
      productDataService
        .getAll()
        .then((response) => {
          this.products = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    refreshList() {
      this.retrieveProducts();
      this.currentProduct = null;
      this.currentIndex = -1;
    },
    setActiveProduct(product, index) {
      this.currentProduct = product;
      this.currentIndex = index;
    },
    removeAllProducts() {
      productDataService
        .deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },


  },
  mounted() {

    this.retrieveProducts();
    if (localStorage.cart) {
      this.cart = JSON.parse(localStorage.cart);
    }
    if (localStorage.user) {
      this.user = JSON.parse(localStorage.user);
    }
    console.log(this.user);
  },
  watch: {
    cart: {
      handler(newCart) {
        localStorage.cart = JSON.stringify(newCart);
      },
      deep: true,
    }
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.check-space {
  margin-right: 15px;
}
</style>