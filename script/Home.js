


// Function to draw accident trend line graph
function drawFirstGraph(){
 d3.json("Data/acc_by_year.json", function(data){
    

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 40, left: 50},
            width = 660 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // parse the date / time
       // var parseTime = d3.timeParse("%d-%b-%y");

        // set the ranges
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        var valueline = d3.line()
            .x(function(data) { return x(data.year); })
            .y(function(data) { return y(data.Number_of_Accidents); });
     
        // Define the div for the tooltip
        var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
        
        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var firstGraphSvg = d3.select("#firstGraph").select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          // Scale the range of the data
          x.domain(d3.extent(data, function(d1) { return d1.year; }));
          y.domain([5000, 20000]);

          // Add the valueline path.
          firstGraphSvg.append("path")
              .data([data])
              .attr("class", "line")
              .attr("d", valueline);
     
          // Add the scatterplot
            firstGraphSvg.selectAll("dot")	
                .data(data)			
                .enter().append("circle")								
                .attr("r", 5)		
                .attr("cx", function(d) { return x(d.year); })		 
                .attr("cy", function(d) { return y(d.Number_of_Accidents); })		
                .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div.html("Year: "+d.year+"<br>"+"Number of accidents: "+d.Number_of_Accidents)	
                        .style("left", (d3.event.pageX - 100) + "px")		
                        .style("top", (d3.event.pageY - 60 ) + "px");	
                    })					
                .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });
        

          // Add the X Axis
          firstGraphSvg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // Add the Y Axis
          firstGraphSvg.append("g")
              .call(d3.axisLeft(y));
        
          // text label for the x axis
          firstGraphSvg.append("text")             
              .attr("transform","translate(" + (width/2) + " ," + (height + margin.top+15) + ")")
              .style("text-anchor", "middle")
              .text("Year");
    
    
    
         // text label for the y axis
          firstGraphSvg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left-5)
              .attr("x",0 - (height / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Number of accidents"); 
//        });

    
    
    
    
});
    
    
 }   
    

//  draw the donut pie chart for age groups
function drawPieChart(){
        
       var ageCount;
        d3.json("Data/acc_by_age_user.json", function(temp_data){
            var pie_data = temp_data;
            console.log(pie_data);   
            
            ageCount = d3.nest()
                              .key(function(k) { return k.age; })
                              .rollup(function(v) { return d3.sum(v, function(d) { return d.count; })})
                              .entries(pie_data);
                              
            console.log(ageCount);
            
            
            var text = "";

        var width = 460;
        var height = 460;
        var thickness = 80;
        var duration = 850;

        var radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var svg = d3.select("#piechart")
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

        var g = svg.append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

        var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

        var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);
            
        //console.log(pie(ageCount));
        
        var path = g.selectAll('path')
        .data(pie(ageCount))
        .enter()
        .append("g")
        .on("mouseover", function(d) {
              let g = d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black")
                .append("g")  
                .attr("class", "text-group");
            
              g.append("text")
                .attr("class", "name-text")
                .text("Age Group")
                .attr('text-anchor', 'middle')
                .attr('dy', '-2.2em');
           
              g.append("text")
                .attr("class", "name-text")
                .text(`${d.data.key}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.2em');
            
            g.append("text")
                .attr("class", "name-text")
                .text("People involved:")
                .attr('text-anchor', 'middle')
                .attr('dy', '0.8em');

              g.append("text")
                .attr("class", "value-text")
                .text(`${d.data.value}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '1.6em');
            })
          .on("mouseout", function(d) {
              d3.select(this)
                .style("cursor", "none")  
                .style("fill", color(this._current))
                .select(".text-group").remove();
            })
          .append('path')
          .attr('d', arc)
          .attr('fill', (d,i) => color(i))
          .on("mouseover", function(d) {
              d3.select(this)     
                .style("cursor", "pointer")
                .style("fill", "black");
            })
          .on("mouseout", function(d) {
              d3.select(this)
                .style("cursor", "none")  
                .style("fill", color(this._current));
            })
          .each(function(d, i) { this._current = i; });

        
                 
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em')
          .text(text);
            
            
        }); 
        
               
        
}








// Draw line graph
drawFirstGraph();

// Draw donut chart
drawPieChart();







//Selection filters
var filter_dict = {};
filter_dict["Postcode.No"]="";
filter_dict["SPEED_ZONE"] = 0;
//filter_dict["SafetyCheck"] = "";
//filter_dict["DayNight"] = "";
filter_dict["Atmosph.Cond.Desc"] = "";
//filter_dict["BadLight"] = "";
filter_dict["Year"] = 0;
filter_dict["SEVERITY"] = 0;
filter_dict["Age.Group"] = "";
//filter_dict["Day.Week.Description"] = "";
//filter_dict["Road.User.Type.Desc"] = "";
//filter_dict["SEX"] = "";
//filter_dict["Accident.Type.Desc"] = "";


var dataCollectionFull;
var zipData;

var firstLoad = true;

//Create map, set its view and add it to div
var map = L.map('mapBox').setView([-37.686043, 145.12], 8);
//Add g back
mapLink = 
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
    }).addTo(map);
        
// Initialize the SVG layer
map._initPathRoot();   

// We simply pick up the SVG from the map object for operations
var mapSvg = d3.select("#mapBox").select("svg"), g = mapSvg.append("g");

var dataCollectionFilter = [];
var zipDataFiltered = [];

d3.json("Data/main.json", function(collection) {
  
  // Add a LatLng object to each item in the dataset
  dataCollectionFull = collection;
  d3.json("Data/zip.json", function(datazip) {
		zipData = datazip;

		
		dataCollectionFilter = dataCollectionFull;
		zipDataFiltered = zipData;
		updateMain();
		executeMain();
	})
 })


//Apply filters and proceed
function updateMain(){
	
	if(!firstLoad){

		var filterCond = [];
		if (filter_dict["SPEED_ZONE"] != 0){

			filterCond.push("SPEED_ZONE");

		}
		if (filter_dict["Postcode.No"]!=""){

			filterCond.push("Postcode.No");

		}

		if (filter_dict["Atmosph.Cond.Desc"]!=""){

			filterCond.push("Atmosph.Cond.Desc");

		}

		if (filter_dict["Year"]!=""){

			filterCond.push("Year");
			
		}
		if (filter_dict["SEVERITY"]!=0){

			filterCond.push("SEVERITY");
			
		}
		if (filter_dict["Age.Group"]!=""){

			filterCond.push("Age.Group");

		}


		if (filterCond.length == 0){
			//No filters

			dataCollectionFilter = dataCollectionFull;
			zipDataFiltered = zipData;

		}else{

			//filter accident data and zip data
			 zipDictTemp = {}
			 zipData.forEach(function(d) {
			    
			    zipDictTemp[d["Zipcode"]] = 0;

			 })
			dataCollectionFilter = [];
			for (var i = 0; i < dataCollectionFull.length; i++) {
				
				var successFlag = true;
				filterCond.forEach(function(filterKey) {
		    		
		    		//filter on selected
	    			if(dataCollectionFull[i][filterKey] != filter_dict[filterKey]){

						successFlag = false;
					}
				  })
				if(successFlag){

					dataCollectionFilter.push(dataCollectionFull[i]);
					var zipVal = dataCollectionFull[i]["Postcode.No"];
					var valNum = zipDictTemp[zipVal];
					valNum = valNum + 1;
					zipDictTemp[zipVal] = valNum;

				}
				
			}

			//zipdata filtered
			zipDataFiltered = [];
			zipData.forEach(function(d) {
			
				if(zipDictTemp[d["Zipcode"]] > 0){
					zipDataFiltered.push(d);
				}
			})

		}
		d3.select("#mapBox").select("svg").remove();
		map.remove();
        
		map = L.map('mapBox').setView([-37.686043, 145.12], 8);
		//Add g back
		mapLink = 
		    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
		    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; ' + mapLink + ' Contributors',
		    maxZoom: 18,
		    }).addTo(map);

		// Initialize the SVG layer
		map._initPathRoot();   

		// Store map svg
		mapSvg = d3.select("#mapBox").select("svg"),g = mapSvg.append("g");

		executeMain();
	}else{
		firstLoad = false;
	}
	
}


function executeMain(){

    
    
  
  zipAccidentCountdataDict = {}
  zipDataFiltered.forEach(function(d) {
    
    d.LatLng = new L.LatLng(d.Lat,
                d.Long)
    zipAccidentCountdataDict[d["Zipcode"]] = 0;

  })

  for (var i = 0; i < dataCollectionFilter.length; i++) {
    
    var zipVal = dataCollectionFilter[i]["Postcode.No"];
    var valNum = zipAccidentCountdataDict[zipVal];
    valNum = valNum + 1;
    zipAccidentCountdataDict[zipVal] = valNum;
  }
  
  //add Accident count to zip code dict
  zipDataFiltered.forEach(function(d) {
    d["AccidentCount"] = zipAccidentCountdataDict[d["Zipcode"]]
  })

  //Maintain Zip list in order
  // convert object into array
  var sortable=[];
  for(var key in zipAccidentCountdataDict)
    if(zipAccidentCountdataDict.hasOwnProperty(key))
      sortable.push([key, zipAccidentCountdataDict[key]]); // each item is an array in format [key, value]
  
  // sort items by value
  sortable.sort(function(a, b)
  {
    return b[1]-a[1]; // compare numbers and sort in descending
  });
  
  var sortedPostalCode = sortable.slice(0,150);

  //add top zip codes to list
  topZipCode = [];
  for(var i=0; i<sortedPostalCode.length; i++){
    topZipCode.push(sortedPostalCode[i][0]);
  }
  

  //Append anchor tag to dropdown
  var postalDropdownContentDiv = d3.select("#postalDropdown");
  //remove anchor tag first
  $("#postalDropdown a").remove();

  postalDropdownContentDiv.selectAll("a")
  .data(zipDataFiltered)
  .enter().append("a")
  .on('click', selectedPostalCode)
  .text(function(d){ return d["Zipcode"];});

  //filter final display zip
  topDataZip = [];
  zipDataFiltered.forEach(function(d) {
    
    for(var i=0; i<topZipCode.length; i++){
      if(d["Zipcode"] == topZipCode[i]){
        topDataZip.push(d);
        break;
      }
    }
    })
    var maptip = d3.tip()
    .attr('class', 'd3-tip map-tip')
    .offset([-10, -70])
    .html(function(d) {
      return "<strong>Postcode:</strong>" + d["Zipcode"] + 
      "<br/> <strong>Number of Accidents:</strong>" + d["AccidentCount"];
    })
    g.call(maptip);

  //plot display
  var feature = g.selectAll("circle")
    .data(zipDataFiltered)
    .enter().append("circle")
    .style("stroke", "black")  
    .style("opacity", .8) 
    .style("fill", "brown")
    .attr("r", 4)
    .attr("id",function(d){return ("zip_" + d["Zipcode"])})
    .style("cursor", "pointer")
    .on('mouseover', maptip.show)
    .on('mouseout', maptip.hide);;

  map.on("viewreset", update);
  update();

  function update() {
      feature.attr("transform", 
      function(d) { 

        return "translate("+ 
          map.latLngToLayerPoint(d.LatLng).x +","+ 
          map.latLngToLayerPoint(d.LatLng).y +")";
        }
      )
    }

      

}

//reset map all circles to orginal
function resetMapToOrginal(){

  g.selectAll("circle").attr("r", 4);
  map.setView([-37.686043, 145.12], 8);
  //document.getElementById("postalDropdown").classList.remove("show");

  //reset dictionary
  filter_dict = {};
	filter_dict["Postcode.No"]="";
	filter_dict["SPEED_ZONE"] = 0;
	
	filter_dict["Atmosph.Cond.Desc"] = "";
	
	filter_dict["Year"] = 0;
	filter_dict["SEVERITY"] = 0;
	filter_dict["Age.Group"] = "";
	

  //Reset speed zone Btn
  $(".speedBtn").removeClass("speedBtnSelected");

  //Reset atmospheric condition type
  $(".atmCondBtn").removeClass("atmTypeBtnSelected");
    
  //Reset Severity Selected
  $(".severityBtn").removeClass("severityBtnSelected");

  //Reset year
  document.getElementById("yearDisBtn").innerText= "All Year";

  //reset zip
  //document.getElementById("zipDispBtn").innerText= "Postal code";


  //change main map
  updateMain();
}

//selected zip code function with from drop down
function selectedPostalCode(){

  //reset first
  g.selectAll("circle").attr("r", 4);
  document.getElementById("postalDropdown").classList.remove("show");
  var dataObj = this["__data__"];

  //get map object
  map.setView([dataObj["Lat"], dataObj["Long"]], 12);
  
  var idNameString = "#zip_" + dataObj["Zipcode"];
  var focusCircle = d3.select(idNameString).attr("r", 20);

  
  document.getElementById("zipDispBtn").innerText= dataObj["Zipcode"];
  document.getElementById("postalCodeSearch").value = "";
}


//Select year from drop down
function selectedYear(yearVal){

	filter_dict["Year"]=yearVal;

	if (yearVal == 0){
		document.getElementById("yearDisBtn").innerText= "All Year";
	}else{
		document.getElementById("yearDisBtn").innerText= yearVal.toString();
	}

	$("#yearDropdown").removeClass("show");
	//document.getElementById("yearSearch").value= "";

	//reset operation
	updateMain();
}




//speedZone Selected with Value
function speedZoneSelectedWithVal(speedValue){

  $(".speedBtn").removeClass("speedBtnSelected");
  filter_dict["SPEED_ZONE"] = speedValue;
  
  var elementId = "#speed_" + speedValue.toString();
  $(elementId).addClass("speedBtnSelected");
  
  //reset operation
  updateMain();
}



//function severity check
function severitySelectedWithVal(severityVal){
    $(".severityBtn").removeClass("severityBtnSelected");
    
    filter_dict["SEVERITY"] = severityVal;
    
    var elementId = "#severity_" + severityVal.toString();
    $(elementId).addClass("severityBtnSelected");
    
    updateMain();
}



//Atmospheric condition selected
function atmTypeSelected(atmVal){

	$(".atmCondBtn").removeClass("atmTypeBtnSelected");
	
	filter_dict["Atmosph.Cond.Desc"] = atmVal;
	
	var elementId = "";
	if(atmVal == "Low Vision"){

		elementId = "#Low";
	}else if(atmVal == "Strong winds"){
		elementId = "#wind";
	}else{
		elementId = "#" + atmVal;
	}

	$(elementId).addClass("atmTypeBtnSelected");
	
	//reset operation
	updateMain();
}




//year drop down button clicked(){
function yearDropDownBtnClicked(){
	document.getElementById("yearDropdown").classList.toggle("show");
}



//Filter drop down year
function filterYearFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("yearSearch");
    filter = input.value.toUpperCase();
    div = document.getElementById("yearDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

