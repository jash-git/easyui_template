
	var AC = {};
	(function($, win, doc, U){
    
    U.slider = function(selection, options){
        var _t = this;
        	
        _t.sliderDom = $(selection);
        _t.rangeDom = _t.sliderDom.find('.range');
        _t.containerDom = _t.sliderDom.find('.container');
        _t.dragDom = _t.sliderDom.find('.drag');
        _t.barDom = _t.sliderDom.find('.bar');
        _t.blockDom = _t.sliderDom.find('.block');
        _t.unitDom = _t.sliderDom.find('.unit');
        _t.inputDom = null;
        				         
        _t.options = options;
        
        _t.ismousedown = false;
        _t.diffX = 0;
        _t.distanceX = 0;
        _t.start = 0;
        _t.minWidth = 0;
        _t.maxWidth = 0;
        _t.minValue = 0;
        _t.maxValue = 0;
        _t.currentWidth = 0;
        _t.currentIndex = 0;
        _t.currentValue = 0;
        _t.blockWidth = [];
        _t.block = _t.options.data;
        _t.hasInput = false;
        _t.changeHandler = function(){};
        
        _t.initUnit = function(){
        	var w, min, max;
            for(var i = 0, len = _t.blockDom.length; i < len; i++){
            	w = $(_t.blockDom[i]).width();
	            $(_t.unitDom[i]).width(w);
	            _t.blockWidth.push(w);
	            _t.maxWidth += w;
            }
            _t.barDom.width(_t.maxWidth + 14);
            
            //if(_t.block[0].min !== _t.currentValue){
	        //_t.currentValue = _t.block[0].min;
            //}
            
            /* 初始化允许选择的最小最大值 */
            _t.currentValue = _t.minValue = !!_t.options.min ? _t.options.min : _t.block[0].min;
            _t.maxValue = !!_t.options.max ? _t.options.max : _t.block[len - 1].max;

        };
        
        _t.initInput = function(){
        	var input;
            if(!!_t.options.bindInput){
	            _t.hasInput = true;
	            _t.inputDom = $(_t.options.bindInput);
            }
        };
        
        _t.initValue = function(){
        	var idx = 0, value = 0;
            if(!!_t.options.defaultValue){
            	_t.currentValue = _t.options.defaultValue - 0;
            }
        	_t.valueToWidth();
            _t.moveToX();
        };
        
        _t.showValue = function(){
            if(_t.hasInput){
	            _t.inputDom.val(_t.currentValue);
            }
        };
        
        _t.changeInputValue = function(){
            if(_t.hasInput){
            	function handler(){
		            var t = $(this), val = t.val(), reg = /^\d+$/, max, min, unit, idx;
		            
		            min = _t.block[0].min;
		            max = _t.block[_t.block.length - 1].max;
		            
		            if(reg.test(val)){
		            	idx = _t.valueToIndex(val);
		            	unit = _t.block[idx].unit;		            	
			            val = val - 0 < min ? min : (val - 0 > max ? max : val);
			            val = Math.ceil(val / unit)	* unit;						            
		            }else{
		            	//val = min;
		            	val = _t.options.defaultValue !== undefined ? _t.options.defaultValue : min;
			        }
			        
			        _t.currentValue = val - 0;
		            _t.valueToWidth();
		            //_t.widthToValue();
		            //_t.valueToWidth();
		            _t.moveToX();
		            t.val(_t.currentValue);
		        }
            
	            _t.inputDom.blur(handler);
	            _t.inputDom.change(handler);							            
            }
        }
        
        _t.showUnit = function(){
        	_t.unitDom.find('span').css('color', '#93c4e2');
        	_t.unitDom.find('i').css('display', 'none');
            $(_t.unitDom[_t.currentIndex]).find('span').css('color', '#000');
            $(_t.unitDom[_t.currentIndex]).find('i').css('display', 'inline');
            
            //_t.changeHandler();
        }
        
        _t.setMaxValue = function(val){
	        _t.maxValue = val < _t.block[_t.block.length - 1].max ? val : _t.block[_t.block.length - 1].max;
	        if(_t.maxValue < _t.minValue){
		        _t.minValue = _t.maxValue;
	        }
	        
	        return _t;
        }
        
        _t.setMinValue = function(val){
	        _t.minValue = val > _t.block[0].min ? val : _t.block[0].min;
	        return _t;
        }
        
        _t.change = function(fun){
	        _t.changeHandler = fun;
	        return _t;
        }
        					            
        _t.calculateVal = function(){						            
            _t.widthToValue();	
            _t.showValue();
            _t.showUnit();	
            
            //alert(1);			            						            
        };
        
        _t.moveToX = function(){	
            _t.showValue();
            _t.showUnit();		            	
            _t.dragDom.stop().animate({
	           	'left' : _t.currentWidth - 7
           	}, 200);
           	_t.containerDom.stop().animate({
	           	'width' : _t.currentWidth
           	}, 200);
           	
           	_t.changeHandler();
        };
        
        _t.valueToIndex = function(v){
	        var len = _t.block.length, idx = 0, i = 0, val;
	        
	        val = !!v ? v : _t.currentValue;
	        //console.log(!!v? 'v' : 'currentValue');
	        
        	for(; i < len; i++){
            	if(val <= _t.block[i].max){
	            	idx = i;
	            	break;
            	}
        	}
        	
        	return idx;
        };
        
        _t.widthToValue = function(width){
        	var i = 0, w = 0, len = _t.blockWidth.length, unit, _w, _v;
        	
        	_w = !!width ? width : _t.currentWidth;
        						            	
        	for(; i < len; i++){
            	if(_w <= w + _t.blockWidth[i]){
	            	break;
            	}						            	
            	w += _t.blockWidth[i];
        	}
        	
        	unit = _t.block[i];
        	
        	_w = (_w - w) / _t.blockWidth[i];
        	//_v = (i < 1 ? _t.block[0].min : _t.block[i - 1].max) + Math.ceil(_w * ((unit.max - unit.min) / unit.unit)) * unit.unit;
        	_v = _t.block[i].min + Math.ceil(_w * ((unit.max - unit.min) / unit.unit)) * unit.unit;
        	/* 调整值 */
        	_t.currentValue = _v = _v < _t.minValue ? _t.minValue : (_v > _t.maxValue ? _t.maxValue : _v);
        	
        	_t.currentValue = _v;
        	//_t.currentIndex = i;
        	_t.currentIndex = _t.valueToIndex();
        						            
            return _t.currentValue;
        };
        
        _t.valueToWidth = function(value){
        	var i = 0, w = 0, len, idx, unit, _v;
        	
        	_v = !!value ? value : _t.currentValue;
        	
        	/* 调整值 */
        	_t.currentValue = _v = _v < _t.minValue ? _t.minValue : (_v > _t.maxValue ? _t.maxValue : _v);
        	
        	len = _t.block.length;
        	for(; i < len; i++){
            	if(_v <= _t.block[i].max){
	            	idx = i;
	            	break;
            	}
        	}
        	
        	for(i = 0, len = idx; i < len; i++){
            	w += _t.blockWidth[i];
        	}
        	
        	unit = _t.block[idx];
        	//w += Math.floor((_v - (idx < 1 ? 0 : _t.block[idx - 1].max)) / (unit.max - unit.min) * _t.blockWidth[idx]);
        	w += Math.floor((_v - _t.block[idx].min) / (unit.max - unit.min) * _t.blockWidth[idx]);
        	_t.currentWidth = w;
        	_t.currentIndex = idx;
        	        				            
            return w;
        };
        
        _t.value = function(val){
        	_t.currentValue = val - 0;
        	_t.valueToWidth();
            _t.moveToX();
            
            return _t;
        };
        
        _t.barDom.click(function(ev){
            var width;
            
            //_t.barDom.focus();
            
            //alert($(doc).scrollLeft());
            
            _t.distanceX = _t.rangeDom.offset().left;
            width = Math.floor(ev.clientX + $(doc).scrollLeft() - _t.distanceX);
            _t.currentWidth = width < 0 ? 0 : (width > _t.maxWidth ? _t.maxWidth : width);
            _t.widthToValue();
            _t.valueToWidth();
            _t.moveToX();
            
        });
        
        _t.dragDom.mousedown(function(ev){
        	ev.preventDefault();
        	//$(this).blur();
        	
        	//_t.dragDom.focus();
        	
        	_t.minWidth	= 0;
            _t.maxWidth;
            _t.distanceX = _t.rangeDom.offset().left;
            _t.diffX = ev.clientX + $(doc).scrollLeft() - _t.dragDom.offset().left;							          					            
            _t.ismousedown = true;       
        });
        
        $(doc).mouseup(function(ev){
        	if(_t.ismousedown){
        		_t.valueToWidth();
        		_t.moveToX();
        		_t.ismousedown = false;
        	}
        });
        
        $(doc).mousemove(function(ev){
        	var x;
        
            if(!_t.ismousedown){
	            return;
            }
            
            x = ev.clientX + $(doc).scrollLeft() - _t.diffX - _t.distanceX;
            x = x <= -7 ? -7 : (x > _t.maxWidth - 7 ? _t.maxWidth - 7 : x);
            _t.currentWidth = x + 7 > _t.maxWith ? _t.maxWith : x + 7;
            
            _t.containerDom.css('width', _t.currentWidth);							            
            _t.dragDom.css('left', x);
            
	        setTimeout(_t.calculateVal, 1);						            
	        //_t.calculateVal();
        });
        
        /* 重置长度 */
        //$(win).resize();					            
        
        _t.initUnit();
        _t.initInput();
        //setTimeout(_t.initValue, 1);
        _t.initValue();
        _t.showValue();
        _t.changeInputValue();
        
    };
    
})(jQuery, window, document, AC);

