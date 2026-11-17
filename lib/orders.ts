export const orders = [
  {
    id: "ORD-1042",
    customerId: "CUST-1",
    item: "Wireless Earbuds Pro",
    price: 59,
    status: "shipped",
    eta: "Thursday",
    address: "12 Lake Road, Dhaka",
  },
  {
    id: "ORD-1043",
    customerId: "CUST-1",
    item: "Phone Case (Black)",
    price: 15,
    status: "delivered",
    eta: null,
    address: "12 Lake Road, Dhaka",
  },
  {
    id: "ORD-2001",
    customerId: "CUST-2",
    item: "Gaming Laptop",
    price: 1299,
    status: "processing",
    eta: "Next Monday",
    address: "221B Baker Street, London",
  },
];

export function findOrder(orderId: string) {
  return orders.find((order) => order.id === orderId);
}
