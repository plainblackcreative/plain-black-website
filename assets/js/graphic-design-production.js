(() => {
 'use strict';
 const audio = document.querySelector('#article-audio');
 const panel = document.querySelector('.article-audio');
 const play = document.querySelector('#audio-play');
 const seek = document.querySelector('#audio-seek');
 const time = document.querySelector('#audio-time');
 const error = document.querySelector('#audio-error');
 const speed = document.querySelector('#audio-speed');
 const format = value => { const seconds = Math.max(0, Math.floor(value || 0)); return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0'); };
 const update = () => {
   const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
   seek.max = String(duration || 1);
   seek.value = String(audio.currentTime);
   seek.setAttribute('aria-valuetext', format(audio.currentTime) + ' of ' + format(Math.ceil(duration)));
   time.textContent = format(audio.currentTime) + ' / ' + (duration ? format(Math.ceil(duration)) : '5:31');
 };
 const showState = () => { const playing = !audio.paused && !audio.ended; play.classList.toggle('is-playing', playing); play.setAttribute('aria-label', playing ? 'Pause audioblog' : 'Play audioblog'); };
 panel.classList.add('audio-enhanced');
 play.addEventListener('click', async () => {
   error.hidden = true;
   if (!audio.paused) { audio.pause(); return; }
   try { await audio.play(); } catch { error.textContent = 'Audio could not start. Try again or download the MP3 below.'; error.hidden = false; showState(); }
 });
 audio.addEventListener('play', showState);
 audio.addEventListener('pause', showState);
 audio.addEventListener('ended', showState);
 audio.addEventListener('error', () => { error.textContent = 'The audio could not load. You can try the MP3 link below.'; error.hidden = false; showState(); });
 ['timeupdate','loadedmetadata','durationchange'].forEach(event => audio.addEventListener(event, update));
 seek.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value); update(); });
 speed.addEventListener('change', () => { audio.playbackRate = Number(speed.value); });
 const dialog = document.querySelector('#reel-dialog');
 const video = dialog.querySelector('video');
 document.querySelectorAll('[data-open-reel]').forEach(button => button.addEventListener('click', () => { audio.pause(); dialog.showModal(); }));
 dialog.querySelector('button').addEventListener('click', () => dialog.close());
 dialog.addEventListener('close', () => video.pause());
 dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
 update();
})();
