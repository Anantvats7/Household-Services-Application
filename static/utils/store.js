const store = new Vuex.Store({
    state : {
        // like data
        access_token : null,
        role : null,
        loggedIn : false,
        user_id : null,
        fullname : null,
    },
    mutations : {
        // functions that change state
        setUser(state) {
            try{
             if (JSON.parse(localStorage.getItem('user'))){
                const user = JSON.parse(localStorage.getItem('user'));
                state.access_token = user.access_token;
                state.role = user.role;
                state.loggedIn = true;
                state.user_id = user.id;
                state.fullname = user.fullname;
             }
            } catch {
                console.warn('not logged in')
        }         
        },

        logout(state){
            state.access_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;
            state.fullname=null;
            localStorage.removeItem('user')
        }
    },
    actions : {
        // actions commit mutations can be async
    }
})

store.commit('setUser')

export default store;