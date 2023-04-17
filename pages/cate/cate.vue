<template>
	<view>
		<!-- 搜索组件页面 -->
		<my-search @tap.native="gotoSearch"></my-search>
		
		<!-- 分类主页面 -->
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}" >
				<block v-for="(item,index) in cateList" :key="index">
					<view 
						:class="['left-scroll-view-item',index === active ? 'active' : '']" 
						@tap="activeChanged(index)"
					>
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop" >
				<view class="right-scroll-view-item" v-for="(item1,index1) in cateList2" :key="index1">
					<!-- 二级分类的标题 -->
					<view class="right-item-title">/ {{item1.cat_name}} /</view>
					<!-- 三级分类 Item 项 -->
					<view class="right-item-list">
						<view 
							class="right-item-list-item" 
							v-for="(item2,index2) in item1.children" 
							:key="index2" 
							@tap="gotoGoodList(item2)"
						>
							<!-- 图片 -->
							<image :src="item2.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item2.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				wh:0, // 当前设备的可用高度
				cateList:[], // 分类列表数据
				active:0, // 默认的激活项
				cateList2:[], // 二级分类列表数据
				scrollTop:0, // 设置二级分类内容的开始浏览区域高度
			};
		},
		onLoad() {

			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight - 50
			// 调用分类列表数据函数
			this.getCateList()
		},
		methods:{
			// 获取分类列导航菜单表数据函数
			getCateList(){
				uni.showLoading({
					title:'数据加载中',
				})
				uni.request({
					url:'https://api-hmugo-web.itheima.net/api/public/v1/categories',
					success:res => {
						this.cateList = res.data.message
						// 为二级分类赋值
						this.cateList2 = res.data.message[0].children
					},
					fail:error => {
						uni.$showMsg()
					}
				})
				clearTimeout(this.timer)
				this.timer = setTimeout(function () {
					uni.hideLoading();
				}, 500);
			},
			// 改变导航菜单的激活状态
			activeChanged(index){
				this.active = index
				// 因为二级分类的数据默认是第一项，所以我们要动态的根据导航索引重新为其赋值
				this.cateList2 = this.cateList[index].children
				// 设置切换二级菜单的时候，滑块的视口距离为0
				// 如果前后都是相同数据是不会发生改变的，所以我们弄成1像素的偏差，至少能够每次都重新赋值
				this.scrollTop = this.scrollTop === 0 ? 1 : 0 
			},
			// 点击商品图片实现路由链接的跳转
			gotoGoodList(item){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid=' + item.cat_id
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
// 解决小程序和app滚动条的问题
/* #ifdef MP-WEIXIN || APP-PLUS */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	  }
/* #endif */

// 解决H5 的问题 
/* #ifdef H5 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}
/* #endif */
.scroll-view-container{
	display: flex;
	// 左侧导航区域
	.left-scroll-view{
		width: 120px;
		.left-scroll-view-item{
			background-color: #ececec;
			line-height: 60px;
			text-align: center;
			font-size: 15px;
			&.active{
				background-color: #FFFFFF;
				position: relative;
				&::before{
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #C00000;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
				}
			}
		}
	}
	
	// 右侧内容区域
	.right-scroll-view{
		.right-scroll-view-item{
			.right-item-title{
				font-size: 12px;
				font-weight: bold;
				text-align: center;
				padding: 15px 0;
			}
			.right-item-list{
				display: flex;
				flex-wrap: wrap; // 自动换行
				.right-item-list-item{
					width: 33.33%;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					margin-bottom: 10px;
					image{
						width: 60px;
						height: 60px;
					}
					text{
						font-size: 12px;
					}
				}
			}
		}
	}
}
</style>
