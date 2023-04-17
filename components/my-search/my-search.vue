<template>
	<view class="my-search-container" :style="{'background-color':bgColor}">
		<view class="my-search-box" :style="{'border-radius':radius + 'px'}">
			<!-- 使用uni-ui提供的图标组件 -->
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		props:{
			// 背景颜色
			bgColor:{ 
				type:String,
				default: '#C00000'
			},
			// 圆角属性
			radius:{
				type:Number,
				default:18 // px
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.my-search-container{
	box-sizing: border-box;
	height: 50px;
	align-items: center;
	padding: 7px 10px;
	.my-search-box{
		background-color: #FFFFFF;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.placeholder{
			font-size: 15px;
			margin-left: 5px;
		}
	}
}
</style>