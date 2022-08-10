/*
 * CAROUSEL BÁSICO
 * Mini instrucciones:
 * La función inicial a llamar es carousel(wrapper, options=null)
 * recibe el contenedor (en lo posible por id) mayor donde está toda la sección y options para sobreescribir las optiones por defecto
 * Opciones: breakpoints, dots, navs
 * el html con id productos, debe tener data-active="1" para que este activo
 * Internamente, es necesario esta estructura para q el script interprete correctamente:
 * <div class="productos_wrapper">
        <ul class="productos">
            <li class="item-slider">
*/

let contenedorExterno, contenedorProductos, productos, viewportWidth, containerHeight, containerWidth, layout;
let isResizing=false,
    bulletsActive = false,
    navActive = true,
    autoHeight = true,
    autoWidth = true,
    autoSlide = false,
    timeoutSlide = 5000;
let breakpoints = {
    base: {
        minWidth: 0,
        items: 1,
        active: true
    },
    medium: {
        minWidth: 768,
        items: 2,
        active: true
    },
    large: {
        minWidth: 992,
        items: 3,
        active: true
    },
    xlarge: {
        minWidth: 1200,
        items: 3,
        active: true
    }
}


export default function carousel(wrapper, options=null) {
    
    contenedorExterno = wrapper.querySelector('.productos_wrapper');
    contenedorProductos = wrapper.querySelector('.productos');
    
    if (contenedorProductos) {
        productos = contenedorProductos.querySelectorAll('.item-slider');
    } else {
        console.error('no hay contenedor de productos');
        return;
    }

    if (productos.length < 1) {
        console.error('no hay productos');
        return;
    }

    //valido las opciones
    if (options!=null && options.breakpoints) {
        breakpoints = options.breakpoints;
    }

    if (options!=null && options.bullets) {
        bulletsActive = options.bullets;
    }

    if (options!=null && options.navigation) {
        navActive = options.navigation;
    }
    if (options!=null && options.autoSlide) {
        autoSlide = options.autoSlide
    }
    if (options!=null && options.timeoutSlide) {
        timeoutSlide = options.timeoutSlide
    }

    if (options!=null && options.autoHeight) {
        autoHeight = options.autoHeight;
    }

    if (options!=null && options.autoWidth) {
        autoWidth = options.autoWidth;
    }
    
    setWindowResizeEvent();
    
    //inicia el carousel
    setTimeout(()=>{
        startCarousel();
    },1000);

}

//destruye carousel, elementos y eventos
const destroyCarousel = () => {
    console.log('carousel ended')
    
    if (navActive) {
        //destruye navs
        let elemento = contenedorExterno.querySelector('.nav-wrapper');
        if (elemento) {
            let padre = elemento.parentNode;
		    padre.removeChild(elemento);
        }
    }

    if (bulletsActive) {
        //destruye bullets
        let elemento = contenedorExterno.querySelector('.bullets-wrapper');
        if (elemento) {
            let padre = elemento.parentNode;
		    padre.removeChild(elemento);
        }        
    }

    //quita clases agregadas para restaurar el diseño original
    //setea productos. activa el primero y prepara las clases para el layout a mostrar
    contenedorExterno.classList.remove('carousel-on');
    contenedorProductos.classList.remove('productos-on');
    if ( autoHeight ) {
        contenedorProductos.style.height = 'auto';
    }

    if ( autoWidth ) {
        contenedorProductos.style.width = 'auto';
    }
    
    for (let p = 0; p < productos.length; p++) {
        const producto = productos[p];
        producto.classList.remove('item-on');
        producto.classList.remove('item-on-'+layout);
        producto.classList.remove('active-1');
        producto.classList.remove('active');
        producto.classList.remove('active1');
        producto.classList.remove('active2');
        producto.classList.remove('active3');
        producto.classList.remove('active4');
        producto.classList.remove('active-out-right');
    }
}

//inicia el carousel de acuerdo a layout
const startCarousel = () => {
    console.log('carousel started');

    //setea ancho de viewport
    viewportWidth = window.innerWidth;

    //setea layout: base/medium/large/xl y sabe cuantos debe mostrar y si debe mostrarlo o detenerlo en este viewport
    layout = setLayout(viewportWidth);
    if ( !layout ) {
        console.log('carousel detenido en este viewport: ', viewportWidth)
        return;
    }

    //chequea si vale la pena el carousel de acuerdo al layout y cantidad de items
    if (layout >= productos.length) {

        console.log('no hay suficientes productos para un carousel')
        return;
    }

    //setea el alto y ancho del ul de productos para soportar absolute
    if ( autoHeight ) {
        containerHeight = getHeightDefault();
    }
    
    if ( autoWidth ) {
        containerWidth = getWidthDefault( layout );
    }

    //arma bullets
    if (bulletsActive) {
        createBullets();
        contenedorExterno.append()
    }

    //arma navs
    if (navActive) {
        createNavigation();
    }

    //setea productos. activa el primero y prepara las clases para el layout a mostrar
    prepareProductsToSlide();

    isNavigationsBtnsInView(0);
    
}



//devuelve layout: base/medium/large/xl y sabe cuantos debe mostrar
const setLayout = (w) => {
    let items = 1;
    let active = true;

    switch (true) {
        case w > breakpoints.xlarge.minWidth:
            items = breakpoints.xlarge.items;
            active = breakpoints.xlarge.active;
        break;
    
        case w > breakpoints.large.minWidth:
            items = breakpoints.large.items;
            active = breakpoints.large.active;
        break;

        case w > breakpoints.medium.minWidth:
            items = breakpoints.medium.items;
            active = breakpoints.medium.active;
        break;
        default:
            items = breakpoints.base.items;
            active = breakpoints.base.active;
        break;
    }

    if ( active ) {
        return items;
    } else {
        return false;
    }
    
}

//busca altura adecuada de acuerdo al producto más alto
const getHeightDefault = () => {
    let h = 0;
    for (let i = 0; i < productos.length; i++) {
        let prH = productos[i].getBoundingClientRect().height
        if ( prH > h ) {
            h = prH;
        }
        
    }
    return h;
}

//busca el ancho considerando el layout
const getWidthDefault = (layout) => {
    let wid = 0;
    for (let i = 0; i < productos.length; i++) {
        let prW = productos[i].getBoundingClientRect().width
        if ( prW > wid ) {
            wid = prW;
        }
        
    }
    return wid * layout;
    
}

//funcion que maneja la lógica del resize
const setWindowResizeEvent = () => {
    //acomodo el evento para detectar resize y que se vuelva a construir el carousel
    window.addEventListener('resize', event => {
        //este se hace para que no se haga resize en cada pixel, sino que espera 1000 antes de hacerlo
        if(isResizing) {
            return;
        } else {
            isResizing=true;
            setTimeout(()=>{
                //chequea si se destruye o no porque si no cambia el layout no vale la pena
                let newLayout = setLayout(window.innerWidth)

                //si setLayout devuelve false, es necesario la destruccion porque no hay carousel en este nuevo layout y no se activa mas
                if ( !newLayout ) {
                    console.log('esta desactivo')
                    destroyCarousel();
                } else if ( newLayout != layout ) {
                    //si newLayout no es igual a llayout hay que destruirlo y volverlo a armar porque cambia layout
                    isResizing=false;
                    destroyCarousel();
                    setTimeout(()=>{
                        startCarousel();
                    },500);
                } 

                isResizing=false;
                
            },1000)
        }
    });
}

//crear bullets
const createBullets = () => {
    let ul = document.createElement('ul');
        ul.classList.add('bullets-wrapper');

    

    for (let index = 0; index < productos.length; index++) {
        let li = document.createElement('li');
        if (index == 0) {
            li.classList.add('active');
        }
        ul.append(li);
    }

    contenedorExterno.append(ul);
}

//crear navs
const createNavigation = () => {
    let div = document.createElement('div');
        div.classList.add('nav-wrapper');

    //botones:
    let btnL = document.createElement('button');
        btnL.classList.add('nav-left');
        btnL.setAttribute('data-direction', 'left');
    div.append(btnL);

    let btnR = document.createElement('button');
        btnR.classList.add('nav-right');
        btnR.setAttribute('data-direction', 'right');
    div.append(btnR);

    contenedorExterno.append(div);

    //crea events para botones

    btnL.addEventListener('click', clickNavigation);

    btnR.addEventListener('click', clickNavigation);
}

//prepara los productos agregando clases y estilos a los contenedores
const prepareProductsToSlide = () => {
    contenedorExterno.classList.add('carousel-on');
    contenedorProductos.classList.add('productos-on');

    if ( autoHeight ) {
        contenedorProductos.style.height = containerHeight + 'px';
    }

    if ( autoWidth ) {
        contenedorProductos.style.width = containerWidth + 'px';
    }
    
    for (let p = 0; p < productos.length; p++) {
        const producto = productos[p];
        producto.classList.add('item-on');
        producto.classList.add('item-on-'+layout)
        producto.setAttribute('data-index', p);

        switch (p) {
            case 0:
                producto.classList.add('active');
            break;
            case 1:
                if (layout && layout > 1) {
                    producto.classList.add('active1');
                } else {
                    producto.classList.add('active-out-right');
                }
            break;
            case 2:
                if (layout && layout > 2) {
                    producto.classList.add('active2');
                } else {
                    producto.classList.add('active-out-right');
                }
            break;
            case 3:
                if (layout && layout > 3) {
                    producto.classList.add('active3');
                } else {
                    producto.classList.add('active-out-right');
                }
            break;
            case 4:
                if (layout && layout > 4) {
                    producto.classList.add('active4');
                } else {
                    producto.classList.add('active-out-right');
                }
            break;
        }

    }
}

//click en botones de navegacion
const clickNavigation = event => {
    const direction = event.target.getAttribute('data-direction');
    
    //se puede mover hacia ahí?
    if ( event.target.getAttribute('data-hidden') != true ) {
        //entonces mueva:
        moveOne(direction);    
    }
    

}

const moveOne = (direction) => {
    console.log(0)
    //detectar que numero está activo
    let active = parseInt(getActive());
    
    //sumar o restar al active
    if (direction == 'right' && (active + layout) < productos.length) {
        active++;
        moveTo(active);
    } else if (direction == 'left' && active != 0){
        active--;
        moveTo(active);
    }

    isNavigationsBtnsInView(active);
}

//funcion que encuentra activa
const getActive = () => {
    let productActive = contenedorProductos.querySelector('.item-on.active');
    let index = productActive.getAttribute('data-index');
    return index;
}

//se mueve a este index: 0, 1, 2
const moveTo = index => {

    //recorrer productos
    for (let p = 0; p < productos.length; p++) {
        const producto = productos[p];
        producto.classList.remove('active-1');
        producto.classList.remove('active');
        producto.classList.remove('active1');
        producto.classList.remove('active2');
        producto.classList.remove('active3');
        producto.classList.remove('active4');
        producto.classList.remove('active-out-right');
    }
    
    //definimos active
    if ( productos[index-1] ) {
        productos[index-1].classList.add('active-1');
    }
    if ( productos[index] ) {
        productos[index].classList.add('active');
    }
    if ( productos[index+1] ) {
        //debugger;
        if (layout > 1 ) {
            productos[index+1].classList.add('active1');
        } else {
            productos[index+1].classList.add('active-out-right');
        }
    } 
    if ( productos[index+2] ) {
        //debugger;
        if (layout > 2 ) {
            productos[index+2].classList.add('active2');
        } else {
            productos[index+2].classList.add('active-out-right');
        }
    } 
    if ( productos[index+3] ) {  
        //debugger;
        if (layout > 3 ) {
            productos[index+3].classList.add('active3');
        } else {
            productos[index+3].classList.add('active-out-right');
        }
    } 
    if ( productos[index+4] ) {  
        //debugger;
        if (layout > 4 ) {
            productos[index+4].classList.add('active4');
        } else {
            productos[index+4].classList.add('active-out-right');
        }
    } 
}


//chequea si es correcto mostrar los buttons right y left y los oculta o los muestra
const isNavigationsBtnsInView = active => {
    let btns = document.querySelectorAll('.nav-wrapper button');

    if (active != 0){
        //muestra left
        btns[0].style.opacity = 1;
        btns[0].style.pointerEvents = 'all';
        btns[0].removeAttribute('data-hidden');
    } else {
        //oculta left
        btns[0].style.opacity = 0;
        btns[0].style.pointerEvents = 'none';
        btns[0].setAttribute('data-hidden', 'true');
    }

    if (layout != false ) {
        if (active+layout == productos.length) {
            //oculta right
            btns[1].style.opacity = 0;
            btns[1].style.pointerEvents = 'none';
            btns[1].setAttribute('data-hidden', 'true');
        } else {
            //muestra right
            btns[1].style.opacity = 1;
            btns[1].style.pointerEvents = 'all';
            btns[1].removeAttribute('data-hidden');
        }
    }
}