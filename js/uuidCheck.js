/* 
 * Minecraft Javascript UUID -> Name check script.
 * 
 * (c) Dr Daniel Naylor, 2014-2015. Licenced under the MIT License.
 */

$(document).ready(function() {
    String.prototype.splice = function( idx, rem, s ) {
        return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
    };
    
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
    
    uuidChecker.checkValid();
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
    
    insertDashes: function(uuid) {
        uuid = uuid.splice(20, 0, "-");
        uuid = uuid.splice(16, 0, "-");
        uuid = uuid.splice(12, 0, "-");
        uuid = uuid.splice(8, 0, "-");
        return uuid;
    },
    
    createName: function() {
        var name = $('#minecraftName').val();
        uuidChecker.getNameAjax(name);
    },
    
    getNameAjax: function(name) {
            $('#uuid').text("Retrieving...");
            $('#name').text("");
            $('#legacy').text("");
            $('#demo').text("");
        
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
                $('#uuid').text(uuidChecker.insertDashes(msg.id));
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