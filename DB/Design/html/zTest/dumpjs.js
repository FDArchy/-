function createCommentSide() {
    var dateMass = new Array;
    var managerMass = new Array;
    var commentMass = new Array;
    var artistMass = new Array;
    var jsDateMass = new Array;;

    var allowedArtistMass = new Array;
    var artistColorsMass = new Array;
    var allowedArtistIDMass = new Array;

    {% for comment in comments %}

    dateMass.push("{{comment.date}}")
    managerMass.push("{{comment.manager.name}}");
    commentMass.push("{{comment.comment}}");
    artistMass.push("{{comment.artist.name}}")
    jsDateMass.push("{{comment.date|date:"d.m.Y"}}")
    {% endfor %}

{%for artist in artists%}
allowedArtistMass.push("{{artist.name}}");
artistColorsMass.push("{{artist.color}}");
allowedArtistIDMass.push("{{artist.id}}");
{%endfor%}

var commentsPanel = document.getElementById("comments");

var first = true;

for(i = 0; i < allowedArtistMass.length; i++)
{
    var wrapperElement = document.createElement("div");
    wrapperElement.setAttribute('class', 'wrapper');
    var wrapperStyle = "border:solid 3px " + artistColorsMass[i];
    wrapperElement.setAttribute('style', wrapperStyle);

    var tableElement = document.createElement("div");
    tableElement.setAttribute('class', 'table');




    for(j = 0; j < dateMass.length; j++)
    {
        if(allowedArtistMass[i] == artistMass[j])
        {
            var tableElement = document.createElement("div");
            tableElement.setAttribute('class', 'table');

            if(first)
            {
                rowHeaderElement = document.createElement("div");
                rowHeaderElement.setAttribute('class', "row flash");
                var onclickAttribute = "showTable('hidden" + allowedArtistIDMass[i] +"');";
                rowHeaderElement.setAttribute('onclick', onclickAttribute);

                colHeaderElement = document.createElement("div");
                colHeaderElement.setAttribute('class', "col header");
                var styleAttribute = "border:solid 1px " + artistColorsMass[i] + ";";
                colHeaderElement.setAttribute('style', styleAttribute);
                colHeaderElement.innerHTML += allowedArtistMass[i];

                rowHeaderElement.appendChild(colHeaderElement);

                colHeaderElement = document.createElement("div");
                colHeaderElement.setAttribute('class', "col header");
                var styleAttribute = "border:solid 1px " + artistColorsMass[i] + ";";
                colHeaderElement.setAttribute('style', styleAttribute);
                tableElement.appendChild(rowHeaderElement);
                wrapperElement.appendChild(tableElement);

                var currentDate = new Date();
                debugger;
                var datetostring = currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "."+currentDate.getFullYear();
                if(String(jsDateMass[i]) == datetostring)
                    colHeaderElement.innerHTML += "<input type=\"checkbox\" disabled=\"disabled\" checked>Звонили сегодня";
                else
                    colHeaderElement.innerHTML += "<input type=\"checkbox\" disabled=\"disabled\">Звонили сегодня";

                rowHeaderElement.appendChild(colHeaderElement);



                tableElement = document.createElement("div")
                tableElement.setAttribute('class', 'table');

                rowElement = document.createElement("div");
                rowElement.setAttribute('class', "row");

                colElement = document.createElement("div");
                colElement.setAttribute('class', "col c10");
                styleAttribute = "border:solid 1px " + artistColorsMass[i] + ";";
                colElement.setAttribute('style', styleAttribute);
                colElement.innerHTML += dateMass[j];
                rowElement.appendChild(colElement);

                colElement = document.createElement("div");
                colElement.setAttribute('class', "col c10");
                styleAttribute = "border:solid 1px " + artistColorsMass[i] + ";";
                colElement.setAttribute('style', styleAttribute);
                colElement.innerHTML += managerMass[j];
                rowElement.appendChild(colElement);

                colElement = document.createElement("div");
                colElement.setAttribute('class', "col c33");
                styleAttribute = "border:solid 1px " + artistColorsMass[i] + ";";
                colElement.setAttribute('style', styleAttribute);
                colElement.innerHTML += commentMass[j];
                rowElement.appendChild(colElement);

                tableElement.appendChild(rowElement);
                wrapperElement.appendChild(tableElement);
            }
            else
            {

                var hiddenContainer = document.createElement("div");
                var styleAttribute = "hidden" + allowedArtistIDMass[i];
                tableElement = null;
                hiddenContainer.setAttribute('id', styleAttribute);
                hiddenContainer.setAttribute('class', 'hidden');

                tableElement = document.createElement("div")
                tableElement.setAttribute('class', 'table');

                rowElement = document.createElement("div");
                rowElement.setAttribute('class', "row");

                colElement = document.createElement("div");
                colElement.setAttribute('class', "col c10");
                styleAttribute = "border:solid 1px " + artistColorsMass[i] + ";";
                colElement.setAttribute('style', styleAttribute);
                colElement.innerHTML += dateMass[j];
                rowElement.appendChild(colElement);

                colElement = document.createElement("div");
                colElement.setAttribute('class', "col c10");
                styleAttribute = "border:solid 1px " + artistColorsMass[i] + ";";
                colElement.setAttribute('style', styleAttribute);
                colElement.innerHTML += managerMass[j];
                rowElement.appendChild(colElement);

                colElement = document.createElement("div");
                colElement.setAttribute('class', "col c33");
                styleAttribute = "border:solid 1px " + artistColorsMass[i] + ";";
                colElement.setAttribute('style', styleAttribute);
                colElement.innerHTML += commentMass[j];
                rowElement.appendChild(colElement);

                tableElement.appendChild(rowElement);
                hiddenContainer.appendChild(tableElement);
                wrapperElement.appendChild(hiddenContainer);

            }



            commentsPanel.appendChild(wrapperElement);
            first = false;


        }

    }

    if(!first)
        commentsPanel.innerHTML+="<hr>";
    first = true;
}
}