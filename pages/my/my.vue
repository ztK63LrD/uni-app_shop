<template>
	<view class="my-container">
		<!-- 没有token说明是未登录状态，显示登录组件 -->
		<my-login v-if="!token"></my-login>
		<!-- 否则显示用户信息组件 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				
			};
		},
		computed:{
			...mapState('m_user',['token']),
		}
	}
</script>

<style lang="scss">
page,.my-container{
	height: 100%;
}
</style>
