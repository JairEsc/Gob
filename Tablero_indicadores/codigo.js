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
    document.getElementById(tagName).style.display = "block";
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
document.getElementById("defaultOpen").click();

B.onChange = function(newValue) {
    console.log("Ultimo estado seleccionado " + newValue);
    chart_nac.data.datasets[0].backgroundColor.fill('rgba(75, 192, 192, 0.2)')
    chart_nac.data.datasets[0].backgroundColor[13-1] = 'rgba(75, 192, 192, 1)'
    chart_nac.data.datasets[0].backgroundColor[newValue-1]='rgba(75, 192, 192, 1)'
    chart_nac.update();
};
document.addEventListener("DOMContentLoaded", function() {
    let chart;
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
                const ctx_nac = document.getElementById('nacional').getContext('2d');
                chart_nac = new Chart(ctx_nac, {
                    type: 'bar',
                    data: {
                        labels: nac[0].slice(3).map(x=>JSON.parse(x)),
                        datasets: [{
                            label: JSON.parse(nac[1]['0']),
                            data: nac[1].slice(3),
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
                chart_nac.data.datasets[0].backgroundColor[13-1] = 'rgba(75, 192, 192, 1)'
    })
    
    fetch('Datos/hidalgo_base.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const select = document.getElementById('indicador');
            var uniqueIndicators = new Set();

            lines.forEach((line, index) => {
                if (index === 0) return; // Skip the header
                var indicadorValue=line.split(',')[1].trim();
                if (!uniqueIndicators.has(indicadorValue)) {
                    const option = document.createElement('option');
                    option.value = indicadorValue;
                    option.text = indicadorValue;
                    select.appendChild(option);
        
                    // Add the value to the set
                    uniqueIndicators.add(indicadorValue);
                }
                
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
    $("#indicador").change(function () {
        $("#indicador option[value='default']").remove();
        document.getElementById("descripcion_indicador").innerHTML = "Aquí pondría la descripción dle indicador: "+$(this).val();
        fetch('Datos/hidalgo_base.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            years=[]
            datos=[]
            lines.forEach((line, index) => {
                if (index === 0) return; // Skip the header
                if(line.split(',')[1].trim()==$(this).val()){
                    years.push(line.split(',')[2].trim())
                    datos.push(parseFloat(line.split(',')[3].trim()))
                }
            });
            const combined = years.map((year, index) => ({
                year: parseInt(JSON.parse(year), 10), // Convertir año a número
                value: datos[index]
            })).sort((a, b) => a.year - b.year);

            const sortedYears = combined.map(item => item.year.toString()); // Convertir años de nuevo a string
            const sortedDatos = combined.map(item => item.value);
            const x=combined.map(item => item.year).sort()
            console.log("x"+x)
            console.log("y"+sortedDatos)
            lr=linearRegression(sortedDatos,x)
            x_0=lr['intercept'];
            p=lr['slope'];
            console.log(x.map(function(y) { return x_0+y * p; }))
            if (chart) {
                // Actualizar la gráfica existente
                chart.data.labels = sortedYears;
                chart.data.datasets[0].data = sortedDatos;
                chart.data.datasets[0].label=$(this).val(),
                
                chart.update();
            } else {
                // Crear una nueva gráfica
                const ctx = document.getElementById('historico').getContext('2d');
                chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: years.sort(),
                        datasets: [{
                            label: $(this).val(),
                            data: sortedDatos,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Regresión',
                            data: [x.map(function(y) { return x_0+y * p; })],
                        },]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: false,
                            }
                        },
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
    });
});
