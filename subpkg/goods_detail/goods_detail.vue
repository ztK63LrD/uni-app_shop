<template>
	<view v-if="goods_info.goods_name" style="padding-bottom: 50px;">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in goods_info.pics" :key="index">
				<image :src="item.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品文字信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 商品信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名字 -->
				<view class="goods_name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费区域 -->
			<view class="yf">快递：免运费</view>
		</view>
		<!-- 商品图文信息区域 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<!-- 商品导航组件区域 -->
		<view class="goods_nav">
			<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations,mapGetters } from 'vuex'
	export default {
		computed:{
			// 把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
			...mapState('m_cart',[]),
			...mapGetters('m_cart',['total'])
		},
		// 通过 watch 侦听器，监听计算属性 total 值的变化，从而动态为购物车按钮的徽标赋值：
		watch:{
			// 定义 total 侦听器，指向一个配置对象
			total: {
				// handler 属性用来定义侦听器的 function 处理函数
				handler(newVal) {
					const findResult = this.options.find(x => x.text === '购物车')
					if (findResult) {
						findResult.info = newVal
					}
				},
				// immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
				immediate: true
			}
		},
		data() {
			return {
				// 商品详情对象
				goods_info:{},
				// 左侧按钮组的配置对象
				options: [{ 
				  icon: 'shop',
				  text: '店铺'
				}, {
				  icon: 'cart',
				  text: '购物车',
				  info: 0
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
					text: '加入购物车',
					backgroundColor: '#ff0000',
					color: '#fff'
				  },
				  {
					text: '立即购买',
					backgroundColor: '#ffa200',
					color: '#fff'
				  }
				]
			}
		},
		onLoad(options) {
			// 获取当前页面的商品信息
			const id = options.goods_id
			// 获取商品详情数据
			this.getGoodsDetail(id)
		},
		methods: {
			...mapMutations('m_cart',['addToCart']),
			getGoodsDetail(id){
				uni.request({
					url:'https://www.uinav.com/api/public/v1/goods/detail',
					data:{
						goods_id:id
					},
					success:res => {
						// 消除图文信息区域产生的间隔问题,以及不同设备兼容图片格式问题
						res.data.message.goods_introduce = res.data.message.goods_introduce.replace(/<img/g,'<img style="display:block;" ').replace(/webp/g, 'jpg')
						this.goods_info = res.data.message
					},
					fail:res => {
						uni.$showMsg()
					}
				})
			},
			preview(index){
				// 进行图片预览
				uni.previewImage({
					current:index, // 当前图片的索引
					urls:this.goods_info.pics.map(url=>url.pics_big), // 当前预览图片的url地址数组
				})
			},
			onClick(e){
				if(e.content.text === '购物车'){
					// 切换到购物车界面
					uni.switchTab({
						url:'/pages/cart/cart'
					})		
				}
			},
			buttonClick(e){
				if(e.content.text === '加入购物车'){
					// 组织商品的信息对象
					const goods = {
						goods_id: this.goods_info.goods_id,      		    // 商品的Id
						goods_name: this.goods_info.goods_name,   			// 商品的名称
						goods_price: this.goods_info.goods_price, 			// 商品的价格
						goods_count: 1,                           			// 商品的数量
						goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
						goods_state: true                       			// 商品的勾选状态
					}
					// 调用 addToCart方法
					this.addToCart(goods)
				}
			}
		}
	}
</script>

<style lang="scss">
// 轮播图区域
swiper{
	height: 750rpx;
	image{
		width: 100%;
		height: 100%;
	}
}
// 商品文字信息区域
.goods-info-box{
	padding: 10px;
	padding-right: 0;
	// 商品价格
	.price{
		color: #c00000;
		font-size: 18px;
		margin: 10px 0;
	}
	// 商品信息主体区域
	.goods-info-body{
		display: flex;
		justify-content: space-between;
		// 商品名字
		.goods_name{
			font-size: 13px;
			margin-right: 10px;
		}
		// 收藏
		.favi{
			width: 120px;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-left: 1px solid #efefef;
			color: gray;
		}
	}
	// 运费区域
	.yf{
		font-size: 12px;
		color: gray;
		margin: 10px 0;
	}
}
// 商品导航组件区域
.goods_nav{
	position: fixed;
	bottom:0;
	left: 0;
	width: 100%;
}
</style>
