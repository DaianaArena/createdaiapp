/* lazy loads de images html
<div class="lazy-load-image">
<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="assets/images/main_image_desktop.png, assets/images/main_image_desktop@2x.png, assets/images/main_image_desktop@3x.png" data-src-768="assets/images/Main_Image_Tablet.png, assets/images/Main_Image_Tablet@2x.png, assets/images/Main_Image_Tablet@3x.png" data-src-mobile="assets/images/Main_Image.png, assets/images/Main_Image@2x.png, assets/images/Main_Image@3x.png" data-src-svg="" alt="Alt verdadero">
<noscript>
    <img src="assets/images/main_image_desktop.png" alt="Alt verdadero">
</noscript>
</div>

//objeto config a pasar
  const config = {
    contenedor: ,//nodo contenedor
    claseContenedora: '.lazy-load-image',
    dimensiones : {
        mobile: 50,
        tablet: 768,
        desktop: 992,
    }
  }
*/
export default function lazyLoadImages(config) {
  let lazyImages;

  if (config.contenedor) {
    lazyImages = config.contenedor.querySelectorAll(config.claseContenedora);
  } else {
    lazyImages = document.querySelectorAll(config.claseContenedora);
  }

  if (lazyImages.length > 0) {
    // cargamos todas las imagenes
    lazyImages.forEach((element) => {
      // recuperamos data de imagen orginal
      const image = element.querySelector('img');
      // recoletamos los datos del elemento
      const iSrc = image.getAttribute('data-src');
      const iSrc768 = image.getAttribute('data-src-768');
      const iSrcMov = image.getAttribute('data-src-mobile');
      const iSrcSVG = image.getAttribute('data-src-svg');
      const alt = image.getAttribute('alt');

      if (iSrc.trim() === '') {
        return;
      }

      // elemento picture
      const picture = document.createElement('picture');

      // elemento svg
      if (iSrcSVG != null) {
        const sourceSVG = document.createElement('source');
        sourceSVG.setAttribute('type', 'image/svg+xml');
        sourceSVG.setAttribute('srcset', iSrcSVG.trim());

        picture.appendChild(sourceSVG);
      }

      // elemento source por defecto, es el mayor

      const srcDefaults = iSrc.trim().split(',');
      let dataSrcDesktop = '';

      for (let a = 0; a < srcDefaults.length; a++) {
        if (a !== 0) {
          dataSrcDesktop += ', ';
        }
        dataSrcDesktop += `${srcDefaults[a]} ${a + 1}x`;
      }

      const sourcedesktop = document.createElement('source');
      sourcedesktop.setAttribute('media', `(min-width: ${config.dimensiones.desktop}px)`);
      sourcedesktop.setAttribute('srcset', dataSrcDesktop);

      picture.appendChild(sourcedesktop);

      // elemento source segundo

      if (iSrc768.trim() !== '') {
        const src768 = iSrc768.trim().split(',');

        let dataSrc768 = '';

        for (let b = 0; b < src768.length; b++) {
          if (b !== 0) {
            dataSrc768 += ', ';
          }
          dataSrc768 += `${src768[b]} ${b + 1}x`;
        }

        const source768 = document.createElement('source');
        source768.setAttribute('media', `(min-width: ${config.dimensiones.tablet}px)`);
        source768.setAttribute('srcset', dataSrc768);

        picture.appendChild(source768);
      }

      // elemento source mobile

      if (iSrcMov.trim() !== '') {
        const srcMobile = iSrcMov.trim().split(',');

        let dataSrcMobile = '';

        for (let c = 0; c < srcMobile.length; c++) {
          if (c !== 0) {
            dataSrcMobile += ', ';
          }
          dataSrcMobile += `${srcMobile[c]} ${c + 1}x`;
        }

        const sourceMobile = document.createElement('source');
        sourceMobile.setAttribute('media', `(min-width: ${config.dimensiones.mobile}px)`);
        sourceMobile.setAttribute('srcset', dataSrcMobile);

        picture.appendChild(sourceMobile);
      }

      // creamos elemento img por defecto
      const img = document.createElement('img');
      img.src = srcDefaults[0];
      img.setAttribute('alt', alt);

      picture.appendChild(img);

      // borro la imagen original si es que estaba
      element.innerHTML = '';
      // agregamos la imagen al dom
      element.appendChild(picture);
    });
  }
}
