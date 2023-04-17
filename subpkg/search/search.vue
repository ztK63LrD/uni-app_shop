<template>
	<view>
		<!-- 搜索输入框 -->
		<view class="search-box">
			<uni-search-bar :radius="100" @input="input" cancelButton="none"></uni-search-bar>
		</view>  
		<!-- 搜索列表界面 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,index) in searchResults" :key="index" @tap="gotoDetail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 内容区域 -->
			<view class="history-tag">
				<!-- <uni-tag text="标签"></uni-tag> -->
				<uni-tag :inverted="true" :text="item" v-for="(item,index) in historys" :key="index" @click="gotoGoodsList(item)"/>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				timer:null, // 延时器的id
				keywords:'' ,// 搜索的关键词
				searchResults:[], // 搜索的结果列表 
				historyList:[], // 搜索历史记录数据
			};
		},
		onLoad() {
			let str = decodeURIComponent(uni.getStorageSync('keywords') || '[]')
			this.historyList = JSON.parse(str)
		},
		computed: {
		  historys() {
			// this.historyList = this.keywords
		    // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
		    // 而是应该新建一个内存无关的数组，再进行 reverse 反转
		    return [...this.historyList].reverse()
		  }
		},
		methods:{
			// 输入框监听事件
			input(e){
				clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					this.keywords = e
					this.getSearchList()
				},500)
			},
			getSearchList(){
				// 判断搜索关键词是否为空
				if(this.keywords.length ===0 ){
					this.searchResults = []
					return
				}
				uni.request({
					url:'https://www.uinav.com/api/public/v1/goods/qsearch',
					data: {
						query:this.keywords
					},
					success:res => {
						this.searchResults = res.data.message
						this.saveSearchHistory()
					},
					fail:error => {
						uni.$showMsg()
					}
				})
			},

			// 跳转到详情页面
			gotoDetail(item){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id 
				})
			},
			saveSearchHistory(){
			  // 保存历史记录
			  // this.historyList.push(this.keywords) 				
			  // 1. 将 Array 数组转化为 Set 对象
			  const set = new Set(this.historyList)
			  // 2. 调用 Set 对象的 delete 方法，移除对应的元素
			  set.delete(this.keywords)
			  // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
			  set.add(this.keywords)
			  // 4. 将 Set 对象转化为 Array 数组
			  this.historyList = Array.from(set)
			  // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
			  uni.setStorageSync('keywords', JSON.stringify(this.historyList))
			},
			// 清空历史记录
			clean(){
				this.historyList = []
				uni.setStorageSync('keywords','[')
			},
			// 点击跳转到商品列表页面
			gotoGoodsList(kw) {
			  uni.navigateTo({
			    url: '/subpkg/goods_list/goods_list?query=' + kw
			  })
			}

		}
	}
</script>

<style lang="scss">
.search-box{
	position: sticky;
	top: 0;
	z-index: 10;
}
.sugg-list{
	padding: 0 5px;
	.sugg-item{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		.goods-name{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
.history-box{
	padding: 0 5px;
	.history-title{
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.history-tag{
		display: flex;
		flex-wrap: wrap;
		.uni-tag{
			margin-top: 5px;
			margin-right: 5px;
			display: block;
			text-align: center;
			width: 20px;
		}
	}
}
</style>
