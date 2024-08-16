function openChart(evt, tagName) {//funcion para activar una de las gráficas según la elección.
    // Declare all variables
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tagName).style.display = "flex";
    evt.currentTarget.className += " active";
    window.dispatchEvent(new Event("resize"));
}
  function linearRegression(y,x){//Hace regresión lineal dados y,x
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;
    for (var i = 0; i < y.length; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    } 
    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
    return lr;
}
function fetchData(data,valor){//Dado un conjunto de datos y una elección de tema, rellena las posibles opciones del indicador.
    const lines = data.split('\n');
    const select = document.getElementById('indicador');
    $("#indicador").empty();
    var uniqueIndicators = new Set();
    var flag=0;
    const option = document.createElement('option');
    option.value = "default";
    option.text = "Seleccione uno";
    select.appendChild(option);
    uniqueIndicators.add("Seleccione uno");
    lines.forEach((line, index) => {
        if(line.split(',')[0].trim()==valor){
            flag=1
            if (index === 0) return; 
        var indicadorValue=line.split(',')[1].trim();
        //Se va a seleccionar 
        
        if (!uniqueIndicators.has(indicadorValue)) {
            const option = document.createElement('option');
            option.value = indicadorValue;
            option.text = indicadorValue;
            select.appendChild(option);
            uniqueIndicators.add(indicadorValue);
        }
        }
    });
}

document.getElementById("defaultOpen").click();//El histórico es la gráfica por default.

document.addEventListener("DOMContentLoaded", function() {//Inicia el procesamiento una vez que está cargada la página.
    

    /*De aquí a----------------------------------------------------------------- */
    /*Tengo otra de prueba. Lo acomodaré a esa. */
    
    /*Acá, aún no tengo la base----------------------------------------------------------------- */
    $("#tema").change(function () {//De manera dinámica, cada vez que se cambia el valor de "tema", hace lo siguiente:
        $("#option option[value='default']").remove();
        fetch('Datos/Hidalgo_historico.csv')//otro fetch. i.e. descarga y luego...
        .then(response => response.text())
        .then(data => {
            fetchData(data,$(this).val().toString());
            })
        .catch(error => console.error('Error fetching the CSV file:', error));
    });
    $("#indicador").change(function () {//cuando cambia el valor del indicador:
        //aquí debe ir el fetch del nacional
        //chart_nac.destroy();
        //Prueba: Que cambie los valores de CVEGEO del mapa de mexico:
        console.log("Indicador seleccionado: "+$(this).val())
        function updateJsonData() {
            // Disparar un evento personalizado cuando se actualiza el JSON
            const event = new CustomEvent('jsonDataUpdated', { });
            window.dispatchEvent(event);
        }
        
        fetch('Datos/Nacional.csv')//Lo primero que hace es descargar los datos
    .then(response => response.text())//después, lo convierte a texto
    .then(data=> {//después, hará lo siguiente:
        var lines = data.split('\n');
                nac=[]
                //console.log($(this).val())
                
                lines.map(line => {
                    
                    if(line.split(",")[1].replace(/^"|"$/g, '')===$(this).val().normalize() || line.split(",")[0].replace(/^"|"$/g, '')=='Tema'){
                        let values = [];
                        let current = '';
                        let inQuotes = false;
                        
                        for (let char of line) {
                            if (char === '"') {
                                inQuotes = !inQuotes; // Cambia el estado si estás dentro de comillas
                            } else if (char === ',' && !inQuotes) {
                                values.push(current.trim());
                                current = '';
                            } else {
                                current += char;
                            }
                        }
                        values.push(current.trim()); // Empuja el último valor
                        nac.push(values)
                    }
                });
                var OriginalEstados=nac[0].slice(4).map(x=>x)//sus nombres originales
                var datosEstados=nac[1].slice(4)//datos originales
                
                ///Falta hacer algo con los NA. Después, podría 
                const combined_Estados = datosEstados.map((dato_est, index) => ({//ordenados por valor de indicador
                            dato: OriginalEstados[index], // Nombre estado
                            value: dato_est=='NA'? null:dato_est, // y su valor
                        }))//orden segun su valor
                console.log("Orden original:")
                console.log(combined_Estados)
                const combined_Estados_ordenados=[...combined_Estados]
                combined_Estados_ordenados.sort((a, b) => b.value - a.value);
                SortedEstados = combined_Estados_ordenados.map(item => item.dato.toString()); // Convertir a cadena
                indexedEstados=OriginalEstados.map(item => SortedEstados.indexOf(item.toString())+1)//indices de los estados según su posición respecto al indicador
                
                mexico.features.forEach((feature, index) => {
                    feature.properties.CVEGEO =33- indexedEstados[index].toString().padStart(2, '0');//CVEGEO es su posición a novel nacional
                });
                datosEstados = combined_Estados_ordenados.map(item => item.value); 
                
                // datos en orden
                /*if(chart_nac){
                    chart_nac.data.datasets[0].labels = SortedEstados;
                    chart_nac.data.datasets[0].data = datosEstados;
                    chart_nac.data.datasets[0].label=$(this).val();
                    chart_nac.update();
                }
                else{*/
                if (typeof chart_nac != "undefined") {
                    chart_nac.destroy()
                 }
                const ctx_nac = document.getElementById('nacional').getContext('2d');//inicio a crear la gráfica
                    chart_nac = new Chart(ctx_nac, {
                        type: 'bar',
                        data: {
                            labels: SortedEstados,
                            datasets: [{
                                label: $(this).val(),
                                data: datosEstados,
                                backgroundColor: nac[1].slice(3).fill('rgba(75, 192, 192, 0.2)'),
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: false,
                                }
                            },
                        }
                    });
                    chart_nac.data.datasets[0].backgroundColor[SortedEstados.indexOf("Hidalgo")] = 'rgba(75, 192, 192, 1)'//Ilumino a Hidalgo
                /*}*/
                updateJsonData();
    })
        //console.log($(this).val())
        $("#indicador option[value='default']").remove();
        document.getElementById("descripcion_indicador").innerHTML = "Aquí pondría la descripción dle indicador: "+$(this).val();
        fetch('Datos/Hidalgo_historico.csv')//Aquí descarga los datos del historico y crea las gráficas
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            years=[]
            datos=[]
            lines.forEach((line, index) => {
                if (index === 0) return; 
                if(line.split(',')[1].trim()==$(this).val()){
                    years.push(line.split(',')[2].trim())
                    datos.push(parseFloat(line.split(',')[3].trim()))
                }
            });
            const combined = years.map((year, index) => ({
                year: parseInt(JSON.parse(year), 10), 
                value: datos[index]
            })).sort((a, b) => a.year - b.year);

            const sortedYears = combined.map(item => item.year.toString());
            const sortedDatos = combined.map(item => item.value);
            //combined es un json, pero .year podria tener huecos.

            var x_original=combined.map(item => item.year).sort()
            //console.log(x_original)
            const lr=linearRegression(sortedDatos,x_original)
            const x_0=lr['intercept'];
            const p=lr['slope'];
            x_original.push(x_original[x_original.length-1]+1)
            const x_completo=Array(x_original[x_original.length-1]-x_original[0]+1).fill().map((element, index) => index + x_original[0])
            function completeYearRange(data) {
                const startYear = Math.min(...data.map(item => item.year));
                const endYear = Math.max(...data.map(item => item.year));
                
                const completeData = [];
                
                for (let year = startYear; year <= endYear; year++) {
                  const foundItem = data.find(item => item.year === year);
                  
                  if (foundItem) {
                    completeData.push(foundItem);
                  } else {
                    completeData.push({year: year, value: null});
                  }
                }
                
                return completeData;
              }
            const x_sin_huecos=completeYearRange(combined)
            //console.log(x_sin_huecos)
            const sortedYears2 = x_sin_huecos.map(item => item.year.toString());
            const sortedDatos2 = x_sin_huecos.map(item => item.value);
            if (typeof chart != "undefined") {
                chart.destroy()
             } 

            // Crear una nueva gráfica
            const ctx = document.getElementById('historico').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels:x_completo,
                    datasets: [{
                        label: $(this).val(),
                        data: sortedDatos2,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        labels: sortedYears2,
                        spanGaps: true
                    },
                    {
                        label: 'Regresión',
                        data: x_completo.map(function(y) { return x_0+y * p; }),
                        labels: x_completo,
                    },]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {chartArea: {
                        backgroundColor: 'rgba(240, 240, 240, 1)' // Cambia este color a lo que desees
                    }},
                    scales: {
                        y: {
                            beginAtZero: false,
                        }
                    },
                },
                /*plugins: [{
                    id: 'custom_canvas_background_color',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        ctx.save();
                        ctx.globalCompositeOperation = 'destination-over';
                        ctx.fillStyle = '#d4c2a3'; // Cambia a tu color de fondo deseado
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();
                    }
                }]*/
            });
        }
    
    ).catch(error => console.error('Error fetching the CSV file:', error));
    });
});
B.onChange = function(newValue) {//Utiliza una variable "global" que se usa en el script del mapa de méxico.
    console.log("Ultimo estado seleccionado " + newValue);
    chart_nac.data.datasets[0].backgroundColor.fill('rgba(75, 192, 192, 0.2)')
    var sortedEstados=chart_nac.data.labels;
    chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf("Hidalgo")] = 'rgba(75, 192, 192, 1)'
    chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf(newValue)]='rgba(75, 192, 192, 1)'
    chart_nac.update();
};

