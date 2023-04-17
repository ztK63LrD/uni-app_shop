import Vue from 'vue'
import Vuex from 'vuex'
import muduleCart from '@/store/cart.js'
import muduleUser from '@/store/user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		'm_cart':muduleCart,
		'm_user':muduleUser
	}
})

export default store