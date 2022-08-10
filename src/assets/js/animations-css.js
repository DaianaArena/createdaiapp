/*
* Por defecto chequea que este en viewport,
* para agregar una animacion hay que agregar la clase "animate"
* Luego se agrega otra clase con la animacion
* Las animaciones se definen en el archivo scss.
* Internet explorer no soporta esta funcion
*/
export default function animationsCSS(elements) {

  //configuracion observer
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  };

  //se crea el observer
  const observer = new IntersectionObserver((entries, observer) => {

    for (let index = 0; index < entries.length; index++) {

      if (entries[index].isIntersecting) {
        entries[index].target.classList.add('in-view');
        observer.unobserve(entries[index].target);
      } else {
        entries[index].target.classList.remove('in-view');
      }
    }
  }, options);

  //observamos
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    element.classList.add('on');
    observer.observe(element);
  }
}
