<template>
  <div v-if="!submitted">
    <div class="col-md-6" >
      <h4>Cart </h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Discount type</th>
            <th>Discount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in cart" :key="index">
            <td scope="row">{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.quantity }}</td>
            <td v-if="product.discounts === 'a'">50% discount</td>
            <td v-if="product.discounts === 'b'">1 free for 2</td>
            <td v-if="product.discounts === 'c'">No discount</td>
            <td v-if="product.discounts === 'a'">
              <strong>
                {{ product.price / 2 }} euros for each {{ product.name }}
              </strong>
            </td>
            <td v-if="product.discounts === 'b'">
              <strong
                >+ {{ Math.trunc(product.quantity / 2) }} free
                {{ product.name }}
              </strong>
            </td>
            <td v-if="product.discounts === 'c'"><strong>---</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="col-md-6">
      <h4>Total</h4>
      <div>
        <label><strong>Total cost :</strong> {{ totalCost }} </label>
      </div>
    </div>

    <button
      class="m-3 btn btn-sm btn-primary"
      @click="$router.push('products')"
    >
      Continue shopping
    </button>
    <button v-if="user" class="m-3 btn btn-sm btn-primary" @click="confirmOrder()">
      Confirm Order
    </button>
    <button v-if="!user" class="m-3 btn btn-sm btn-primary" @click="$router.push('login')">
      Login to confirm order
    </button>
  </div>
  <div v-else> 
    <h4> Order submitted successfully! </h4>
    <button class="btn btn-success" @click="$router.push('products')">New Order</button>
  </div>
</template>

<script>
import OrderDataService from "../services/orderDataService";
import productDataService from "../services/productDataService";


export default {
  name: "cart",
  data() {
    return {
      cart: [],
      totalCost: null,
      user : null,
      order : {
        id:null,
        total_cost :0 ,
        customer : 0,
      },
      submitted : false,
    };
  },
  methods: {
    sum() {
      let sum = 0;
      this.cart.forEach((element) => { 
        if(element.discounts==='a'){
          sum += (element.price/2) * element.quantity;
        }
        else {
          sum += element.price * element.quantity;
        }
      });
      this.totalCost = sum;
    },

    confirmOrder(){

      this.order.customer = this.user.id;
      this.order.total_cost = this.totalCost;
      
      // Create a new order in database
      OrderDataService
        .createOrder(this.order)
        .then((response) => {
          this.order.id = response.data.id;
          console.log(response.data);
          
        })
        .catch((e) => {
          console.log(e);
        });
      
      // Wait for the server answer in order to add items of the order to database and update products data
      setTimeout(() => {
        let order_id = this.order.id;
        this.cart.forEach(function(item) {
          
          let orderItem = {
            order : order_id,
            product : item.id,
            quantity : item.quantity,
          };

          let newProduct = {
            price : item.price,
            available_quantity : (item.available_quantity - item.quantity),
          }

          OrderDataService
          .createOrderItems(orderItem)
          .then((response) => {
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });

          productDataService.update(item.id, newProduct)
          .then(response => {
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });

        });
      }, 1000);
      setTimeout(() => {
        this.submitted = true;
        this.cart = []
      }, 1500);
      
    },

  },

  mounted() {
    if (localStorage.cart) {
      this.cart = JSON.parse(localStorage.cart);
    }
    if (localStorage.user) {
      this.user = JSON.parse(localStorage.user);
    }
    this.sum();
    
  },
  watch: {
    cart: {
      handler(newCart) {
        localStorage.cart = JSON.stringify(newCart);
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>