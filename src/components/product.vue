<template>
  <div v-if="currentProduct" class="edit-form">
    <h4>Product</h4>
    <form>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name"
          v-model="currentProduct.name"
        />
      </div>
      <div class="form-group">
        <label for="price">Price</label>
        <input type="number" step="0.1" class="form-control" id="price"
          v-model="currentProduct.price" 
        />
      </div>
      <div class="form-group">
        <label for="quantity">Quantity</label>
        <input
          type="number" step ="1"
          class="form-control"
          id="quantity"
          v-model="currentProduct.available_quantity"
          name="quantity"
          
        />
      </div>

      <div class="form-group">
        <label for="discount">discount</label>
        <br>
        <select v-model="currentProduct.discounts">
          <option disabled value="">Please select one</option>
          <option>a: 50% discount</option>
          <option>b: 1 free for 2</option>
          <option>c: No discount</option>
        </select>
      </div>

    
    </form>
       
    
      <button class="badge badge-danger mr-2"
        @click="deleteProduct"
      >
        Delete
      </button>

      <button type="submit" class="badge badge-success"
        @click="updateProduct"
      >
        Update
      </button>


    <p>{{ message }}</p>
  </div>

  <div v-else>
    <br />
    <p>Please click on a product...</p>
  </div>
</template>

<script>
import productDataService from "../services/productDataService";

export default {
  name: "product",
  data() {
    return {
      currentProduct: null,
      message: ''
    };
  },
  methods: {
    getProduct(id) {
      productDataService.get(id)
        .then(response => {
          this.currentProduct = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },



    updateProduct() {
      var data = {
        
        name: this.currentProduct.name,
        price: this.currentProduct.price,
        available_quantity: this.currentProduct.available_quantity,
        discounts: this.currentProduct.discounts.split(":")[0],
      };
      productDataService.update(this.currentProduct.id, data)
        .then(response => {
          console.log(response.data);
          this.message = 'The product was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteProduct() {
      productDataService.delete(this.currentProduct.id)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "products" });
        })
        .catch(e => {
          console.log(e);
        });
    },

    
  },
  mounted() {
    this.message = '';
    this.getProduct(this.$route.params.id);
    
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>