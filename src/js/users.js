(async function loadUsers() {

	async function getUser(url) {
		const response = await fetch(url)
		const data = await response.json()
		return data;
	}

	function templateUsers(user) {
		return (
			`
			<li class="playlistFriends-item">
	             <a href="#">
	               <img src="${user.picture.thumbnail}" alt="echame la culpa" />
	               <span>
	                 ${user.name.first} ${user.name.last} 
	               </span>
	             </a>
	           </li>
			`
		)
	}

	function createTemplate(HTMLString) {
		const html = document.implementation.createHTMLDocument()
		html.body.innerHTML = HTMLString
		return html.body.children[0]
	}

	const $usersContainer = document.getElementById('container-users')
	const data = await getUser('https://randomuser.me/api/?results=10')
	const dataResults = data.results

	function renderUsers(list, container) {
		list.forEach( (user) => {
			const HTML = templateUsers(user)
			const userHTML = createTemplate(HTML)
			container.append(userHTML)
		})
	}

	renderUsers(dataResults, $usersContainer)
	
})()