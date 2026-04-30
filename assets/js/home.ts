import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/categoria";
import { getProductos } from "../../../data/data";
import { getCategories } from "../../../data/data";
import { addProductToCart, getCart } from "../../../utils/utils";


const gridElements = document.getElementById("grid-productos") as HTMLElement;
const getCategoriasBtn = document.getElementById("categorias-container") as HTMLElement
const inputBuscar = document.getElementById("buscador") as HTMLInputElement;
console.log(inputBuscar);

const todosProductos: Product[] = getProductos();
const todasCategorias: ICategory[] = getCategories();


const botonDesactivado = (container: HTMLButtonElement) => {
  container.disabled = true;
  container.innerText = "Sin stock";
  container.style.backgroundColor = "rgba(22, 6, 6, 0.35)";
  container.style.pointerEvents = "none";
}

const botonActivado = (container: HTMLButtonElement) => {
  const textoOriginal = container.innerText;
  const coloOrOriginal = container.style.backgroundColor;
  container.innerText = "Agregado";
  container.style.backgroundColor = "rgba(6, 78, 18, 0.59)";
  container.style.pointerEvents = "none";
  setTimeout(() => {

    container.innerText = textoOriginal;
    container.style.backgroundColor = coloOrOriginal;
    container.style.pointerEvents = "auto";
  }, 300);
}

//Interface para el carrito
export interface ElementoCarrito {
  producto: Product;
  cantidad: number;
}
//Array de ElementosCarrito
const carrito: ElementoCarrito[] = getCart();

//Mensaje de eror generico
export const mensajeError = (mensaje: string, container: HTMLElement) => {
  //container.innerHTML = "";
  const mensajeError = document.createElement("h2");
  mensajeError.innerText = mensaje;
  container.appendChild(mensajeError);
}

//Cargar productos al main
const cargarProductos = (producto: Product[]) => {
  gridElements.innerHTML = "";
  if (producto.length > 0) {
    producto.forEach((p) => {
      const tarjeta = document.createElement("article")
      tarjeta.classList.add("tarjetas")
      tarjeta.innerHTML = `
                    <img src="/${p.categorias.map(cat => cat.nombre)}/${p.categorias.map(cat => cat.nombre)}.jpg" alt="${p.descripcion}">
                    <div class="info">
                        <span class="tag">${p.categorias.map(cat => cat.nombre)}</span>
                        <h4>${p.nombre}</h4>
                        <p>${p.descripcion}</p>
                        <div class="precio-accion">
                            <span class="precio">$${p.precio}</span>
                            <button class="btn-agregar">+ Agregar</button>
                        </div>`

      //Agregar al carrito a cada elemento creado se le agrega un event listener al boton de agregar
      const botonAgregar = tarjeta.querySelector(".btn-agregar") as HTMLButtonElement;


      //ESTILO BOTON AGREGAR


      botonAgregar.addEventListener("click", () => {
        agregarCarrito(p, botonAgregar);
        botonActivado(botonAgregar);
        // agregarAlCarrito(p); 
      });

      carrito.some(item => {
        if (item.producto.stock === 0 && item.producto.id === p.id) {
          botonDesactivado(botonAgregar);
        }
      })
      gridElements.appendChild(tarjeta);
    })

  }
  else {
    mensajeError("No se encontraron productos", gridElements);
  }
}
//LLAMADA A FUNCION
cargarProductos(todosProductos);
//Cargar Categorias al aside
const cargarCategorias = (categorias: ICategory[]) => {
  //getCategoriasBtn.innerHTML = "";  
  categorias.forEach((c) => {
    const botonCategoria = document.createElement("button")
    botonCategoria.classList.add("cat-btn")
    botonCategoria.innerText = `${c.nombre}`
    getCategoriasBtn.appendChild(botonCategoria);
  })

}
cargarCategorias(todasCategorias);

getCategoriasBtn.addEventListener("click", (e) => {
  // e.target es el elemento exacto que tocaste
  getCategoriasBtn.querySelector(".cat-btn.activo")?.classList.remove("activo");
  const elemento = e.target as HTMLElement;
  if (elemento.classList.contains("cat-btn")) {
    elemento.classList.add("activo");

    const nombreCategoria = elemento.innerText;
    if (nombreCategoria === "Todos los productos") {
      cargarProductos(todosProductos);
      return;
    }

    // filtro los productos recorro sus categoriasy me fijo si alguna de las categorias se llama igual a la categoria que toque
    const filtrados: Product[] = todosProductos.filter(p =>
      //categoria es un array
      p.categorias.some(categoria => categoria.nombre === nombreCategoria)
    );

    cargarProductos(filtrados);
  }

});



inputBuscar.addEventListener("input", () => {
  //console.log(e.target.value);
  const busqueda = inputBuscar.value.toLowerCase()
  //(pokemon) => { ... }
  //Es una arrow function. Por cada elemento del arreglo, JavaScript "toma" ese objeto y lo nombra temporalmente pokemon para poder trabajar con sus propiedades.
  const resultado = todosProductos.filter((producto) => {
    return producto.nombre.toLowerCase().includes(busqueda);

  })
  //se va a llamar la funcion mostrarPokemones por cada letra que escribas
  cargarProductos(resultado);
})



//BOTON AGREGAR AL CARRITO
const agregarCarrito = (producto: Product, container: HTMLButtonElement) => {
  const productoExistente = carrito.find(item => item.producto.id === producto.id);
  if (productoExistente) {
    if (productoExistente.producto.stock > 0) {
      productoExistente.cantidad += 1;
      productoExistente.producto.stock -= 1;
      addProductToCart(carrito);
      if (productoExistente.producto.stock === 0) {
        botonDesactivado(container);
      }
    }
    else {
      botonDesactivado(container);

    }
  }
  else {
    carrito.push({ producto, cantidad: 1 });
    producto.stock -= 1;
    addProductToCart(carrito);
  }
  //estilo del boton al agregar al carrito



}




