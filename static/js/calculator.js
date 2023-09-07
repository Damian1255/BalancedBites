var item_list = [];

var input = document.getElementById("input");
var p = document.getElementById("result-container");

input.addEventListener("keyup", function () {
    p.style.display = "flex";
    if (input.value.length >= 2) {
        p.innerHTML = "<div class='lds-ring'><div></div><div></div><div></div><div></div></div>";
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/search', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () { 
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.success) {
                    p.innerHTML = "";
                    for (row of response.data) {
                        var button = document.createElement("button");
                        button.innerHTML = "Add";
                        button.setAttribute("onclick", "add_item(`" + row.id + "`)");
                        
                        var span = document.createElement("span");
                        span.innerHTML = " " + row.name;

                        span.appendChild(button);
                        span.appendChild(document.createElement("br"))
                        p.appendChild(span);
                    }
                } else {
                    alert("Search failed.");
                }
            } else {
                alert('An Internal error occurred.');
            }
        };

        xhr.send(JSON.stringify({
            search_query: input.value
        }));
    }
    else {
        p.innerHTML = "";
    }
});

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (event.target != input) {
        p.style.display = "none";
    }
}

function add_item(id) {
    // check if item already exists in item_list
    for (item of item_list) {
        if (item.id == id) {
            // if item already exists, add serving size
            item.serving_size_g += 100;
            update_item_list();
            p.style.display = "none";

            return;
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/fetch/' + id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                item_list.push(response.data);
                update_item_list();
            } else {
                alert("Unable to fetch item.");
            }
        } else {
            alert('An Internal error occurred.');
        }
    };

    xhr.send();
    p.style.display = "none";
}

function update_item_list() {
    var list = document.getElementById("item-list")
    var total_list = document.getElementById("total-list")
    list.innerHTML = "";

    var calories_cal = 0;
    var total_fat_g = 0;
    var saturated_fat_g = 0;
    var cholesterol_mg = 0;
    var sodium_mg = 0;
    var vitamin_a_iu = 0;
    var vitamin_b12_mcg = 0;
    var vitamin_b6_mg = 0;
    var vitamin_c_mg = 0;
    var vitamin_d_iu = 0;
    var vitamin_e_mg = 0;
    var vitamin_k_mcg = 0;
    var calcium_mg = 0;
    var iron_mg = 0;
    var magnesium_mg = 0;
    var potassium_mg = 0;
    var protein_g = 0;
    var carbohydrate_g = 0;
    var fiber_g = 0;
    var sugars_g = 0;
    var glucose_g = 0;
    var lactose_g = 0;
    var sucrose_g = 0;
    var alcohol_g = 0;
    var caffeine_mg = 0;
    var water_g = 0;

    for (item of item_list) {
        var li = document.createElement("li");
        li.innerHTML = item.name

        var textbox = document.createElement("input");
        textbox.setAttribute("type", "number");
        textbox.setAttribute("value", item.serving_size_g);
        textbox.setAttribute("min", "0");
        textbox.setAttribute("max", "5000");
        textbox.setAttribute("step", "1");
        textbox.setAttribute("onchange", "change_serving_size(" + item.id + ", this.value)");

        var button = document.createElement("button");
        button.innerHTML = "Remove";
        button.setAttribute("onclick", "remove_item(" + item.id + ")");
        
        li.appendChild(textbox);
        li.appendChild(button);
        list.appendChild(li);
        
        serving_size_g = item.serving_size_g;
        
        calories_cal += item.calories_cal / 100 * serving_size_g;
        total_fat_g += item.total_fat_g / 100 * serving_size_g;
        saturated_fat_g += item.saturated_fat_g / 100 * serving_size_g;
        cholesterol_mg += item.cholesterol_mg / 100 * serving_size_g;
        sodium_mg += item.sodium_mg / 100 * serving_size_g;
        vitamin_a_iu += item.vitamin_a_iu / 100 * serving_size_g;
        vitamin_b12_mcg += item.vitamin_b12_mcg / 100 * serving_size_g;
        vitamin_b6_mg += item.vitamin_b6_mg / 100 * serving_size_g;
        vitamin_c_mg += item.vitamin_c_mg / 100 * serving_size_g;
        vitamin_d_iu += item.vitamin_d_iu / 100 * serving_size_g;
        vitamin_e_mg += item.vitamin_e_mg / 100 * serving_size_g;
        vitamin_k_mcg += item.vitamin_k_mcg / 100 * serving_size_g;
        calcium_mg += item.calcium_mg / 100 * serving_size_g;
        iron_mg += item.iron_mg / 100 * serving_size_g;
        magnesium_mg += item.magnesium_mg / 100 * serving_size_g;
        potassium_mg += item.potassium_mg / 100 * serving_size_g;
        protein_g += item.protein_g / 100 * serving_size_g;
        carbohydrate_g += item.carbohydrate_g / 100 * serving_size_g;
        fiber_g += item.fiber_g / 100 * serving_size_g;
        sugars_g += item.sugars_g / 100 * serving_size_g;
        glucose_g += item.glucose_g / 100 * serving_size_g;
        lactose_g += item.lactose_g / 100 * serving_size_g;
        sucrose_g += item.sucrose_g / 100 * serving_size_g;
        alcohol_g += item.alcohol_g / 100 * serving_size_g;
        caffeine_mg += item.caffeine_mg / 100 * serving_size_g;
        water_g += item.water_g / 100 * serving_size_g;
    }

    document.getElementById('calories_cal').textContent = calories_cal.toFixed(2) + " cal";
    document.getElementById('total_fat_g').textContent = total_fat_g.toFixed(2) + " g";
    document.getElementById('saturated_fat_g').textContent = saturated_fat_g.toFixed(2) + " g";
    document.getElementById('cholesterol_mg').textContent = cholesterol_mg.toFixed(2) + " mg";
    document.getElementById('sodium_mg').textContent = sodium_mg.toFixed(2) + " mg";
    document.getElementById('vitamin_a_iu').textContent = vitamin_a_iu.toFixed(2) + " IU";
    document.getElementById('vitamin_b12_mcg').textContent = vitamin_b12_mcg.toFixed(2) + " mcg";
    document.getElementById('vitamin_b6_mg').textContent = vitamin_b6_mg.toFixed(2) + " mg";
    document.getElementById('vitamin_c_mg').textContent = vitamin_c_mg.toFixed(2) + " mg";
    document.getElementById('vitamin_d_iu').textContent = vitamin_d_iu.toFixed(2) + " IU";
    document.getElementById('vitamin_e_mg').textContent = vitamin_e_mg.toFixed(2) + " mg";
    document.getElementById('vitamin_k_mcg').textContent = vitamin_k_mcg.toFixed(2) + " mcg";
    document.getElementById('calcium_mg').textContent = calcium_mg.toFixed(2) + " mg";
    document.getElementById('iron_mg').textContent = iron_mg.toFixed(2) + " mg";
    document.getElementById('magnesium_mg').textContent = magnesium_mg.toFixed(2) + " mg";
    document.getElementById('potassium_mg').textContent = potassium_mg.toFixed(2) + " mg";
    document.getElementById('protein_g').textContent = protein_g.toFixed(2) + " g";
    document.getElementById('carbohydrate_g').textContent = carbohydrate_g.toFixed(2) + " g";
    document.getElementById('fiber_g').textContent = fiber_g.toFixed(2) + " g";
    document.getElementById('sugars_g').textContent = sugars_g.toFixed(2) + " g";
    document.getElementById('glucose_g').textContent = glucose_g.toFixed(2) + " g";
    document.getElementById('lactose_g').textContent = lactose_g.toFixed(2) + " g";
    document.getElementById('sucrose_g').textContent = sucrose_g.toFixed(2) + " g";
    document.getElementById('alcohol_g').textContent = alcohol_g.toFixed(2) + " g";
    document.getElementById('caffeine_mg').textContent = caffeine_mg.toFixed(2) + " mg";
    document.getElementById('water_g').textContent = water_g.toFixed(2) + " g";
}

function change_serving_size(id, serving_size_g) {
    // search item by id in item_list and change serving size
    for (item of item_list) {
        if (item.id == id) {
            item.serving_size_g = parseFloat(serving_size_g);
            break;
        }
    }
    update_item_list();
}

function remove_item(id) {
    // search item by id in item_list and remove it
    for (var i = 0; i < item_list.length; i++) {
        if (item_list[i].id == id) {
            item_list.splice(i, 1);
            break;
        }
    }
    update_item_list();
}