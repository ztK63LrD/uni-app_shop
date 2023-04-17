<template>
	<view>
		<my-search class="mySearch" bgColor="pink" radius="0" @tap.native="gotoSearch"></my-search>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图的item项 -->
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<!-- 动态绑定图片的 src 属性 -->
					<image :src="item.image_src" mode="aspectFill"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,index) in navList" :key="index" >
				<image :src="item.image_src" mode="aspectFill" @tap="navTapHandler(item)"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="(item,index) in floorList" :key="index">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" mode="aspectFill"></image>
				<!-- 楼层的图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url='item.product_list[0].url'>
						<image 
							:src="item.product_list[0].image_src" 
							:style="{width: item.product_list[0].image_width + 'rpx'}" 
							mode="widthFix">
						</image>
					</navigator>
					<!-- 右侧四个小盒子 -->
					<view class="right-img-box">
						<navigator 
							class="right-img-item" 
							v-for="(item1,index1) in item.product_list" 
							:key="index1" v-if="index1 !== 0"
							:url="item1.url"
						>
							<image :src="item1.image_src" mode="widthFix" :style="{width:item1.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				swiperList:[] ,// 轮播图数据列表
				navList:[], // 分类导航数据列表
				floorList:[], // 楼层数据列表
			};
		},
		onLoad() {
			this.getSwiperList() // 调用方法，获取轮播图数据
			this.getNavList() // 调用方法，获取分类导航数据
			this.getFloorList() // 调用方法，获取楼层的数据
		},
		methods:{
			// 获取轮播图数据的函数
			getSwiperList(){
				uni.request({
					url:'https://www.uinav.com/api/public/v1/home/swiperdata',
					success:res => {
						this.swiperList = res.data.message	
					},
					fail:error => {
						uni.$showMsg()
					}
				})
			},
			// 获取分类列表数据的函数
			getNavList(){
				uni.request({
					url:'https://www.uinav.com/api/public/v1/home/catitems',
					success:res => {
						this.navList = res.data.message
					},
					fail:error => {
						uni.$showMsg()
					}
				})
				
			},
			// 获取当前分类列表的相关信息
			navTapHandler(item){
				// 判断点击的是哪个 nav 分类
				if(item.name === '分类') {
					uni.switchTab({
						url:'/pages/cate/cate'
					})
				}
			},
			// 获取首页楼层数据的函数
			getFloorList(){
				uni.request({
					url:'https://www.uinav.com/api/public/v1/home/floordata',
					success:res => {
						// 对接口数据的url地址进行相关处理，能匹配上自己定义的组件路由路径
						res.data.message.forEach(floor => {
							floor.product_list.forEach(prod=>{
								prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
							})
						})
						this.floorList = res.data.message
					},
					fail:error => {
						uni.$showMsg()
					}
				})
			},
			// 跳转到搜索界面
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
// 搜索组件样式
.mySearch{
	width: 100%;
	position: fixed;
	z-index: 10;
	top: 0;
	left: 0;
}
// 轮播图样式
swiper{
	height: 330rpx;
	margin-top: 50px;
	.swiper-item, image{
		width: 100%;
		height: 100%;
	}
}
// 分类导航样式
.nav-list{
	display: flex;
	justify-content: space-around;
	margin: 15px 0;
	image{
		width: 128rpx;
		height: 140rpx;
	}
}
// 楼层样式
.floor-list{
	// 楼层标题样式
	.floor-item image{
		width: 100%;
		height: 60rpx;
		display: flex;
	}
	// 楼层图片样式
	.floor-img-box{
		display: flex;
		padding-left: 10rpx;
		// 右侧四个小图片的样式
		.right-img-box{
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}
}

</style>
