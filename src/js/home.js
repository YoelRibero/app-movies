(async function load() {
	async function getData(url) {
		const response = await fetch(url) 
		const data = await response.json()
		// Evalúo si el conteo de películas es mayor a 0
		if (data.data.movie_count > 0) {
			return data;
			// si hay más de 0 películas se corta
		}
		// si hay 0 películas
		throw new Error('No se encontró ningun resultado');
	}

	// Fetch de usuarios
	async function getUser(url) {
		const response = await fetch(url)
		const data = await response.json()
		return data;
	}

	// Selector home
	const $form = document.getElementById('form')
	// Selector home
	const $home = document.getElementById('home')
	//No tenemos funcition para crear varios atributos a la misma vez en vanilla JS
	/* 
	En jQuery se hace con $('#selector').attr({
		src: 'jdj/kfkfk'
		height: '50px' 
	})
	*/
	// Selector featuring
	const $featuringContainer = document.querySelector('#featuring')
	// Creamos la function
	function setAttributes($element, attributes) {
		// Recorro a el parámetro attributes
		for (const attribute in attributes) {
			$element.setAttribute(attribute, attributes[attribute])
		}
	}

	// Principio url de api
	const BASE_API = 'https://yts.lt/api/v2/'

	// function para crear featuring template literal
	function featuringTemplate(peli) {
		return(
			`
				<div class="featuring">
					<div class="featuring-image">
						<img src="${peli.medium_cover_image}" width="70">
					</div>
					<div class="featuring-content">
						<p class="featuring-title">Película encontrada</p>
						<p class="featuring-album">${peli.title}</p>
					</div>
				</div>
			`
		)
	}


	$form.addEventListener('submit', async (event) => {
		// Quito la acción del evento que viene por default para que la ventana no recargue cada vez que hace submit
		event.preventDefault()
		$home.classList.add('search-active')
		// Creación de loader
		const $loader = document.createElement('img')
		setAttributes($loader, {
			src: 'src/images/loader.gif',
			height: 50,
			width: 50
		})
		$featuringContainer.append($loader)

		// Obteniendo el dato del input del form
		// Al objeto FormData le paso como parámetro el formulario
		const data = new FormData($form)

		// Evaluo el error al buscar una película que no existe con un try catch.
		try{

			const { 
				data: {
					movies: pelis
				}
			} = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);

			const HTMLString = featuringTemplate(pelis[0])

			$featuringContainer.innerHTML = HTMLString

		} catch(error) {
			alert(error.message)
			$loader.remove()
			$home.classList.remove('search-active')
		}

		// Para obtener el valor del input hay que setear el atributo name en html
		// const peli = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)

		// Me meto dentro de un objeto con una varaiable. La idea es hacer lo mismo de arriba pero destructurar el objeto que nos llega desde la api.

		// const { 
		// 	data: {
		// 		movies: pelis
		// 	}
		// } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
		// ingreso al objeto data que dentro de el tiene el array movies, a este le reasigno el nombre pelis y así lo llamo abajo. Ahorra tener que escribir todo completo ya que lo gusrdo en la variable

		// const HTMLString = featuringTemplate(peli.data.movies[0])

		// const HTMLString = featuringTemplate(pelis[0])

		// $featuringContainer.innerHTML = HTMLString
	})
	
	// Creción HTML para películas (Templates Literal)

	function videoItemTemplate(movie, category) {
		// Le paso un atributo data para obtener el click del user
		return(
			`<div class="primaryPlayListItem" data-id="${movie.id}" data-category="${category}">
				<div class="primaryPlaylistItem-image">
					<img src="${movie.medium_cover_image}">
				</div>
				<h4 class="primaryPlaylistItem-title">
					${movie.title}
				</h4>
			</div>`
		)
	}

	// Function que crea template
	function createTemplate(HTMLString) {
		const html = document.implementation.createHTMLDocument()
		html.body.innerHTML = HTMLString
		return html.body.children[0]
	}

	/* GET LIST PELIS RANDOM */

	function templateMovieListRandom(movie) {
		return (
			`
			<li class="myPlaylist-item" data-id="${movie.id}">
              <a href="#">
                <span>
                 	${movie.title}
                </span>
              </a>
            </li>
			`	
		)
	}

	async function cacheExistMovieRandom () {
		const listName = 'movie'
		const cacheList = window.localStorage.getItem(listName)
		if(cacheList) {
			return JSON.parse(cacheList);
		}
		const movieListRandom = await getData(`${BASE_API}list_movies.json?limit=10`)
		const movieRandomData = movieListRandom.data.movies
		window.localStorage.setItem('movie', JSON.stringify(movieRandomData))
		return movieRandomData;
	}

	
	const $playListContainer = document.querySelector('#container-playlist')
	// console.log(movieRandom)

	function renderMovieListRandom(listRandom, container) {
		listRandom.forEach( (movie) => {
			const HTML = templateMovieListRandom(movie)
			const movieRandomHTML = createTemplate(HTML)
			container.append(movieRandomHTML)
			addEventClick(movieRandomHTML)
		})
	} 

	const movieRandom = await cacheExistMovieRandom()
	renderMovieListRandom(movieRandom, $playListContainer)

	/**/

	/* GET USERS LIST */

	function templateUsers(user) {
		// debugger
		return (
			`
			<li class="playlistFriends-item" data-id=${user.id.value}>
	               <img src="${user.picture.thumbnail}" alt="echame la culpa" />
	               <span>
	                 ${user.name.first} ${user.name.last} 
	               </span>
	        </li>
			`
		)
	}

	async function cacheExistUsers() {
		const listName = 'users'
		const cacheList = window.localStorage.getItem(listName)
		if(cacheList) {
			return JSON.parse(cacheList);
		}
		const dataUsers = await getUser('https://randomuser.me/api/?results=10')
		const dataUsersResults = dataUsers.results
		window.localStorage.setItem('users', JSON.stringify(dataUsersResults))
		return dataUsersResults;
	}

	const $usersContainer = document.getElementById('container-users')

	function renderUsers(list, container) {
		list.forEach( (user) => {
			const HTML = templateUsers(user)
			const userHTML = createTemplate(HTML)
			container.append(userHTML)
		})
	}

	const users = await cacheExistUsers();
	renderUsers(users, $usersContainer)

	/**/

	// function addEventClick
	function addEventClick(element) {
		element.addEventListener('click', () => {
			showModal(element)
		})
	}

	// Selectors Movies
	const $actionContainer = document.querySelector('#action')
	const $dramaContainer = document.querySelector('#drama')
	const $animationContainer = document.querySelector('#animation')

	// Itero elementos de cada array
	function renderMovieList(list, $container, category) {
		// Cuando cargan las películas borrar el loader
			$container.children[0].remove()
		// category.data.movies
			list.forEach( (movie) => {
				// debugger
				const HTMLString = videoItemTemplate(movie, category)
				// debugger
				// Creamos el DOM a partir de texto HTML, creamos el html de esta manera. El document nos da una function implementation, nos crea un html de 0 por cada palícula. 
				// const html = document.implementation.createHTMLDocument();
				// console.log(html)
				// a html le agregamos como hijo el HTMLString que creamos arriba
				// html.body.innerHTML = HTMLString
				// Agrego html creado al selector $actionContainer
				// container.append(html.body.children[0])
				const movieElement = createTemplate(HTMLString)
				$container.append(movieElement)

				// Animacion para q cuando aparezcan las películas tenga efecto fadeIn
				const image = movieElement.querySelector('img')
				image.addEventListener('load', (event) => {
					event.srcElement.classList.add('fadeIn')
				})

				addEventClick(movieElement)
		})
	}

	// function que evalúa si el usuario ya tiene datos almacenados en su localStorage o debemos trer esos datos desde la api.

	async function cacheExist(category) {
		const listName = `${category}List`
		const cacheList = window.localStorage.getItem(listName)
		if (cacheList) {
			// Como lo que llega es en formato de texto, con JSON.parse lo parseo a object
			return JSON.parse(cacheList)
		}
		const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`)
		window.localStorage.setItem(listName, JSON.stringify(data))
		return data;
	}

	// Petición
	// const { data: { movies: actionList } } = await getData(`${BASE_API}list_movies.json?genre=action`)
	const actionList = await cacheExist('action')
	// Local storage para guardar las películas después que se cargan. Uso JSON.stringify para convertir el objeto a texto plano para que localStorage lo lea de forma correcta
	// window.localStorage.setItem('actionList', JSON.stringify(actionList))
	// Invocando functions que renderizan templates de películas.
	// Render
	renderMovieList(actionList, $actionContainer, 'action')

	// Petición
	const dramaList = await cacheExist('drama')
	// window.localStorage.setItem('dramaList', JSON.stringify(dramaList))
	// Render
	renderMovieList(dramaList, $dramaContainer, 'drama')

	// Petición
	const animationList = await cacheExist('animation')
	// window.localStorage.setItem('animationList', JSON.stringify(animationList))
	// Render
	renderMovieList(animationList, $animationContainer, 'animation')
	
	// Selectors Modals
	const $modal = document.getElementById('modal')
	const $overlay = document.getElementById('overlay')
	const $hideModal = document.getElementById('hide-modal')
	const $modalTitle = $modal.querySelector('h1')
	const $modalImage = $modal.querySelector('img')
	const $modalDescription = $modal.querySelector('p')

	// function que filtra por categorías
	function findById(list, id) {
		return list.find( movie => movie.id === parseInt(id, 10))
	}

	// function para filtrar peliculas
	function findMovie(id, category) {
		// switch para cada caso
		switch (category) {
			case 'action' : {
				return findById(actionList, id)
			}
			case 'drama' : {
				return findById(dramaList, id)
			}
			case 'animation': {
				return findById(animationList, id)
			}
			default: {
				return findById(movieRandom, id)
			}
		}
		// El método find() devuelve el valor del primer elemento del array que cumple la función de prueba proporcionada. En cualquier otro caso se devuelve undefined.
		// actionList.find( (movie) => {
		// 	debugger
		// 	// Parseo para que el id sea un número entero
		// 	return movie.id === parseInt(id, 10)
		// })
		// En una arrow function si solo tengo un return y un parámetro la reestructuro de esta manera.
		// actionList.find( movie => movie.id === parseInt(id, 10))
	}

	// function para abrir el modal
	function showModal($element, ev) {
		$overlay.classList.add('active')
		$modal.style.animation = 'modalIn .8s forwards'
		// Accedo al data del elemento
		const id = $element.dataset.id
		const category = $element.dataset.category
		// Llamado a function que filtra las películas
		const data = findMovie(id, category)
		// Agrego cada atributo del objeto a las partes del modal
		$modalTitle.textContent = data.title
		$modalImage.setAttribute('src', data.medium_cover_image)
		$modalDescription.textContent = data.description_full
	}

	$hideModal.addEventListener('click', hideModal)
	$overlay.addEventListener('click', hideModal)

	function hideModal() {
		$modalOutAnimation = 'modalOut .8s forwards'
		$overlay.classList.remove('active')
		$modal.style.animation = $modalOutAnimation
		$modalUser.style.animation = $modalOutAnimation
	}

	// Claear LocalStorage
	const $btnClear = document.getElementById('btn-clear')
	$btnClear.addEventListener('click', clearCache)

	function clearCache() {
		window.localStorage.clear()
	}

	// GET UserName

	const $formUser = document.getElementById('form-user')
	const $btnSesion = document.getElementById('btn-sesion')
	const $inputName = document.getElementById('input-name')
	const $nameUser = document.getElementById('name-user')
	const $modalUser = document.getElementById('modal-user')
	const $loginBox = document.getElementById('login-box')

	function evalueIf(list) {
		if(list) {
			$nameUser.innerHTML = `Hola ${list}`
			$inputName.classList.add('hiden')
			const $titleModal = $modalUser.querySelector('h1')
			$titleModal.innerHTML = '¿Quieres cerrar tu sesión?'
			$btnSesion.innerHTML = 'Cerrar Sesión'
			$btnSesion.addEventListener('click', removeLocalName)
		}
	}

	function evalueUserName() {
		const userList = window.localStorage.getItem('userName')
		evalueIf(userList)
	}

	function removeLocalName() {
		localStorage.removeItem('userName')
	}

	function userNameValue(ev) {
		const userName = $inputName.value
		window.localStorage.setItem('userName', userName)
		$nameUser.innerHTML = `Hola ${userName}`
		hideModal()
	}

	$loginBox.addEventListener('click', () => {
		$overlay.classList.add('active')
		$modalUser.style.animation = 'modalIn .8s forwards'
	})

	$btnSesion.addEventListener('click', userNameValue)
	evalueUserName()

})()