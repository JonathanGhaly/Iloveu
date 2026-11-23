const panels=[...document.querySelectorAll('.panel')];
function showPanel(id){panels.forEach(p=>p.classList.remove('active'));const target=document.getElementById(id);target.classList.add('active');target.style.animation='none';void target.offsetWidth;target.style.animation='';window.scrollTo({top:0,behavior:'smooth'});}
// Start the main song as soon as she opens the letter. This happens after
// a real button click, which is the browser-approved way to start audio.
function startMainSong() {
  const player = document.getElementById('songPlayer');
  const frame = document.getElementById('songFrame');
  const button = document.getElementById('playSong');
  player.hidden = false;
  if (!frame.src) frame.src = 'https://www.youtube-nocookie.com/embed/EgmXTmj62ic?autoplay=1&rel=0';
  button.textContent = '♪ Playing';
  button.disabled = true;
}
document.getElementById('openLetter').addEventListener('click',()=>{
  startMainSong();
  showPanel('letter');
});
document.querySelectorAll('[data-next]').forEach(btn=>btn.addEventListener('click',()=>showPanel(btn.dataset.next)));
document.getElementById('restart').addEventListener('click',()=>showPanel('intro'));


// Load music only after the visitor presses play.
function enableSong(buttonId, playerId, frameId, videoId) {
  const button = document.getElementById(buttonId);
  const player = document.getElementById(playerId);
  const frame = document.getElementById(frameId);
  button.addEventListener('click', () => {
    player.hidden = false;
    if (!frame.src) frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    button.textContent = '♪ Playing';
    button.disabled = true;
  });
}
enableSong('playSong', 'songPlayer', 'songFrame', 'EgmXTmj62ic');
enableSong('playElvis', 'elvisPlayer', 'elvisFrame', 'O-aavAlSYgc');
