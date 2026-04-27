// Combined Script: JSON Automation & Illustrator Import Panel
(function(thisObj) {

    // --- Shared State (JSON Section) ---
    var jsonName = "", jsonData = null, jsonFile = null;
    // --- References to UI Elements (needed across functions) ---
    var statusTextJson; // Reference to the JSON status text element
    var controlsPanelJson, exportPanelJson; // References to panels to enable/disable
    var ddOpJson, ddColJson, ddExpJson; // Dropdowns
    // Justo debajo de: var ddOpJson, ddColJson, ddExpJson; // Dropdowns
    var ddImgJson; // NUEVO: Dropdown para la clave JSON de imagen
    // Justo debajo de: var jsonFileText; // Text showing loaded JSON file  <-- (asumo que esta es la línea a la que se refería el comentario original)
    var DYNAMIC_IMAGE_COMMENT_PREFIX = "AE_JSON_IMG_KEY:"; // NUEVO: Prefijo para el comentario de la capa
    // jsonFileText ya está declarado arriba con los otros elementos UI

    // ==========================================================
    // --- SECTION 1: JSON AUTOMATION CODE (Adapted from Script 1) ---
    // ==========================================================

    // --- JSON Utility Functions ---
    function readJsonData(file) {
        if (!file || !file.exists) throw new Error("Archivo JSON no encontrado: " + file.fsName);
        file.open("r");
        var str = file.read();
        file.close();
        try {
            if (typeof JSON !== 'undefined' && typeof JSON.parse === 'function') {
                return JSON.parse(str);
            } else {
                 // Eval es un riesgo de seguridad si el JSON no es de confianza absoluta.
                 return eval("(" + str + ")");
            }
        } catch (e) {
            throw new Error("Error al parsear JSON: " + e.toString() + "\nAsegúrate que el archivo es JSON válido.");
        }
    }

    // --- JSON Utility Functions ---
    // ... (la función readJsonData se mantiene igual) ...

    function getFields(data) {
        var recordToInspect = null;
        if (data instanceof Array && data.length > 0) {
            recordToInspect = data[0]; // Usar el primer objeto del array si es un array
        } else if (typeof data === 'object' && data !== null && !(data instanceof Array)) {
            // Lógica original si data es un objeto con sub-objetos (como jsonData[compName])
            // O si el JSON es un solo objeto directamente.
            // Para ser más robusto y obtener campos del primer nivel si data es el objeto raíz:
            var firstKey = null;
            for (var key in data) { if (data.hasOwnProperty(key)) { firstKey = key; break; } }

            if (firstKey !== null && typeof data[firstKey] === 'object' && data[firstKey] !== null) {
                 recordToInspect = data[firstKey]; // Si el primer valor es un objeto, inspecciónalo
            } else {
                 recordToInspect = data; // Si no, o si las claves son directamente valores, inspecciona data
            }
        }

        if (recordToInspect && typeof recordToInspect === 'object') {
            var fields = [];
            for (var f in recordToInspect) {
                if (recordToInspect.hasOwnProperty(f)) fields.push(f);
            }
            return fields.sort();
        }
        return [];
    }

    // --- JSON AE Functions (Pass status UI element for feedback) ---
    function applyJsonText(statusUiElement) {
        if (!jsonName) { statusUiElement.text = "Error Texto: Carga un archivo JSON primero."; return; }
        app.beginUndoGroup("Texto JSON");
        try {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) throw new Error("Selecciona una composición activa.");
            var layers = comp.selectedLayers;
            if (layers.length === 0) throw new Error("Selecciona al menos una capa de texto.");

            var appliedCount = 0;
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer.matchName === "ADBE Text Layer" && layer.property("Source Text")) {
                    layer.property("Source Text").expression =
                        "var out; try { out = footage('" + jsonName + "').sourceData[thisComp.name][thisLayer.name]; } catch(e) { out = '// Error: ' + e.toString(); } out;";
                    appliedCount++;
                }
            }
             if (appliedCount === 0) throw new Error("No se encontraron capas de texto válidas en la selección.");
            statusUiElement.text = "Expresión de Texto aplicada a " + appliedCount + " capa(s).";
        } catch (e) {
            statusUiElement.text = "Error Texto: " + e.message;
        } finally {
            app.endUndoGroup();
        }
    }

    function applyJsonOpacity(field, statusUiElement) {
        if (!jsonName) { statusUiElement.text = "Error Opacidad: Carga un archivo JSON primero."; return; }
        if (!field) { statusUiElement.text = "Error Opacidad: Selecciona un campo JSON."; return; }

        app.beginUndoGroup("Opacidad JSON");
        try {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) throw new Error("Selecciona una composición activa.");
            var layers = comp.selectedLayers;
            if (layers.length === 0) throw new Error("Selecciona al menos una capa.");

            var appliedCount = 0;
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer.property("Opacity")) {
                    layer.property("Opacity").expression =
                        "var out = 0; try { var d = footage('" + jsonName + "').sourceData[thisComp.name]; out = (d['" + field + "']==thisLayer.name)?100:0; } catch(e) { /* Silencio en caso de error, mantiene 0 */ } out;";
                     appliedCount++;
                }
            }
             if (appliedCount === 0) throw new Error("No se aplicó a ninguna capa con propiedad 'Opacity'.");
             statusUiElement.text = "Expresión de Opacidad ("+field+") aplicada a " + appliedCount + " capa(s).";
        } catch (e) {
            statusUiElement.text = "Error Opacidad: " + e.message;
        } finally {
             app.endUndoGroup();
        }
    }

    function applyJsonColor(field, statusUiElement) {
        if (!jsonName) { statusUiElement.text = "Error Color: Carga un archivo JSON primero."; return; }
        if (!field) { statusUiElement.text = "Error Color: Selecciona un campo JSON."; return; }

        app.beginUndoGroup("Color JSON");
        try {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) throw new Error("Selecciona una composición activa.");
            var layers = comp.selectedLayers;
            if (layers.length === 0) throw new Error("Selecciona al menos una capa.");

            var appliedCount = 0;
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                var fx = layer.property("Effects");
                if (!fx) {
                    try { fx = layer.property.addProperty("ADBE Effect Parade"); } catch (err) { continue; }
                }
                if (fx) {
                    var fill = fx.addProperty("ADBE Fill");
                    fill.property("Color").expression =
                        "var out = [1,1,1,1]; try { var c = footage('" + jsonName + "').sourceData[thisComp.name]['" + field + "']; " +
                        "if (typeof c === 'string') { var m=/#?([0-9A-Fa-f]{6})/.exec(c); if(m) { var h=m[1]; out=[parseInt(h.substr(0,2),16)/255,parseInt(h.substr(2,2),16)/255,parseInt(h.substr(4,2),16)/255,1]; } } " +
                        "else if (c instanceof Array && c.length===3 && typeof c[0] === 'number') { out=[c[0]/255,c[1]/255,c[2]/255,1]; } "+
                        "else if (c instanceof Array && c.length===4 && typeof c[0] === 'number') { out=[c[0]/255,c[1]/255,c[2]/255,c[3]/255]; } "+
                        "else if (c instanceof Array && c.length>=3 && typeof c[0] === 'number' && c[0] <= 1.0) { out=c; if(out.length===3) out[3]=1;} " +
                        "} catch(e) { /* Silencio */ } out;";
                    appliedCount++;
                }
            }
             if (appliedCount === 0) throw new Error("No se pudo añadir efecto Relleno a ninguna capa seleccionada.");
             statusUiElement.text = "Expresión de Color ("+field+") aplicada a " + appliedCount + " capa(s).";
        } catch (e) {
            statusUiElement.text = "Error Color: " + e.message;
        } finally {
             app.endUndoGroup();
        }
    }

    function exportJsonComps(field, statusUiElement) {
        if (!jsonName || !jsonData) { statusUiElement.text = "Error Exportar: Carga un archivo JSON primero."; return; }
        if (!field) { statusUiElement.text = "Error Exportar: Selecciona un campo JSON para el nombre."; return; }

        app.beginUndoGroup("Exportar Comps JSON");
        try {
            var sel = app.project.selection;
            var comps = [];
            for (var i = 0; i < sel.length; i++) {
                if (sel[i] instanceof CompItem) comps.push(sel[i]);
            }
            if (comps.length === 0) throw new Error("Selecciona al menos una composición en el panel Proyecto.");

            var folder = Folder.selectDialog("Selecciona la carpeta de destino para las exportaciones");
            if (!folder) { statusUiElement.text = "Exportación cancelada."; return; }

            var rq = app.project.renderQueue;
            var addedCount = 0;
            var skippedComps = [];
            statusUiElement.text = "Añadiendo " + comps.length + " comps a la cola...";

            for (var i = 0; i < comps.length; i++) {
                var comp = comps[i];
                var compData = jsonData[comp.name];
                var val = comp.name;
                if (compData && compData.hasOwnProperty(field)) {
                    val = compData[field];
                } else {
                    skippedComps.push(comp.name + " (Falta clave '" + field + "' en JSON)");
                }

                var outName = val.toString().replace(/[\\\/:*?"<>|]/g,'_') + ".mp4";
                var outFile = new File(folder.fsName + "/" + outName);
                var item = rq.items.add(comp);
                item.outputModule(1).file = outFile;
                // item.applyTemplate("Best Settings"); // Descomentar si se necesita
                addedCount++;
            }

            var message = "Añadidos " + addedCount + " comps a la Cola en: " + folder.fsName;
            if (skippedComps.length > 0) { message += "\nOmitidos: " + skippedComps.join(", "); }
            statusUiElement.text = message;
            // folder.execute(); // Descomentar para abrir carpeta

        } catch (e) {
            statusUiElement.text = "Error Exportar: " + e.message;
        } finally {
            app.endUndoGroup();
        }
    }
        // ... (después de la función exportJsonComps) ...

    // --- NUEVAS FUNCIONES PARA IMÁGENES DINÁMICAS ---

    function findFootageItemByName(itemName) {
        if (!itemName || typeof itemName !== 'string' || itemName.replace(/\s/g, '') === '') {
            return null; // Nombre de ítem inválido
        }
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof FootageItem && item.name === itemName) {
                return item;
            }
        }
        return null; // No encontrado
    }

    function setLayerForDynamicImage(statusUiElement) {
        if (!jsonName || !jsonData) { statusUiElement.text = "Error Imagen: Carga un archivo JSON primero."; return; }
        if (!ddImgJson || !ddImgJson.selection) { statusUiElement.text = "Error Imagen: Selecciona un campo JSON para la imagen."; return; }

        app.beginUndoGroup("Vincular Capa para Imagen Dinámica");
        try {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) throw new Error("Selecciona una composición activa.");
            
            var layers = comp.selectedLayers;
            if (layers.length !== 1) throw new Error("Selecciona exactamente UNA capa para vincular.");
            
            var layer = layers[0];
            // Asegurarse de que es una capa que puede tener 'source' (AVLayer: video, imagen, sólido, precomp)
            if (!(layer instanceof AVLayer) || !layer.source) {
                throw new Error("La capa seleccionada ('" + layer.name + "') no es adecuada para reemplazar su fuente (ej. no es una capa de imagen, video o sólido).");
            }

            var jsonKey = ddImgJson.selection.text;
            layer.comment = DYNAMIC_IMAGE_COMMENT_PREFIX + jsonKey;
            
            statusUiElement.text = "Capa '" + layer.name + "' vinculada a la clave JSON '" + jsonKey + "' para imagen dinámica.";

        } catch (e) {
            statusUiElement.text = "Error Imagen: " + e.message;
        } finally {
            app.endUndoGroup();
        }
    }

    // REEMPLAZA TU FUNCIÓN processDynamicImagesInComp EXISTENTE CON ESTA:
    function processDynamicImagesInComp(statusUiElement, targetComp) {
        if (!jsonName || !jsonData) {
            var compNameForMsg = targetComp ? "'" + targetComp.name + "'" : "la composición activa";
            // statusUiElement.text = "Error Actualizar Imágenes (" + compNameForMsg + "): Carga un archivo JSON primero."; // El mensaje de error lo manejará quien llama
            // Devolvemos un objeto de error para que la función que llama lo maneje
            return { success: 0, fail: 1, notFound: [], errors: ["Error: Carga un archivo JSON primero."], compName: targetComp ? targetComp.name : "N/A" };
        }

        // El Undo Group se manejará afuera para el lote, o por la función individual si se llama directamente.
        var successCount = 0;
        var failCount = 0;
        var notFoundMessages = [];
        var errorMessages = [];
        var currentCompName = targetComp ? targetComp.name : (app.project.activeItem ? app.project.activeItem.name : "Desconocida");


        try {
            var comp = targetComp ? targetComp : app.project.activeItem;

            if (!(comp instanceof CompItem)) {
                throw new Error("No se especificó o no hay una composición válida activa para procesar.");
            }
            currentCompName = comp.name; // Actualizar por si acaso

            var compData = null;
            if (jsonData instanceof Array) {
                var parsedCompName = parseInt(comp.name, 10); // Asumimos que el nombre de la comp es el índice "0", "1", etc.
                var foundByCompKey = false;
                for (var i = 0; i < jsonData.length; i++) {
                    // Comprobar si el objeto JSON tiene una clave "Comp" y si coincide con el nombre parseado.
                    if (jsonData[i] && typeof jsonData[i].Comp !== 'undefined' && jsonData[i].Comp == parsedCompName) { // Usar == para comparar número y string "0"
                        compData = jsonData[i];
                        foundByCompKey = true;
                        break;
                    }
                }
                // Fallback: si no se encontró por la clave "Comp", intenta usar el nombre de la comp como índice directo
                if (!foundByCompKey && !isNaN(parsedCompName) && jsonData[parsedCompName]) {
                    compData = jsonData[parsedCompName];
                }

            } else if (typeof jsonData === 'object' && jsonData !== null) {
                if (jsonData.hasOwnProperty(comp.name)) {
                    compData = jsonData[comp.name];
                }
            }

            if (!compData) {
                throw new Error("No se encontraron datos JSON para la comp '" + comp.name + "'. Verifica nombres/índices.");
            }

            for (var i = 1; i <= comp.numLayers; i++) {
                var layer = comp.layer(i);
                if (layer.comment && layer.comment.indexOf(DYNAMIC_IMAGE_COMMENT_PREFIX) === 0) {
                    if (!(layer instanceof AVLayer) || !layer.source) {
                        errorMessages.push("Capa '" + layer.name + "' marcada pero no es reemplazable.");
                        failCount++;
                        continue;
                    }

                    var jsonKey = layer.comment.substring(DYNAMIC_IMAGE_COMMENT_PREFIX.length);
                    if (compData.hasOwnProperty(jsonKey)) {
                        var imageName = compData[jsonKey];
                        if (typeof imageName === 'string' && imageName.replace(/\s/g, '') !== '') {
                            var footageToUse = findFootageItemByName(imageName);
                            if (footageToUse) {
                                try {
                                    if (layer.source !== footageToUse) {
                                        layer.replaceSource(footageToUse, true);
                                        successCount++;
                                    } else {
                                        successCount++; // Ya tiene la fuente correcta
                                    }
                                } catch (replaceError) {
                                    errorMessages.push("Error reemplazando fuente para '" + layer.name + "': " + replaceError.message);
                                    failCount++;
                                }
                            } else {
                                notFoundMessages.push("Imagen '" + imageName + "' (de clave '" + jsonKey + "' para capa '" + layer.name + "') no encontrada en Proyecto.");
                                failCount++;
                            }
                        } else {
                            errorMessages.push("Valor para clave '" + jsonKey + "' (capa '" + layer.name + "') no es un nombre de archivo válido en el JSON.");
                            failCount++;
                        }
                    } else {
                        errorMessages.push("Clave JSON '" + jsonKey + "' (de capa '" + layer.name + "') no encontrada en los datos para comp '" + comp.name + "'.");
                        failCount++;
                    }
                }
            }
        } catch (e) {
            errorMessages.push("Error procesando comp '" + currentCompName + "': " + e.message);
            failCount++;
        }
        
        return { 
            success: successCount, 
            fail: failCount, 
            notFound: notFoundMessages, 
            errors: errorMessages, 
            compName: currentCompName 
        };
    }
    // AÑADE ESTA NUEVA FUNCIÓN DESPUÉS DE processDynamicImagesInComp
    function processDynamicImagesInSelectedComps(statusUiElement) {
        if (!jsonName || !jsonData) {
            statusUiElement.text = "Error Actualizar Lote: Carga un archivo JSON primero.";
            return;
        }

        app.beginUndoGroup("Actualizar Imágenes Dinámicas en Comps Seleccionadas");
        var overallSuccess = 0;
        var overallFail = 0;
        var allNotFoundMessages = []; // Renombrado para claridad
        var allErrorMessages = [];    // Renombrado para claridad
        var processedCompsSummary = []; // Para un resumen de qué se hizo en cada comp

        try {
            var selectedItems = app.project.selection;
            var compsToProcess = [];
            for (var i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i] instanceof CompItem) {
                    compsToProcess.push(selectedItems[i]);
                }
            }

            if (compsToProcess.length === 0) {
                statusUiElement.text = "No hay composiciones seleccionadas en el panel de Proyecto para procesar en lote.";
                // No es un error necesariamente, podría ser que el usuario quiera procesar la activa.
                // La lógica del botón decidirá. Aquí simplemente retornamos si se llamó y no había nada que hacer en lote.
                app.endUndoGroup(); // Cerrar el undo group que abrimos
                return;
            }

            statusUiElement.text = "Iniciando procesamiento de " + compsToProcess.length + " composición(es)...";
            if (statusUiElement.window && statusUiElement.window.update) statusUiElement.window.update();


            for (var j = 0; j < compsToProcess.length; j++) {
                var currentComp = compsToProcess[j];
                // Actualizar el estado para indicar qué comp se está procesando
                var progressMsg = "Procesando (" + (j + 1) + "/" + compsToProcess.length + "): " + currentComp.name;
                statusUiElement.text = progressMsg;
                if (statusUiElement.window && statusUiElement.window.update) statusUiElement.window.update(); // Forzar actualización de UI

                var result = processDynamicImagesInComp(statusUiElement, currentComp); // Llamamos a la función individual

                overallSuccess += result.success;
                overallFail += result.fail;
                
                // Anteponer el nombre de la comp a cada mensaje específico
                for(var nf = 0; nf < result.notFound.length; nf++) {
                    allNotFoundMessages.push("[" + result.compName + "] " + result.notFound[nf]);
                }
                for(var er = 0; er < result.errors.length; er++) {
                    allErrorMessages.push("[" + result.compName + "] " + result.errors[er]);
                }
                
                // Guardar un resumen del procesamiento de esta comp
                if (result.success > 0 || result.fail > 0 || result.errors.length > 0 || result.notFound.length > 0) {
                    processedCompsSummary.push(result.compName + " (OK:" + result.success + ", Fallos:" + result.fail + ")");
                } else if (result.compName) { // Si no hubo ni éxito ni fallo pero se intentó (ej. no hay capas marcadas)
                    processedCompsSummary.push(result.compName + " (Sin capas de imagen dinámicas encontradas o sin cambios)");
                }
            }

            var summary = "PROCESO DE LOTE FINALIZADO.\n";
            summary += "Composiciones intentadas: " + compsToProcess.length + ".\n";
            summary += "Total imágenes OK: " + overallSuccess + ". Total fallos: " + overallFail + ".\n\n";

            if (processedCompsSummary.length > 0) {
                summary += "Resumen por Composición:\n" + processedCompsSummary.join("\n") + "\n\n";
            }

            if (allNotFoundMessages.length > 0) {
                summary += "--- IMÁGENES NO ENCONTRADAS EN PROYECTO ---\n" + allNotFoundMessages.join("\n") + "\n\n";
            }
            if (allErrorMessages.length > 0) {
                summary += "--- OTROS ERRORES/ADVERTENCIAS ---\n" + allErrorMessages.join("\n") + "\n";
            }
            
            if (overallSuccess === 0 && overallFail === 0 && allNotFoundMessages.length === 0 && allErrorMessages.length === 0 && compsToProcess.length > 0) {
                summary += "No se realizaron cambios o no se encontraron capas dinámicas en las comps seleccionadas.";
            }

            statusUiElement.text = summary;

        } catch (e) {
            statusUiElement.text = "Error Crítico en Lote: " + e.message;
        } finally {
            app.endUndoGroup();
        }
    }

    // --- JSON Import Handler ---
    function handleJsonImport() {
        var f = File.openDialog("Selecciona un archivo JSON (*.json)", "*.json");
        if(!f) return; // Usuario canceló

        try {
            // 1. Leer datos
            var tempData = readJsonData(f);
             if (tempData === null || typeof tempData !== 'object') throw new Error("El JSON está vacío o no es un objeto.");
             jsonData = tempData; // Assign to shared state

            // 2. Importar Footage
            app.beginUndoGroup("Importar Footage JSON");
            var importOptions = new ImportOptions(f);
            var jsonFootage = app.project.importFile(importOptions);
            var niceName = prompt("¿Cómo llamar al Footage JSON en After Effects?", f.name.replace(/%20/g, " ") );
            if(niceName && niceName.replace(/\s/g,'')) jsonFootage.name = niceName;
            else niceName = jsonFootage.name;
            jsonName = jsonFootage.name; // Assign to shared state
            jsonFile = f; // Assign to shared state
            app.endUndoGroup();

            // 3. Actualizar UI JSON
            jsonFileText.text = jsonName + " (" + f.name + ")";
            jsonFileText.helpTip = f.fsName;
            statusTextJson.text = "JSON '" + jsonName + "' cargado. Listo para aplicar datos.";

            // Rellenar desplegables
            var fields = getFields(jsonData); // Asegúrate que getFields está actualizada (hecho en PASO 2)
            ddOpJson.removeAll(); ddColJson.removeAll(); ddExpJson.removeAll();
            if (ddImgJson) ddImgJson.removeAll(); // NUEVO: Limpiar dropdown de imágenes si existe

            if (fields.length === 0) {
                 statusTextJson.text = "Advertencia: No se encontraron campos (columnas) en el JSON.";
            } else {
                for (var i=0; i<fields.length; i++) {
                    ddOpJson.add("item",fields[i]);
                    ddColJson.add("item",fields[i]);
                    ddExpJson.add("item",fields[i]);
                    if (ddImgJson) ddImgJson.add("item", fields[i]); // NUEVO: Poblar dropdown de imágenes
                }
                if (fields.length > 0) {
                    ddOpJson.selection = 0;
                    ddColJson.selection = 0;
                    ddExpJson.selection = 0;
                    if (ddImgJson) ddImgJson.selection = 0; // NUEVO: Seleccionar primer ítem
                }
            }

            // Habilitar controles JSON
            controlsPanelJson.enabled = true;
            exportPanelJson.enabled = true;

        } catch (e) {
            statusTextJson.text = "Error al importar JSON: " + e.message;
            // Deshabilitar controles JSON y resetear estado si falla
            controlsPanelJson.enabled = false;
            exportPanelJson.enabled = false;
            jsonFileText.text = "Fallo al cargar JSON.";
            jsonData = null; jsonName = ""; jsonFile = null;
        }
    }


    // ==========================================================
    // --- SECTION 2: ILLUSTRATOR IMPORT CODE (Adapted from Script 2) ---
    // ==========================================================

    function importAiText() {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Por favor, selecciona una composición activa en After Effects.");
            return;
        }

        var bt = new BridgeTalk();
        bt.target = "illustrator";
        // Function to execute in Illustrator (Text) - Copied directly from Script 2
        bt.body = '(' + function () {
            try {
                if (app.documents.length === 0) return "NO_DOC";
                var doc = app.activeDocument;
                if (doc.selection.length === 0) return "NO_SELECTION";
                var selection = doc.selection;
                var results = [];
                var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
                var rect = artboard.artboardRect;
                var artLeft = rect[0], artTop = rect[1], artBottom = rect[3];
                var artHeight = artTop - artBottom;

                for (var i = 0; i < selection.length; i++) {
                    var sel = selection[i];
                    if (sel.typename === "TextFrame") {
                        var contenido = sel.contents;
                        var fuente = "Arial", tamano = 40, color = { r: 0, g: 0, b: 0 }, relativePosition = [0, 0];
                        try { fuente = sel.textRange.characterAttributes.textFont.name; } catch (e) {}
                        try { tamano = sel.textRange.characterAttributes.size; } catch (e) {}
                        try {
                            var fillColor = sel.textRange.characterAttributes.fillColor;
                            if (fillColor.typename === "RGBColor") color = { r: Math.round(fillColor.red), g: Math.round(fillColor.green), b: Math.round(fillColor.blue) };
                            else if (fillColor.typename === "GrayColor") { var grayVal = Math.round(fillColor.gray); color = { r: grayVal, g: grayVal, b: grayVal }; }
                        } catch (e) {}
                        try {
                            var bounds = sel.geometricBounds;
                            var itemLeft = bounds[0], itemTop = bounds[1];
                            var relX = itemLeft - artLeft;
                            var relY = artHeight - (itemTop - artBottom);
                            relativePosition = [relX, relY];
                        } catch (e) {}
                        results.push({ contenido: contenido, fuente: fuente, tamano: tamano, color: color, relativePosition: relativePosition });
                    }
                }
                if (results.length === 0) return "NO_TEXT";
                return results.toSource();
            } catch (e) { return "ERROR: " + e.toString(); }
        }.toString() + ')();';

        // Callback function for when Illustrator responds (Text) - Copied/adapted from Script 2
        bt.onResult = function (res) {
            var raw = res.body;
            if (!raw) { alert("Error: No se recibió respuesta de Illustrator."); return; } // Added check
            if (raw === "NO_DOC") { alert("Error en Illustrator: No hay ningún documento abierto."); return; }
            if (raw === "NO_SELECTION") { alert("Error en Illustrator: No hay nada seleccionado."); return; }
            if (raw === "NO_TEXT") { alert("Error en Illustrator: No se encontraron objetos de texto en la selección."); return; }
            if (raw.indexOf("ERROR:") === 0) { alert("Error en Illustrator:\n" + raw); return; }

            try {
                var dataList = eval(raw); // Evaluate the response string
                if (!dataList || !dataList.length) { alert("No se recibieron datos de texto válidos de Illustrator."); return; }

                app.beginUndoGroup("Importar Texto desde Illustrator");
                var currentComp = app.project.activeItem; // Re-get comp just in case

                for (var i = 0; i < dataList.length; i++) {
                    var data = dataList[i];
                    var textLayer = currentComp.layers.addText(data.contenido);
                    textLayer.name = data.contenido.substring(0, 30);
                    var textProp = textLayer.property("Source Text");
                    var textDoc = textProp.value;
                    textDoc.font = data.fuente;
                    textDoc.fontSize = data.tamano;
                    textDoc.fillColor = [data.color.r / 255, data.color.g / 255, data.color.b / 255];
                    textDoc.applyStroke = false;
                    textProp.setValue(textDoc);
                    var bounds = textLayer.sourceRectAtTime(currentComp.time, false);
                    textLayer.property("Anchor Point").setValue([bounds.left, bounds.top]);
                    textLayer.property("Position").setValue(data.relativePosition);
                }
                app.endUndoGroup();
            } catch (e) {
                alert("Error procesando datos de texto en After Effects:\n" + e.toString());
                try { app.endUndoGroup(); } catch(eu) {} // Ensure undo closes on error
            }
        };

        bt.onError = function (err) { alert("Error de comunicación (BridgeTalk Texto):\n" + err.body); };
        bt.send(30); // Send message with 30 sec timeout
    }

    function importAiShape() {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Por favor, selecciona una composición activa en After Effects.");
            return;
        }

        var bt = new BridgeTalk();
        bt.target = "illustrator";

        // Function to execute in Illustrator (Shape) - MODIFIED FOR CompoundPathItems
        bt.body = '(' + function () {
            // Recursive function to process items and nested items
            function processItem(item, resultsArray, artboardInfo) {
                try {
                    // If it's a Group, recurse into its items
                    if (item.typename === "GroupItem") {
                        for (var j = 0; j < item.pageItems.length; j++) {
                            processItem(item.pageItems[j], resultsArray, artboardInfo); // Recursive call
                        }
                    }
                    // *** NEW: If it's a Compound Path, recurse into its constituent PathItems ***
                    else if (item.typename === "CompoundPathItem") {
                         //$.writeln("Processing CompoundPathItem: " + (item.name || "Unnamed")); // Optional debug
                         for (var k = 0; k < item.pathItems.length; k++) {
                            // Process each sub-path item using the same recursive function
                            // Note: Sub-paths inherit appearance from the compound path usually,
                            // but we'll extract appearance from the sub-path itself here,
                            // which might differ sometimes but ensures we get *something*.
                            processItem(item.pathItems[k], resultsArray, artboardInfo);
                         }
                    }
                    // If it's a valid PathItem, process it
                    else if (item.typename === "PathItem" && !item.guides && !item.clipping) {
                         //$.writeln("Processing PathItem: " + (item.name || "Unnamed")); // Optional debug
                        var sel = item;
                        var points = [], inTangents = [], outTangents = [];
                        var pathPoints = sel.pathPoints;

                        // --- Coordinate and Tangent Extraction ---
                        for (var j = 0; j < pathPoints.length; j++) {
                            var pt = pathPoints[j];
                            var anchor = pt.anchor, leftDir = pt.leftDirection, rightDir = pt.rightDirection;
                            var x = anchor[0] - artboardInfo.left;
                            var y = artboardInfo.height - (anchor[1] - artboardInfo.bottom);
                            points.push([x, y]);
                            inTangents.push([leftDir[0] - anchor[0], -(leftDir[1] - anchor[1])]);
                            outTangents.push([rightDir[0] - anchor[0], -(rightDir[1] - anchor[1])]);
                        }

                        // --- Fill, Stroke, Gradient Extraction ---
                        var isGradient = false, gradientInfo = null, fill = { r: 0, g: 0, b: 0 }, stroke = { r: 0, g: 0, b: 0 };
                        var sw = sel.strokeWidth, hasFill = sel.filled, hasStroke = sel.stroked;
                        var capStyle = sel.strokeCap === StrokeCap.ROUNDENDCAP ? 2 : sel.strokeCap === StrokeCap.PROJECTINGENDCAP ? 3 : 1;

                        // Use try...catch for color extraction as it can fail on complex items
                        try {
                            if (hasFill) {
                                if (sel.fillColor.typename === "RGBColor") { fill = { r: Math.round(sel.fillColor.red), g: Math.round(sel.fillColor.green), b: Math.round(sel.fillColor.blue) }; }
                                else if (sel.fillColor.typename === "GradientColor") {
                                    isGradient = true;
                                    var gradient = sel.fillColor.gradient;
                                    var stopsData = [];
                                    for (var k = 0; k < gradient.gradientStops.length; k++) {
                                        var stop = gradient.gradientStops[k];
                                        var stopColor = { r: 0, g: 0, b: 0 };
                                        var alpha = stop.opacity ? stop.opacity / 100.0 : 1.0;
                                        if (stop.color.typename === "RGBColor") stopColor = { r: Math.round(stop.color.red), g: Math.round(stop.color.green), b: Math.round(stop.color.blue) };
                                        else if (stop.color.typename === "GrayColor") { var grayValStop = Math.round(stop.color.gray); stopColor = { r: grayValStop, g: grayValStop, b: grayValStop }; }
                                        stopsData.push({ pos: stop.rampPoint / 100.0, color: stopColor, alpha: alpha });
                                    }
                                    stopsData.sort(function(a, b) { return a.pos - b.pos; });
                                    gradientInfo = { type: gradient.type === GradientType.LINEAR ? 'linear' : 'radial', stops: stopsData };
                                } else if (sel.fillColor.typename === "GrayColor") { var grayValFill = Math.round(sel.fillColor.gray); fill = { r: grayValFill, g: grayValFill, b: grayValFill }; }
                                // Note: Could add CMYK or other color types here if needed
                            }
                        } catch(fillError) { hasFill = false; /*$.writeln("Fill color error: "+fillError);*/ } // If error getting fill, treat as no fill

                        try {
                            if (hasStroke) {
                                 if (sel.strokeColor.typename === "RGBColor") stroke = { r: Math.round(sel.strokeColor.red), g: Math.round(sel.strokeColor.green), b: Math.round(sel.strokeColor.blue) };
                                 else if (sel.strokeColor.typename === "GrayColor") { var grayValStroke = Math.round(sel.strokeColor.gray); stroke = { r: grayValStroke, g: grayValStroke, b: grayValStroke }; }
                                 // Note: Could add CMYK or other color types here if needed
                            }
                         } catch(strokeError) { hasStroke = false; /*$.writeln("Stroke color error: "+strokeError);*/ } // If error getting stroke, treat as no stroke


                        // --- Add data to results ---
                        resultsArray.push({
                            points: points, inTangents: inTangents, outTangents: outTangents,
                            fill: fill, hasFill: hasFill, stroke: stroke, hasStroke: hasStroke,
                            strokeWidth: sw, capStyle: capStyle, closed: sel.closed,
                            isGradient: isGradient, gradientInfo: gradientInfo
                        });
                    }
                    // Else: ignore other types like TextFrames, PlacedItems, etc.

                } catch (e) {
                    // Log error for this specific item but continue processing others
                    // $.writeln("Error processing item '" + (item.name || item.typename)+ "': " + e.toString()); // Optional debug logging in AI ESTK
                }
            } // --- End of processItem function ---

            // --- Main execution starts here ---
            try {
                if (app.documents.length === 0) return "NO_DOC";
                var doc = app.activeDocument;
                if (doc.selection.length === 0) return "NO_SELECTION";

                var selection = doc.selection;
                var results = []; // Array to hold data for ALL valid PathItems found

                // Get artboard info ONCE
                var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
                var rect = artboard.artboardRect;
                var artboardInfo = {
                    left: rect[0], top: rect[1], bottom: rect[3],
                    height: rect[1] - rect[3] // Top - Bottom
                };

                // Iterate through the TOP LEVEL selection
                for (var i = 0; i < selection.length; i++) {
                    processItem(selection[i], results, artboardInfo); // Call the recursive processor
                }

                if (results.length === 0) return "NO_SHAPES"; // No *PathItems* found
                return results.toSource(); // Convert results array to string

            } catch (e) {
                return "ERROR: " + e.toString(); // General error during execution
            }
        }.toString() + ')();'; // Execute the function in Illustrator

         // --- The rest of the function (bt.onResult, bt.onError, bt.send) remains THE SAME ---

         // --- The rest of the function (bt.body, bt.onError, bt.send) remains THE SAME ---

         bt.onResult = function (res) {
            var raw = res.body;
             if (!raw) { alert("Error: No se recibió respuesta de Illustrator."); return; }
            if (raw === "NO_DOC") { alert("Error en Illustrator: No hay ningún documento abierto."); return; }
            if (raw === "NO_SELECTION") { alert("Error en Illustrator: No hay nada seleccionado."); return; }
            if (raw === "NO_SHAPES") { alert("Error en Illustrator: No se encontraron formas (PathItems) válidas en la selección, grupos o trazados compuestos."); return; }
            if (raw.indexOf("ERROR:") === 0) { alert("Error en Illustrator:\n" + raw); return; }

            try {
                var dataList = eval(raw);
                 if (!dataList || !dataList.length) { alert("No se recibieron datos de formas válidos de Illustrator."); return; }

                app.beginUndoGroup("Importar Formas desde Illustrator");
                 var currentComp = app.project.activeItem;

                // ***** MODIFICATION START: Loop backwards through the dataList *****
                for (var i = dataList.length - 1; i >= 0; i--) {
                // ***** MODIFICATION END *****

                    // --- Processing each shape data remains the same ---
                    var data = dataList[i]; // Get data for the current item
                    var minX = data.points[0][0], minY = data.points[0][1];
                    for (var j = 1; j < data.points.length; j++) {
                        if (data.points[j][0] < minX) minX = data.points[j][0];
                        if (data.points[j][1] < minY) minY = data.points[j][1];
                    }
                    var adjustedPoints = [];
                    for (var j = 0; j < data.points.length; j++) adjustedPoints.push([ data.points[j][0] - minX, data.points[j][1] - minY ]);
                    var shape = new Shape();
                    shape.closed = data.closed; shape.vertices = adjustedPoints; shape.inTangents = data.inTangents; shape.outTangents = data.outTangents;

                    var shapeLayer = currentComp.layers.addShape();
                    // Layer naming: Using (i + 1) still makes sense conceptually,
                    // as it relates to the original position in the array sent from AI.
                    // The *visual order* in AE timeline will now be correct.
                    shapeLayer.name = "Forma AI " + (i + 1);
                    var contents = shapeLayer.property("Contents");
                    var group = contents.addProperty("ADBE Vector Group");
                    group.name = "Forma Importada " + (i + 1);
                    var pathGroup = group.property("Contents").addProperty("ADBE Vector Shape - Group");
                    pathGroup.property("Path").setValue(shape);

                    // --- Fill handling ---
                    if (data.hasFill) {
                        if (data.isGradient && data.gradientInfo && data.gradientInfo.stops && data.gradientInfo.stops.length > 0) {
                            // ... (gradient fill code - no changes needed here) ...
                             var gradientFill = group.property("Contents").addProperty("ADBE Vector Graphic - G-Fill");
                            gradientFill.name = "Relleno Degradado AI";
                            gradientFill.property("Opacity").setValue(100);
                            gradientFill.property("Type").setValue(data.gradientInfo.type === 'linear' ? 1 : 2);
                            var layerBounds = shapeLayer.sourceRectAtTime(0, false);
                            var layerWidth = Math.abs(layerBounds.width) || 100, layerHeight = Math.abs(layerBounds.height) || 100;
                            var startPoint = [-layerWidth / 2, 0], endPoint = [layerWidth / 2, 0];
                            if (data.gradientInfo.type === 'radial') { var radius = Math.max(layerWidth, layerHeight) / 2; endPoint = [radius, 0]; gradientFill.property("Highlight Length").setValue(100); gradientFill.property("Highlight Angle").setValue(0); }
                            gradientFill.property("Start Point").setValue(startPoint); gradientFill.property("End Point").setValue(endPoint);

                            var numStops = data.gradientInfo.stops.length;
                            var colorArray = [];
                            if (numStops > 0) {
                                for (var k = 0; k < numStops; k++) {
                                    var stop = data.gradientInfo.stops[k];
                                    colorArray.push(stop.pos); colorArray.push(stop.color.r / 255); colorArray.push(stop.color.g / 255); colorArray.push(stop.color.b / 255); colorArray.push(stop.alpha);
                                }
                                if (numStops === 1) { colorArray = colorArray.concat(colorArray); }
                             }
                            if (colorArray.length >= 10 && colorArray.length % 5 === 0) {
                                try { gradientFill.property("Colors").setValue(colorArray); }
                                catch (e_setColor) {
                                    alert("Error al asignar colores de degradado (Forma " + (i+1) + ", con Alfa): " + e_setColor.toString() + "\nDatos: " + colorArray.toSource());
                                    var fallbackFillError = group.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fallbackFillError.property("Color").setValue([1, 0, 1]);
                                }
                            } else {
                                var alertMsg = "Advertencia: No se pudieron crear los stops del degradado para la forma " + (i + 1) + ".";
                                if(colorArray.length > 0 && colorArray.length % 5 !== 0) alertMsg += " El número de elementos (" + colorArray.length + ") no es múltiplo de 5 (pos,R,G,B,A).";
                                alert(alertMsg + " Se usará relleno sólido magenta.");
                                var fallbackFillNoStops = group.property("Contents").addProperty("ADBE Vector Graphic - Fill"); fallbackFillNoStops.property("Color").setValue([1, 0, 1]);
                            }
                        } else { // Solid fill
                            var solidFill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                             solidFill.name = "Relleno Sólido AI";
                            solidFill.property("Color").setValue([ data.fill.r / 255, data.fill.g / 255, data.fill.b / 255 ]);
                            solidFill.property("Opacity").setValue(100);
                        }
                    }
                    // --- Stroke handling ---
                    if (data.hasStroke && data.strokeWidth > 0) {
                        // ... (stroke code - no changes needed here) ...
                        var strokeProp = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
                        strokeProp.name = "Trazo AI";
                        strokeProp.property("Color").setValue([ data.stroke.r / 255, data.stroke.g / 255, data.stroke.b / 255 ]);
                        strokeProp.property("Stroke Width").setValue(data.strokeWidth);
                        strokeProp.property("Line Cap").setValue(data.capStyle);
                        strokeProp.property("Opacity").setValue(100);
                    }
                    // --- Positioning ---
                    shapeLayer.property("Transform").property("Position").setValue([minX, minY]);

                } // --- END of loop processing each shape in AE ---
                app.endUndoGroup();
            } catch (e) {
                alert("Error procesando datos de formas en After Effects:\n" + e.toString() + (e.line ? ('\nLínea: ' + e.line) : ''));
                try { app.endUndoGroup(); } catch(eu) {}
            }
        }; // --- End of bt.onResult ---

        bt.onError = function (err) { alert("Error de comunicación (BridgeTalk Formas):\n" + err.body); };
        bt.send(30);
    } // --- End of importAiShape function ---


// ==========================================================
    // --- SECTION 3: BUILD COMBINED UI ---
    // ==========================================================
    function buildUI(panelObj) {
        var pal = (panelObj instanceof Panel) ? panelObj : new Window("palette", "Automation_Script_V2", undefined, { resizeable: true });
        if (!pal) return null;

        pal.orientation = "column";
        pal.alignChildren = ["fill", "top"];
        pal.spacing = 5;
        pal.margins = 10;

        // --- Panel 1: JSON Automation ---
        var jsonPanel = pal.add("panel", undefined, "Automatización JSON");
        jsonPanel.orientation = "column";
        jsonPanel.alignChildren = ["fill", "top"];
        jsonPanel.margins = 10;
        jsonPanel.spacing = 8;

            // Import Group (copy from Script 1 structure)
            var importGroup = jsonPanel.add("group {orientation: 'row', alignment: ['fill', 'top'], alignChildren: ['left', 'center']}");
                var importBtnJson = importGroup.add("button", undefined, "Importar JSON");
                importBtnJson.helpTip = "Selecciona un archivo .json local";
                jsonFileText = importGroup.add("statictext", undefined, "Ningún JSON cargado.", { truncate: "middle" }); // Assign global ref
                jsonFileText.characters = 25;
                jsonFileText.preferredSize.width = 200; // Give it some width

            // Controls Panel (copy from Script 1 structure, assign global ref)
            controlsPanelJson = jsonPanel.add("panel", undefined, "Aplicar Datos JSON");
            controlsPanelJson.alignChildren = ["fill", "top"];
            controlsPanelJson.margins = 10;
            controlsPanelJson.enabled = false; // Initially disabled

                // Text Group
                var textGroup = controlsPanelJson.add("group {orientation: 'row'}");
                    var textBtnJson = textGroup.add("button", undefined, "Aplicar a Texto");
                    textBtnJson.helpTip = "Aplica expresión a capas de texto seleccionadas";
                    textBtnJson.alignment = ["fill", "center"];

                controlsPanelJson.add("panel", [0,0,100,3]); // Separator

                // Opacity Group
                var opGroup = controlsPanelJson.add("group {orientation: 'row', alignChildren: ['left', 'center']}");
                    opGroup.add("statictext", undefined, "Opacidad:");
                    ddOpJson = opGroup.add("dropdownlist", undefined, []); // Assign global ref
                    ddOpJson.helpTip = "Columna JSON para Opacidad=100";
                    ddOpJson.size = [150, 25];
                    var opBtnJson = opGroup.add("button", undefined, "Aplicar");
                    opBtnJson.helpTip = "Aplica expresión de opacidad";

                controlsPanelJson.add("panel", [0,0,100,3]); // Separator

                // Color Group
                var colGroup = controlsPanelJson.add("group {orientation: 'row', alignChildren: ['left', 'center']}");
                    colGroup.add("statictext", undefined, "Color:");
                    ddColJson = colGroup.add("dropdownlist", undefined, []); // Assign global ref
                    ddColJson.helpTip = "Columna JSON para color (hex o [R,G,B])";
                    ddColJson.size = [150, 25];
                    var colBtnJson = colGroup.add("button", undefined, "Aplicar");
                    colBtnJson.helpTip = "Añade Relleno y aplica expresión de color";

                // --- NUEVO: Image Dynamic Source Group ---
                controlsPanelJson.add("panel", [0,0,100,3]); // Separator
                var imgGroup = controlsPanelJson.add("group {orientation: 'row', alignChildren: ['left', 'center']}");
                    imgGroup.add("statictext", undefined, "Imagen:");
                    ddImgJson = imgGroup.add("dropdownlist", undefined, []); // Asigna a la variable global ddImgJson
                    ddImgJson.helpTip = "Columna JSON con nombre de archivo de imagen";
                    ddImgJson.size = [150, 25];
                    var imgBtnJsonApply = imgGroup.add("button", undefined, "Vincular");
                    imgBtnJsonApply.helpTip = "Vincula capa seleccionada a esta clave JSON para imagen dinámica";
                // --- FIN NUEVO: Image Dynamic Source Group ---

                // --- NUEVO: Botón para actualizar todas las imágenes dinámicas en la comp activa ---
                controlsPanelJson.add("panel", [0,0,100,3]); // Separator
                var updateImagesBtn = controlsPanelJson.add("button", undefined, "Actualizar Imágenes (Comp Activa / Seleccionadas)");
                updateImagesBtn.helpTip = "Procesa comp activa o las comps seleccionadas en el panel Proyecto.";
                updateImagesBtn.alignment = ["fill", "center"];
                // --- FIN NUEVO: Botón de actualización ---

            // Export Panel (copy from Script 1 structure, assign global ref)
            exportPanelJson = jsonPanel.add("panel", undefined, "Exportar Composiciones");
            exportPanelJson.alignChildren = ["fill", "top"];
            exportPanelJson.margins = 10;
            exportPanelJson.enabled = false; // Initially disabled

                var expGroup = exportPanelJson.add("group {orientation: 'row', alignChildren: ['left', 'center']}");
                     expGroup.add("statictext", undefined, "Nombre Archivo:");
                     ddExpJson = expGroup.add("dropdownlist", undefined, []); // Assign global ref
                     ddExpJson.helpTip = "Columna JSON para nombrar archivos";
                     ddExpJson.size = [150, 25];
                     var expBtnJson = expGroup.add("button", undefined, "Añadir a Cola");
                     expBtnJson.helpTip = "Añade comps seleccionadas a la Cola de Procesamiento";

            // Status Area (copy from Script 1 structure, assign global ref)
            var statusGroupJson = jsonPanel.add("group {alignment: ['fill', 'top']}");
                 statusTextJson = statusGroupJson.add("statictext", undefined, "Carga un archivo JSON para empezar.", { multiline: true }); // Assign global ref
                 statusTextJson.alignment = ["fill", "center"];
                 statusTextJson.preferredSize.height = 40;

        // --- Panel 2: Illustrator Import ---
        var aiPanel = pal.add("panel", undefined, "Importar desde Illustrator");
        aiPanel.orientation = "column";
        aiPanel.alignChildren = ["fill", "top"];
        aiPanel.margins = 10;
        aiPanel.spacing = 8;

            var btnAiText = aiPanel.add("button", undefined, "Importar Texto(s) de Illustrator");
            btnAiText.helpTip = "Importa texto seleccionado en Illustrator como capas de texto en AE";
            var btnAiShape = aiPanel.add("button", undefined, "Importar Forma(s) de Illustrator");
            btnAiShape.helpTip = "Importa formas seleccionadas en Illustrator como capas de forma en AE";

        // --- Footer/Credits --- (MODIFICADO/AÑADIDO)
        // Añade un pequeño espacio antes del crédito
        pal.add("panel", [0,0,100,2]); // Separador delgado o espacio
        // Añade el texto de crédito, centrado
        pal.add("statictext", undefined, "By: Lizeth Gómez + Google AI", {justify: "center"});


        // --- Assign Button Actions ---
        // JSON Buttons
        importBtnJson.onClick = handleJsonImport; // Use the dedicated handler
        textBtnJson.onClick = function() { applyJsonText(statusTextJson); }; // Pass status UI element
        opBtnJson.onClick   = function() {
            if(jsonName && ddOpJson.selection) applyJsonOpacity(ddOpJson.selection.text, statusTextJson);
            else statusTextJson.text = "Selecciona un campo de Opacidad primero.";
        };
        colBtnJson.onClick  = function() {
            if(jsonName && ddColJson.selection) applyJsonColor(ddColJson.selection.text, statusTextJson);
            else statusTextJson.text = "Selecciona un campo de Color primero.";
        };
        expBtnJson.onClick  = function() {
            if(jsonName && ddExpJson.selection && jsonData) exportJsonComps(ddExpJson.selection.text, statusTextJson);
            else statusTextJson.text = "Selecciona un campo para Nombre de Archivo primero.";
        };

        // --- NUEVO: Acciones para botones de Imagen Dinámica ---
        if (imgBtnJsonApply) { // imgBtnJsonApply es el botón "Vincular"
            imgBtnJsonApply.onClick = function() {
                setLayerForDynamicImage(statusTextJson); // Llama a la nueva función de vinculación
            };
        }
        if (updateImagesBtn) {
            updateImagesBtn.onClick = function() {
                var selectedProjectItems = app.project.selection;
                var compsInSelectionCount = 0;
                for (var i = 0; i < selectedProjectItems.length; i++) {
                    if (selectedProjectItems[i] instanceof CompItem) {
                        compsInSelectionCount++;
                    }
                }

                if (compsInSelectionCount > 0) {
                    // Si hay composiciones seleccionadas en el panel de proyecto, procesar esas en lote
                    processDynamicImagesInSelectedComps(statusTextJson);
                } else if (app.project.activeItem instanceof CompItem) {
                    // Si no hay selección en proyecto, y hay una composición activa, procesar solo la activa
                    app.beginUndoGroup("Actualizar Imágenes Dinámicas en Comp Activa"); // Envolver la acción individual
                    try {
                        var result = processDynamicImagesInComp(statusTextJson, app.project.activeItem);
                        // Construir un resumen para la única comp procesada
                        var summary = "ACTUALIZACIÓN INDIVIDUAL COMPLETA (" + result.compName + "):\n";
                        summary += "Imágenes OK: " + result.success + ". Fallos: " + result.fail + ".\n";

                        if (result.notFound.length > 0) {
                            summary += "\n--- Imágenes No Encontradas ---\n" + result.notFound.join("\n") + "\n";
                        }
                        if (result.errors.length > 0) {
                            summary += "\n--- Errores/Advertencias ---\n" + result.errors.join("\n") + "\n";
                        }
                        if (result.success === 0 && result.fail === 0 && result.notFound.length === 0 && result.errors.length === 0) {
                            summary += "No se realizaron cambios o no se encontraron capas dinámicas.";
                        }
                        statusTextJson.text = summary;
                    } catch (e) {
                        statusTextJson.text = "Error procesando comp activa: " + e.message;
                    } finally {
                        app.endUndoGroup();
                    }
                } else {
                    statusTextJson.text = "Para actualizar: Selecciona comps en el panel Proyecto o activa una composición en la línea de tiempo.";
                }
            };
        }
        // --- FIN NUEVO: Acciones ---


        // Illustrator Buttons
        btnAiText.onClick = importAiText; // Call the specific function
        btnAiShape.onClick = importAiShape; // Call the specific function


        // --- Finalize UI Layout ---
        pal.layout.layout(true);
        pal.onResizing = pal.onResize = function () { this.layout.resize(); }

        return pal;
    }

    // --- Run the script ---
    var myCombinedPanel = buildUI(thisObj);
    if (myCombinedPanel instanceof Window) {
        myCombinedPanel.center();
        myCombinedPanel.show();
    }

})(this);