import { smoothScroll } from './helpers';

export default function legalesModal(wrapper) {
  const btnLegal = wrapper.querySelector('.togle-legal');

  if (btnLegal) {
    const wrapperLegales = document.querySelector('.legal-wrapper');
    const btnCloseLegal = wrapperLegales.querySelector('.close-legal');

    btnLegal.addEventListener('click', () => {

      if (btnLegal.classList.contains('active')) {
        wrapperLegales.classList.remove('active');
        wrapperLegales.style.height = 0;
        btnLegal.classList.remove('active');
      } else {
        wrapperLegales.classList.add('active');

        wrapperLegales.style.height = `${wrapperLegales.scrollHeight}px`;
        btnLegal.classList.add('active');

        //scroll up
        setTimeout(() => {

          smoothScroll('.legal-wrapper');
          //window.scrollTo(0, window.scrollY+(wrapperLegales.getBoundingClientRect().top) );

        }, 501);
      }

    });

    btnCloseLegal.addEventListener('click', () => {
      wrapperLegales.classList.remove('active');
      wrapperLegales.style.height = 0;
      btnLegal.classList.remove('active');
    });

  }
}
