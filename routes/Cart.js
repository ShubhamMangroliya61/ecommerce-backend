const express = require('express');
const { addToCart, fetchCartByUser, deleteFromCart, updateCart, resetCart } = require('../controller/cart');

const router = express.Router();
//  /products is already added in base path
router.post('/', addToCart)
      .get('/own', fetchCartByUser)
      .delete('/:id', deleteFromCart)
      .delete('/resetcart/:userId',resetCart)
      .patch('/:id', updateCart)


module.exports = router;