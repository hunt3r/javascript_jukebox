// from chris f
// hint: jukebox.play
// hint: html5 audio playback - this will have a default play button this assignment is asking us not to use that button
// hint: need an array of song objects
// hint: good time to practice github - make checklist of issues and then close them as you accomplish them

// additional requirement: 10+ commits, 3+ branches, 2+ issues

// 1. Display at least one song on the page when the page loads.
// 2. Give the user the ability to play that song, without using the "built-in" play button. 
// This could be through a different button, through clicking or mousing over an image on the page, or any other device of your choosing.
// 3. Give the user the ability to stop that song without using the "built-in" stop button. 
// Once again, this could be through a different button, through clicking or mousing over an image on the page, or any other device of your choosing.
// 4. Give the user the ability to load at least one different song into the Jukebox besides the one that is loaded when the page initially renders
// The whole Jukebox should be backed by an object called Jukebox with methods to play, stop, and load songs.

var Song = function(src, artist, title) {
	this.src = src;
	this.artist = artist;
	this.title = title;
};

var Player = function() {
	var self = this;
	self.songs = [];
	self.currentTrackIndex = null;
	self.audioPlayer = new Audio();
	self.isPlaying = false;
	self.playlist = null;

	//Player control handles
	var playControl = document.getElementById('play');
	var nextControl = document.getElementById('next');
	var stopControl = document.getElementById('stop');
	var prevControl = document.getElementById('prev');
	var currentTime = document.getElementById('currentTime');
	var duration = document.getElementById('duration');
	var display = document.getElementById('controls');
	var playlist = document.getElementById('playlist');

	function bindActions() {
		playControl.addEventListener('click', self.playToggle);
		nextControl.addEventListener('click', self.nextSong);
		stopControl.addEventListener('click', self.stop);
		prevControl.addEventListener('click', self.prevSong);
		self.audioPlayer.addEventListener('onended', function() {
			self.nextSong();
		});
		self.audioPlayer.addEventListener('timeupdate', function(e) {
			duration.innerText = Math.floor(this.duration);
			currentTime.innerText = Math.floor(this.currentTime);
		})
	};

	self.addSong = function(song) {
		if (!self.currentTrackIndex) {
			self.currentTrackIndex = 0;
		}
		self.songs.push(song);
		self.updatePlaylist(song, self.songs.length - 1);
	};
	self.play = function play() {
		display.classList.remove('hidden');
		self.audioPlayer.play();
		playControl.innerText = 'Pause'
		self.isPlaying = true;
	} 
	self.pause = function pause() {
		self.audioPlayer.pause();
		playControl.innerText = 'Play';
		self.isPlaying = false;
	}
	self.playToggle = function(e) {
		if (!self.isPlaying) {
			self.play();
		} else { 
			self.pause();
		}
	};

	self.loadTrack = function(i) {
		if (i > self.songs.length - 1) {
			return;
		}
		self.currentTrackIndex = i;
		self.audioPlayer.src = self.songs[self.currentTrackIndex].src;
		if (self.isPlaying) {
			self.audioPlayer.play();
		}
	};

	self.stop = function(e) {
		// tell player objet to stop
		display.classList.add('hidden');
		self.pause();
		self.audioPlayer.src = self.songs[0].src;
	};

	self.nextSong = function(e) {
		self.currentTrackIndex += 1;
		if (self.currentTrackIndex >= self.songs.length) {
			// If we've hit next past the last song, goto first song
			self.currentTrackIndex = 0;
		}
		self.loadTrack(self.currentTrackIndex);
	};

	self.prevSong = function(e) {
		self.currentTrackIndex -= 1;
		if (self.currentTrackIndex < 0) {
			// If we've hit prev before the 0 index, goto the last index (index is 0 based! so we need to subtract 1 from length)
			self.currentTrackIndex = self.songs.length-1;
		}
		self.loadTrack(self.currentTrackIndex);
	};

	self.updatePlaylist = function updatePlaylist(song, index) {
		var item = document.createElement('li');
		item.addEventListener('click', function(e) {
			self.loadTrack(index);
			if (!self.isPlaying) {
				self.playToggle();
			}
		})
		var text = document.createTextNode(song.artist + ' - ' + song.title);
		item.appendChild(text);
		playlist.appendChild(item);
	
	};
	
	bindActions();
	return self;
};

var songs = [
	new Song("songs/Brubecktakefive.m4a", "Brubeck", "Take Five"),
	new Song("songs/BSmywanderingdays.m4a", "Belle and Sebastian", "My Wandering Days Are Over"),
	new Song("songs/Foxygensanfrancisco.m4a", "Foxygen", "San Francisco"),
	new Song("songs/Guarldiginza.m4a", "Guaraldi", "Ginza"),
	new Song("songs/VUsundaymorning.m4a", "Velvet Underground", "Sunday Morning")
]
var jukebox = new Player();

for (var i=0; i < songs.length; i++) {
	jukebox.addSong(songs[i]);
}
// Load the first track
jukebox.loadTrack(0); 


