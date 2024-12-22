export default{
    state: {
        isCollapse: false,
		userData: [],
		coachData: [],
		adminData: [],
		baseUrl: 'http://localhost:8081/util/download?name=',
		urLsuffix: '',
    },
    mutations:{
        collapseMenu(state){
            state.isCollapse = !state.isCollapse;
        },
		setCoachData(state,data){
			state.coachData = data;
		},
		setAdminData(state,data){
			state.adminData = data;
		},
		setUserData(state, data){
			state.userData = data;
			state.urLsuffix = data.imagelink;
		},
		setUserImageLink(state, imageLink){
			state.userData.imagelink = imageLink;
		},
		setCoachImageLink(state, imageLink){
			state.coachData.imagelink = imageLink;
		}
    }
}