# Árbol de links. SIGEH
## Principales proyectos  
![Imagen dle SIGEH](Otros_archivos/imagenes/sigeh.png)


### Mapa Web Emisiones de Gases
Aquí iría una explicación de los tipos de gases o lo que podríamos encontrar en el mapa
[Emisiones de Gases](http://sigeh.hidalgo.gob.mx/pags/semarnath/)  

| Proyecto      | Vista previa                                 | Descripción |Enlace |
|--------------|---------------------------------------------|--------------------|--------|
| **Proyecto 1** | <img src="Otros_archivos/imagenes/Captura_1.JPG" width="300"> | Descripción A|[🔗 Ver más](https://ejemplo.com/proyecto1) |
| **Proyecto 2** | <img src="Otros_archivos/imagenes/Captura_2.JPG" width="300"> | Descripción A|[🔗 Ver más](https://ejemplo.com/proyecto2) |
<div align='center'>
  <table width="100%">
    <tr>
      <th width="10%">Proyecto</th>
      <th width="40%">Vista previa</th>
      <th width="40%">Descripción</th>
      <th width="10%">Enlace</th>
    </tr>
    <tr>
      <td><b>Proyecto 1</b></td>
      <td><img src="Otros_archivos/imagenes/Captura_1.JPG" width="600"></td>
      <td>
         <span id="desc1-short">En un lugar de la Mancha, de cuyo nombre... <a href="#" onclick="toggleText('desc1'); return false;">Ver más</a></span>
      <span id="desc1-full" style="display:none;">En un lugar de la Mancha2, de cuyo nombre no quiero acordarme3, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor4. Una olla de algo más vaca que carnero, salpicón las más noches5, duelos y quebrantos los sábados6, lantejas los viernes7, algún palomino de añadidura los domingos8, consumían las tres partes de su hacienda9. <a href="#" onclick="toggleText('desc1'); return false;">Ver menos</a></span>
    </td>
        </td>
      <td><a href="https://ejemplo.com/proyecto1">🔗 Ver más</a></td>
    </tr>
    <tr>
      <td><b>Proyecto 2</b></td>
      <td><img src="Otros_archivos/imagenes/Captura_2.JPG" width="600"></td>
      <td>En un lugar de la Mancha2, de cuyo nombre no quiero acordarme3, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor4. Una olla de algo más vaca que carnero</td>
      <td><a href="https://ejemplo.com/proyecto2">🔗 Ver más</a></td>
    </tr>
  </table>
</div>



<script>
  function toggleText(id) {
    var shortText = document.getElementById(id + "-short");
    var fullText = document.getElementById(id + "-full");
    if (shortText.style.display === "none") {
      shortText.style.display = "inline";
      fullText.style.display = "none";
    } else {
      shortText.style.display = "none";
      fullText.style.display = "inline";
    }
  }
</script>
