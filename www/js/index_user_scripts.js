var token; //The Token
var parentid;
var appid;
//$.ui.disableSideMenu();
window.randomGen = function(){
		return Math.floor(Math.random()*900000) + 100000;
}

var userdata = {};
userdata.username = 'administrator';
userdata.token = randomGen();
userdata.is_admin = true;

var serverUrl = 'http://www.sumitjaiswal.com/blog/';
	
function register_event_handlers()
 {   	 
         $(document).on("click", "#one-screen", function(evt)
        {	
            //Get Login Data
            var admin_email = $('input#admin_email').val(); //Get email and check if that is true
            var admin_pin = $('input#admin_pin').val();
			var online_user = [];
			get_online_users(userdata,function(users){
				$.each(users, function(index,user) {
					online_user.push(user);
				});
			});
			$.ui.blockUI(0.1);
			$.ui.showMask("Verifying...");
			//Authenticate
			checkLogin(serverUrl,{ username: admin_email,password: admin_pin },function(result){
				$.ui.hideMask();
				$.ui.unblockUI();
				if(result.success){	
					getUsers(serverUrl,{ username: admin_email },function(result){
							var _cont = '';
							var result = $.parseJSON(result);
							$.each(result.users, function(index,group) {
								var online_div = '';
								if($.inArray( group, online_user ) >= 0){ online_div = '<div class="onliner online"></div>'; }
								_cont += '<li class="widget uib_w_list list-apps" data-user="'+group+'" data-uib="app_framework/listitem" data-ver="0">\
											<a href="#uib_page_3" data-transition="slide">'+online_div+group+'</a></li>';
							});
							$('ul#users').empty().append(_cont);
						$.ui.loadContent("#uib_page_2",false,false,"slide");
					});
				}
				else	alert('not logged in');
			});
			
        });
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
    //    initPushPlug();
	    $.ui.disableSideMenu();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		register_event_handlers();
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"16692000019","ecb":"app.onNotificationGCM"});
    },
        // result contains any message sent from the plugin call
        successHandler: function(result) {
              //  alert('Callback Success! Result = '+result)
        },
        //Any errors? 
        errorHandler:function(error) {
                alert(error);
        },
        onNotificationGCM: function(e) {

        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
					token = e.regid;
                }
            break;
 
            case 'message':
						  navigator.notification.alert(
								e.message,  // message
								'Push Received!',            // title
								'Dismiss'                  // buttonName
						  );
						  navigator.notification.vibrate(2000); //Vibrate for 2 secs
						  navigator.notification.beep(3); //Make beep sound 3 times
                          
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }
};
