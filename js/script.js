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

var Song = function(location, artist, title) {
	this.location = location;
	this.artist = artist;
	this.title = title;
};

var Player = function() {
	this.songs = [];
	// this.songIndex = 0;

	this.addSong = function(song) {
		this.songs.push(song);
	};

	this.play = function(i) {
		// Tell player object to play song path at this index in this.songs
	};

	this.stop = function() {
		// tell player objet to stop
	};

	this.nextSong = function() {

	}

};

var jukebox = new Player();

jukebox.addSong(new Song('/Users/labutler/Desktop/MusicProject/songs/washed-out-entrance.m4a', 'Washed Out', 'Entrace'));


