import config  from '../../../config';

let google = {

	authInstance: {},

	init(callback) {
        gapi.load('auth2', () => {
            gapi.client.load('plus', 'v1').then(() => {
                gapi.auth2.init({
                    client_id: config.auth.google.clientID,
                    scopes: 'email,openid'
                }).then((authInstance) => {
                    this.authInstance = authInstance;
                    this.getCurrentUser(callback);
                });
            });
        });
	},

	refresh(callback) {
			// gapi.auth2.getAuthInstance({
	  //           client_id: config.auth.google.clientID,
	  //           scopes: 'email,openid'
	  //       }).then((authInstance) => {
	  //           this.authInstance = authInstance;
	            this.getCurrentUser(callback);
	        // });
	},

	signIn(callback) {
		this.authInstance.signIn().then(() => {
            this.getCurrentUser(callback);
        });
	},

	signOut(callback) {
		this.authInstance.signOut().then((a) => {
			callback();
		});
	},

	getCurrentUser(callback) {
		// get user data
		let user = this.authInstance.currentUser.get();

        // token
        let token = user.hg;

        // profile
        let basicProfile = user.getBasicProfile();
        let profile = null;
        if (basicProfile) {
	        profile = {
	        	_id:       basicProfile.getEmail(),
	        	email:     basicProfile.getEmail(),
	        	firstName: basicProfile.getGivenName(),
	        	lastName:  basicProfile.getFamilyName(),
	        	imageUrl:  basicProfile.getImageUrl()
	        };
		}

		// is signed in
        let isSignedIn = user.isSignedIn();

        callback(token, profile, isSignedIn);
	}
};

export default google;