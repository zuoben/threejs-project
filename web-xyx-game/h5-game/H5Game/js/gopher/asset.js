(function(ns) {
	
	var IMG_URL="./images/gopher/";
	
	var asset = ns.Asset = Hilo.Class.create({
		Mixes: Hilo.EventMixin,

		queue: null,

		load: function() {
			var resources = [{
				id: 'bg_0',
				src: IMG_URL+'GameBg.jpg'
			},
			{
				id: 'role_0_0',
				src: IMG_URL+'role_0_0.png'
			},
			{
				id: 'role_0_1',
				src: IMG_URL+'role_0_1.png'
			},
			{
				id: 'role_0_2',
				src: IMG_URL+'role_0_2.png'
			},
			{
				id: 'role_1_0',
				src: IMG_URL+'role_1_0.png'
			},
			{
				id: 'role_1_1',
				src: IMG_URL+'role_1_1.png'
			},
			{
				id: 'role_1_2',
				src: IMG_URL+'role_1_2.png'
			}];

			this.queue = new Hilo.LoadQueue();
			this.queue.add(resources);
			this.queue.on('complete', this.onComplete.bind(this));
			this.queue.on('load', this.onLoad.bind(this));
			this.queue.start();
		},

		onComplete: function(e) {
			this.bg_0 = this.queue.get('bg_0').content;
			
			this.role_0_up = this.queue.get('role_0_0').content;
			this.role_0_hit = this.queue.get('role_0_1').content;
			this.role_0_down = this.queue.get('role_0_2').content;
			
			this.role_1_up = this.queue.get('role_1_0').content;
			this.role_1_hit = this.queue.get('role_1_1').content;
			this.role_1_down = this.queue.get('role_1_2').content;
			
			this.queue.off('complete');
			this.fire('complete');
		},
		
		onLoad:function(e){
			this.fire('load',e);
		}
	});

})(window.game);