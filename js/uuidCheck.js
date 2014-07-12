/* 
 * Minecraft Javascript UUID -> Name check script.
 * 
 * (c) Dr Daniel Naylor, 2014. Licenced under the MIT License.
 */

$(document).ready(function() {
    $('#minecraftName').change(function() {
        uuidChecker.checkValid();
    });
    
    $('#minecraftName').keyup(function() {
       uuidChecker.checkValid(); 
    });
    
    $('form').submit(function() {
        if (uuidChecker.isValid) {
            uuidChecker.createName();
        }       
        
        return false;
    });
});

uuidChecker = {
    
    isValid: false,
    
    checkValid: function() {
        var name = $('#minecraftName').val();        
        uuidChecker.isValid = /^[A-Za-z0-9_]{1,16}$/g.test(name);
        
        if (uuidChecker.isValid) {
            $('#sub').removeAttr('disabled');
        } else {
            $('#sub').attr('disabled', 'disabled');
        }
    },
    
    createName: function() {
        var name = $('#minecraftName').val();
        uuidChecker.getNameAjax(name);
    },
    
    getNameAjax: function(name) {
        $.ajax({
            url: "ping.php",
            data: {
                name: name
            },
            type: 'POST',
            crossDomain: true
        }).done(function(data) {
            if (data.length !== 0) {
                var msg = data[0];
                $('#uuid').text(msg.id);
                $('#name').text(msg.name);
                
                if (msg.hasOwnProperty('legacy') && msg.legacy) {
                    $('#legacy').text("Yes");
                } else {
                    $('#legacy').text("No");
                }
            
                if (msg.hasOwnProperty('demo') && msg.demo) {
                    $('#demo').text("Yes");
                } else {
                    $('#demo').text("No");
                }
            } else {
                $('#uuid').text("No profile was found.");
                $('#name').text("");
                $('#legacy').text("");
                $('#demo').text("");
            }
            
        }).fail(function() {
            $('#uuid').text("Could not get profiles from Mojang.");
            $('#name').text("");
            $('#legacy').text("");
            $('#demo').text("");
        });
    }  
};