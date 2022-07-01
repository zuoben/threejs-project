(function(ns) {
	
	var IMG_URL="./images/redpacketrain/";
	
	var asset = ns.Asset = Hilo.Class.create({
		Mixes: Hilo.EventMixin,

		queue: null,

		load: function() {
			var resources = [{
				id: 'bg',
				src: IMG_URL+'bg.png'
			},
			{
				id: 'catimg',
				src: IMG_URL+'catImg.png'
			}];

			this.queue = new Hilo.LoadQueue();
			this.queue.add(resources);
			this.queue.on('complete', this.onComplete.bind(this));
			this.queue.on('load', this.onLoad.bind(this));
			this.queue.start();
		},

		onComplete: function(e) {
			this.bg = this.queue.get('bg').content;
			
			this.catimg = this.queue.get('catimg').content;
			
			this.queue.off('complete');
			this.fire('complete');
		},
		
		onLoad:function(e){
			this.fire('load',e);
		}
	});

})(window.game);