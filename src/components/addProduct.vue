<template>
  <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          required
          v-model="product.name"
          name="name"
        />
      </div>

      <div class="form-group">
        <label for="price">Price</label>
        <input
          type="number"
          step="0.1"
          class="form-control"
          id="price"
          required
          v-model="product.price"
          name="price"
        />
      </div>

      <div class="form-group">
        <label for="quantity">Quantity</label>
        <input
          type="number"
          step="1"
          class="form-control"
          id="quantity"
          required
          v-model="product.available_quantity"
          name="quantity"
        />
      </div>

      <div class="form-group">
        <label for="discount">discount</label>
        <br>
        <select v-model="product.discounts">
          <option disabled value="">Please select one</option>
          <option>a: 50% discount</option>
          <option>b: 1 free for 2</option>
          <option>c: No discount</option>
        </select>
      </div>

      <button @click="saveProduct" class="btn btn-success">Submit</button>
    </div>

    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newProduct">Add</button>
    </div>
  </div>
</template>

<script>
import productDataService from "../services/productDataService";

export default {
  name: "add-product",
  data() {
    return {
      product: {
        id: null,
        name: "",
        price: 0,
        available_quantity: 0,
        discounts: "",
      },
      submitted: false,
    };
  },
  methods: {
    saveProduct() {
      var data = {
        name: this.product.name,
        price: this.product.price,
        available_quantity: this.product.available_quantity,
        discounts: this.product.discounts.split(":")[0],
      };

      productDataService
        .create(data)
        .then((response) => {
          this.product.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newProduct() {
      this.submitted = false;
      this.product = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>