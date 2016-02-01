jQuery.fn.extend({
  color: function(array) {
  if (array==null){
    var color_val =  this.eq(0).css("background-color");
    var colors=new Array();
    color_val=color_val.replace("(","");
    color_val=color_val.replace(")","");
    color_val=color_val.replace("rgb","");
    colors = color_val.split(",");
    for (var i in colors){colors[i]=parseInt(colors[i]);} 
    return colors;
  }
  else{
    for (var i in array){
      array[i]=(parseInt(array[i])).toString(16,2);
      if(array[i].length==1){array[i]="0"+array[i];}
      } 
    var color_val="#"+array.join("");
    return this.css({"background-color":color_val});
  }},
  colorTransform: function(string){
    var defaultHue=0.2;
    var instructions = string.split(' ');
    var operation = instructions[0];
    var args=instructions.slice(1);
	operation="setHSL"
    var old = this.color;
    var cols=new col(old[0],old[1],old[2]);
    if (operation=="scaleAmp"){cols.scaleAmp(args[0]);}
    else if (operation=="setAmp"){cols.setAmp(args[0]);}
    else if (operation=="setAngles"){cols.setAngles(args[0],args[1]);}
    else if (operation=="scaleAngles"){cols.scaleAngles(args[0],args[1]);}
    else if (operation=="greyscale"){
      var hsl = cols.toHSL();
      hsl[1]=0; 
      var rgb = cols.HSLtoRGB(hsl[0],hsl[1],hsl[2]);
      cols.red=rgb[0];
      cols.green=rgb[1];
      cols.blue=rgb[2];
    }
    else if (operation=="colorize"){
      var hsl = cols.toHSL();
      hsl[1]=1; 
      hsl[0]=args[0]; 
      var rgb = cols.HSLtoRGB(hsl[0],hsl[1],hsl[2]);
      cols.red=rgb[0];
      cols.green=rgb[1];
      cols.blue=rgb[2];
    }
   else if (operation=="darken"){
      var hsl = cols.toHSL();
      hsl[2]=args[0]; 
      var rgb = cols.HSLtoRGB(hsl[0],hsl[1],hsl[2]);
      cols.red=rgb[0];
      cols.green=rgb[1];
      cols.blue=rgb[2];
    }
    else if (operation=="setHSL"){
      var rgb = cols.HSLtoRGB(args[0],args[1],args[2]);
      cols.red=rgb[0];
      cols.green=rgb[1];
      cols.blue=rgb[2];
    }
    return this.color(cols.vector());
    },
	renderPalette: function(hue_increments,sat_increments,lum_increments){
		palette = $("<div class='palette'></div>")
		hues=[];
		sats=[];
		lums=[];
		for(var i=0;i<hue_increments;i++){ hues.push(i*(1/hue_increments))}
		for(var j=1;j<=sat_increments;j++){ sats.push(j*(1/sat_increments))}
		for(var k=0;k<lum_increments;k++){ lums.push(k*(1/lum_increments))}
	
		$.each(hues,function(i,n){ 
			var hue_block = $("<div class='hue' id='s_" +n.toString().replace(/[^0-9]/g,'') + "'></div>")
			palette.append(hue_block);
		
			$.each(sats,function(j,m){
				
				var class_names = [
					"sat",
					"color",
					["row",j].join("_"),
					["column",i].join("_")
				]
				
				var sat_block = 
					$("<div class='" + 
						class_names.join(" ") + 
						"' id='s_" + 
						m.toString().replace(/[^0-9]/g,'') + 
						"'>&nbsp;</div>"
					)
				sat_block.colorTransform("setHSL "+ n + " " + m + " 0.6")
				hue_block.append(sat_block)
			})
			
		})
				
		$(this).append(palette)
		var hue_width = $(".hue").eq(0).width();
	//	if ($.browser.msie){hue_width+=20}
		var sat_width = parseInt(hue_width/sat_increments);
		var palette_colors =
			$(".sat").add(".colors .color").add(".palette .color").width(sat_width).height(sat_width);
			$(".sat").css({
				float:"left",
				"border-top-color": $(this).css("background-color"),
				"border-top-width": sat_width + "px",
				
				"border-right-color": "#fff",
				"border-right-width": sat_width + "px",
				width: "0px",
				height: "0px"
			})
		return $(this)
	},
	colorPicker: function(){
		var color_picker = $("<div id='color_picker'><div id='full_palette'></div></div>");
		$(this).append("<div class='current_color'><div class='swatch'></div><span class='title'>Wall Color</span></div>");
		$(".current_color").after(color_picker);
		
		var farb = $.farbtastic(("#full_palette"), function(color){
			$(".swatch").css("background",color);
			$("body").css("background",color);
		});
	
		$("#color_picker").renderPalette(7,7,7);
		$("#color_picker,#full_palette").show();
	
		$(".current_color").click(function(){$("#color_picker").toggle();});
		$(".closer").click(function(){$("#color_picker").show();});
		$("#color_picker").prepend($(".colors"))
		$(".colors").show()
		$("#color_picker").prepend("<div id='show_full'></div>")
		$(".color").click(function(){
			var c = $(this).css("background-color").replace("#",'');
			if(c.match(",")!=null){	
				c = $.map(c.split(","),function(i){ return parseInt(i.replace(/[^0-9]/g,'')).toString(16)});
				c = "#" + $.map(c,function(i){ return i.length == 1 ? ("0"+i) : i }).join("");
			}
			else{
				c.length ==	6 ? c = "#"+c : c = [c[0],c[1],c[2]]
			}
			farb.setColor(c);
		});
		
		$("#show_full").click(function(){$("#full_palette").toggle();})
		$("#color_picker").add('.current_color').mouseover(function(){on_picker = true})
		$("#color_picker").add('.current_color').mouseout(function(){on_picker = false})
	//	$("#color_picker").css("display","none")
		$("body").click(function(){
			//if(!on_picker && $("#color_picker").css("display")=="block"){
			//	$("#color_picker").hide()
			//}
		})
		farb.setColor("#FFFFFF");
		if (false){
	//		farb.setColor(userSettings("wallColor").toString());
		}
		else{
		// If we want to select a color from the photo's palette 
		//$(".colors").find(".color").eq(0).trigger("click")
	//		farb.setColor("#FFD3A8");
		}
		$(".color").each(function(){
			
			var parent_size = parseFloat(  
				$(this).siblings().size() 
			)
			
			var row =  $(this).attr("class").split(" ").filter(
						function(e){ 
							return e.match(/^row/g)
						 }
					 )
			row = "string" == typeof row[0] ? row[0].split("_")[1] : 0
					 
		 	var column=  $(this).attr("class").split(" ").filter(
		 						function(e){ 
		 							return e.match(/^column/g)
		 						 }
		 					 )
		 			row = "string" == typeof column[0] ? column[0].split("_")[1] : 0
				
	
			var centrality =  Math.abs( ( parent_size / 2 ) - row ) / parent_size
				 console.log(centrality )

			
			
			
			var chances = ( Math.random() >= 0.5 )
			
			chances ? 
				0 :  
				$(this).css({
					background: "#fff"
				})
		
		})

		return farb
	}
});

function col(r,g,b){
  phi_grey=0.785;
  theta_grey=0.615;
  this.rgb=[r,g,b];
  this.red=this.rgb[0];
  this.green=this.rgb[1];
  this.blue=this.rgb[2];
  this.det=Math.pow(this.red,2)+Math.pow(this.green,2)+Math.pow(this.blue,2);
  this.det2=Math.pow(this.red,2)+Math.pow(this.blue,2);
  this.rg=Math.pow(this.det2,0.5);
  this.theta=Math.atan2(this.green,this.rg);
  this.phi=Math.atan2(this.blue,this.red);
  this.amp=Math.pow(this.det, 0.5);
  this.scaleAmp=function(amount){
    this.amp*=amount;
    this.red   = this.amp*Math.cos(this.theta)*Math.cos(this.phi);
    this.green = this.amp*Math.sin(this.theta);
    this.blue  = this.amp*Math.cos(this.theta)*Math.sin(this.phi);
  }
  this.setAmp=function(new_amp){
    this.amp=new_amp;
    this.red   = this.amp*Math.cos(this.theta)*Math.cos(this.phi);
    this.green = this.amp*Math.sin(this.theta);
    this.blue  = this.amp*Math.cos(this.theta)*Math.sin(this.phi);
  }
  this.setAngles=function(phi,theta){
    this.phi = phi;
    this.theta = theta;
    this.red   = this.amp*Math.cos(this.theta)*Math.cos(this.phi);
    this.green = this.amp*Math.sin(this.theta);
    this.blue  = this.amp*Math.cos(this.theta)*Math.sin(this.phi);
  }
  this.scaleAngles=function(phi_scale,theta_scale){
    this.phi = this.phi * phi_scale;
    this.theta = this.theta * theta_scale;
    this.red   = this.amp*Math.cos(this.theta)*Math.cos(this.phi);
    this.green = this.amp*Math.sin(this.theta);
    this.blue  = this.amp*Math.cos(this.theta)*Math.sin(this.phi);
  }
  this.toHex=function(){
    var red  =(parseInt(this.red)).toString(16);
    if(red.length==1){red="0"+red;}
    var green =(parseInt(this.green)).toString(16);
    if(green.length==1){green="0"+green;}
    var blue =(parseInt(this.blue)).toString(16);
    if(blue.length==1){blue="0"+blue;}
    return red+green+blue;
  }
  this.HuetoRGB=function(v1,v2,vH){
   if ( vH < 0 ){vH += 1;}
   if ( vH > 1 ){vH -= 1;}
   if (( 6 * vH ) < 1 ){ return ( v1 + ( v2 - v1 ) * 6 * vH );}
   else if (( 2 * vH ) < 1 ){ return ( v2 );}
   else if (( 3 * vH ) < 2 ){ return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );}
   else {return v1};
   }
  this.HSLtoRGB=function(hue,sat,lum){
    hue=parseFloat(hue);
    sat=parseFloat(sat);
    lum=parseFloat(lum);
    var var_1=0;
    var var_2=0;
    var output=new Array();
    if (sat == 0){
      output[0] = lum * 255;
      output[1] =  lum * 255;
      output[2] =  lum * 255;
    }
    else{
      if ( lum < 0.5 ) {var_2 = lum * (1 + sat);}
      else {var_2 = (lum + sat) - (sat * lum);}
      var_1 = 2 * lum - var_2;
      output[0] = 255 * this.HuetoRGB(var_1, var_2,hue + ( 1 / 3 ) );
      this.red=output[0];
      output[1] = 255 * this.HuetoRGB(var_1, var_2,hue);
      this.green=output[1];
      output[2] = 255 * this.HuetoRGB(var_1, var_2,hue - ( 1 / 3 ) );
      this.blue=output[2];
   };
  return output;
  }
  this.toHSL=function(){
    var var_R = (this.red / 255 );
    var var_G = (this.green / 255);
    var var_B = (this.blue / 255 );
    
    var var_Min = Math.min(var_B,Math.min(var_R,var_G));
    var var_Max = Math.max(Math.max(var_R,var_G,var_B));
    var del_Max = var_Max - var_Min ;
    var L = (var_Max + var_Min )/2;
    if ( del_Max == 0 ){
    var H = 0;
    var S = 0;
    }
    else{
      if ( L < 0.5 ){var S = del_Max / ( var_Max + var_Min );}
      else {var S = del_Max / ( 2 - var_Max - var_Min );}
      var del_R = ((( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
      var del_G = ((( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
      var del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

      if ( var_R == var_Max ){var H = del_B - del_G;}
      else if ( var_G == var_Max ){var H = ( 1 / 3 ) + del_R - del_B;}
      else if ( var_B == var_Max ){ var H = ( 2 / 3 ) + del_G - del_R;}
      if ( H < 0 ){H += 1;}
      if ( H > 1 ) { H -= 1;}
    }
    var output=new Array();
    output[0]=H;
    this.hue=H;
    output[1]=S;
    this.sat=S;
    output[2]=L;
    this.lum=L;
    return output;
  }

  this.invert=function(){
    this.red=255-this.red;
    this.green=255-this.green;
    this.blue=255-this.blue;
  }
  this.vector=function(){
    var output=new Array();
    output[0]=parseInt(this.red);
    output[1]=parseInt(this.green);
    output[2]=parseInt(this.blue);
    return output;
  }
  this.shiftHue=function(){
    var output=new Array();
    output[0]=parseInt(this.red);
    output[1]=parseInt(this.green);
    output[2]=parseInt(this.blue);
    return output;
  }
  this.max=function(){
    var mx=new Object();
    mx.val=0;
    for (var i=0;i<this.vector().length;i++){
      if (this.vector()[i]>mx.val){mx.val=this.vector()[i];mx.index=i;}
    }
    return mx;
  }
  
  this.min=function(){
    var mn=new Object();
    mn.val=0;
    for (var i=0;i<this.vector().length;i++){
      if (this.vector()[i]<mn.val){mn.val=this.vector()[i];mn.index=i;}
    }
    return mn;
  }
  this.normalize=function(to){
    to=to||255;
    var norm=new Array();
    for (var i=0;i<this.vector().length;i++){
      norm[i]=(this.vector()[i] / this.max().val)*to;
    }
    return norm;
  }
  
  this.constrain=function(min,max){
    min=min||0;
    max=max||255;
    var con=new Array();
    for (var i=0;i<this.vector().length;i++){
      if (this.vector()[i]<min){con[i]=min;}
      else if (this.vector()[i]>max){con[i]=max;}
      else{con[i]=this.vector()[i];}
    }
    return con;
  }
  
  this.validate=function(){
    return this.constrain();
  }
}



