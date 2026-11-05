// Animator In.com Shows
// The list of shows and movies. The title is written inside each picture.
//
// To add a new show or movie:
//   1. Put its picture in the images/shows/ folder.
//   2. Add a new line to the SHOWS list (put a comma after the line before it).
// "title" is the name people can search for.
//
// To give a show its own page (with seasons and episodes):
//   1. Add  page: "show.html?id=something"  to its line in SHOWS.
//   2. Add an entry called "something" to SHOW_PAGES below.

var SHOWS = [
  { title: "AvM The Original", image: "images/shows/avm-the-original.webp" },
  { title: "AvA Victim", image: "images/shows/ava-victim.webp" },
  { title: "AvM", image: "images/shows/avm.webp", page: "show.html?id=avm" },
  { title: "Enemy How It Began", image: "images/shows/enemy-how-it-began.webp" },
  { title: "AvP", image: "images/shows/avp.webp" },
  { title: "Coming Soon", image: "images/shows/coming-soon.webp" }
];

// An episode with a "skipIntro" or "skipCredits" gets a Skip button: it shows when the video reaches
// "from" and jumps to "to" (both in seconds). Leave them out for episodes that do not need one.
// An episode with a "video" plays it. The "credit" words show for 5 seconds at the start.
// The pages for each show: the banner picture at the top, the name,
// and the seasons with their episodes (episodes are numbered in order).
var SHOW_PAGES = {
  avm: {
    title: "Animation versus Minecraft",
    banner: "images/shows/avm-banner-new.webp",
    seasons: [
      {
        name: "S1",
        episodes: [
          {
            title: "The rediscovery",
            thumbnail: "images/shows/avm-s1-e1.webp",
            video: "videos/avm-s1-e1.mp4",
            credit: "Original by Alan Becker",
            // "Skip intro" shows at "from" (2:47) and jumps to "to" (4:13). Times are in seconds.
            skipIntro: { from: 167, to: 253 },
            // "Skip credits" shows at 16:50 and jumps to 18:12
            skipCredits: { from: 1010, to: 1092 }
          },
          {
            title: "Everything not needed.",
            thumbnail: "images/shows/avm-s1-e2.webp",
            video: "videos/avm-s1-e2.mp4",
            credit: "Original by Alan Becker",
            // "Skip intro" shows at 0:46 and jumps to 2:09 (times are in seconds)
            skipIntro: { from: 46, to: 129 },
            // "Skip credits" shows at 17:52 and jumps to 19:13
            skipCredits: { from: 1072, to: 1153 }
          }
        ]
      }
    ]
  }
};
