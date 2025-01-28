const urlAPI = "https://www.el-tiempo.net/api/json/v2/";
const h1 = document.getElementById("cabecera2");
const p1 = document.getElementById("text1");
const p2 = document.getElementById("text2");
const wait = document.getElementById("wait");
const selectProvincias = document.getElementById("provincias");
const selectMunicipios = document.getElementById("municipios");
let idProv = null;
let idMun = null;

// Carga la página de inicio
fetch(urlAPI + "home")
  .then((res) => res.json())
  .then((home) => {
    showHome(home);
  })
  .catch((error) => {
    console.error("Error al obtener datos de la página de inicio:", error);
    wait.textContent = "Hubo un problema al cargar la información de la página de inicio. Inténtalo de nuevo más tarde.";
  });

function showHome(home) {
  const decoder = new TextDecoder("utf-8");
  h1.textContent = "El Tiempo";
  p1.innerHTML = "";
  p2.innerHTML = "";
  home.today.p.forEach((texto) => {
    const decodedText = decoder.decode(new Uint8Array(texto.split("").map((char) => char.charCodeAt(0))));
    p1.innerHTML += decodedText.replace(/\n/g, "<br>");
  });
  home.tomorrow.p.forEach((texto) => {
    const decodedText = decoder.decode(new Uint8Array(texto.split("").map((char) => char.charCodeAt(0))));
    p2.innerHTML += decodedText.replace(/\n/g, "<br>");
  });
}

// Carga las provincias
fetch(urlAPI + "provincias")
  .then((res) => res.json())
  .then((provincia) => {
    showProv(provincia);
  })
  .catch((error) => {
    console.error("Error al obtener datos de las provincias:", error);
    wait.textContent = "Hubo un problema al cargar la lista de provincias. Inténtalo de nuevo más tarde.";
  });

function showProv(provincia) {
  provincia.provincias.forEach((prov) => {
    const option = document.createElement("option");
    option.textContent = prov.NOMBRE_PROVINCIA;
    option.id = prov.CODPROV;
    selectProvincias.append(option);
  });
}

// Evento para cuando se selecciona una provincia
selectProvincias.addEventListener("change", (e) => {
  wait.textContent = "Cargando...";
  idProv = e.target.options[e.target.selectedIndex].id;

  fetch(urlAPI + "provincias/" + idProv)
    .then((res) => res.json())
    .then((infoProv) => {
      showInfoProv(infoProv);
    })
    .catch((error) => {
      console.error("Error al obtener la información de la provincia:", error);
      wait.textContent = "Hubo un problema al cargar la información de la provincia. Inténtalo de nuevo más tarde.";
    });

  fetch(urlAPI + "provincias/" + idProv + "/municipios")
    .then((res) => res.json())
    .then((mun) => {
      showMun(mun);
    })
    .catch((error) => {
      console.error("Error al obtener la lista de municipios:", error);
      wait.textContent = "Hubo un problema al cargar la lista de municipios. Inténtalo de nuevo más tarde.";
    });
});

function showInfoProv(infoProv) {
  const decoder = new TextDecoder("utf-8");
  h1.textContent = infoProv.title;
  p1.innerHTML = decoder.decode(new Uint8Array(infoProv.today.p.split("").map((char) => char.charCodeAt(0)))).replace(/\n/g, "<br>");
  p2.innerHTML = decoder.decode(new Uint8Array(infoProv.tomorrow.p.split("").map((char) => char.charCodeAt(0)))).replace(/\n/g, "<br>");
  wait.textContent = "";
}

function showMun(mun) {
  selectMunicipios.innerHTML = `<option value="" disabled selected>Elige un municipio</option>`;
  mun.municipios.forEach((muni) => {
    const option = document.createElement("option");
    option.textContent = muni.NOMBRE;
    option.id = muni.CODIGOINE.substring(0, 5);
    selectMunicipios.append(option);
  });
}

// Evento para cuando se selecciona un municipio
selectMunicipios.addEventListener("change", (e) => {
  wait.textContent = "Cargando...";
  idMun = e.target.options[e.target.selectedIndex].id;

  fetch(urlAPI + "provincias/" + idProv + "/municipios/" + idMun)
    .then((res) => res.json())
    .then((infoMun) => {
      showInfoMun(infoMun);
    })
    .catch((error) => {
      console.error("Error al obtener la información del municipio:", error);
      wait.textContent = "Hubo un problema al cargar la información del municipio. Inténtalo de nuevo más tarde.";
    });
});

function showInfoMun(infoMun) {
  h1.textContent = infoMun.municipio.NOMBRE;
  const decoder = new TextDecoder("utf-8");

  p1.innerHTML = 
      `${infoMun.stateSky.description} ${infoMun.temperatura_actual}ºC (max: ${infoMun.temperaturas.max}ºC | min: ${infoMun.temperaturas.min}ºC)`
       

  p2.innerHTML = 
      `(max: ${infoMun.proximos_dias[0].temperatura.maxima}ºC | min: ${infoMun.proximos_dias[0].temperatura.minima}ºC)`
      
  
  wait.textContent = "";
}
