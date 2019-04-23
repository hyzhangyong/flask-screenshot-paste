(function ($) {
  $.fn.screenshotPaste=function(options){
    var me = this;

    if(typeof options =='string'){
      var method = $.fn.screenshotPaste.methods[options];

      if (method) {
        return method();
      } else {
        return;
      }
    }

    var defaults = {
      imgContainer: '',  //预览图片的容器
      imgHeight:200,    //预览图片的默认高度
      imgIputUrl:''         //服务返回地址，放入图片input内 
    };
    
    options = $.extend(defaults,options);

    var imgReader = function( item ){
      var file = item.getAsFile();
      var reader = new FileReader();
      
      reader.readAsDataURL( file );
      reader.onload = function( e ){
        var img = new Image();

        img.src = e.target.result;
		//ajax上传图片，返回图片地址
		var imgurl;
		$.ajax({
			async:false,
			type:"post",
			url:'/updateImg',
			data:{scr:img.src},
			success:function(data,status){
				if(status == "success"){imgurl=data.imgsrc;}
			}
		});
		//return imgurl;
        $(img).css({ height: options.imgHeight });
	//img加入onclick，点击小图放大显示。
	$(img).attr("onclick","javascript:showimage("+"'"+imgurl+"'"+")");
        $(document).find(options.imgContainer)
        .html('')
        .show()
        .append(img);
		$(document).find(options.imgInputUrl)
		.val(imgurl);
      };
    };
    //事件注册
    $(me).on('paste',function(e){
      var clipboardData = e.originalEvent.clipboardData;
      var items, item, types;

      if( clipboardData ){
        items = clipboardData.items;

        if( !items ){
          return;
        }

        item = items[0];
        types = clipboardData.types || [];

        for(var i=0 ; i < types.length; i++ ){
          if( types[i] === 'Files' ){
            item = items[i];
            break;
          }
        }

        if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
          imgReader( item );
        }
      }
    });

    $.fn.screenshotPaste.methods = {
      getImgData: function () {
        var src = $(document).find(options.imgContainer).find('img').attr('src');

        if(src==undefined){
          src='';
        }

        return src;
      }
    };
  };
})(jQuery);
