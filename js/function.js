
$(document).ready(function() {
	var marcador;
	var mapaHotel;
	var lngActual = -78.4823867;
	var latActual = -0.18207600;
	var latlngInicial = new google.maps.LatLng(-0.18207600, -78.4823867);
	var listarHoteles = [];
	

	$(".regresarHome").click(function() {
		cambiarPagina("pageHome");
	});
	

	$(".regresarHoteles").click(function() {
		cambiarPagina("pageHoteles");
	});


	$("#RegistroHotel").click(function() {
		cambiarPagina("pageRegistro")
	});


	$("#GuardarHotel").click(function() {
		var infoHotel = {};
		var nombreH = $("#nombreH").val();
		var ciudadH = $("#ciudadH").val();
		var telefonoH = $("#telefonoH").val();
		var estrellasH = $("#estrellasH").val();	
		if(nombreH && estrellasH && telefonoH && ciudadH ) {

			infoHotel.lng = lngActual;
			infoHotel.lat = latActual;

			infoHotel.nombre = nombreH;
			infoHotel.telefono = telefonoH;
			infoHotel.ciudad = ciudadH;
			infoHotel.estrellas = estrellasH;

			listarHoteles.push(infoHotel);

			alert("El Hotel ha sido registrado con exito...!");

			$("#nombreH").val("");
			$("#telefonoH").val("");
			$("#ciudadH").val("");
			$("#estrellasH").val("");
		}else{
			alert("Los campos no deben estar incompletos");
		}		
	});


	$("#ListaHoteles").click(function() {
		cambiarPagina("pageHoteles");

		$("#contenedorLista").empty();

		for(var i = listarHoteles.length - 1; i >= 0; i--) {
			var html = '<li > <a href="#" data-id="' + i + '" class="ui-btn ui-shadow-icon ui-shadow ui-corner-all ui-btn-icon-right ui-icon-carat-r">' + listarHoteles[i].nombre + '</a> </li>';
			$('#contenedorLista').append(html);
		};
	});


	$("#contenedorLista").on("click", "a", function(){

		cambiarPagina("pageHotel");
		var id = $(this).data("id");

		$("#NombreInfo").text(listarHoteles[id].nombre);
		$("#EstrellasInfo").text(listarHoteles[id].estrellas);
		$("#TelefonoInfo").text(listarHoteles[id].telefono);
		$("#CiudadInfo").text(listarHoteles[id].ciudad);

		lngActual = listarHoteles[id].lng;
		latActual = listarHoteles[id].lat;	

		LocalizacionHotel() 

	});


	function cambiarPagina(page) {
		$.mobile.changePage("#" + page, {
			transition: "flow"
		});
	}


	function LocalizacionHotel() {
		var geocoder = new google.maps.Geocoder();
		var latlngHotel = new google.maps.LatLng(lngActual, latActual);
		var opciones = {
			zoom: 9,
			center: latlngHotel,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		mapaHotel = new google.maps.Map(document.getElementById("MapaHotel"), opciones);

		marcador = new google.maps.Marker({
			position: latlngHotel,
			map: mapaHotel,
			draggable: false,
			title: "Posición Registro Hotel"
		});

		$.mobile.loading("show", {
			text: "Convirtiendo Dirección...",
			textVisible: true,
			theme: "a",
			textonly: false,
			html: ''
		});

		geocoder.geocode ({
			'latLng': latlngHotel
		}, function(resultados, estado) {
			if(estado == google.maps.GeocoderStatus.OK) {
				$.mobile.loading("hide");
			}else{
				$.mobile.loading("hide");
				alert('Error en el servicio!!' + estado);
			}
		});
	}


	function mostrarMapa() {
		latlngInicial = new google.maps.LatLng(latActual, lngActual);
		
		var opciones = {
			zoom: 7,
			center: latlngInicial,
			mapType: google.maps.MapTypeId.ROADMAP
		};

		mapaHotel = new google.maps.Map(document.getElementById("Mapa"), opciones);

		marcador = new google.maps.Marker({
			position: latlngInicial,
			map: mapaHotel,
			draggable: true,
			title: "Posición de marcador"
		});
		google.maps.event.addListener(marcador, 'dragend', function(event) {
			lngActual = event.latLng.lat();
			latActual = event.latLng.lng();
			LocalizacionHotel();
		});
	}

	mostrarMapa();

});
