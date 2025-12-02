
function playMusic() {
  const music = document.getElementById("bgMusic");
  const btn = document.getElementById("playMusicBtn");

  music.play()
    .then(() => {
      btn.style.display = "none"; 
    })
    .catch(err => {
      console.log("Music blocked:", err);
    });
}

async function loadPokemonList() {
  const listContainer = document.getElementById("pokemon-list-container");

  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
    const data = await res.json();
    const pokemons = data.results.map(p => p.name);
    pokemons.sort(); 

    listContainer.innerHTML = pokemons
      .map(name => `<span class="pokemon-name" onclick="searchPokemonByClick('${name}')">${name}</span>`)
      .join(" ");

  } catch (err) {
    listContainer.innerHTML = "Failed to load Pokémon list.";
    console.error(err);
  }
}

async function searchPokemon(event) {
  event.preventDefault();
  const query = document.getElementById("searchInput").value.toLowerCase();
  searchPokemonByClick(query);
}

async function searchPokemonByClick(query) {
  const resultContainer = document.getElementById("result-container");
  const listContainer = document.getElementById("pokemon-list-container");

  listContainer.style.display = "none";

  resultContainer.innerHTML = `
    <div class="poke-card">
      <button class="exit-btn" onclick="closeCard()">Exit</button>
      <div class="loader"></div>
      <div style="text-align:center; margin-top:10px;">Loading Pokémon data...</div>
    </div>
  `;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (!res.ok) {
      resultContainer.innerHTML = `<div class="poke-card"><button class="exit-btn" onclick="closeCard()">Exit</button>No Pokémon found.</div>`;
      return;
    }

    const pokemon = await res.json();

    const typesHTML = pokemon.types
      .map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
      .join(" ");

    const movesHTML = pokemon.moves.slice(0, 6).map(m => 
      `<span class="move-chip">${m.move.name}</span>`
    ).join(" ");

    const artwork = pokemon.sprites.other["official-artwork"].front_default;

    resultContainer.innerHTML = `
      <div class="poke-card">
        <button class="exit-btn" onclick="closeCard()">Exit</button>
        <img src="${artwork}" alt="${pokemon.name}">
        <div class="card-title">${pokemon.name.toUpperCase()}</div>
        <div class="card-section"><b>ID:</b> ${pokemon.id}</div>
        <div class="card-section"><b>Type:</b> <br>${typesHTML}</div>
        <div class="card-section"><b>Moves:</b></div>
        <div class="move-container">${movesHTML}</div>
      </div>
    `;
  } catch (err) {
    resultContainer.innerHTML = `<div class="poke-card"><button class="exit-btn" onclick="closeCard()">Exit</button>Error loading data.</div>`;
    console.error(err);
  }
}

function closeCard() {
  document.getElementById("result-container").innerHTML = "";
  document.getElementById("pokemon-list-container").style.display = "grid";
}

window.addEventListener("DOMContentLoaded", loadPokemonList);