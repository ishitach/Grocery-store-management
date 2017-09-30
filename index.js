(function () {
    "uses strict"
    var groceryname, grocerydesc, groceryprice, grocerylist, btsubmit, btcancel, newlist, grocerytemp, groc_arr, working_groc, legend_name;

    groceryname = document.querySelector("#groceryname");
    grocerydesc = document.querySelector("#grocerydesc");
    groceryprice = document.querySelector("#groceryprice");
    grocerylist = document.querySelector("#grocerylist");
    btsubmit = document.querySelector("#btsubmit");
    btcancel = document.querySelector("#btcancel");
    newlist = document.querySelector("#newlist");
    grocerytemp = document.querySelector("#grocerytemp");
    legend_name = document.querySelector("#legend_name");
    groc_arr = [];
    working_groc = null;

    function persist() {
        window.localStorage.setItem("groc_arr", JSON.stringify(groc_arr));
    }

    function filldata() {
        var x = window.localStorage.getItem("groc_arr");
        if (x) {
            groc_arr = JSON.parse(x);
        }
        var i;
        for (i = 0; i < groc_arr.length; i++) {
            var litemp = listgenerate(groc_arr[i]);
            newlist.appendChild(litemp);
        }
    }

    function valid(grocery) {
        if (!grocery.name) {
            alert("Please enter name");
            return false;
        }

        var price = parseInt(grocery.price, 10);
        /////////////////////////////added 
        if (!price) {
            alert("Please enter price");
            return false;
        }
        else if (price <= 0) {
            alert("Price can't be negative");
            return false;
        }

        var occured = document.querySelectorAll('h2[purpose="name"][g_data="' + grocery.name + '"]');
        if (occured.length > 0 && (working_groc == null || occured[0].parentNode !== working_groc)) {
            alert("Name can't be repeated");
            return false;
        }
        return true;
    }

    function clicksubmit() {

        var grocery = {};
        grocery.name = groceryname.value;
        grocery.desc = grocerydesc.value;
        grocery.price = groceryprice.value;

        if (valid(grocery)) {
            if (working_groc == null) {
                addgroc(grocery);
            }
            else {
                updategroc(grocery);
                legend_name.innerHTML = "Grocery-form";
            }
            btcancel.click();
        }


        window.event.preventDefault();
    }

    function addgroc(grocery) {
        if (groc_arr.length > 0) {
            grocery.groceryid = parseInt(groc_arr[groc_arr.length - 1].groceryid) + 1;
        }
        else {
            grocery.groceryid = 1;
        }
        var litemp = listgenerate(grocery);
        newlist.appendChild(litemp);
        groc_arr.push(grocery);
        persist();
    }

    function clicklist() {
        if (window.event.srcElement.getAttribute('action') === 'delete') {

            var element_delete = window.event.srcElement;
            var element_delete_name = element_delete.nextElementSibling;
            var todelete = confirm('Are you sure,' + element_delete_name.innerHTML + 'is to be deleted?');

            if (todelete) {

                var groceryid = element_delete.parentNode.getAttribute('g_data');
                var j = 0;
                for (j = 0; j < groc_arr.length; j++) {
                    if (groc_arr[j].groceryid == groceryid) {
                        break;
                    }
                }
                groc_arr.splice(j, 1);
                window.event.srcElement.parentNode.remove();
                persist();
                /////////////////////////////added 
                if (working_groc !== null) {
                    if (working_groc.getAttribute('g_data') === groceryid) {
                        working_groc = null;
                        btcancel.click();
                    }
                }
            }

        }
        else {

            if (window.event.srcElement.constructor === HTMLLIElement) {
                working_groc = window.event.srcElement;

            }
            else {
                ///////////////addded
                // if (window.event.srcElement.constructor !== HTMLUListElement) 
                working_groc = window.event.srcElement.parentNode;


            }

            var alllist = document.querySelectorAll('li');
            var j = 0;
            for (j = 0; j < alllist.length; j++) {

                alllist[j].style.backgroundColor = "cyan";
            }

            working_groc.style.backgroundColor = "yellow";
            groceryid = working_groc.getAttribute('g_data');
            var newname = document.querySelector("li[g_data='" + groceryid + "'] [purpose='name']");

            var newdesc = document.querySelector("li[g_data='" + groceryid + "'] [purpose='desc']");
            var newprice = document.querySelector("li[g_data='" + groceryid + "'] [purpose='price']");

            legend_name.innerHTML = 'Updating Grocery';
            groceryname.value = newname.innerHTML;
            grocerydesc.value = newdesc.innerHTML;
            groceryprice.value = newprice.innerHTML;

        }
    }

    function listgenerate(grocery) {

        var source = grocerytemp.innerHTML;

        source = source.changeAll("{{name}}", grocery.name);
        source = source.changeAll("{{desc}}", grocery.desc);
        source = source.changeAll("{{price}}", grocery.price);
        var li = document.createElement('li');
        li.setAttribute('g_data', grocery.groceryid);
        li.innerHTML = source;
        return li;
    }

    function updategroc(grocery) {

        working_groc.style.backgroundColor = "cyan";
        grocery.groceryid = working_groc.getAttribute('g_data');

        var newname = document.querySelector("li[g_data='" + grocery.groceryid + "'] [purpose='name']");
        var newdesc = document.querySelector("li[g_data='" + grocery.groceryid + "'] [purpose='desc']");
        var newprice = document.querySelector("li[g_data='" + grocery.groceryid + "'] [purpose='price']");

        legend_name.innerHTML = 'Updating Grocery';
        newname.innerHTML = grocery.name;
        newdesc.innerHTML = grocery.desc;
        newprice.innerHTML = grocery.price;
        /////////////////////////////added 
        newname.setAttribute("g_data", grocery.name);
        var i = 0;
        for (i = 0; i < groc_arr.length; i++) {
            if (groc_arr[i].groceryid == grocery.groceryid) {
                break;
            }
        }
        groc_arr[i] = grocery;
        persist();
        working_groc = null;

    }
    function init() {

        btsubmit.addEventListener('click', clicksubmit);
        newlist.addEventListener('click', clicklist);
        filldata();
    }
    init();
})();