function openChart(evt, tagName) {
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
  function linearRegression(y,x){
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
function fetchData(data,valor){
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
            if (index === 0) return; // Skip the header
        var indicadorValue=line.split(',')[1].trim();
        //Se va a seleccionar 
        
        if (!uniqueIndicators.has(indicadorValue)) {
            const option = document.createElement('option');
            option.value = indicadorValue;
            option.text = indicadorValue;
            select.appendChild(option);
            // Add the value to the set
            uniqueIndicators.add(indicadorValue);
        }
        }
        
    });

}
document.getElementById("defaultOpen").click();

B.onChange = function(newValue) {
    console.log("Ultimo estado seleccionado " + newValue);
    chart_nac.data.datasets[0].backgroundColor.fill('rgba(75, 192, 192, 0.2)')
    var sortedEstados=chart_nac.data.labels;
    chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf("Hidalgo")] = 'rgba(75, 192, 192, 1)'
    chart_nac.data.datasets[0].backgroundColor[sortedEstados.indexOf(newValue)]='rgba(75, 192, 192, 1)'
    chart_nac.update();
};
document.addEventListener("DOMContentLoaded", function() {
    let chart;
    /*De aquí a----------------------------------------------------------------- */
    fetch('Datos/Nacional_prueba.csv')
    .then(response => response.text())
    .then(data=> {
        var lines = data.split('\n');
                nac=[]
                lines.forEach((line, index) => {
                    if (index === 0) 
                        names=line.trim();
                    nac.push(line.split(','))  
                });
                var SortedEstados=nac[0].slice(3).map(x=>JSON.parse(x))//sus nombres originales
                var datosEstados=nac[1].slice(3)//datos originales
                const combined_Estados = datosEstados.map((dato_est, index) => ({
                            dato: SortedEstados[index], // Nombre estado
                            value: dato_est // y su valor
                        })).sort((a, b) => b.value-a.value);//orden segun su valor
                SortedEstados = combined_Estados.map(item => item.dato.toString()); // Convertir a cadena
                datosEstados = combined_Estados.map(item => item.value); // datos en orden
                const ctx_nac = document.getElementById('nacional').getContext('2d');
                chart_nac = new Chart(ctx_nac, {
                    type: 'bar',
                    data: {
                        labels: SortedEstados,
                        datasets: [{
                            label: JSON.parse(nac[1]['0']),
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
                chart_nac.data.datasets[0].backgroundColor[SortedEstados.indexOf("Hidalgo")] = 'rgba(75, 192, 192, 1)'//Va a cambiar
    })

    /*Acá, aún no tengo la base----------------------------------------------------------------- */
    $("#tema").change(function () {
        $("#option option[value='default']").remove();
        fetch('Datos/Hidalgo_historico.csv')
        .then(response => response.text())
        .then(data => {
            fetchData(data,$(this).val().toString())
            })
        .catch(error => console.error('Error fetching the CSV file:', error));
    });
    
    $("#indicador").change(function () {
        console.log($(this).val())
        $("#indicador option[value='default']").remove();
        document.getElementById("descripcion_indicador").innerHTML = "Aquí pondría la descripción dle indicador: "+$(this).val();
        fetch('Datos/Hidalgo_historico.csv')
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
            console.log(x_original)
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
            console.log(x_sin_huecos)
            const sortedYears2 = x_sin_huecos.map(item => item.year.toString());
            const sortedDatos2 = x_sin_huecos.map(item => item.value);
            if (chart) {
                // Actualizar la gráfica existente
                chart.data.datasets[1].labels = x_completo;
                chart.data.datasets[0].labels = sortedYears2;
                chart.data.datasets[0].data = sortedDatos2;
                chart.data.datasets[1].data = x_completo.map(function(y) { return x_0+y * p; });
                chart.data.datasets[0].label=$(this).val();
                chart.data.labels=x_completo,
                chart.update();
            } else {
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
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
    });
});
