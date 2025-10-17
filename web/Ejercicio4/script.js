document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('btnConsultar');
    const campo = document.getElementById('termino');
    boton.addEventListener('click', consultarDigimon);
    campo.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            consultarDigimon();
        }
    });
});

async function consultarDigimon() {
    const filtro = document.getElementById('filtro').value;
    const valor = document.getElementById('termino').value.trim();
    const lista = document.getElementById('lista');
    const aviso = document.getElementById('aviso');
    lista.innerHTML = '';
    aviso.textContent = '';
    if (!valor) {
        aviso.textContent = 'Debes escribir algo para buscar.';
        return;
    }
    const url = `https://digimon-api.vercel.app/api/digimon/${filtro}/${valor}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('No se encontraron resultados para tu búsqueda.');
        }
        const digimons = await res.json();
        if (digimons.ErrorMsg) {
            throw new Error(digimons.ErrorMsg);
        }

        for (const digi of digimons) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${digi.name}</td>
                <td>${digi.level}</td>

            `;
            lista.appendChild(fila);
        }
    } catch (err) {
        aviso.textContent = `Error: ${err.message}`;
    }
}