$(function() {

    $.mobile.selectmenu.prototype.options.nativeMenu = false;
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src",
            "http://maps.googleapis.com/maps/api/js?sensor=true&callback=getGeolocation");
    document.getElementsByTagName("head")[0].appendChild(fileref);
    $("#btnSumit").click(function() {

        if ($('#usuario_login').val() == "") {
            alert('El campo usuario no debe estar vacio');
            $('#usuario_login').focus();
            return;
        }

        if ($('#pass_login').val() == "") {
            alert('El campo clave no debe estar vacio');
            $('#pass_login').focus();
            return;
        }

//        $.mobile.showPageLoadingMsg();
//        $.post($base_url_login, (
//                {
//                    usuario: $('#usuario_login').val(),
//                    pass: $('#pass_login').val(),
//                    tipo: 1
//                }
//        ),
//                function(result) {
////                    $.mobile.changePage("#page2", {transition: 'slide'});
//                    if (result.login == 0) {
//                        $.mobile.hidePageLoadingMsg();
//                        alert(result.mensaje);
//                    } else {
//                        $.mobile.hidePageLoadingMsg();
//                        $('#usuariotxt').val($.trim($('#usuariotxt').val()));
//                        id_usuario = result.id_usuario;
//                        isSessionActive = true;
//                        $.mobile.changePage("#page2", {transition: 'slide'});
////                            $('ul').find('li').remove();
////                            $('ul').append('<li data-role="list-divider" role="heading">Menu</li>');
////                            for (var i = 0; i < result.data.length; i++) {
////                                $('ul').append('<li id=' + result.data[i].id_obra + ' data-theme="a"><a onclick="setIdObra(\'' + result.data[i].id_obra + '\')" href="#page3" data-transition="slide">' + result.data[i].nombre + '</a></li>');
////                            }
////
////                            $('ul').append('<li data-theme="a"><a href="#page4" data-transition="slide" onclick="obtenerMiPosicion();">Mi Posicion</a></li>');
////                            $('ul').listview('refresh');                            
//                    }
//                    $.mobile.changePage("#page2", {transition: 'slide'});
//                }, 'json');
        $.mobile.changePage("#page2", {transition: 'slide'});
    });
});


var isTypeOf = 1; //1 foto , 2 video
var $base_url_login = '#';
var $url_usuario_municipio = 'http://www.dolmen.net.co/sid_v1/usuarios/ajax/contUsuario.php?accion=usuario_municipios';

var url_censo = 'http://www.dolmen.net.co/sid_v1/censo_au/ajax/contCenso.php';
var isSessionActive = false;
var id_usuario = 0;
window.id_obra = 0;
output = [];
tipo_via = [];
barrios = [];
tipologia = [];
mobiliario = [];
referencia = [];
estado = [];

function registrarAccion() {
    if (isTypeOf == 1) {
        savePhoto();
    } else {
        uploadMediaFile();
    }
}

function setIdObra(argument) {
    window.id_obra = argument;
}

function obtenerMiPosicion() {
    getGeolocation();
}

function getGeolocation() {
    // get the user's gps coordinates and display map
    var options = {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
}

function loadMap(position) {
    var latlng = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
    var myOptions = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapObj = document.getElementById("map_canvas");
    var map = new google.maps.Map(mapObj, myOptions);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "You " + $('#usuariotxt').val()
    });
}

function geoError(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

//********************FUNCIONES DE FORMULARIO**********************

function llenarMunicipio() {

    $.post($url_usuario_municipio, (
            {
                id_usuario: id_usuario
            }
    ),
            function(result) {
                var sel = '';
                if (!result) {
                    alert("Usuario no tiene municipios asignados");
                } else {
                    $.mobile.hidePageLoadingMsg();
                    for (var i = 0; i < result.length; i++) {
                        if (i == 0) {
                            sel = 'selected= "selected"';
                        }
                        output.push('<option ' + sel + ' value="' + result[i].id + '">' + result[i].descripcion + '</option>');
                    }
                    $('#municipio').append(output.join('')).selectmenu('refresh');
                    obtenerBarrios();
                }
            }, 'json');

}

function obtenerBarrios() {
    $.post(url_censo + '?accion=municipio_barrios', (
            {
                id_municipio: $('#municipio').val()
            }
    ),
            function(result) {
                if (!result) {
                    alert("Municipio no tiene barrios asignados");
                    barrios = [];
                    $('#barrio').html(' ');
                    $('#barrio').append(barrios.join('')).selectmenu('refresh');
                } else {
                    $.mobile.hidePageLoadingMsg();
                    barrios = [];
                    $('#barrio').html(' ');
                    for (var i = 0; i < result.length; i++) {
                        barrios.push('<option value="' + result[i].id + '">' + result[i].descripcion + '</option>');
                    }
                    $('#barrio').append(barrios.join('')).selectmenu('refresh');
                }
            }, 'json');
}

function optenerTipologia() {

    $.post(url_censo + '?accion=getTipologia', (
            {
                id_usuario: id_usuario
            }
    ),
            function(result) {
                if (!result) {
                    alert("Error de conexion a Internet");
                } else {
                    $.mobile.hidePageLoadingMsg();
                    tipologia = [];
                    $('#tipologia').html(' ');
                    for (var i = 0; i < result.length; i++) {
                        tipologia.push('<option value="' + result[i].id + '">' + result[i].descripcion + '</option>');
                    }
                    $('#tipologia').append(tipologia.join('')).selectmenu('refresh');
                    obtenerMobiliarios();
                }
            }, 'json');
}

function obtenerMobiliarios() {
    $.post(url_censo + '?accion=getMobiliarios', (
            {
                id_tipologia: $('#tipologia').val()
            }
    ),
            function(result) {
                if (!result) {
                    alert("Tipologia no tiene mobiliarios asignados");
                    mobiliario = [];
                    $('#mobiliario').html(' ');
                    $('#mobiliario').append(mobiliario.join('')).selectmenu('refresh');
                } else {
                    $.mobile.hidePageLoadingMsg();
                    mobiliario = [];
                    $('#mobiliario').html(' ');
                    for (var i = 0; i < result.length; i++) {
                        mobiliario.push('<option value="' + result[i].id + '">' + result[i].descripcion + '</option>');
                    }
                    $('#mobiliario').append(mobiliario.join('')).selectmenu('refresh');
                    obtenerRefMobiliarios();
                }
            }, 'json');
}

function obtenerRefMobiliarios() {
    $.post(url_censo + '?accion=getRefMobiliario', (
            {
                id_mobiliario: $('#mobiliario').val()
            }
    ),
            function(result) {
                if (!result) {
                    alert("Mobiliario no tiene referencia de mobiliarios asignados");
                    referencia = [];
                    $('#referencia').html(' ');
                    $('#referencia').append(referencia.join('')).selectmenu('refresh');
                } else {
                    $.mobile.hidePageLoadingMsg();
                    referencia = [];
                    $('#referencia').html(' ');
                    for (var i = 0; i < result.length; i++) {
                        referencia.push('<option value="' + result[i].id + '">' + result[i].descripcion + '</option>');
                    }
                    $('#referencia').append(referencia.join('')).selectmenu('refresh');
                    obtenerEstado();
                }
            }, 'json');
}

function obtenerEstado() {
    $.post(url_censo + '?accion=getEstado', (
            {
                id_mobiliario: $('#mobiliario').val(),
                id_referencia: $('#referencia').val()
            }
    ),
            function(result) {
                if (!result) {
                    alert("Mobiliario y/o Referencia no tiene estados asignados");
                    estado = [];
                    $('#estado').html(' ');
                    $('#estado').append(estado.join('')).selectmenu('refresh');
                } else {
                    $.mobile.hidePageLoadingMsg();
                    for (var i = 0; i < result.length; i++) {
                        estado.push('<option value="' + result[i].id + '">' + result[i].descripcion + '</option>');
                    }
                    $('#estado').append(estado.join('')).selectmenu('refresh');
                }
            }, 'json');
}

function getDireccion() {
    $.mobile.changePage("#page6", {transition: 'slide'});

    $.post(url_censo + '?accion=tipo_via', (
            {
                id_usuario: id_usuario
            }
    ),
            function(result) {
                if (!result) {
                    alert("Error");
                } else {
                    $.mobile.hidePageLoadingMsg();
                    for (var i = 0; i < result.length; i++) {
                        tipo_via.push('<option value="' + result[i].abrv + '">' + result[i].abrv + ' (' + result[i].descripcion + ')' + '</option>');
                    }
                    $('#tipo_via_1').append(tipo_via.join('')).selectmenu('refresh');
                    $('#tipo_via_2').append(tipo_via.join('')).selectmenu('refresh');
                }
            }, 'json');

}

function crearDireccion() {
    $.mobile.changePage("#page3", {transition: 'slide'});
    $('#direccion').val($('#tipo_via_1').val() + ' ' + $('#numero1').val() + ' ' + $('#tipo_via_2').val() + ' ' + $('#numero2').val() + ' - ' + $('#distancia').val() + ' ' + $('#comp').val());
}