const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const modal = document.getElementById("pokemon-modal");
const closeModalButton = document.getElementById("close-modal");

const modalName = document.getElementById("modal-name");
const modalNumber = document.getElementById("modal-number");
const modalImage = document.getElementById("modal-image");
const modalTypes = document.getElementById("modal-types");
const modalStats = document.getElementById("modal-stats");


const maxRecords = 151;
const limit = 10;
let offset = 0;

function openPokemonModal(pokemon) {
    const modalHeader = document.querySelector(".modal-header");
    modalHeader.className = `modal-header ${pokemon.types[0]}`;
    
    modalName.textContent = pokemon.name;
    modalNumber.textContent = `#${pokemon.number}`;
    modalImage.src = pokemon.photo;

    modalTypes.innerHTML = "";
    
    pokemon.types.forEach(type => {
        const span = document.createElement("span");
        span.classList.add("type", type);
        span.innerText = type;
        modalTypes.appendChild(span);
    });
    
    modalStats.innerHTML = "";

    pokemon.stats?.forEach(stat => {
    const li = document.createElement("li");
    li.textContent = `${stat.name}: ${stat.baseStat}`;
    modalStats.appendChild(li);
    });
    
    modal.classList.remove("hidden");
}

closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" data-pokemon-number="${pokemon.number}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                    </ol>

                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
        `).join("");

        pokemonList.innerHTML += newHtml;

        document.querySelectorAll(".pokemon").forEach(card => {
            card.addEventListener("click", () => {
                const pokemonNumber = card.dataset.pokemonNumber;
                fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
                    .then(response => response.json())
                    .then(pokemonDetail => {
                        openPokemonModal({
                            name: pokemonDetail.name,
                            number: pokemonDetail.id,
                            photo: pokemonDetail.sprites.other.dream_world.front_default,
                            types: pokemonDetail.types.map(t => t.type.name),
                            stats: pokemonDetail.stats.map(stat => ({
                                name: stat.stat.name,
                                baseStat: stat.base_stat
                            }))
                        });
                    });
            });
        });
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
    offset += limit;

    const qtdRecordNextPage = offset + limit;

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

