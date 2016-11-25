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

/** 
 * padLeft function
 * @param  {int} len      Number of columns
 * @param  {int} c        Constant to pad with
 * @return {string}       The output string padded with constant to the length
 */
String.prototype.padLeft=function(len, c) {
    var s=this, c= c || '0';
    while(s.length< len) s= c+ s;
    return s;
}
/**
 * Formats time into HH:mm:ss from raw millis
 * @param  {float} seconds number of seconds
 * @return {String}         A formatted string that includes hours and seconds
 */
function formatPlayTime(seconds) {
	var hours = String(Math.floor(seconds / 3600)).padLeft(2);
	var remainingMinutes = String(Math.floor((seconds - (hours * 3600)) / 60)).padLeft(2);
	var remainingSeconds = String(Math.floor(seconds - (remainingMinutes * 60))).padLeft(2);
	return (hours != '00') ? hours + ':' + remainingMinutes + ':' + remainingSeconds : remainingMinutes + ':' + remainingSeconds;
}

/** @type {Event} Custom event for reloading the playlist */
var eventPlaylistReload = new Event('PLAYLIST_RELOAD');

/**
 * Song object, this encapsulates the Song state
 * @param {String} src    Path to song
 * @param {String} artist Artist name
 * @param {String} title  Track title
 */
var Song = function(src, artist, title) {
	var self = this;
	self.src = src;
	self.track = new Audio();
	self.track.src = self.src;
	self.duration = 0;
	self.track.addEventListener('loadedmetadata', function(e) {
		self.duration = formatPlayTime(this.duration);
		document.dispatchEvent(eventPlaylistReload);
	});
	self.artist = artist;
	self.title = title;
	self.display = self.artist + " - " + self.title;
	return self;
};

/**
 * Player object, this object wraps the Audio() class and provides playlist functionality and view controls
 */
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
	var displayCurrentTrack = document.getElementById('displayCurrentTrack');

	/** Bind all events for the player */
	function bindEventListeners() {
		playControl.addEventListener('click', self.playToggle);
		nextControl.addEventListener('click', self.nextSong);
		stopControl.addEventListener('click', self.stop);
		prevControl.addEventListener('click', self.prevSong);
		self.audioPlayer.addEventListener('onended', function() {
			self.nextSong();
		});
		self.audioPlayer.addEventListener('timeupdate', function(e) {
			currentTime.innerText = formatPlayTime(this.currentTime);
		})
		document.addEventListener('PLAYLIST_RELOAD', function (e) {
			self.reloadPlayList();
		}, false);
	};

	/** 
	 * Adds songs to song array
	 * @param {Song} song - Song object
	 */
	self.addSong = function(song) {
		if (!self.currentTrackIndex) {
			self.currentTrackIndex = 0;
		}
		self.songs.push(song);
		self.createPlaylistItem(song, self.songs.length - 1);
	};

	/** 
	 * Get song object from array by index
	 * param i		
	 */
	self.getSongByIndex = function getSongByIndex(i) {
		return self.songs[i];
	}
	/** 
	 * Get the current playing song
	 */
	self.getCurrentSong = function getCurrentSong() {
		return self.songs[self.currentTrackIndex];
	}

	/** 
	 * Load a track into the player by index
	 * @param  {int} i Song Index
	 * @return {void} 
	 */
	self.loadTrack = function(i) {
		if (i > self.songs.length - 1) {
			return null;
		}
		self.currentTrackIndex = i;
		self.audioPlayer.src = self.songs[self.currentTrackIndex].src;
		if (self.isPlaying) {
			self.audioPlayer.play();
		}
		displayCurrentTrack.innerText = self.getCurrentSong().display;

		//Reloads playlist view
		document.dispatchEvent(eventPlaylistReload);
		return self.songs[self.currentTrackIndex];
	};

	/** 
	 * Move the playlist to the next song and load it
	 * @param  {Event} e change song event
	 * @return {Song} the song that has been changed to
	 */
	self.nextSong = function(e) {
		self.currentTrackIndex += 1;
		if (self.currentTrackIndex >= self.songs.length) {
			// If we've hit next past the last song, goto first song
			self.currentTrackIndex = 0;
		}
		return self.loadTrack(self.currentTrackIndex);
	};

	/** 
	 * Pause the player
	 */
	self.pause = function pause() {
		self.audioPlayer.pause();
		playControl.innerText = 'Play';
		self.isPlaying = false;
	}

	/** 
	 * Play the player
	 */
	self.play = function play() {
		self.audioPlayer.play();
		playControl.innerText = 'Pause'
		self.isPlaying = true;
	} 

	/**
	 * Play the previous song
	 * @param  {Event} e change to previous song event
	 * @return {Song}  returns the previous song that will play
	 */
	self.prevSong = function(e) {
		self.currentTrackIndex -= 1;
		if (self.currentTrackIndex < 0) {
			// If we've hit prev before the 0 index, goto the last index (index is 0 based! so we need to subtract 1 from length)
			self.currentTrackIndex = self.songs.length-1;
		}
		return self.loadTrack(self.currentTrackIndex);
	};

	/**
	 * Toggles the player between play/pause
	 * @param  {Event} e Play toggle event
	 */
	self.playToggle = function(e) {
		if (!self.isPlaying) {
			self.play();
		} else { 
			self.pause();
		}
	};

	/**
	 * Stop the player and reset to beginning of playlist
	 * @param  {Event} e the stop event
	 * @return {Song}  the first track
	 */
	self.stop = function(e) {
		// tell player objet to stop
		self.pause();
		return self.loadTrack(0);
	};

	/** 
	 * Add an item to the playlist
	 * @param  {Song} song  The song that is being added to the playlist
	 * @param  {int} index The index in the playlist
	 */
	self.createPlaylistItem = function createPlaylistItem(song, index) {
		var item = document.createElement('li');
		item.addEventListener('click', function(e) {
			self.loadTrack(index);
			if (!self.isPlaying) {
				self.playToggle();
			}
		});
		item.id = index;
		if (index == self.currentTrackIndex) {
			item.classList.add('active')
		}
		var text = document.createTextNode(song.duration + ' - ' + song.artist + ' - ' + song.title );
		item.appendChild(text);
		playlist.appendChild(item);
	
	};

	/** 
	 * Rebuild the playlist to handle changes
	 */
	self.reloadPlayList = function reloadPlayList() {
		while (playlist.firstChild) {
		    playlist.removeChild(playlist.firstChild);
		}
		for (var i=0; i < self.songs.length; i++) {
			self.createPlaylistItem(self.songs[i], i);
		}
	}

	bindEventListeners();
	return self;
};

/**
 * Add the songs to the library, this could be done from a network call in the future.
 * @type {Array}
 */
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

// Load the first track and ensure that the player is ready to play
jukebox.loadTrack(0); 



