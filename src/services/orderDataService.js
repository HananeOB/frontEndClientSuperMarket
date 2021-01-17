import http from "../http-common";

class OrderDataService {
  
  createOrder(data) {
    return http.post("/orders", data);
  }
  createOrderItems(data) {
    return http.post("/orderItems", data);
  }

}

export default new OrderDataService();