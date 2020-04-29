var teams = [
	{
		name: 'Минск - Swagger'
	},
	{
		name: 'Минск - Markdown'
	},
	{
		name: 'Минск - Reports'
	},
	{
		name: 'Гродно'
	},
	{
		name: 'Брест'
	},
	{
		name: 'Гомель'
	},
	{
		name: 'Могилев',
		color: 'pink'
	}
];

var TeamViewModel = function(dataModel){
	this.name = dataModel.name;
	this.color = dataModel.color || ['rgb(', Math.floor(Math.random()*150)+100, ',',Math.floor(Math.random()*150)+100,',',Math.floor(Math.random()*200)+50,')'].join('');
	this.position = ko.observable();
};


var PageViewModel = function(){
	this.isMixing = ko.observable(false);

	this.teamsInitialList = ko.observableArray(teams.map(function(team){
		return new TeamViewModel(team);
	}));

	this.teamsResultList = ko.observableArray();
};

var MIX_COUNTER_MAX_COUNT = 30;
PageViewModel.prototype.mixCounter = MIX_COUNTER_MAX_COUNT;

PageViewModel.prototype.mix = function(callback) {
	var self = this;

	var resultedArray = new Int32Array(self.teamsInitialList().length);
	window.crypto.getRandomValues(resultedArray);
	
	for (var i =0; i < self.teamsInitialList().length; i++) {
		this.teamsInitialList()[i].position(resultedArray[i]);
	}

	self.teamsInitialList.sort(function(a, b) {
		return a.position() > b.position() ? 1 : -1;
	});

	callback();
}

PageViewModel.prototype.startFlickering = function(){
	var self = this;

	this.mix(function() {
		var unhappyTeam = self.teamsInitialList.pop();
		unhappyTeam.position(self.teamsInitialList().length + 1);

		self.teamsResultList.unshift(unhappyTeam);

		if(self.teamsInitialList().length > 0) {
			setTimeout(self.startFlickering.bind(self), 500);
		}
	})
};

PageViewModel.prototype.mixTeams = function(){
	this.isMixing(true);
	setTimeout(this.startFlickering.bind(this), 500);
};

ko.applyBindings(new PageViewModel())
