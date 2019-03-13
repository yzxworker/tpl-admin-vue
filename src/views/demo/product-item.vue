<template>
    <div class="product-item-container">
        <h1>{{title}}</h1>
        <p>子组件data中的价格&yen;{{currentPrice}}</p>
        <p>子组件props中的价格&yen;{{price}}</p>
        <button @click="onChangePrice">子组件改变价格</button>
    </div>
</template>
<script>
    export default {
        name: 'product-item',
        props:{
          title:{
            type:String,
            default:'商品标题'
          },
          price:{
            type:Number,
            default: 0
          }
        },
        components: {},
        data() {
            return {
              currentPrice:this.price
            }
        },
        computed: {

        },
        created() {
        },
        mounted(){
          console.log('==product-item mounted==');
        },
        updated(){
          console.log('==product-item updated==',this);
        },
        methods: {
          onChangePrice(){
            this.currentPrice +=10;
            this.$emit('outPrice',this.currentPrice)
          }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .product-item {
        &-container {
            margin: 30px;
        }
    }
</style>
