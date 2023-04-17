<template>
	<view class="goods-item">
		<!-- 左侧的盒子 -->
		<view class="goods-item-left">
			<radio :checked="item.goods_state" color="#C00000" v-if="showRadio" @click="radioChangeHandler"></radio>
			<image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 右侧的盒子 -->
		<view class="goods-item-right">
			<!-- 商品名称 -->
			<view class="goods-name">{{item.goods_name}}</view>
			<!-- 商品价格 -->
			<view class="goods-info-box">
				<view class="goods-price">￥{{item.goods_price.toFixed(2)}}</view>
				<uni-number-box :min="1" :value="item.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		props:{
			item:{
				type:Object,
				default:{}
			},
			// 是否展示图片左侧的 radio
			showRadio:{
				type:Boolean,
				default:false, // 如果外界没有指定 show-radio 属性的值，则默认不显示 radio 组件
			},
			// 是否展示数字输入框
			showNum:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
			};
		},
		methods:{
			radioChangeHandler(){
				this.$emit('radioChange',{
					goods_id:this.item.goods_id,
					goods_state:!this.item.goods_state
				})
			},
			numChangeHandler(val){
				this.$emit('numChange',{
					goods_id:this.item.goods_id,
					goods_count:+val
				})
			}
		}
	}
</script>

<style lang="scss">
.goods-item{
	width: 750rpx;
	box-sizing: border-box;
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;
	.goods-item-left{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-right: 5px;
		.goods-pic{
			width: 100px;
			height: 100px;
			display: block;
		}
	}
	.goods-item-right{
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		.goods-name{
			font-size: 13px;
		}
		.goods-info-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.goods-price{
				color: #c00000;
				font-size: 16px;
			}
		}

	}
}
</style>