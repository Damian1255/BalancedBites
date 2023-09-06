var item_list = [];

var input = document.getElementById("input");
var p = document.querySelector("p");

input.addEventListener("keyup", function () {
    if (input.value.length >= 2) {
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
                        button.setAttribute("onclick", "add_item(`" + row.NDB_No + "`)");
                        
                        var span = document.createElement("span");
                        span.innerHTML = " " + row.Descrip;

                        p.appendChild(document.createElement("br"));
                        p.appendChild(button);
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
});

function add_item(id) {
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
}

function update_item_list() {
    var list = document.getElementById("item_list")
    list.innerHTML = "";

    for (item of item_list) {
        var li = document.createElement("li");
        li.innerHTML = item[1]
        list.appendChild(li);
    }
}