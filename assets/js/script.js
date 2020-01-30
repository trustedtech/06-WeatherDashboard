// API keys that may be useful
var APIKeyNutritionix = "543062e2f89a916d71461f4c8c3befda"
var APIKeyUSDA = "L3tHPcFfPTSKSiXbCfKg2KltRijm4Dlj6PL2hK7I"


// backend test code
var input = "butter"

$.ajax({
    url: "https://api.nal.usda.gov/fdc/v1/search?api_key="+APIKeyUSDA+"\&generalSearchInput="+input,

    method: "GET"
}).then(function (response) {
	console.log(response);
});