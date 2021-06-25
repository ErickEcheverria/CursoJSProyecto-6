// Variables
let precioBase, valorEuropeo, valorAmericano, valorAsiatico; // Valores para asignar valor y hacer los calculos

const borrarDatosBtn = document.querySelector('#borrarDatos'); // Variable que hace referencia al boton

let datosEmpresa = []; // Arreglo que contendra la informacion de la empresa

// Constructores
function Seguro(marca,year,tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realiza la contizacion con los datos
Seguro.prototype.cotizarSeguro = function() {

    let cantidad;
    const base = precioBase;

    switch(this.marca){
        case'1':
            cantidad = base * valorAmericano;
            break;
        case'2':
            cantidad = base * valorAsiatico;
            break;
        case'3':
            cantidad = base * valorEuropeo;
            break;
        default:
            break;
    }

    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia * 3) * cantidad ) / 100;

    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    }else{
        cantidad *= 1.50;
    }

    return cantidad;

}


function InterfazUsuario(){}

InterfazUsuario.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(), min = max -20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Mostrar alertar en pantalla
InterfazUsuario.prototype.mostrarMensaje = (mensaje,tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }

    div.classList.add('mensaje','mt-10');
    div.textContent = mensaje;

    //Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

InterfazUsuario.prototype.mostrarResultado = (total,seguro) => {

    const resultadoDiv = document.querySelector('#resultado');

    const {marca,year,tipo} = seguro;

    let textoMarca;

    switch(marca){
        case'1':
        textoMarca = 'Americano';
            break;
        case'2':
            textoMarca = 'Asiatico';
            break;
        case'3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }

    // Crear resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
    <p class='header'>Tu Resumen: </p>
    <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca} </span> </p>
    <p class="font-bold">Año: <span class="font-normal"> ${year} </span> </p>
    <p class="font-bold">Tipo: <span class="font-normal"> ${tipo} </span> </p>
    <p class="font-bold"> Total: <span class="font-normal"> $ ${total} </span> </p>
    `;

    // Mostramos el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000);


}
//Instanciando interfaz de usuario
const ui = new InterfazUsuario();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); // llenando listado de años

    datosEmpresa = JSON.parse(localStorage.getItem('datosEmpresa')) || []; // Lee los datos en el LocalStorage
    
    if(datosEmpresa.length == 0){
        cargarDatosEmpresa(); // Si no hay datos, ejecutara la funcion cargarDatosEmpresa
    }else{
        asignarValores(); // Si los hay, ejecuta la funcion para asignar los valores
    }
    
    borrarDatosBtn.addEventListener('click', borrarDatos);
})

function asignarValores(){
    precioBase = datosEmpresa[0].precioBase; // Solamente almacenaremos un arreglo, entonces los datos estarán en la Pos 0
    valorEuropeo = datosEmpresa[0].valorEuropeo;
    valorAsiatico = datosEmpresa[0].valorAsiatico;
    valorAmenericano = datosEmpresa[0].valorAmericano;
}

function cargarDatosEmpresa(){

    precioBase = prompt('Defina un Precio base para los seguros'); // Preguntando Datos al usuario para almacenarlos en las variables
    valorEuropeo = prompt('Defina el % de aumento para los autos Europeos');
    valorAsiatico = prompt('Defina el % de aumento para los autos Asiaticos');
    valorAmenericano = prompt('Defina el % de aumento para los autos Americanos');

    const datosObj ={ // Guarda la informacion en un objeto
        precioBase,
        valorEuropeo,
        valorAsiatico,
        valorAmenericano
    }

    // Añadir al arreglo de taread
    datosEmpresa = [...datosEmpresa, datosObj]; // Guardamos el objeto en el arreglo

    sincronizarStorage(); // Sincronizamos en el Localstorage
}

function sincronizarStorage(){
    localStorage.setItem('datosEmpresa', JSON.stringify(datosEmpresa)); // Convertimos en String y guardamos
}

function borrarDatos(){
    datosEmpresa = []; // Vaciamos el arreglo

    sincronizarStorage();

    location.reload(); // Recargamos la página desde 0
}



eventListeners();
function eventListeners(){
     const formulario = document.querySelector('#cotizar-seguro');
     formulario.addEventListener('submit',cotizarSeguro);
}

function cotizarSeguro(e){
    
    e.preventDefault();

    //Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    //Leer el año seleccionado
    const year = document.querySelector('#year').value;

    //Leer tipo de cobertura seleccionado
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios','error');
        return;
    }

    // Ocultar cotizaciones anteriores
    const resultados = document.querySelector('#resultado div');
    if(resultados != null){
        resultados.remove();
    }

    // Instanciar el seguro
     const seguro = new Seguro(marca,year,tipo);
     const total = seguro.cotizarSeguro();

    // Utilizar el prototype que contizara
    ui.mostrarResultado(total, seguro);
    ui.mostrarMensaje('Cotizando...','exito');

    
}

