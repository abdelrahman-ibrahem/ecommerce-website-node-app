$(document).ready(function() {

  $(".owl-carousel").owlCarousel({
  
  autoPlay: 3000,
  items : 4,
  itemsDesktop : [1199,3],
  itemsDesktopSmall : [979,3],
  itemsMobile : [600,1],
  center: true,
  nav:true,
  loop:true,
  responsive: {
  600: {
  items: 4
  }
  }
  
  });
  
  });

var elements = document.querySelectorAll('.ripple-effect');

for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function (e) { 
    
    e.preventDefault;
    var elm =  document.querySelector('.wrapper');
    
    if(elm.className  !== 'marked')
      elm.classList.add('marked');
       
    
    elm.classList.remove("active");
    void elm.offsetWidth;
    elm.classList.add("active");
  });
}

new WOW().init();
