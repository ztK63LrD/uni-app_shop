<template>
	<view class="my-settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullChecked" /><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapGetters,mapMutations,mapState } from 'vuex'
	export default {
		name:"my-settle",
		data() {
			return {
				// 倒计时的秒数
				seconds:3,
				// 定时器的ID
				timer:null,
			};
		},
		computed:{
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			...mapGetters('m_user',['addStr']),
			...mapState('m_user',['token']),
			...mapState('m_cart',['cart']),
			isFullChecked(){
				return this.total === this.checkedCount
			}
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			...mapMutations('m_user',['updateRedirectInfo']),
			changeAllState(){
				this.updateAllGoodsState(!this.isFullChecked)
			},
			// 用户点击结算按钮
			settlement(){
				// 如果用户没有勾选任何商品
				if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
				// 如果用户没有选择收货地址
				if(!this.addStr) return uni.$showMsg('请选择收货地址！')
				// 如果用户没有登录
				if(!this.token) return this.delayNavigate()
				// 进行结算
				this.payOrder()
			},
			async payOrder(){
			const orderInfo = {
				order_price:0.01,
				consignee_addr: this.addStr,
				goods: this.cart.filter(x => x.goods_state)
								.map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
			}
			// 发起请求创建订单
			const res = await uni.request({
				url:'https://api-hmugo-web.itheima.net/api/public/v1/my/orders/create',
				method:'POST',
				data:orderInfo,
				header:{
					Authorization:wx.getStorageSync("token")
				}
			})
			if (res.data.meta.status !== 200) return uni.$showMsg('创建订单失败！')
			// 得到服务器响应的“订单编号”
			const orderNumber = res.data.message.order_number
			// 发起请求获取订单的支付信息
			const res2 = await uni.request({
				url:'https://api-hmugo-web.itheima.net/api/public/v1/my/orders/req_unifiedorder',
				method:"POST",
				data:{
					order_number:orderNumber
				},
				header:{
					Authorization:wx.getStorageSync("token")
				}
			})
			// 预付订单生成失败
			if (res2.data.meta.status !== 200) return uni.$showError('预付订单生成失败！')
			// 得到订单支付相关的必要参数
			const payInfo = res2.data.message.pay
			console.log(payInfo)
			// 调用 uni.requestPayment() 发起微信支付
			await uni.requestPayment(payInfo)
			// 完成了支付，进一步查询支付的结果
			const res4 = await uni.request({
				url:'https://api-hmugo-web.itheima.net/api/public/v1/my/orders/chkOrder',
				method:'POST',
				data:{
					order_number: orderNumber
				},
				header:{
					Authorization:wx.getStorageSync("token")
				}
			})
			console.log(res4)
			// 检测到订单未支付
			if (res4.data.meta.status !== 200) return uni.$showMsg('订单未支付！')
			// 检测到订单支付完成
			uni.showToast({
				title: '支付完成！',
				icon: 'success'
			})
			},
			// 延迟导航到my页面
			delayNavigate(){
				// 把 data 中的秒数重置成 3 秒
				this.seconds = 3
				this.showTips(this.seconds)
				this.timer = setInterval(()=>{
					this.seconds--
					if(this.seconds <= 0){
						clearInterval(this.timer)
						uni.switchTab({
							url:'/pages/my/my',
							success:res => {
								this.updateRedirectInfo({
									openType:'switchTab',
									from:'/pages/cart/cart'
								})
							}
						})
						return
					}
					this.showTips(this.seconds)
				},1000)
			},
			// 展示倒计时的提示消息
			showTips(n){
				uni.showToast({
					icon:'none',
					title:'请登录后再结算！'+n+'秒之后自动跳转到登录页',
					mask:true, // 为页面添加透明遮罩，防止点击穿透
					duration:1500 // 1.5 秒后自动消失
				})
			}
		}
	}
</script>

<style lang="scss">
.my-settle-container{
	position: fixed;
	z-index: 999;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 60px;
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;
	.radio{
		display: flex;
		align-items: center;
	}
	.amount-box{
		.amount{
			color: #C00000;
			font-weight: bold;
		}
	}
	.btn-settle{
		background-color: #C00000;
		height: 60px;
		color: white;
		line-height: 60px;
		padding: 0 10px;
		min-width: 100px;
		text-align: center;
	}
}
</style>