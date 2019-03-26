<template>
  <div class="page-container demo-container">
    <h1>无菜单DEMO</h1>
    <h1>demo</h1>
    <!--组件之间的数据流-->
    <product-item
      :title="productTitle"
      :price="productPrice"
      @outPrice="onProductItemPrice"
    ></product-item>
    <p>父组件中的价格：{{productPrice}}</p>
    <button @click="onChangePrice">父组件事件</button>
  </div>
</template>

<script>
import ProductItem from './product-item'
export default {
  name: 'Demo',
  components: {
    ProductItem
  },
  filters: {

  },
  data() {
    return {
      productTitle:'水果',
      productPrice:10
    }
  },
  computed: {},
  created() {

  },
  methods: {
    onChangePrice(){
      this.productPrice = 100;
    },
    onProductItemPrice(data){
      console.log('======onProductItemPrice=====',data);
      this.productPrice = data
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .demo-container {

  }
</style>
