//高度自适应
$(window).resize(function(e) {
	$(".loginbox").height($(window).height());
    $(".main").height($(window).height() - $(".header").height() - $(".footer").height()-1);
	$(".left").height($(".main").height());
	$(".right").height($(".main").height());
	$(".rightdown").height($(".right").height()-27);
	$("#iframe").height($(window).height() - $(".header").height() - $(".footer").height()-29);
}).resize();


//顶部菜单显示隐藏
$(".menuup").click(function(){
  $(".headdown").slideUp("fast");
});
$(".nav li").click(function(){
  $(".headdown").slideDown("fast");
});


//IE7下菜单背景BUG
$(".menuson li a").css("width",$(".menuson").width());

//隔行换色
$('.simpletable tbody tr:even').addClass('even');