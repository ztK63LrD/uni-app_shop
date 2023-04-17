<template>
	<view>
		<view class="goods-list">
			<view v-for="(item,index) in goodsList" :key="index" @click="gotoDetail(item)">
				<my-goods :item="item"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj:{
					query:'',
					cid:'',
					pagenum:1,
					pagesize:10
				},
				goodsList:[],// 商品列表数据
				total:0, // 商品总数
				isloading: false, // 节流阀,是否正在请求数据
			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			this.getGoodsList()
		},
		methods: { 
			// 获取商品列表数据
			getGoodsList(cb){
				// 打开节流阀
				this.isloading = true
				uni.request({
					url:'https://www.uinav.com/api/public/v1/goods/search',
					data:{
						...this.queryObj
					},
					success:res => {
						// 关闭节流阀
						this.isloading = false
						cb && cb()
						this.goodsList = [...this.goodsList,...res.data.message.goods]
						this.total = res.data.message.total
					},
					fail:res=> {
						uni.$showMsg()
					}
				})
			},
			gotoDetail(item){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id
				})
			}
		},
		// 上拉加载函数
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if(this.isloading) return
			// 让页码值自增加1
			this.queryObj.pagenum++
			this.getGoodsList()
		},
		// 下拉刷新函数
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			// 重新发起数据请求
			this.getGoodsList(()=> uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>