var input = document.getElementById("input");
var go = document.getElementById("go");
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
                    p.innerHTML = response.data;
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
})