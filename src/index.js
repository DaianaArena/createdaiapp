import './assets/css/style.scss';
//import { smoothScroll } from './assets/js/helpers';
//import legalesModal from './assets/js/legales-modal';
//import animationsCSS from './assets/js/animations-css';

(function init() {
  const siteWrapper = document.querySelector('#site-wrapper');

  if (siteWrapper) {

    //do
    console.log('This site is loaded');

    //legales modal
    //legalesModal(siteWrapper);

    //animations on view:
    //if ( siteWrapper.classList.contains('animations-active') ) {
      // const animates = document.querySelectorAll('.animate');
      // if (animates.length > 0) {
      //     animationsCSS(animates);
      // }
    //}

  } else {
    //reload
    setTimeout(init, 1000);
  }
})();
