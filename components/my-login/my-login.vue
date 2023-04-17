<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- open-type="getUserInfo"固定写法获取用户信息 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @tap="getUserInfo">一键登录</button>
		<text class=" ">登录后尽享更多权益</text>
	</view>
</template>

<script>
	import { mapMutations,mapState } from 'vuex'
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		computed:{
			...mapState('m_user',['redirectInfo'])
		},
		onShow() {
			console.log(redirectInfo)
		},
		methods:{
			...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
			// 获取用户授权之后的基本信息
			async getUserInfo(){
				const res = await uni.getUserProfile({
					desc:'个人信息',
					success:res => {
						// 这里我定义一些假数据
						res.userInfo.country = '中国'
						res.userInfo.province = '河南省'
						res.userInfo.city = '安阳市'
						// 调用vuex中mapMutations映射的方法，将用户信息存储到vuex中
						this.updateUserInfo(res.userInfo)
						this.getToken(res)
					},
					fail:error => {
						if(error.errMsg === "getUserProfile:fail auth deny") return uni.$showMsg('您取消了登录授权！')
					}
				})
			},
			getToken(info){
				// 获取code对应的值
				uni.login({
					success:res => {
						// 准备参数
						const query = {
							code:res.code,
							encryptedData:info.encryptedData,
							iv:info.iv,
							rawData:info.rawData,
							signature:info.signature
						}
						uni.request({
							url:'https://api-hmugo-web.itheima.net/api/public/v1/users/wxlogin',
							method:'POST',
							data:query,
							success:res => {
								// 模拟数据
								res.data={ "message": { "user_id": 23,"user_email_code": null,"is_active": null,"user_sex": "男","user_qq": "",
										"user_tel": "","user_xueli": "本科","user_hobby": "","user_introduce": null,"create_time": 1562221487,
										"update_time": 1562221487,"token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"},
									  "meta": {"msg": "登录成功","status": 200}}
								res.header = {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'}
								
								console.log(res)
								// 直接把token存储到vuex中
								this.updateToken(res.data.message.token)
								// 登录成功之后，重新跳转到购物车界面
								this.navigateBack()
							},
							fail:error => {
								uni.$showMsg('登录失败！')
							}
						})
		
					},
					fail:error => {
						uni.$showMsg('登录失败！')
					}
				})
			},
			navigateBack(){
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
					uni.switchTab({
						url:this.redirectInfo.from,
						complete:()=>{
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		},
	}
</script>

<style lang="scss">
.login-container{
	height: 750rpx;
	background-color: #F8F8F8;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow: hidden;
	&::after{
		content: '';
		display: block;
		width: 100%;
		height: 40px;
		background-color: white;
		position: absolute;
		bottom: 0;
		left: 0;
		border-radius: 100%;
		transform: translateY(50%);
	}
	.btn-login{
		width: 90%;
		border-radius: 100px;
		margin: 15px 0;
		background-color: #C00000;
	}
	.tips-text{
		font-size: 12px;
		color:gray;
	}
}
</style>