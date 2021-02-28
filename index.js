let gradoTempMtemprano;
let gradoTempTemprano;
let gradoTempMedioDia;
let gradoTempTarde;
let gradoTempMuytarde;
let gradoTempNoche;
//JUMEDAD
let gradoHumedadPoca;
let gradoHumedadMedia;
let gradoHumedadMucha;
let Maximo;
let reglaMaxima;
let datos = {};
function setDefaultValues()
{
	gradoTempMtemprano = 0;
	gradoTempTemprano = 0;
	gradoTempMedioDia = 0;
	gradoTempTarde = 0;
	gradoTempMuytarde = 0;
	gradoTempNoche = 0;
	gradoHumedadPoca = 0;
	gradoHumedadMedia = 0;
	gradoHumedadMucha = 0;
	Maximo = 0;
	reglaMaxima = "";
	datos = {
		"conjuntos" :
		{
			"hora" :
			{
					"Muy_temprano" : { "min" : 3 , "max" : 9, "nucleo" : 7, "func" : "triangular"},
					"Temprano" : { "min" : 8 , "max" : 12, "nucleo" : 10, "func" : "triangular"},
					"Medio_dia" : { "min" : 11 , "max" : 14, "nucleo" : 12, "func" : "triangular"},
					"Tarde" :  { "min" : 13.5 , "max" : 18, "nucleo" : 16, "func" : "triangular"},
							"Muy_tarde" : { "min" : 17 , "max" : 20, "nucleo" : 19, "func" : "triangular"},
								"Noche" : { "min" : 19 , "max" : 22, "func" : "hi"},
			},
			"humedad" :
			{
					"poca" : { "min" : 0 , "max" : 40, "nucleo" : 20, "func" : "triangular"},
					"media" : { "min" : 30 , "max" : 70, "nucleo" : 50, "func" : "triangular"},
					"mucha" : { "min" : 60 , "max" : 100, "nucleo" : 80, "func" : "triangular"},
			},
			"trafico" :
			{
					"muy_bajo" : { "min" : 0, "max" : 33, "func" : "hd"},
					"Bajo" : { "min" : 0 , "max" : 68, "nucleo" : 33, "func" : "triangular"},
					"Medio" : { "min" : 33 , "max" : 100, "nucleo" : 68, "func" : "triangular"},
					"Alto": { "min" : 68 , "max" : 100, "func" : "hi"}

			}
		},
		"reglas" :
		{
			// MT
			"r1" : {"activada": false, "valor": null, "hora" : "Muy_temprano", "humedad" : "poca", "trafico" : "Medio"},
			"r2" : {"activada": false, "valor": null, "hora" : "Muy_temprano", "humedad" : "media",  "trafico" : "Medio"},
			"r3" : {"activada": false, "valor": null, "hora" : "Muy_temprano", "humedad" : "mucha",  "trafico" : "Alto"},
			//// T

			"r4" : {"activada": false, "valor": null, "hora" : "Temprano", "humedad" : "poca", "trafico" : "Bajo"},
			"r5" : {"activada": false, "valor": null, "hora" : "Temprano", "humedad" : "media", "trafico" : "Medio"},
			"r6" : {"activada": false, "valor": null, "hora" : "Temprano", "humedad" : "mucha", "trafico" : "Medio"},
			//Mediodia
			"r7" : {"activada": false, "valor": null, "hora" : "Medio_dia", "humedad" : "poca", "trafico" : "muy_bajo"},
			"r8" : {"activada": false, "valor": null, "hora" : "Medio_dia", "humedad" : "media", "trafico" : "Medio"},
			"r9" : {"activada": false, "valor": null, "hora" : "Medio_dia", "humedad" : "mucha", "trafico" : "Medio"},
			//Tarde
			"r10" : {"activada": false, "valor": null, "hora" : "Tarde", "humedad" : "poca", "trafico" : "Bajo"},
			"r11" : {"activada": false, "valor": null, "hora" : "Tarde", "humedad" : "media", "trafico" : "Medio"},
			"r12" : {"activada": false, "valor": null, "hora" : "Tarde", "humedad" : "mucha", "trafico" : "Medio"},
			//Muy_tarde
			"r13" : {"activada": false, "valor": null, "hora" : "Muy_tarde", "humedad" : "poca", "trafico" : "Medio"},
			"r14" : {"activada": false, "valor": null, "hora" : "Muy_tarde", "humedad" : "media", "trafico" : "Medio"},
			"r15" : {"activada": false, "valor": null, "hora" : "Muy_tarde", "humedad" : "mucha", "trafico" : "Alto"},
			//Noche
			"r16" : {"activada": false, "valor": null, "hora" : "Noche", "humedad" : "poca", "trafico" : "Medio"},
			"r17" : {"activada": false, "valor": null, "hora" : "Noche", "humedad" : "media", "trafico" : "Medio"},
			"r18" : {"activada": false, "valor": null, "hora" : "Noche", "humedad" : "mucha", "trafico" : "Alto"}
		}
	}
}


function calcularGradoPertenencia(a,b,m,func,x)
{
	switch(func)
	{
		case "triangular":
			if(x < a)
			{
				return 0;
			}
			else if (a < x && x <= m)
			{
				return (x - a) / (m - a);
			}
			else if (m < x && x < b)
			{
				return (b - x) / (b - m);
			}
			else if(x >= b)
			{
				return 0;
			}
		break;
		case "hi":
			if(x <= a)
			{
				return 0;
			}
			else if (a <= x && x <= b)
			{
				return (x - a) / (b - a);
			}
			else if(x >= b)
			{
				return 1;
			}
		break;
		case "hd":
			if(x <= a)
			{
				return 1;
			}
			else if (a <= x && x <= b)
			{
				return (x - b) / (a - b);
			}
			else if(x >= b)
			{
				return 0;
			}
		break;
	}
}

function obtenerGradoTiempo(hora = 14)
{
	let hora_muytemprano=datos.conjuntos.hora.Muy_temprano;
	let hora_temprano=datos.conjuntos.hora.Temprano;
	let hora_mediodia=datos.conjuntos.hora.Medio_dia;
	let hora_tarde=datos.conjuntos.hora.Tarde;
	let hora_muytarde=datos.conjuntos.hora.Muy_tarde;
	let hora_noche=datos.conjuntos.hora.Noche;

	gradoTempMtemprano = calcularGradoPertenencia(hora_muytemprano.min,hora_muytemprano.max,hora_muytemprano.nucleo,hora_muytemprano.func,hora);
	gradoTempTemprano = calcularGradoPertenencia(hora_temprano.min,hora_temprano.max,hora_temprano.nucleo,hora_temprano.func,hora);
	gradoTempMedioDia = calcularGradoPertenencia(hora_mediodia.min,hora_mediodia.max,hora_mediodia.nucleo,hora_mediodia.func,hora);
	gradoTempTarde = calcularGradoPertenencia(hora_tarde.min,hora_tarde.max,hora_tarde.nucleo,hora_tarde.func,hora);
	gradoTempMuytarde = calcularGradoPertenencia(hora_muytarde.min,hora_muytarde.max,hora_muytarde.nucleo,hora_muytarde.func,hora);
	gradoTempNoche = calcularGradoPertenencia(hora_noche.min,hora_noche.max,hora_noche.nucleo,hora_noche.func,hora);
	console.log("Hora Muy temprano :" + gradoTempMtemprano)
	console.log("Hora Temprano:" + gradoTempTemprano)
	console.log("Hora Medio Dia :" + gradoTempMedioDia)
	console.log("Hora Tarde :" + gradoTempTarde)
	console.log("Hora Muy Tarde :" + gradoTempMuytarde)
	console.log("Hora Noche :" + gradoTempNoche)
}

function obtenerGradoHumedad(humedad = 85)
{
	let Humedadpoca = datos.conjuntos.humedad.poca;
	let Humedadmedia = datos.conjuntos.humedad.media;
	let Humedadmucha = datos.conjuntos.humedad.mucha;
	gradoHumedadPoca = calcularGradoPertenencia(Humedadpoca.min,Humedadpoca.max,Humedadpoca.nucleo,Humedadpoca.func,humedad);
	gradoHumedadMedia = calcularGradoPertenencia(Humedadmedia.min,Humedadmedia.max,Humedadmedia.nucleo,Humedadmedia.func,humedad);
	gradoHumedadMucha = calcularGradoPertenencia(Humedadmucha.min,Humedadmucha.max,Humedadmucha.nucleo,Humedadmucha.func,humedad);
	console.log("PocaHumedad :" + gradoHumedadPoca)
	console.log("MediaHumedad :" + gradoHumedadMedia)
	console.log("MuchaHumedad :" + gradoHumedadMucha)
}

function recorrerReglas()
{
	for(let regla in datos.reglas)
	{
		switch(datos.reglas[regla].hora)
		{
			case "Muy_temprano":
				switch(datos.reglas[regla].humedad)
				{
					case "poca":
						datos.reglas[regla].valor = Math.min(gradoTempMtemprano,gradoHumedadPoca);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;
					case "media":
						 datos.reglas[regla].valor = Math.min(gradoTempMtemprano,gradoHumedadMedia);
						 if(datos.reglas[regla].valor > 0)
						 {
						 	datos.reglas[regla].activada = true;
						 }
					break;
					case "mucha":
						datos.reglas[regla].valor = Math.min(gradoTempMtemprano,gradoHumedadMucha);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;

				}
			break;
			case "Temprano":
				switch(datos.reglas[regla].humedad)
				{
					case "poca":
						datos.reglas[regla].valor = Math.min(gradoTempTemprano,gradoHumedadPoca);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;
					case "media":
						 datos.reglas[regla].valor = Math.min(gradoTempTemprano,gradoHumedadMedia);
						 if(datos.reglas[regla].valor > 0)
						 {
						 	datos.reglas[regla].activada = true;
						 }
					break;
					case "mucha":
						datos.reglas[regla].valor = Math.min(gradoTempTemprano,gradoHumedadMucha);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;

				}
			break;
			case "Medio_dia":
				switch(datos.reglas[regla].humedad)
				{
					case "poca":
						datos.reglas[regla].valor = Math.min(gradoTempMedioDia,gradoHumedadPoca);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;
					case "media":
						 datos.reglas[regla].valor = Math.min(gradoTempMedioDia,gradoHumedadMedia);
						 if(datos.reglas[regla].valor > 0)
						 {
						 	datos.reglas[regla].activada = true;
						 }
					break;
					case "mucha":
						datos.reglas[regla].valor = Math.min(gradoTempMedioDia,gradoHumedadMucha);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;
				}

			break;
			case "Tarde":
				switch(datos.reglas[regla].humedad)
				{
					case "poca":
						datos.reglas[regla].valor = Math.min(gradoTempTarde,gradoHumedadPoca);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;
					case "media":
						 datos.reglas[regla].valor = Math.min(gradoTempTarde,gradoHumedadMedia);
						 if(datos.reglas[regla].valor > 0)
						 {
						 	datos.reglas[regla].activada = true;
						 }
					break;
					case "mucha":
						datos.reglas[regla].valor = Math.min(gradoTempTarde,gradoHumedadMucha);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;

				}
			break;

			case "Muy_tarde":
				switch(datos.reglas[regla].humedad)
				{
					case "poca":
						datos.reglas[regla].valor = Math.min(gradoTempMuytarde,gradoHumedadPoca);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;
					case "media":
						 datos.reglas[regla].valor = Math.min(gradoTempMuytarde,gradoHumedadMedia);
						 if(datos.reglas[regla].valor > 0)
						 {
						 	datos.reglas[regla].activada = true;
						 }
					break;
					case "mucha":
						datos.reglas[regla].valor = Math.min(gradoTempMuytarde,gradoHumedadMucha);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;

				}
			break;
			case "Noche":
				switch(datos.reglas[regla].humedad)
				{
					case "poca":
						datos.reglas[regla].valor = Math.min(gradoTempNoche,gradoHumedadPoca);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;
					case "media":
						 datos.reglas[regla].valor = Math.min(gradoTempNoche,gradoHumedadMedia);
						 if(datos.reglas[regla].valor > 0)
						 {
						 	datos.reglas[regla].activada = true;
						 }
					break;
					case "mucha":
						datos.reglas[regla].valor = Math.min(gradoTempNoche,gradoHumedadMucha);
						if(datos.reglas[regla].valor > 0)
						{
						 	datos.reglas[regla].activada = true;
						}
					break;

				}
			break;
		}
	}
}

function obtenerMaximo(hora,humedad)
{
	obtenerGradoTiempo(hora);
	obtenerGradoHumedad(humedad);
	recorrerReglas();

	for(let regla in datos.reglas)
	{
		if(datos.reglas[regla].activada == true)
		{
			if(datos.reglas[regla].valor > Maximo)
			{
				Maximo = datos.reglas[regla].valor;
				reglaMaxima = regla;
			}
		}
	}
	console.log("La regla con maxima puntuacion es la regla: " + reglaMaxima + " con un valor de: " + Maximo);
}

function despejarGradoPertenencia(a,b,m,func,x)
{
	switch(func)
	{
		case "triangular":
			let r1 = (x * (m -a)) + a;
			let r2 = b -(x * (b -m));
			console.log( "El resultado del trafico es:" + ((r1 + r2) / 2));
		break;
		case "hi":
			console.log( "El resultado del trafico es:" + ((x * (b - a)) + a));
		break;
		case "hd":
			console.log( "El resultado del trafico es:" + ((x * (a - b)) + b));
		break;
	}
}

function calcular(hora,humedad)
{
	setDefaultValues();
	obtenerMaximo(hora,humedad);
	let n = datos.reglas[reglaMaxima].trafico;
	let j = datos.conjuntos.trafico[n];
	despejarGradoPertenencia(j.min, j.max,j.nucleo,j.func,Maximo);
}
