(function(e){e("a[data-reveal-id]").bind("click",function(t){t.preventDefault();var n=e(this).attr("data-reveal-id");e("#"+n).reveal(e(this).data())});e.fn.reveal=function(t){var n={animation:"fadeAndPop",animationspeed:300,closeonbackgroundclick:true,dismissmodalclass:"close-reveal-modal"};var t=e.extend({},n,t);return this.each(function(){function a(){s=false}function f(){s=true}var n=e(this),r=parseInt(n.css("top")),i=n.height()+r,s=false,o=e(".reveal-modal-bg");if(o.length==0){o=e('<div class="reveal-modal-bg" />').insertAfter(n)}n.bind("reveal:open",function(){o.unbind("click.modalEvent");e("."+t.dismissmodalclass).unbind("click.modalEvent");if(!s){f();if(t.animation=="fadeAndPop"){n.css({top:e(document).scrollTop()-i,opacity:0,visibility:"visible"});o.fadeIn(t.animationspeed/2);n.delay(t.animationspeed/2).animate({top:e(document).scrollTop()+r+"px",opacity:1},t.animationspeed,a())}if(t.animation=="fade"){n.css({opacity:0,visibility:"visible",top:e(document).scrollTop()+r});o.fadeIn(t.animationspeed/2);n.delay(t.animationspeed/2).animate({opacity:1},t.animationspeed,a())}if(t.animation=="none"){n.css({visibility:"visible",top:e(document).scrollTop()+r});o.css({display:"block"});a()}}n.unbind("reveal:open")});n.bind("reveal:close",function(){if(e(this).attr("id")==="myModal2"){s2.killForceAtlas2()}if(!s){f();if(t.animation=="fadeAndPop"){o.delay(t.animationspeed).fadeOut(t.animationspeed);n.animate({top:e(document).scrollTop()-i+"px",opacity:0},t.animationspeed/2,function(){n.css({top:r,opacity:1,visibility:"hidden"});a()})}if(t.animation=="fade"){o.delay(t.animationspeed).fadeOut(t.animationspeed);n.animate({opacity:0},t.animationspeed,function(){n.css({opacity:1,visibility:"hidden",top:r});a()})}if(t.animation=="none"){n.css({visibility:"hidden",top:r});o.css({display:"none"})}}n.unbind("reveal:close")});n.trigger("reveal:open");var u=e("."+t.dismissmodalclass).bind("click.modalEvent",function(){n.trigger("reveal:close")});if(t.closeonbackgroundclick){o.css({cursor:"pointer"});o.bind("click.modalEvent",function(){n.trigger("reveal:close")})}e("body").keyup(function(e){if(e.which===27){n.trigger("reveal:close")}})})}})(jQuery)