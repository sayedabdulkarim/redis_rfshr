export const getProducts = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        products: [
          {
            id: 1,
            name: "Product 1",
            price: 100,
          },
        ],
      });
    }, 5000);
  });
};
