var fsBanner = function(pw_container,options) {
	var self = this;

	var defaults = {
		'showName':true,	
		'toUpdate':{},
		'whenEmpty':{},
		'trigger':'click',
		'hideParent':null,
		'onChanged':null
	}

	this.options = $.extend({}, defaults, options);

	this.ilast = -1;

	this.setup = function() {
		this.pw_container = $(pw_container);
		this.items = this.pw_container.find('.pw-change-part');
		this.itemsHeader = this.items.find('.pw-panel-header');

		if (!this.pw_container.width()) this.pw_container.width(this.pw_container.parent().width());

		// 三部分平分的宽度（屏幕总宽度/3）
		this.part = this.pw_container.width() / this.items.length;
		// 某一项展开后，另外两项宽度（三部分平分的宽度/4）
		this.mini = this.part/4;

		this.widmain = this.pw_container.width() - (this.mini*this.items.length);

		this.items.css({'height':this.pw_container.height(),'width':this.widmain+this.mini});	

		// if (!this.options.showName) this.items.find('.name').hide();

		this.items.each(function(i) {
			var $item = $(this);
			$item.css({'z-index':i});
			if (self.options.trigger == 'click') 
				$item.on('click',function() { 
					self.selectItem($item,i);
				});
			// if (self.options.trigger == 'mouse') $item.on('mouseenter',function() { self.selectItem($item,i,true); });
		});

		// if (self.options.trigger == 'mouse') {
		// 	this.pw_container.on('mouseleave',function() { self.resetcss(); });
		// }

		this.resetcss();
		this.pw_container.show();
	}

	this.resetcss = function() {
		// this.items.each(function(i) {
		// 	var $item = $(this);
		// 	$item.stop().animate({'left':i*self.part});
		// });
		this.itemsHeader.each(function(i) {
			var $itemsHeader = $(this);
			$itemsHeader.stop().animate({'width':self.mini}, 500);
		});
		// this.ilast = null;
		// this.updateHtml();
	};

	this.selectItem = function($expanded,iexpanded,forceClick) {
		this.$lastexpanded = this.$expanded;

		if (forceClick) this.ilast = null;
		if (iexpanded == this.ilast) {
			// this.$expanded = null;
			// this.resetcss();
		} else {
			// this.resetcss();
			this.$expanded = $expanded;			
			this.items.each(function(i) {
				var $item = $(this);
				if (i <= iexpanded) {
					$item.stop().animate({
						'left':i*self.mini
					}, 500);
				} else {
					$item.stop().animate({
						'left':i*self.mini+self.widmain
					}, 500);
				}
			});

			this.itemsHeader.each(function(i) {
				var $itemsHeader = $(this);
				if (i == iexpanded) {
					$itemsHeader.animate({
						'width':self.mini+self.widmain,
						'opacity':0
					}, 500);
					$itemsHeader.animate({
						'zIndex':0
					}, 1);
				} else {
					$itemsHeader.animate({
						'zIndex':2
					}, 1);
					$itemsHeader.animate({
						'width':self.mini,
						'opacity':1
					}, 500);
				}
			});


			
			this.ilast = iexpanded;
			// this.updateHtml($expanded);
		};
		this.fireChanged();

		this.items.each(function(i) {
			var $item = $(this);
			$item.css({'z-index':i});
		});

		// 更新被选中部分的z-index
		// setTimeout(this.$expanded.css({'z-index':9999}), 500);
		// setTimeout(this.updateZIndex(this.$expanded), 500);
	};

	// this.updateZIndex = function($selectItem) {
	// 	$selectItem.css({'z-index':9999});
	// };

	this.updateHtml = function($expanded) {
		this.$expanded = $expanded;

		var $parent = $(self.options.hideParent);
		$.each(this.options.toUpdate,function(field,selector) {
			var $obj = $(selector);
			var showit = false;
			var value = '';
			if ($expanded) {
				$parent.show();
				value = $expanded.find('.'+field).html();
				showit = true;
			} else {
				if ($parent.length) {
					showit = false;
					$parent.hide();
				} else {
					if (self.options.whenEmpty[field]) {
						value = self.options.whenEmpty[field];
						showit = true;
					}
				}
			}
			$obj.hide();
			if (showit) $obj.html(value).fadeIn('fast');
		});
	};

	this.fireChanged = function() {
		if (this.options.onChanged) {
			this.options.onChanged(this.$expanded,this.$lastexpanded);
		}
	};

	this.setup();
};

$.fn.fsBanner = function(options) {
	return new fsBanner(this,options);

};
