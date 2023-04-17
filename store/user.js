export default {
	// 开启命名空间
	namespaced: true,
	// state数据
	state:()=>({
		// 收获地址
		address:JSON.parse(uni.getStorageSync('address') || '{}'),
		token:uni.getStorageSync('token') || '',
		// 用户的信息对象
		userinfo:JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 重定向的 Object 对象
		redirectInfo:null
	}),
	// 方法
	mutations:{
		// 更新收获地址
		updateAddress(state,address){
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		// 持久化存储address
		saveAddressToStorage(state){
			uni.setStorageSync('address',JSON.stringify(state.address))
		},
		// 更新用户信息
		updateUserInfo(state,userinfo){
			state.userinfo = userinfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		// 持久化存储用户信息
		saveUserInfoToStorage(state){
			uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
		},
		// 更新token信息
		updateToken(state,token){
			state.token = token
			this.commit('m_user/saveTokenToStorage')
		},
		// 持久化token信息
		saveTokenToStorage(state){
			uni.setStorageSync('token',state.token)
		},
		// 更新重定向的信息对象
		updateRedirectInfo(state,info){
			state.redirectInfo = info
 		}
	},
	// 数据包装器
	getters:{
		addStr(state){
			if (!state.address.provinceName) return ''
			// 拼接 省，市，区，详细地址 的字符串并返回给用户
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	},
}