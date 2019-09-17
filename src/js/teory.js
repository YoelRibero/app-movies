/* 
Dentro de JavaScript tenemos tres formas de declarar una variable las cuales son: var, const y let.

var era la forma en que se declaraban las variables hasta ECMAScript 5.
const y let es la forma en que se declaran las variables a partir de ECMAScript 6, const sirve para declarar variables que nunca van a ser modificadas y en -
cambio let son variables que pueden ser modificadas.
Las funciones son piezas de código que puedes reutilizar y se declaran con la palabra function.
*/

/*
Las promesas sirven para manejar nuestro código asíncrono.

“Una Promesa es un objeto que representa la terminación o el fracaso eventual de una operación asíncrona”, o dicho de forma más cotidiana, se va a mandar una función para ver si falla o se ejecuta con éxito.

Al crear una Promesa debemos pasarle por argumento la función que vamos a ejecutar de forma asíncrona, dicha función va a recibir dos parámetros para evaluar si se ejecuto bien la función o si fallo.

Nuestra promesa va a tener dos métodos para saber si todo salió bien o fallo. El método then se encarga cuando la promesa se cumplió exitosamente, mientras que el método catch se encarga cuando la promesa falla.

Dentro de JavaScript tenemos dos funciones para ejecutar una función después de algún tiempo, estas funciones son:

• setInterval: ejecutara una función cada x tiempo.
• setTimeout: ejecutara una función después de x tiempo.

Si queremos resolver varias promesas a la misma vez, Promise cuenta con un método llamado all que recibe un array de promesas como parámetro. Este método se termina cuando todas las promesas del array se terminan de ejecutar. Si una de las promesas falla entonces el método all saltara un error mandándote al método catch.

Promise también cuenta con el método race que te regresa los resultados de la promesa que termine primero.
*/

const getUser = new Promise(function(todoBien, todoMal) {
	// Simulamos llamada a api
	setTimeout(function () {
		// Luego de 3s
		// todoBien()
		todoMal('Se acabó el tiempo')
	}, 3000)
	
})

getUser
	.then(function() { // -> Promesa salió bien
		console.log('Todo está bien en la vida')
	})
	.catch(function(message) { // -> Promesa sale mal.
		console.log(message)
	})

Promise.all([ // Pasamos varias promesas al array
	getUser,
	getUser
])
.then()
.catch(function(message) {
	console.log(message)
})

// Promise.race() // Nos devuelve el then de la promesa que se ejecute primero.

/*
Una característica muy solicitada en cualquier sitio dinámico es solicitar datos a un servidor, denominado API. Para esto normalmente se utiliza Ajax.

Ajax recibe dos parámetros los cuales son la url de la API y un objeto donde pondrás la configuración que se usara para realizar la petición. En la configuración se añaden dos funciones para manejar cuando la petición se realizo correctamente y cuando falla.

JavaScript internamente cuenta con una función llamada fetch que también realiza peticiones a una API. Al igual que Ajax necesita dos parámetros, una url y una configuración, pero si solo le mandas la url fetch usará una configuración por defecto donde el método HTTP será GET.
fetch te regresa una promesa, esa promesa al resolverse te da los datos de respuesta y tiene un método llamado json que te regresa otra promesa con los datos en formato JSON.

Las promesas resuelven el problema del Callback Hell haciendo que una promesa pueda devolver otra promesa y en lugar de ser anidadas como los callback, estas promesas son encadenadas.
*/

// Petición al servidor con jQuery
$.ajax('https://randomuser.me/api/', {
	method: 'GET', // Si traigo datos de un servidor, utilizo GET, Si mando datos utilizo POST
	success: function (data) { // La llama cuando todo sale bien
		console.log(data)
	}
	error: function(error) { // Para cuando hay error
		console.log(error)
	}
})

//Petición al server con vanilla JavaScript
fetch('https://randomuser.me/api/') // Devuelve una promesa
	.then(function(response) {
		console.log(response)
		return response.json()
	})
	.then(function (user) {
		console.log(`Hola mi nombre es ${user.results[0].name.first} y vengo desde la api de usuarios random`)
	})
	.catch(function() {
		console.log('Algo falló')
	}); // Para terminar una promesa le damos ;

/*

Una función asíncrona va a ser como una función normal, pero poniendo código asíncrono de forma que sea más fácil de leer de forma síncrona.

Para declarar una función asíncrona se usa la palabra reservada async, luego de eso declaras tu función de forma normal. Dentro de una función asíncrona cuentas con otra palabra reservada llamada await, lo que hará esta palabra es indicar que se debe esperar a que termine de ejecutarse ese fragmento de código antes de continuar.

Vamos a realizar peticiones con fetch a la API de yts para pedirle películas según su categoría y mostrarlas dentro de PlatziVideo. Sin el uso de funciones asíncronas para cada fetch tendríamos que usar los métodos then y catch, en cambio gracias a async/await solo debemos escribir la palabra await antes de cada promesa.

*/

(async function load() {
	// await
	// action
	// terror
	// animation
	async function getData(url) {
		const response = await fetch(url) // Pauso mi aplicación hasta que esto se termine de ejecutar y luego sigo con el código que sigue debajo.
		const data = await response.json()
		return data;
	}
	// Obtener lista con async-await
	const actionList = await getData('https://yts.lt/api/v2/list_movies.json?genre=action')
	const dramaList = await getData('https://yts.lt/api/v2/list_movies.json?genre=drama')
	const animationList = await getData('https://yts.lt/api/v2/list_movies.json?genre=animation')

	console.log('actionList', actionList)
	console.log('dramaList', dramaList)
	console.log('animationList', animationList)
	// Obtener lista con promesas
	let terrorList;
	getData('https://yts.lt/api/v2/list_movies.json?genre=action')
		.then( function(data) {
			console.log('terrorList', data);
			terrorList = data;
		})

})() // De esta manera hacemos que una función se auto-ejecute

/*

Un selector nos sirve para poder manipular un objeto del DOM, puedes buscar dicho objeto ya sea por su id, clase, atributo, etc.

Para PlatziVideo necesitamos un selector de un contenedor para ponerle dentro la lista de películas.

En jQuery hacemos un selector de la siguiente forma:

const $home = $('.home');

Por convención una variable que este represente un objeto del DOM lleva el signo $, esto es para tener claro que estamos manipulando un objeto del DOM y no algún tipo de información o dato.

Dentro de JavaScript existen distintas funciones para hacer selectores, entre ellas se encuentra:

• getElementById: recibe como parámetro el id del objeto del DOM que estás buscando. Te regresa un solo objeto.
• getElementsByTagName: recibe como parámetro el tag que estas buscando y te regresa una colección html de los elementos que tengan ese tag.
• getElementsByClassName: recibe como parámetro la clase y te regresa una colección html de los elementos que tengan esa clase.
• querySelector: va a buscar el primer elemento que coincida con el selector que le pases como parámetro.
• querySelectorAll: va a buscar todos los elementos que coincidan con el selector que le pases como parámetro.

*/

(async function load() {
	async function getData(url) {
		const response = await fetch(url) 
		const data = await response.json()
		return data;
	}
	const actionList = await getData('https://yts.lt/api/v2/list_movies.json?genre=action')
	const dramaList = await getData('https://yts.lt/api/v2/list_movies.json?genre=drama')
	const animationList = await getData('https://yts.lt/api/v2/list_movies.json?genre=animation')

	console.log('actionList', actionList)
	console.log('dramaList', dramaList)
	console.log('animationList', animationList)

	// Selector en jQuery
	const $home = $('.home .list #item') // -> Busco el #item que está dentro de .list que está dentro de .home
	
	// Selector en JavaScript
	const $home = document.getElementById('modal')
	const $home = document.querySelector('.modal') // Trae el primer elemento que coincide con lo que le pasamos

})()

/*
Dentro de jQuery, la creación de un template seria con un texto base y si nuestro texto cuenta con distintas líneas más aparte tuviera valores dinámicos se vería de la siguiente forma:
*/

"<div class=”container”>" +
    "<p id="+ id +">Hola Mundo<p>" +
"<div>"

/*
Desde ECMAScript 6 contamos con una nueva característica llamada template literals que se representan con las comillas invertidas ``, el ejemplo anterior pasaría a verse de esta forma:
*/

`<div class=”container”>
    <p id=${id}>Hola Mundo<p>
<div>`

/*
Eventos
Toda aplicación web necesita lidiar con interacciones del usuario, desde un click hasta arrastrar algún elemento, estas interacciones son escuchadas por el navegador mediante algo llamado eventos. Existen muchos tipos de eventos, el más común es el evento de click.
En esta clase vamos a trabajar con el evento click y submit.
Para que un elemento HTML pueda escuchar algún evento debemos usar el método addEventListener. Este método recibe dos parámetros, el nombre del evento que va a escuchar y la función que se va a ejecutar al momento de que se accione el evento.
La página se recarga al momento de ejecutarse el evento submit, para evitar esto debemos quitarle la acción por defecto que viene en submit usando el método event.preventDefault().

*/

/*
Clases y estilos
Dentro de cada elemento tenemos un método llamado classList, con este podemos ver las clases que tiene nuestro elemento y además llamar a otros métodos para añadir, borrar o hacer toggle a alguna clase.
De igual forma podemos acceder a todas las propiedades de CSS algún elemento mediante element.style.

*/

/*

Creación de elementos y asignación de atributos

Vamos a crear un elemento HTML sin usar un template string. Para crear el elemento desde cero vamos a usar el método document.createElement, este recibe como parámetro la etiqueta html del elemento que se quiere crear, no funciona mandándole el template string.
Para añadirle un atributo al elemento que acabamos de crear haremos uso del método setAttribute. Este recibe dos parámetros, uno indicando el nombre del atributo que vamos a añadir y el segundo parámetro indicando el valor de dicho atributo.
Vamos a crear una función para poder añadir múltiples atributos a un solo elemento.

*/

/*
LocalStorage

La propiedad de sólo lectura localStorage te permite acceder al objeto local Storage; los datos persisten almacenados entre de las diferentes sesiones de navegación. localStorage es similar a sessionStorage. La única diferencia es que, mientras los datos almacenados en localStorage no tienen fecha de expiración, los datos almacenados en sessionStorage son eliminados cuando finaliza la sesion de navegación - lo cual ocurre cuando se cierra la página.

Con sessionStorage los datos persisten sólo en la ventana/tab que los creó, mientras que con localStorage los datos persisten entre ventanas/tabs con el mismo origen.

Debe tenerse en cuenta que los datos almacenados tanto en localStorage como en sessionStorage son específicos del protocolo de la página.

Las claves y los valores son siempre cadenas de texto (ten en cuenta que, al igual que con los objetos, las claves de enteros se convertirán automáticamente en cadenas de texto).

*/