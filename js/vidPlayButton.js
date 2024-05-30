/*const playVisibleVideos = ()=> {
    var cards = document.querySelectorAll('.card');
    cards.forEach((card, index)=> {
      var rect = card.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight) {
        var video = card.querySelector('button video');
        video.play();
      } else {
        var video = card.querySelector('button video');
        video.pause();
      }
    });
}
*/


const addPlayVidButton = ()=>{
    //window.addEventListener('scroll', playVisibleVideos);
    //window.addEventListener('resize', playVisibleVideos);
    //playVisibleVideos();

        var videos = document.querySelectorAll('.gif');
        if (videos.length > 0 && !videos[0].classList.contains("hidden")){
            videos.forEach(function(video) {
                var button = video.parentElement.querySelector('.play-button');
                var overlay = video.parentElement;
                overlay.addEventListener('click', ()=> {
                  if (video.paused ) {
                    video.play();
                    button.classList.add("opacity");
                  } else {
                    video.pause();
                    button.classList.remove("opacity");
                  }
                });
            
                video.addEventListener('ended', ()=> {
                  button.classList.remove("opacity");
                });
                    
              });
        }
};
export {addPlayVidButton}
