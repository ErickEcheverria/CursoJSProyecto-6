// Constructores
function Seguro(marca,year,tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realiza la contizacion con los datos
Seguro.prototype.cotizarSeguro = function() {

    let cantidad;
    const base = 2000;

    switch(this.marca){
        case'1':
            cantidad = base * 1.15;
            break;
        case'2':
            cantidad = base * 1.05;
            break;
        case'3':
            cantidad = base * 1.35;
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
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca} </span></p>
        <p class="font-bold">Año: <span class="font-normal">${year} </span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo} </span></p>
        <p class="font-bold">Total <span class="font-normal">$ ${total} </span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    

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
})

eventListeners();
function eventListeners(){
     const formulario = document.querySelector('#cotizar-seguro');
     formulario.addEventListener('submit',cotizarSeguro);
}

function cotizarSeguro(e){
    
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

    ui.mostrarMensaje('Cotizando...','exito');

    // Ocultar cotizaciones anteriores
    const resultado = document.querySelector('#resultado div');
    if(resultado != null){
        resultado.remove();
    }

    // Instanciar el seguro
     const seguro = new Seguro(marca,year,tipo);
     const total = seguro.cotizarSeguro();
    

    // Utilizar el prototype que contizara
    ui.mostrarResultado(total, seguro);
}