const pokedex = document.getElementById('pokedex');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const campoFiltro = document.getElementById('filtro');
const nav = document.getElementById('navegacion');

let offset = 0;
const limit = 20;

const cargarPokemons = async () => {
    pokedex.innerHTML = '<p>Cargando...</p>';
    nav.style.display = 'flex';
    
    try {
        const listaRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const listaData = await listaRes.json();
    
        const promesas = listaData.results.map(p => fetch(p.url).then(res => res.json()));
        const pokemons = await Promise.all(promesas);
    
        pokedex.innerHTML = '';
        
        pokemons.forEach(pokemon => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <p>${pokemon.name}</p>
            `;
            pokedex.appendChild(card);
        });

        prevBtn.disabled = offset === 0;

    } catch(err) {
        pokedex.innerHTML = '<p>Error al cargar los Pokémon.</p>';
    }
}

const buscarPokemon = async () => {
    const busqueda = campoFiltro.value.toLowerCase().trim();

    if (busqueda === '') {
        cargarPokemons();
        return;
    }

    pokedex.innerHTML = '<p>Buscando...</p>';
    nav.style.display = 'none';

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda}`);
        if (!res.ok) {
            throw new Error();
        }
        const pokemon = await res.json();
        
        pokedex.innerHTML = '';
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>${pokemon.name}</p>
        `;
        pokedex.appendChild(card);

    } catch(err) {
        pokedex.innerHTML = `<p>No se encontró el Pokémon "${busqueda}".</p>`;
    }
}

campoFiltro.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarPokemon();
    }
});

prevBtn.addEventListener('click', () => {
    if (offset > 0) {
        offset -= limit;
        cargarPokemons();
    }
});

nextBtn.addEventListener('click', () => {
    offset += limit;
    cargarPokemons();
});

cargarPokemons();