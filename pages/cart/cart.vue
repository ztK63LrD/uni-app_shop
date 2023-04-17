<template>
	<!-- 有商品数据显示 -->
	<view style="padding-bottom: 60px;" v-if="cart.length !== 0">
		<!-- 收获地址组件 -->
		<my-address></my-address>
		<!-- 商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 右侧的文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 循环渲染购物车中的商品信息 -->
		<uni-swipe-action>
			<block v-for="(item,index) in cart" :key="index">
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(item)">
					<my-goods
						:item="item" 
						:showRadio="true" 
						:showNum="true"
						@radioChange="radioChangeHandler"
						@numChange="numChangeHandler">
					</my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 使用自定义的结算组件 -->
		<my-settle></my-settle>
	</view>
	<!-- 空白购物车的区域 -->
	<view class="empty-cart" v-else>
		<image src="../../static/images/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { mapState,mapMutations } from 'vuex'
	export default {
		computed:{
			...mapState('m_cart',['cart'])
		},
		mixins:[badgeMix],
		data() {
			return {
				options:[{
					text:'删除', 
					style:{
						backgroundColor: '#C00000'
					} 
				}]
			};
		},
		methods:{
			...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
			radioChangeHandler(e){
				this.updateGoodsState(e)
			},
			numChangeHandler(e){
				this.updateGoodsCount(e)
			},
			swipeItemClickHandler(item){
				this.removeGoodsById(item.goods_id)
			}
		}
	}
</script>

<style lang="scss">
.cart-title{
	height: 40px;
	display: flex;
	align-items: center;
	padding-left: 5px;
	border-bottom: 1px solid #EFEFEF;
	.cart-title-text{
		font-size: 14px;
		margin-left: 10px;
	}
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;

  .empty-img {
    width: 90px;
    height: 90px;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}

</style>
