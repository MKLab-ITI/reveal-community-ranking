

function hidemsg(){
	

	//hide timeline blocks which are outside the viewport
	$('.cd-timeline-block').each(function(){
                if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.8) {//0.8
			$(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		}
	});
    }
    
jQuery(document).ready(function($){
    //var $timeline_block = 
	//on scolling, show/animate timeline blocks when enter the viewport
	$('#conve').on('scroll', function(){
		$('.cd-timeline-block').each(function(){
			if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.8 && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
				$(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
			}
		});
	});
    
});