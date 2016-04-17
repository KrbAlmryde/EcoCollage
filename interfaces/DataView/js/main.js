function sickPeople(count)
{
    var img_element = "";
    var img;
    var min = 1;
    var max = 3;
    for(var i=0;i<count;i++)
    {
    	var random = Math.floor(Math.random() * (max - min + 1)) + min;
    	img = '<img src="./p'+random+'.jpg" height="43px" width="43px">';
    	img_element+=img;
    }
    // console.log(img_element);
    var div = document.createElement('div');
    div.innerHTML = img_element;
    
    var heading = document.createElement('div');
    heading.innerHTML = '<h3><center>Number of Sick People</h3>';
    document.body.appendChild(heading);
    document.body.appendChild(div);
}



